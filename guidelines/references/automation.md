# Design-System Automation and MCP

Use this reference only when exposing Lumen through automated tooling, CI, or Model Context Protocol services.

## The bundled MCP server

This repository ships a stdio MCP server at `src/mcp/`, run with `npm run mcp`
or the `lumen-ui-mcp` binary. It exposes this skill and its references, the
root styleguides, every public export with its props and workbench examples,
and the token bundle. It derives all of that from the repository at call time
rather than from a hand-maintained manifest, and it reads only within the
package directory.

Prefer extending that server over building a parallel one. See
[MCP.md](../../MCP.md) for its tools, resources, and client configuration.

## Useful capabilities

- Token bundle: return the active DTCG-compatible token JSON.
- Component metadata: list component purposes, variants, states, token bindings, examples, and accessibility requirements.
- Accessibility audit: accept a deploy preview URL or component identifier and return verified failures with remediation guidance.

Illustrative interfaces:

- `GET /v1/ui/tokens/latest` returns the active equivalent of `assets/core.tokens.json`.
- `GET /v1/ui/components` returns structured component definitions and token bindings.
- `POST /v1/ui/audit` accepts a target URL and requested viewports.

Treat these routes as conceptual examples, not an API contract. Design the actual interface around the host system's authentication, versioning, job model, and error conventions.

## Workflows

1. On an approved token change, generate platform artifacts, run visual and accessibility checks, and open a review with rendered previews.
2. Run accessibility audits against deploy previews and attach actionable findings to the change under review.
3. Generate release notes from intentional token and component changes, not from raw diffs alone.

## Governance

- Authenticate agent calls with least-privilege credentials and rotate secrets.
- Validate target URLs to prevent server-side request forgery in audit services.
- Record token version, author, source commit, and generated artifacts for traceability.
- Require review for breaking token removal or semantic meaning changes.
- Version published token bundles and component schemas.
- Never let an automated visual change bypass accessibility or product review solely because snapshots pass.

The source package described the routes and workflows above as recommended MCP integration patterns; it did not define a server or dependency. The bundled read-only server described at the top of this reference is original to this repository.
