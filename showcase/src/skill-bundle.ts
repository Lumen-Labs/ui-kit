import { SKILL_ARCHIVE_NAME, toSkillEntries } from "./skill-entries";
import { createZip } from "./zip";

/**
 * The same guideline sources the viewer renders, loaded raw so the download
 * always matches what is on screen. Support files are included because the
 * skill links to them: the token bundle and the source-to-claim map.
 */
const skillFiles = import.meta.glob(
  [
    "../../guidelines/SKILL.md",
    "../../guidelines/references/*.md",
    "../../guidelines/references/*.csv",
    "../../guidelines/assets/*.json",
  ],
  { eager: true, import: "default", query: "?raw" },
) as Record<string, string>;

export { SKILL_ARCHIVE_NAME };

export function skillEntries() {
  return toSkillEntries(skillFiles);
}

export function createSkillArchive() {
  return createZip(skillEntries());
}

/**
 * Hands the archive to the browser as a download. The object URL is revoked
 * once the click has been dispatched so the blob is not retained.
 */
export function downloadSkillArchive() {
  const archive = createSkillArchive();
  const blob = new Blob([archive as BlobPart], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = SKILL_ARCHIVE_NAME;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return skillEntries().length;
}
