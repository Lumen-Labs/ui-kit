import { showcaseSections } from "../catalog.js";
import { readPublicExports } from "./components.js";
import { listAllDocuments } from "./documents.js";
import { readKitFileIfPresent } from "./kit.js";
import { flattenTokens, readTokenBundle } from "./tokens.js";

export type SearchResultType = "component" | "section" | "document" | "token";

export interface SearchResult {
  type: SearchResultType;
  /** The identifier to pass back to `get_component`, `read_document`, or `get_tokens`. */
  id: string;
  title: string;
  score: number;
  snippet: string;
}

/**
 * Agents search with descriptions rather than names — "sortable table",
 * "focus ring". Matching every term separately and rewarding items that hit
 * more of them keeps those queries useful, while an exact phrase still wins.
 */
export function parseQuery(rawQuery: string) {
  const phrase = rawQuery.trim().toLowerCase();
  const terms = [...new Set(phrase.split(/[^a-z0-9]+/i).filter((term) => term.length > 1))];

  return { phrase, terms: terms.length ? terms : phrase ? [phrase] : [] };
}

interface Scored {
  score: number;
  matchedTerms: number;
  bestTerm: string | null;
}

/** Scores a haystack against the parsed query, weighting whole-phrase hits. */
function scoreText(haystack: string, phrase: string, terms: readonly string[], weight: number) {
  const lowered = haystack.toLowerCase();
  let score = 0;
  let matchedTerms = 0;
  let bestTerm: string | null = null;
  let bestCount = 0;

  for (const term of terms) {
    const count = countOccurrences(lowered, term);

    if (count === 0) continue;

    matchedTerms += 1;
    score += Math.min(count, 8) * weight;

    if (count > bestCount) {
      bestCount = count;
      bestTerm = term;
    }
  }

  if (terms.length > 1 && lowered.includes(phrase)) {
    score += weight * 12;
    bestTerm = phrase;
  }

  // Reward covering the whole query rather than repeating one common word.
  if (matchedTerms > 0) score += (matchedTerms / terms.length) * weight * 10;

  return { score, matchedTerms, bestTerm } satisfies Scored;
}

function countOccurrences(haystack: string, needle: string) {
  let count = 0;
  let index = haystack.indexOf(needle);

  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }

  return count;
}

/** Returns a one-line excerpt centred on the first match. */
function snippetAround(content: string, term: string | null, radius = 140) {
  if (!term) return "";

  const index = content.toLowerCase().indexOf(term);

  if (index === -1) return "";

  const start = Math.max(0, index - radius);
  const end = Math.min(content.length, index + term.length + radius);
  const excerpt = content.slice(start, end).replace(/\s+/g, " ").trim();

  return `${start > 0 ? "…" : ""}${excerpt}${end < content.length ? "…" : ""}`;
}

/**
 * One ranked pass over every surface the server exposes, so an agent that only
 * knows what it wants to build lands on the component, the guide, and the
 * token in a single call.
 */
export async function searchKit(rawQuery: string, limit = 20): Promise<SearchResult[]> {
  const { phrase, terms } = parseQuery(rawQuery);

  if (!terms.length) return [];

  const results: SearchResult[] = [];

  for (const entry of await readPublicExports()) {
    const name = entry.name.toLowerCase();
    const scored = scoreText(entry.name, phrase, terms, 6);

    if (scored.matchedTerms === 0) continue;

    results.push({
      type: "component",
      id: entry.name,
      title: `${entry.name} (${entry.kind})`,
      score: scored.score + (name === phrase ? 80 : name.startsWith(phrase) ? 30 : 0),
      snippet: `${entry.sectionLabel ?? "Uncategorized"} · import { ${entry.name} } from "${entry.entrypoint}"`,
    });
  }

  for (const section of showcaseSections) {
    const scored = scoreText(
      [section.label, section.description, ...section.components].join(" "),
      phrase,
      terms,
      3,
    );

    if (scored.matchedTerms === 0) continue;

    results.push({
      type: "section",
      id: section.id,
      title: section.label,
      score: scored.score,
      snippet: `${section.description} (${section.components.length} components)`,
    });
  }

  for (const document of await listAllDocuments()) {
    const content = (await readKitFileIfPresent(document.path)) ?? "";
    const scored = scoreText(`${document.title}\n${content}`, phrase, terms, 2);

    if (scored.matchedTerms === 0) continue;

    results.push({
      type: "document",
      id: document.id,
      title: `${document.title} (${document.kind})`,
      score: scored.score,
      snippet: snippetAround(content, scored.bestTerm) || document.summary,
    });
  }

  const tokens = await readTokenBundle();

  for (const token of tokens ? flattenTokens(tokens) : []) {
    const scored = scoreText(token.path, phrase, terms, 2);

    if (scored.matchedTerms === 0) continue;

    results.push({
      type: "token",
      id: token.path,
      title: token.path,
      score: scored.score,
      snippet: `${token.type}: ${token.value}`,
    });
  }

  return results.sort((left, right) => right.score - left.score).slice(0, limit);
}
