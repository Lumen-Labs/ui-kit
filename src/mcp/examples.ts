import { readKitFileIfPresent } from "./kit.js";

const WORKBENCH_PATH = "showcase/src/workbench.tsx";

export interface KitExample {
  title: string;
  description: string;
  /** The JSX body of one workbench story, as rendered in the showcase. */
  code: string;
}

const STORY_OPENING = /<Story\s[^>]*>/g;
const STORY_CLOSING = "</Story>";

/**
 * Lifts the showcase stories out of the workbench so agents read the same
 * compositions the design system actually renders, rather than invented ones.
 */
export function extractStories(source: string): KitExample[] {
  const stories: KitExample[] = [];

  for (const match of source.matchAll(STORY_OPENING)) {
    const openingTag = match[0];
    const bodyStart = match.index + openingTag.length;
    const bodyEnd = source.indexOf(STORY_CLOSING, bodyStart);

    if (bodyEnd === -1) continue;

    stories.push({
      title: /title="([^"]*)"/.exec(openingTag)?.[1] ?? "Untitled story",
      description: /description="([^"]*)"/.exec(openingTag)?.[1] ?? "",
      code: dedent(source.slice(bodyStart, bodyEnd)),
    });
  }

  return stories;
}

/** Removes the workbench's shared indentation so snippets paste cleanly. */
function dedent(code: string) {
  const lines = code.replace(/^\n/, "").trimEnd().split("\n");
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => /^\s*/.exec(line)![0].length);
  const shortest = indents.length ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(shortest)).join("\n");
}

/** Matches a story that renders the component, not one that merely mentions it. */
export function storyUsesComponent(story: KitExample, name: string) {
  return new RegExp(`<${name}[\\s/>]`).test(story.code);
}

export async function listExamples(): Promise<KitExample[]> {
  const source = await readKitFileIfPresent(WORKBENCH_PATH);

  return source === null ? [] : extractStories(source);
}

export async function listExamplesFor(name: string): Promise<KitExample[]> {
  return (await listExamples()).filter((story) => storyUsesComponent(story, name));
}
