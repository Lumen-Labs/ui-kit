import { type ZipEntry } from "./zip";

/**
 * The archive nests everything under one folder named after the skill, so the
 * download extracts straight into an agent's skills directory (for example
 * `.claude/skills/`) with `SKILL.md` at the folder root.
 */
export const SKILL_DIRECTORY = "lumen-ui-kit";

export const SKILL_ARCHIVE_NAME = `${SKILL_DIRECTORY}-skill.zip`;

/** Rewrites a bundler module id such as `/@fs/…/guidelines/references/x.md` to `references/x.md`. */
export function toArchivePath(modulePath: string) {
  const marker = "/guidelines/";
  const index = modulePath.lastIndexOf(marker);
  const relative = index === -1 ? modulePath.replace(/^.*\//, "") : modulePath.slice(index + marker.length);

  return `${SKILL_DIRECTORY}/${relative}`;
}

/**
 * Turns the raw guideline modules into archive entries, sorted so the archive
 * is reproducible regardless of the order the bundler enumerated them.
 */
export function toSkillEntries(modules: Record<string, string>): ZipEntry[] {
  return Object.entries(modules)
    .map(([modulePath, content]) => ({ path: toArchivePath(modulePath), content }))
    .sort((left, right) => left.path.localeCompare(right.path));
}
