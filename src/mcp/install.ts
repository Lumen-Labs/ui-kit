import { resolveModulePath, type KitEntrypoint } from "./components.js";
import { readKitFileIfPresent, readKitPackage } from "./kit.js";

/**
 * React is required by every entrypoint, so repeating it under each component
 * is noise. It is reported once as the package baseline instead.
 */
const BASELINE_PEERS = new Set(["react", "react-dom"]);

export interface PeerRequirement {
  name: string;
  range: string;
  optional: boolean;
}

const IMPORT_SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)["']([^"']+)["']/g;

/** Every module specifier a source file imports, relative and bare alike. */
export function extractImportSpecifiers(source: string) {
  return [...new Set([...source.matchAll(IMPORT_SPECIFIER)].map((match) => match[1]))];
}

/**
 * Maps a deep import to the package that provides it, so `next/link` counts as
 * `next` and `@scope/pkg/sub` as `@scope/pkg`.
 */
export function packageNameFor(specifier: string) {
  const segments = specifier.split("/");

  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

export function isBareSpecifier(specifier: string) {
  return !specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.startsWith("node:");
}

/**
 * Walks an entrypoint's local module graph, following relative imports, and
 * returns every bare package it reaches.
 *
 * A peer belongs to the entrypoint rather than to the individual component:
 * importing anything from `lumen-ui-kit/graph` pulls in that entrypoint's
 * module graph, so its peers are needed either way.
 */
export async function collectBarePackages(entrypointPath: string) {
  const visited = new Set<string>();
  const queue = [entrypointPath];
  const packages = new Set<string>();

  while (queue.length) {
    const current = queue.shift()!;

    if (visited.has(current)) continue;

    visited.add(current);

    const source = await readKitFileIfPresent(current);

    if (source === null) continue;

    for (const specifier of extractImportSpecifiers(source)) {
      if (isBareSpecifier(specifier)) {
        packages.add(packageNameFor(specifier));
        continue;
      }

      const resolved = await resolveModulePath(current, specifier);

      if (resolved) queue.push(resolved);
    }
  }

  return [...packages].sort();
}

/**
 * The declared peers an entrypoint actually reaches. Declared-but-unimported
 * peers are omitted, so a stale peer list never turns into a wrong install
 * command.
 */
export async function peersForEntrypoint(entrypoint: KitEntrypoint): Promise<PeerRequirement[]> {
  const pkg = (await readKitPackage()) as {
    peerDependencies?: Record<string, string>;
    peerDependenciesMeta?: Record<string, { optional?: boolean }>;
  };
  const declared = pkg.peerDependencies ?? {};
  const meta = pkg.peerDependenciesMeta ?? {};
  const reached = await collectBarePackages(entrypoint.path);

  return reached
    .filter((name) => name in declared && !BASELINE_PEERS.has(name))
    .map((name) => ({
      name,
      range: declared[name],
      optional: Boolean(meta[name]?.optional),
    }));
}

export interface PackageIdentity {
  name: string;
  version: string;
  registryUrl: string;
  /** The declared React range, reported once rather than per component. */
  reactRange: string | null;
}

export async function readPackageIdentity(): Promise<PackageIdentity> {
  const pkg = (await readKitPackage()) as {
    name: string;
    version: string;
    peerDependencies?: Record<string, string>;
  };

  return {
    name: pkg.name,
    version: pkg.version,
    registryUrl: `https://www.npmjs.com/package/${pkg.name}`,
    reactRange: pkg.peerDependencies?.react ?? null,
  };
}

/** Renders the install section shown by `get_component`. */
export function formatInstall(identity: PackageIdentity, peers: readonly PeerRequirement[]) {
  const lines = [`\`\`\`bash`, `npm install ${identity.name}`, `\`\`\``];

  if (peers.length) {
    const required = peers.filter((peer) => !peer.optional);
    const optional = peers.filter((peer) => peer.optional);

    lines.push(
      "",
      `This entrypoint also needs ${peers
        .map((peer) => `\`${peer.name}\` (${peer.range}${peer.optional ? ", optional peer" : ""})`)
        .join(", ")}:`,
      "```bash",
      `npm install ${[...required, ...optional].map((peer) => peer.name).join(" ")}`,
      "```",
    );
  }

  return lines.join("\n");
}
