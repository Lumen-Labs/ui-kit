import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { showcaseSections, showcasedComponentCount } from "../catalog.js";
import {
  extractTypeDeclarations,
  findComponent,
  listEntrypoints,
  readPublicExports,
  relatedTypeNames,
} from "./components.js";
import {
  extractSection,
  listAllDocuments,
  listSectionHeadings,
  listSkillDocuments,
  listStyleguideDocuments,
  readDocument,
  type KitDocument,
} from "./documents.js";
import { listExamplesFor } from "./examples.js";
import { formatInstall, peersForEntrypoint, readPackageIdentity } from "./install.js";
import { readKitFileIfPresent, readKitPackage } from "./kit.js";
import { searchKit } from "./search.js";
import { flattenTokens, readTokenBundle, selectTokenGroup } from "./tokens.js";

export const SERVER_NAME = "lumen-ui-kit";

const RESOURCE_PREFIX = "lumen://document/";
const TOKENS_URI = "lumen://tokens";
const CATALOG_URI = "lumen://catalog";

export const tools = [
  {
    name: "list_skills",
    description:
      "List the Lumen agent skill and the reference guides it loads on demand. Start here to learn how the design system expects UI to be built and reviewed.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_styleguides",
    description:
      "List the long-form Lumen styleguides: the component catalog, layout and shell guidance, data display, icons, and package references.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "read_document",
    description:
      "Read a skill, reference, or styleguide by id. Pass `section` to read a single heading, or `headings_only` to see a document's outline before loading it.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Document id from list_skills or list_styleguides, such as `skill`, `references/accessibility`, or `layout`.",
        },
        section: {
          type: "string",
          description: "Optional heading text to return instead of the whole document.",
        },
        headings_only: {
          type: "boolean",
          description: "Return only the document outline.",
        },
      },
      required: ["id"],
      additionalProperties: false,
    },
  },
  {
    name: "list_components",
    description:
      "Browse the components, hooks, and variants exported by the kit, grouped by catalog section. Filter with `query`, `section`, or `entrypoint`.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Case-insensitive substring match on the export name." },
        section: { type: "string", description: "Catalog section id, such as `forms` or `visualization`." },
        entrypoint: {
          type: "string",
          description: "Restrict to one import specifier, such as `lumen-ui-kit/graph`.",
        },
        include_types: {
          type: "boolean",
          description: "Include exported TypeScript types alongside runtime exports.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component",
    description:
      "Get everything needed to use one export: its import specifier, catalog section, prop types, sibling parts it composes with, real workbench examples, and the guides that govern it.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Exported name, such as `Button` or `GraphExplorer`." },
        include_source: {
          type: "boolean",
          description: "Include the full source of the module that declares the export.",
        },
        include_examples: {
          type: "boolean",
          description: "Include workbench usage examples. Defaults to true.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "get_tokens",
    description:
      "Read the DTCG design-token bundle. Pass `group` to narrow to a branch such as `color.brand`, and `format: \"flat\"` for a readable path/value listing.",
    inputSchema: {
      type: "object",
      properties: {
        group: { type: "string", description: "Dotted token group, such as `color.brand` or `space`." },
        format: {
          type: "string",
          enum: ["json", "flat"],
          description: "`json` returns the raw DTCG bundle; `flat` returns path/value pairs. Defaults to `flat`.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "search",
    description:
      "Search components, catalog sections, styleguides, and tokens in one pass. Use this when you know the problem but not the name.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text query, such as `sortable table` or `focus ring`." },
        limit: { type: "number", description: "Maximum results. Defaults to 20." },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
] as const;

type ToolArguments = Record<string, unknown>;

function requireString(args: ToolArguments, key: string) {
  const value = args[key];

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`\`${key}\` is required and must be a non-empty string.`);
  }

  return value;
}

function optionalString(args: ToolArguments, key: string) {
  const value = args[key];

  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new Error(`\`${key}\` must be a string.`);

  return value.trim() || undefined;
}

function optionalBoolean(args: ToolArguments, key: string, fallback: boolean) {
  const value = args[key];

  if (value === undefined || value === null) return fallback;
  if (typeof value !== "boolean") throw new Error(`\`${key}\` must be a boolean.`);

  return value;
}

function optionalNumber(args: ToolArguments, key: string, fallback: number) {
  const value = args[key];

  if (value === undefined || value === null) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`\`${key}\` must be a number.`);
  }

  return value;
}

function documentLines(documents: readonly KitDocument[]) {
  return documents.map(
    (document) => `- \`${document.id}\` — **${document.title}**: ${document.summary} _(${document.path})_`,
  );
}

/**
 * Guides whose text names the export, so an agent reads the rules before
 * composing. Nearly every guide mentions a common export such as `Button`, so
 * the list is ranked by how much each one says about it and kept short.
 */
async function relatedDocuments(name: string, limit = 4) {
  const pattern = new RegExp(`\\b${name}\\b`, "g");
  const scored: { id: string; title: string; mentions: number }[] = [];

  for (const document of await listAllDocuments()) {
    const content = (await readKitFileIfPresent(document.path)) ?? "";
    const mentions = content.match(pattern)?.length ?? 0;

    if (mentions > 0) scored.push({ id: document.id, title: document.title, mentions });
  }

  return scored
    .sort((left, right) => right.mentions - left.mentions)
    .slice(0, limit)
    .map((entry) => `\`${entry.id}\` (${entry.title})`);
}

async function runTool(name: string, args: ToolArguments): Promise<string> {
  switch (name) {
    case "list_skills": {
      const documents = await listSkillDocuments();

      return [
        "# Lumen skills and references",
        "",
        "Read `skill` first: it carries the workflow and the invariants every Lumen interface must hold.",
        "Load a reference only when the task needs it.",
        "",
        ...documentLines(documents),
        "",
        "Read any of these with `read_document`.",
      ].join("\n");
    }

    case "list_styleguides": {
      const documents = await listStyleguideDocuments();

      return [
        "# Lumen styleguides",
        "",
        ...documentLines(documents),
        "",
        "Read any of these with `read_document`.",
      ].join("\n");
    }

    case "read_document": {
      const id = requireString(args, "id");
      const document = await readDocument(id);

      if (!document) {
        const available = (await listAllDocuments()).map((entry) => entry.id).join(", ");

        throw new Error(`Unknown document \`${id}\`. Available ids: ${available}.`);
      }

      if (optionalBoolean(args, "headings_only", false)) {
        const headings = listSectionHeadings(document.content);

        return [
          `# ${document.title} — outline`,
          "",
          ...headings.map((heading) => `- ${heading}`),
          "",
          "Read one with `read_document` and the `section` argument.",
        ].join("\n");
      }

      const section = optionalString(args, "section");

      if (section) {
        const extracted = extractSection(document.content, section);

        if (!extracted) {
          throw new Error(
            `No section \`${section}\` in \`${id}\`. Use \`headings_only\` to list the available headings.`,
          );
        }

        return `<!-- ${document.path} -->\n\n${extracted}`;
      }

      return `<!-- ${document.path} -->\n\n${document.content}`;
    }

    case "list_components": {
      const query = optionalString(args, "query")?.toLowerCase();
      const section = optionalString(args, "section")?.toLowerCase();
      const entrypoint = optionalString(args, "entrypoint");
      const includeTypes = optionalBoolean(args, "include_types", false);

      const exports = (await readPublicExports()).filter((entry) => {
        if (!includeTypes && entry.kind === "type") return false;
        if (query && !entry.name.toLowerCase().includes(query)) return false;
        if (section && entry.sectionId?.toLowerCase() !== section) return false;
        if (entrypoint && entry.entrypoint !== entrypoint) return false;

        return true;
      });

      if (!exports.length) return "No exports matched that filter.";

      const grouped = new Map<string, string[]>();

      for (const entry of exports) {
        const heading = entry.sectionLabel
          ? `${entry.sectionLabel} — ${entry.entrypoint}`
          : `Uncategorized — ${entry.entrypoint}`;

        grouped.set(heading, [
          ...(grouped.get(heading) ?? []),
          entry.kind === "type" ? `${entry.name} _(type)_` : entry.name,
        ]);
      }

      return [
        `# Lumen exports (${exports.length} shown)`,
        "",
        ...[...grouped.entries()].flatMap(([heading, names]) => [
          `## ${heading}`,
          names.map((entryName) => `\`${entryName}\``).join(", "),
          "",
        ]),
        "Call `get_component` for props, examples, and the guides that govern one export.",
      ].join("\n");
    }

    case "get_component": {
      const name = requireString(args, "name");
      const component = await findComponent(name);

      if (!component) {
        throw new Error(
          `No export named \`${name}\`. Use \`list_components\` or \`search\` to find the right name.`,
        );
      }

      const source = (await readKitFileIfPresent(component.sourcePath)) ?? "";
      const exports = await readPublicExports();
      const typeNames = relatedTypeNames(component.name, exports);
      const declarations = extractTypeDeclarations(source, typeNames);
      const sectionMeta = showcaseSections.find((entry) => entry.id === component.sectionId);

      const identity = await readPackageIdentity();
      const entrypoint = (await listEntrypoints()).find(
        (entry) => entry.specifier === component.entrypoint,
      );
      const peers = entrypoint ? await peersForEntrypoint(entrypoint) : [];

      const lines = [
        `# ${component.name}`,
        "",
        `- **Package**: \`${identity.name}@${identity.version}\` — ${identity.registryUrl}`,
        `- **Import**: \`import { ${component.name} } from "${component.entrypoint}";\``,
        `- **Kind**: ${component.kind}`,
        `- **Section**: ${sectionMeta ? `${sectionMeta.label} — ${sectionMeta.description}` : "Uncategorized"}`,
        `- **Source**: \`${component.sourcePath}\``,
      ];

      if (component.siblings.length) {
        lines.push(
          `- **Composes with**: ${component.siblings.map((entry) => `\`${entry}\``).join(", ")}`,
        );
      }

      const related = await relatedDocuments(component.name);

      if (related.length) lines.push(`- **Documented in**: ${related.join(", ")}`);

      lines.push("", "## Install", "", formatInstall(identity, peers));

      if (declarations.length) {
        lines.push("", "## Types", "", "```ts", declarations.map((entry) => entry.code).join("\n\n"), "```");
      }

      if (optionalBoolean(args, "include_examples", true)) {
        const examples = await listExamplesFor(component.name);

        if (examples.length) {
          lines.push("", "## Examples", "");

          for (const example of examples) {
            lines.push(`### ${example.title}`, "", example.description, "", "```tsx", example.code, "```", "");
          }
        }
      }

      if (optionalBoolean(args, "include_source", false)) {
        lines.push("", `## Source (\`${component.sourcePath}\`)`, "", "```tsx", source, "```");
      }

      return lines.join("\n");
    }

    case "get_tokens": {
      const bundle = await readTokenBundle();

      if (!bundle) throw new Error("The token bundle is not present in this install.");

      const group = optionalString(args, "group");
      const selected = group ? selectTokenGroup(bundle, group) : bundle;

      if (selected === undefined) {
        throw new Error(`No token group \`${group}\`. Call \`get_tokens\` without a group to see the tree.`);
      }

      const format = optionalString(args, "format") ?? "flat";

      if (format === "json") return JSON.stringify(selected, null, 2);

      const flattened = flattenTokens(selected, group ? group.split(".") : []);

      return [
        `# Lumen tokens${group ? ` — ${group}` : ""} (${flattened.length})`,
        "",
        ...flattened.map((token) => `- \`${token.path}\` (${token.type}): ${token.value}`),
      ].join("\n");
    }

    case "search": {
      const query = requireString(args, "query");
      const results = await searchKit(query, optionalNumber(args, "limit", 20));

      if (!results.length) return `No matches for \`${query}\`.`;

      return [
        `# Matches for \`${query}\``,
        "",
        ...results.map(
          (result) => `- **${result.title}** _(${result.type} · id \`${result.id}\`)_\n  ${result.snippet}`,
        ),
      ].join("\n");
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/** Exposed for tests and for hosts that want to embed the handlers directly. */
export async function callTool(name: string, args: ToolArguments = {}) {
  return runTool(name, args);
}

export async function createServer() {
  const pkg = await readKitPackage();
  const entrypoints = await listEntrypoints();
  const identity = await readPackageIdentity();

  const server = new Server(
    { name: SERVER_NAME, version: pkg.version },
    {
      capabilities: { tools: {}, resources: {} },
      instructions: [
        `${pkg.name} exposes the Lumen design system: an agent skill, styleguides, ${showcasedComponentCount} catalogued components, and design tokens.`,
        `The components ship as the npm package \`${identity.name}@${identity.version}\` (install with \`npm install ${identity.name}\`${identity.reactRange ? `, requires React ${identity.reactRange}` : ""}).`,
        "Before writing or reviewing Lumen UI, read the `skill` document with `read_document` — it carries the invariants.",
        `Import from: ${entrypoints.map((entry) => entry.specifier).join(", ")}.`,
        "`get_component` reports the install command and any extra peers an entrypoint needs. Use `search` when you know the problem but not the component name.",
      ].join(" "),
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [...tools] }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const text = await runTool(request.params.name, request.params.arguments ?? {});

      return { content: [{ type: "text" as const, text }] };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: (error as Error).message }],
        isError: true,
      };
    }
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const documents = await listAllDocuments();

    return {
      resources: [
        ...documents.map((document) => ({
          uri: `${RESOURCE_PREFIX}${document.id}`,
          name: document.title,
          description: document.summary,
          mimeType: "text/markdown",
        })),
        {
          uri: TOKENS_URI,
          name: "Lumen design tokens",
          description: "The DTCG-compatible core token bundle.",
          mimeType: "application/json",
        },
        {
          uri: CATALOG_URI,
          name: "Lumen component catalog",
          description: "Catalog sections and the components each one contains.",
          mimeType: "application/json",
        },
      ],
    };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === TOKENS_URI) {
      const bundle = await readTokenBundle();

      if (!bundle) throw new Error("The token bundle is not present in this install.");

      return {
        contents: [{ uri, mimeType: "application/json", text: JSON.stringify(bundle, null, 2) }],
      };
    }

    if (uri === CATALOG_URI) {
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(showcaseSections, null, 2),
          },
        ],
      };
    }

    if (uri.startsWith(RESOURCE_PREFIX)) {
      const document = await readDocument(uri.slice(RESOURCE_PREFIX.length));

      if (document) {
        return { contents: [{ uri, mimeType: "text/markdown", text: document.content }] };
      }
    }

    throw new Error(`Unknown resource: ${uri}`);
  });

  return server;
}
