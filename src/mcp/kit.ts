import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The package root, resolved from this module rather than the working
 * directory so the server behaves the same whether it runs from `src/mcp`
 * under tsx or from `dist/mcp` under Node.
 */
export const kitRoot = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));

/** Resolves a package-relative path and refuses to escape the package. */
export function resolveKitPath(relativePath: string) {
  const resolved = path.resolve(kitRoot, relativePath);

  if (resolved !== kitRoot && !resolved.startsWith(kitRoot + path.sep)) {
    throw new Error(`Refusing to read outside the kit: ${relativePath}`);
  }

  return resolved;
}

export async function readKitFile(relativePath: string) {
  return readFile(resolveKitPath(relativePath), "utf8");
}

/** Returns `null` instead of throwing when a file is absent from the install. */
export async function readKitFileIfPresent(relativePath: string) {
  try {
    return await readKitFile(relativePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/** Lists files in a package directory, sorted, and empty when the directory is absent. */
export async function listKitFiles(relativeDirectory: string, extension: string) {
  let entries: string[];

  try {
    entries = await readdir(resolveKitPath(relativeDirectory));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  return entries
    .filter((entry) => entry.endsWith(extension))
    .sort()
    .map((entry) => `${relativeDirectory}/${entry}`);
}

/** Resolves the first path that exists, for sources that may be `.ts` or `.tsx`. */
export async function resolveExistingPath(candidates: readonly string[]) {
  for (const candidate of candidates) {
    if ((await readKitFileIfPresent(candidate)) !== null) return candidate;
  }

  return null;
}

export interface KitPackage {
  name: string;
  version: string;
  description?: string;
  exports?: Record<string, unknown>;
}

export async function readKitPackage(): Promise<KitPackage> {
  return JSON.parse(await readKitFile("package.json")) as KitPackage;
}

/** Escapes a string for safe use inside a `RegExp`, for names containing `/` or `.`. */
export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}
