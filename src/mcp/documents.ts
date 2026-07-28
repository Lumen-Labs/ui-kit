import { listKitFiles, readKitFileIfPresent } from "./kit.js";

export type DocumentKind = "skill" | "reference" | "styleguide";

export interface KitDocument {
  /** Stable identifier accepted by `read_document`. */
  id: string;
  title: string;
  summary: string;
  kind: DocumentKind;
  /** Package-relative source path. */
  path: string;
}

const SKILL_PATH = "guidelines/SKILL.md";
const REFERENCE_DIRECTORY = "guidelines/references";

interface Frontmatter {
  fields: Record<string, string>;
  body: string;
}

/** Reads the small `key: value` frontmatter block used by the skill document. */
export function parseFrontmatter(source: string): Frontmatter {
  if (!source.startsWith("---")) return { fields: {}, body: source };

  const end = source.indexOf("\n---", 3);

  if (end === -1) return { fields: {}, body: source };

  const fields: Record<string, string> = {};

  for (const line of source.slice(3, end).split("\n")) {
    const separator = line.indexOf(":");

    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    if (key) fields[key] = value;
  }

  const bodyStart = source.indexOf("\n", end + 1);

  return { fields, body: bodyStart === -1 ? "" : source.slice(bodyStart + 1).trimStart() };
}

/** Takes the first ATX heading as a title and the first paragraph as a summary. */
function describeMarkdown(source: string, fallbackTitle: string) {
  const { body } = parseFrontmatter(source);
  const lines = body.split("\n");
  const headingIndex = lines.findIndex((line) => line.startsWith("# "));
  const title = headingIndex === -1 ? fallbackTitle : lines[headingIndex].slice(2).trim();

  return { title, summary: firstParagraph(lines.slice(headingIndex + 1)) };
}

/**
 * The first prose paragraph. Guides that open straight into subheadings fall
 * through to the first paragraph under one of them rather than summarizing
 * as an empty string.
 */
function firstParagraph(lines: readonly string[]) {
  const paragraph: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      if (paragraph.length) break;
      continue;
    }

    paragraph.push(trimmed);
  }

  return paragraph.join(" ");
}

function slugFromPath(filePath: string) {
  const basename = filePath.slice(filePath.lastIndexOf("/") + 1);

  return basename.replace(/\.md$/i, "").toLowerCase();
}

async function describeDocument(
  filePath: string,
  kind: DocumentKind,
  id: string,
): Promise<KitDocument | null> {
  const source = await readKitFileIfPresent(filePath);

  if (source === null) return null;

  const { title, summary } = describeMarkdown(source, slugFromPath(filePath));

  return { id, title, summary, kind, path: filePath };
}

/**
 * The agent skill and the reference documents it loads on demand. The skill
 * itself carries the workflow and invariants; references carry the detail.
 */
export async function listSkillDocuments(): Promise<KitDocument[]> {
  const documents: KitDocument[] = [];
  const skillSource = await readKitFileIfPresent(SKILL_PATH);

  if (skillSource !== null) {
    const { fields } = parseFrontmatter(skillSource);
    const described = describeMarkdown(skillSource, "Skill");

    documents.push({
      id: "skill",
      title: fields.name ?? described.title,
      summary: fields.description ?? described.summary,
      kind: "skill",
      path: SKILL_PATH,
    });
  }

  for (const filePath of await listKitFiles(REFERENCE_DIRECTORY, ".md")) {
    const document = await describeDocument(
      filePath,
      "reference",
      `references/${slugFromPath(filePath)}`,
    );

    if (document) documents.push(document);
  }

  return documents;
}

/** The long-form guides that live at the package root. */
export async function listStyleguideDocuments(): Promise<KitDocument[]> {
  const documents: KitDocument[] = [];

  for (const filePath of await listKitFiles(".", ".md")) {
    const document = await describeDocument(
      filePath.replace(/^\.\//, ""),
      "styleguide",
      slugFromPath(filePath),
    );

    if (document) documents.push(document);
  }

  return documents;
}

export async function listAllDocuments(): Promise<KitDocument[]> {
  return [...(await listSkillDocuments()), ...(await listStyleguideDocuments())];
}

export interface DocumentContent extends KitDocument {
  content: string;
}

export async function readDocument(id: string): Promise<DocumentContent | null> {
  const normalized = id.trim().toLowerCase();
  const document = (await listAllDocuments()).find((entry) => entry.id === normalized);

  if (!document) return null;

  const content = await readKitFileIfPresent(document.path);

  return content === null ? null : { ...document, content };
}

/**
 * Narrows a document to one `##` section so agents can pull a single rule
 * without loading an entire guide.
 */
export function extractSection(content: string, heading: string) {
  const normalized = heading.trim().toLowerCase();
  const lines = content.split("\n");
  const start = lines.findIndex((line) => {
    const match = /^(#{2,6})\s+(.*)$/.exec(line);

    return match ? match[2].trim().toLowerCase() === normalized : false;
  });

  if (start === -1) return null;

  const level = /^(#{2,6})/.exec(lines[start])![1].length;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => {
    const match = /^(#{1,6})\s+/.exec(line);

    return match ? match[1].length <= level : false;
  });

  return [lines[start], ...(end === -1 ? rest : rest.slice(0, end))].join("\n").trimEnd();
}

/** Lists the `##`-and-deeper headings of a document for targeted follow-up reads. */
export function listSectionHeadings(content: string) {
  return content
    .split("\n")
    .map((line) => /^(#{2,6})\s+(.*)$/.exec(line))
    .filter((match): match is RegExpExecArray => match !== null)
    .map((match) => match[2].trim());
}
