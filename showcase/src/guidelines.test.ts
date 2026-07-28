import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { guideDocuments, matchesGuide } from "./guidelines";

test("the workbench exposes every copied Lumen Markdown guide", () => {
  const ids = guideDocuments.map((guide) => guide.id);
  const paths = guideDocuments.map((guide) => guide.path);

  assert.equal(guideDocuments.length, 10);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(paths).size, paths.length);
  assert.deepEqual(paths, [
    "SKILL.md",
    "references/foundations.md",
    "references/components.md",
    "references/accessibility.md",
    "references/product-patterns.md",
    "references/react-nextjs.md",
    "references/package-api.md",
    "references/graph.md",
    "references/automation.md",
    "references/attribution.md",
  ]);

  for (const guide of guideDocuments) {
    const markdown = readFileSync(
      new URL(`../../guidelines/${guide.path}`, import.meta.url),
      "utf8",
    );

    assert.match(markdown, /^---[\s\S]*?^# .+|^# .+/m);
  }
});

test("guideline search matches titles, summaries, and source paths", () => {
  const accessibility = guideDocuments.find((guide) => guide.id === "accessibility");
  const react = guideDocuments.find((guide) => guide.id === "react-nextjs");
  const foundations = guideDocuments.find((guide) => guide.id === "foundations");

  assert.ok(accessibility && react && foundations);
  assert.equal(matchesGuide(accessibility, "WCAG"), true);
  assert.equal(matchesGuide(react, "server components"), true);
  assert.equal(matchesGuide(foundations, "references/foundations.md"), true);
  assert.equal(matchesGuide(foundations, "focus trapping"), false);
});
