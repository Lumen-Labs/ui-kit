import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { SKILL_ARCHIVE_NAME, SKILL_DIRECTORY, toArchivePath, toSkillEntries } from "./skill-entries";
import { createZip } from "./zip";

test("module ids are rewritten to skill-relative archive paths", () => {
  assert.equal(toArchivePath("/repo/ui-kit/guidelines/SKILL.md"), `${SKILL_DIRECTORY}/SKILL.md`);
  assert.equal(
    toArchivePath("../../guidelines/references/foundations.md"),
    `${SKILL_DIRECTORY}/references/foundations.md`,
  );
  assert.equal(
    toArchivePath("/@fs/Users/x/ui-kit/guidelines/assets/core.tokens.json"),
    `${SKILL_DIRECTORY}/assets/core.tokens.json`,
  );
});

test("everything is nested under one folder so it unzips into a skills directory", () => {
  const entries = toSkillEntries({
    "../../guidelines/SKILL.md": "# Skill",
    "../../guidelines/references/graph.md": "# Graph",
  });

  assert.ok(entries.every((entry) => entry.path.startsWith(`${SKILL_DIRECTORY}/`)));
  assert.equal(SKILL_ARCHIVE_NAME, `${SKILL_DIRECTORY}-skill.zip`);
});

test("entries are sorted so the archive does not depend on bundler ordering", () => {
  const forward = toSkillEntries({
    "../../guidelines/SKILL.md": "a",
    "../../guidelines/references/b.md": "b",
    "../../guidelines/assets/c.json": "c",
  });
  const reversed = toSkillEntries({
    "../../guidelines/assets/c.json": "c",
    "../../guidelines/references/b.md": "b",
    "../../guidelines/SKILL.md": "a",
  });

  assert.deepEqual(forward, reversed);
});

test("the real guidelines round-trip through the archive as an installable skill", (t) => {
  let unzip: string;

  try {
    unzip = execFileSync("which", ["unzip"], { encoding: "utf8" }).trim();
  } catch {
    t.skip("unzip is not available on this machine");
    return;
  }

  // Read the guidelines the way the bundler would, then take the same path
  // the browser button takes: map to entries, zip, and extract.
  const guidelines = new URL("../../guidelines/", import.meta.url);
  const modules: Record<string, string> = {
    "../../guidelines/SKILL.md": readFileSync(new URL("SKILL.md", guidelines), "utf8"),
  };

  for (const name of readdirSync(new URL("references/", guidelines))) {
    modules[`../../guidelines/references/${name}`] = readFileSync(
      new URL(`references/${name}`, guidelines),
      "utf8",
    );
  }

  for (const name of readdirSync(new URL("assets/", guidelines))) {
    modules[`../../guidelines/assets/${name}`] = readFileSync(
      new URL(`assets/${name}`, guidelines),
      "utf8",
    );
  }

  const directory = mkdtempSync(path.join(tmpdir(), "lumen-skill-"));
  const archivePath = path.join(directory, SKILL_ARCHIVE_NAME);

  try {
    writeFileSync(archivePath, createZip(toSkillEntries(modules)));

    assert.match(execFileSync(unzip, ["-t", archivePath], { encoding: "utf8" }), /No errors detected/);

    execFileSync(unzip, ["-q", "-o", archivePath, "-d", directory]);

    const root = path.join(directory, SKILL_DIRECTORY);
    const skill = readFileSync(path.join(root, "SKILL.md"), "utf8");

    // The frontmatter name must survive, since it identifies the installed skill.
    assert.match(skill, /^---\n[\s\S]*name: lumen-ui-kit/);
    assert.match(skill, /## Lumen Invariants/);

    // The references the skill links to have to be there too, or it is broken.
    assert.equal(
      readFileSync(path.join(root, "references", "foundations.md"), "utf8").length > 0,
      true,
    );
    assert.ok(JSON.parse(readFileSync(path.join(root, "assets", "core.tokens.json"), "utf8")).color);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
