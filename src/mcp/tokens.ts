import { readKitFileIfPresent } from "./kit.js";

const TOKEN_PATHS = ["src/tokens/core.tokens.json", "dist/tokens/core.tokens.json"];

export type TokenTree = Record<string, unknown>;

export async function readTokenBundle(): Promise<TokenTree | null> {
  for (const path of TOKEN_PATHS) {
    const source = await readKitFileIfPresent(path);

    if (source !== null) return JSON.parse(source) as TokenTree;
  }

  return null;
}

/** Narrows the bundle to a dotted group such as `color.brand`. */
export function selectTokenGroup(tree: TokenTree, group: string): unknown {
  let node: unknown = tree;

  for (const segment of group.split(".")) {
    if (!segment) continue;
    if (typeof node !== "object" || node === null) return undefined;

    node = (node as TokenTree)[segment];
  }

  return node;
}

export interface FlatToken {
  path: string;
  type: string;
  value: string;
}

function formatTokenValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    if (typeof record.hex === "string") return record.hex;

    return JSON.stringify(value);
  }

  return String(value);
}

/** Walks the DTCG tree and returns every leaf token as a readable path/value pair. */
export function flattenTokens(node: unknown, prefix: string[] = []): FlatToken[] {
  if (typeof node !== "object" || node === null) return [];

  const record = node as Record<string, unknown>;

  if ("$value" in record) {
    return [
      {
        path: prefix.join("."),
        type: typeof record.$type === "string" ? record.$type : "unknown",
        value: formatTokenValue(record.$value),
      },
    ];
  }

  return Object.entries(record)
    .filter(([key]) => !key.startsWith("$"))
    .flatMap(([key, value]) => flattenTokens(value, [...prefix, key]));
}
