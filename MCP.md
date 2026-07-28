# Lumen MCP Server

An MCP server that exposes this design system to coding agents: the Lumen
agent skill, the styleguides, every exported component with its props and real
examples, and the design tokens.

The server reads the repository at call time. Adding a component, a guide, or a
token makes it browsable without editing the server.

## Run it

```bash
npm run mcp
```

The server speaks MCP over stdio. After `npm run build` it is also available as
the `lumen-ui-mcp` binary.

`@modelcontextprotocol/sdk` is an optional peer dependency, like the icon and
graph peers. Install it in any consuming project that runs the server.

## Connect an agent

Claude Code, from the repository root:

```bash
claude mcp add lumen -- npx tsx ui-kit/src/mcp/index.ts
```

Any client that reads a JSON config:

```json
{
  "mcpServers": {
    "lumen": {
      "command": "npx",
      "args": ["tsx", "ui-kit/src/mcp/index.ts"]
    }
  }
}
```

Point `command` at `lumen-ui-mcp` instead once the package is installed as a
dependency.

## Run it as a service

Stdio is spawned per client, so it cannot be supervised — a process manager
would keep a server alive with nothing attached to its stdin. For a
long-running, shared instance there is an HTTP transport:

```bash
npm run mcp:http
```

It serves Streamable HTTP at `POST /mcp` and an unauthenticated `GET /health`
for health checks.

| Variable | Default | Purpose |
| --- | --- | --- |
| `LUMEN_MCP_HOST` | `127.0.0.1` | Bind address. |
| `LUMEN_MCP_PORT` | `1803` | Port. 1801 and 1802 are already taken. |
| `LUMEN_MCP_TOKEN` | — | Bearer token. **Required** for any non-loopback bind. |
| `LUMEN_MCP_ALLOWED_HOSTS` | — | Comma-separated `Host` allow list. |
| `LUMEN_MCP_ALLOWED_ORIGINS` | — | Comma-separated `Origin` allow list. |

### Security

This server reads and returns the ui-kit's source. Binding it beyond loopback
publishes that source to whoever can reach the port, so:

- **A token is mandatory off loopback.** The server refuses to start on a
  non-loopback host without `LUMEN_MCP_TOKEN` rather than starting open.
  Tokens are compared as digests in constant time.
- **Keep it off the public internet.** Use a firewall rule, a private network,
  or a reverse proxy that terminates TLS. The server speaks plain HTTP.
- **Set the allow lists** when a browser-based client will call it, which
  blocks DNS-rebinding attempts.

Generate a token with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### pm2

[`ecosystem.config.cjs`](ecosystem.config.cjs) runs the built server under pm2:

```bash
npm run build && pm2 start ecosystem.config.cjs
```

Configuration comes from the environment or from `.env.mcp.local`, which is
gitignored. Copy [`.env.mcp.local.example`](.env.mcp.local.example) to start.

> Do not put the token in `.env.production.local`. The repository's root
> `.gitignore` force-includes that filename, so a secret placed there would be
> committed.

The config fails fast with a clear message if the token is missing for a public
bind, rather than leaving pm2 in a restart loop.

Connect a client over HTTP:

```json
{
  "mcpServers": {
    "lumen": {
      "type": "http",
      "url": "http://127.0.0.1:1803/mcp",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" }
    }
  }
}
```

## Tools

| Tool | Purpose |
| --- | --- |
| `list_skills` | The agent skill and the reference guides it loads on demand. |
| `list_styleguides` | The long-form guides: catalog, layout, data display, icons, graph. |
| `read_document` | Read any guide by id, narrowed to one `section` or reduced to an outline with `headings_only`. |
| `list_components` | Browse exports grouped by catalog section, filtered by `query`, `section`, or `entrypoint`. |
| `get_component` | Install command, import specifier, section, prop types, composition parts, workbench examples, and governing guides for one export. |
| `get_tokens` | The DTCG token bundle, narrowed with `group` and readable with `format: "flat"`. |
| `search` | One ranked pass over components, sections, guides, and tokens. |

The intended path is `search` or `list_components` to find a name, then
`get_component` for everything needed to write the code. An agent building or
reviewing UI should read the `skill` document first — it carries the invariants.

## Resources

- `lumen://document/{id}` — every skill, reference, and styleguide as Markdown.
- `lumen://tokens` — the DTCG token bundle.
- `lumen://catalog` — catalog sections and their components.

## How the data is derived

Nothing is hand-maintained in a second place:

- **Entrypoints** come from the `exports` map in `package.json`. A new subpath
  is picked up automatically; `./mcp` is excluded so the server does not
  catalog itself.
- **Components** come from parsing the export statements of each entrypoint.
  Re-exports are attributed to the module that declares them, so
  `get_component` points at real source rather than at a barrel file.
- **Sections** come from [`src/catalog.ts`](src/catalog.ts), shared with the
  showcase workbench. Composition parts that the catalog does not list on their
  own — `TableBody`, for instance — inherit the section of the components they
  are declared beside.
- **Prop types** are extracted from the declaring module by name convention
  (`ButtonProps` for `Button`), attributed to the most specific export that
  owns them so `TableToolbarTitleProps` does not also appear under `Table`.
- **Install commands** name the published npm package and its version. An
  entrypoint's extra peers are found by walking its local module graph and
  intersecting the packages it reaches with `peerDependencies`, so a peer that
  is declared but no longer imported is never suggested. React is reported once
  as the package baseline instead of under every component.
- **Examples** are the real workbench stories from
  [`showcase/src/workbench.tsx`](showcase/src/workbench.tsx), so agents read
  compositions the design system actually renders.
- **Documents** are discovered by scanning `guidelines/` and the repository
  root, taking titles from the first heading and summaries from the first
  paragraph.

File reads are confined to the package directory.

## Embedding

Hosts that run their own transport can import the server directly:

```ts
import { createServer } from "lumen-ui-kit/mcp";

const server = await createServer();

await server.connect(transport);
```

`callTool(name, args)` is exported from the same module for hosts that want the
tool results without the protocol.
