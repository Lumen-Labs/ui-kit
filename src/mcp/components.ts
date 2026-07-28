import { showcaseSections, type ShowcaseSection } from "../catalog.js";
import {
  readKitFileIfPresent,
  readKitPackage,
  resolveExistingPath,
} from "./kit.js";

export interface KitEntrypoint {
  /** The specifier consumers import, such as `lumen-ui-kit/graph`. */
  specifier: string;
  /** Package-relative source path of the entrypoint module. */
  path: string;
}

export interface KitExport {
  name: string;
  kind: "value" | "type";
  entrypoint: string;
  /** Package-relative source path of the module that declares the export. */
  sourcePath: string;
  sectionId?: string;
  sectionLabel?: string;
}

const SECTION_BY_COMPONENT = new Map<string, ShowcaseSection>(
  showcaseSections.flatMap((section) =>
    section.components.map((component) => [component, section] as [string, ShowcaseSection]),
  ),
);

/** This server is published from the same package but is not part of the kit's UI surface. */
const SELF_DIRECTORY = "src/mcp/";

/**
 * Derives the public entrypoints from the package `exports` map so a new
 * subpath becomes browsable without touching this server.
 */
export async function listEntrypoints(): Promise<KitEntrypoint[]> {
  const pkg = await readKitPackage();
  const entrypoints: KitEntrypoint[] = [];

  for (const [subpath, target] of Object.entries(pkg.exports ?? {})) {
    const resolved =
      typeof target === "string"
        ? target
        : ((target as Record<string, string> | null)?.default ??
          (target as Record<string, string> | null)?.import ??
          null);

    if (!resolved?.endsWith(".js")) continue;

    const base = resolved.replace(/^\.\/dist\//, "src/").replace(/\.js$/, "");

    if (base.startsWith(SELF_DIRECTORY)) continue;

    const path = await resolveExistingPath([`${base}.ts`, `${base}.tsx`]);

    if (!path) continue;

    entrypoints.push({
      specifier: subpath === "." ? pkg.name : `${pkg.name}${subpath.slice(1)}`,
      path,
    });
  }

  return entrypoints;
}

const EXPORT_LIST = /export\s*(?:(type)\s+)?\{([^}]*)\}\s*(?:from\s*["']([^"']+)["'])?\s*;/g;
const EXPORT_DECLARATION =
  /export\s+(?:declare\s+)?(?:abstract\s+)?(interface|type|const|function|class|enum)\s+([A-Za-z_$][\w$]*)/g;

/** Resolves a relative import from an entrypoint to a package-relative source path. */
export async function resolveModulePath(fromPath: string, specifier: string) {
  if (!specifier.startsWith(".")) return null;

  const directory = fromPath.slice(0, fromPath.lastIndexOf("/"));
  const segments = `${directory}/${specifier}`.split("/");
  const stack: string[] = [];

  for (const segment of segments) {
    if (segment === "." || segment === "") continue;
    if (segment === "..") stack.pop();
    else stack.push(segment);
  }

  const base = stack.join("/").replace(/\.js$/, "");

  return resolveExistingPath([`${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]);
}

export interface ParsedExport {
  name: string;
  kind: KitExport["kind"];
  /** The module specifier a re-export came from, or `null` when declared locally. */
  from: string | null;
}

/**
 * Reads the exported names out of one module. This covers the three forms the
 * kit's entrypoints use: re-export lists with a `from` clause, local export
 * lists, and direct `export interface`/`export const` declarations.
 */
export function parseExports(source: string): ParsedExport[] {
  const parsed: ParsedExport[] = [];
  const seen = new Set<string>();

  const add = (name: string, kind: KitExport["kind"], from: string | null) => {
    if (!name || seen.has(name)) return;

    seen.add(name);
    parsed.push({ name, kind, from });
  };

  for (const match of source.matchAll(EXPORT_LIST)) {
    const [, listIsType, names, specifier] = match;

    for (const entry of names.split(",")) {
      const trimmed = entry.trim();

      if (!trimmed) continue;

      const isType = Boolean(listIsType) || /^type\s+/.test(trimmed);
      const withoutType = trimmed.replace(/^type\s+/, "");
      const alias = /\s+as\s+([A-Za-z_$][\w$]*)$/.exec(withoutType);

      add(alias ? alias[1] : withoutType, isType ? "type" : "value", specifier ?? null);
    }
  }

  for (const match of source.matchAll(EXPORT_DECLARATION)) {
    const [, keyword, name] = match;

    add(name, keyword === "interface" || keyword === "type" ? "type" : "value", null);
  }

  return parsed;
}

/**
 * Resolves one entrypoint's exports against the filesystem. Re-exports are
 * attributed to the module they come from so `get_component` points at real
 * source rather than at the barrel file.
 */
export async function readEntrypointExports(entrypoint: KitEntrypoint): Promise<KitExport[]> {
  const source = await readKitFileIfPresent(entrypoint.path);

  if (source === null) return [];

  const exports: KitExport[] = [];

  for (const parsed of parseExports(source)) {
    const sourcePath = parsed.from
      ? ((await resolveModulePath(entrypoint.path, parsed.from)) ?? entrypoint.path)
      : entrypoint.path;
    const section = SECTION_BY_COMPONENT.get(parsed.name);

    exports.push({
      name: parsed.name,
      kind: parsed.kind,
      entrypoint: entrypoint.specifier,
      sourcePath,
      sectionId: section?.id,
      sectionLabel: section?.label,
    });
  }

  return exports;
}

export async function readPublicExports(): Promise<KitExport[]> {
  const entrypoints = await listEntrypoints();
  const exports = await Promise.all(entrypoints.map(readEntrypointExports));

  return inheritSectionsByModule(exports.flat());
}

/**
 * The catalog names the components a designer browses for, not every
 * composition part. Parts such as `TableBody` inherit the section of the
 * catalogued components they are declared beside so nothing lands in a
 * meaningless "uncategorized" bucket.
 */
function inheritSectionsByModule(exports: readonly KitExport[]): KitExport[] {
  const sectionByModule = new Map<string, { id: string; label: string }>();

  for (const entry of exports) {
    if (entry.sectionId && entry.sectionLabel && !sectionByModule.has(entry.sourcePath)) {
      sectionByModule.set(entry.sourcePath, { id: entry.sectionId, label: entry.sectionLabel });
    }
  }

  return exports.map((entry) => {
    if (entry.sectionId) return entry;

    const inherited = sectionByModule.get(entry.sourcePath);

    return inherited
      ? { ...entry, sectionId: inherited.id, sectionLabel: inherited.label }
      : entry;
  });
}

export interface ComponentSummary extends KitExport {
  /** Other exports declared in the same module, which usually compose together. */
  siblings: string[];
}

export async function findComponent(name: string): Promise<ComponentSummary | null> {
  const exports = await readPublicExports();
  const normalized = name.trim();
  const match =
    exports.find((entry) => entry.name === normalized) ??
    exports.find((entry) => entry.name.toLowerCase() === normalized.toLowerCase());

  if (!match) return null;

  return {
    ...match,
    siblings: exports
      .filter(
        (entry) =>
          entry.sourcePath === match.sourcePath &&
          entry.name !== match.name &&
          entry.kind === "value",
      )
      .map((entry) => entry.name),
  };
}

/**
 * Pulls `interface` and `type` declarations out of a module. Type declarations
 * never contain JSX, so brace counting is safe here in a way it would not be
 * for component bodies.
 */
export function extractTypeDeclarations(source: string, names: readonly string[]) {
  const wanted = new Set(names);
  const declarations: { name: string; code: string }[] = [];
  const pattern = /(?:export\s+)?(interface|type)\s+([A-Za-z_$][\w$]*)/g;

  for (const match of source.matchAll(pattern)) {
    const [, keyword, name] = match;

    if (!wanted.has(name)) continue;

    const start = match.index;
    const end =
      keyword === "interface"
        ? findBalancedEnd(source, source.indexOf("{", start))
        : findStatementEnd(source, start);

    if (end === -1) continue;

    declarations.push({ name, code: source.slice(start, end).trim() });
  }

  return declarations;
}

function findBalancedEnd(source: string, openIndex: number) {
  if (openIndex === -1) return -1;

  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}") {
      depth -= 1;

      if (depth === 0) return index + 1;
    }
  }

  return -1;
}

function findStatementEnd(source: string, start: number) {
  let depth = 0;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];

    if (character === "{" || character === "(" || character === "[") depth += 1;
    else if (character === "}" || character === ")" || character === "]") depth -= 1;
    else if (character === ";" && depth === 0) return index + 1;
  }

  return -1;
}

/**
 * Type names that describe a component's own API, by naming convention.
 *
 * A type belongs to the longest export name it is prefixed by, so `Table`
 * keeps `TableProps` while `TableToolbarTitleProps` stays with
 * `TableToolbarTitle` rather than being repeated under every ancestor.
 */
export function relatedTypeNames(name: string, exports: readonly KitExport[]) {
  const moreSpecific = exports
    .filter((entry) => entry.kind === "value" && entry.name !== name && entry.name.startsWith(name))
    .map((entry) => entry.name);

  return exports
    .filter(
      (entry) =>
        entry.kind === "type" &&
        entry.name.startsWith(name) &&
        !moreSpecific.some((owner) => entry.name.startsWith(owner)),
    )
    .map((entry) => entry.name);
}
