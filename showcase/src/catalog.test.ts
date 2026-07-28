import assert from "node:assert/strict";
import test from "node:test";

import {
  matchesSection,
  showcaseSections,
  showcasedComponentCount,
} from "./catalog";

test("the workbench catalog has stable, unique section and component names", () => {
  const ids = showcaseSections.map((section) => section.id);
  const components = showcaseSections.flatMap((section) => section.components);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(components).size, components.length);
  assert.equal(showcasedComponentCount, 233);
});

test("catalog search matches labels, descriptions, and component names", () => {
  const forms = showcaseSections.find((section) => section.id === "forms");
  const icons = showcaseSections.find((section) => section.id === "icons");
  const layout = showcaseSections.find((section) => section.id === "layout");
  const overlays = showcaseSections.find((section) => section.id === "overlays");
  const visualization = showcaseSections.find((section) => section.id === "visualization");
  const foundations = showcaseSections.find((section) => section.id === "foundations");

  assert.ok(forms && icons && layout && overlays && visualization && foundations);
  assert.equal(matchesSection(forms, "keyboard"), true);
  assert.equal(matchesSection(icons, "decorative"), true);
  assert.equal(matchesSection(layout, "readable"), true);
  assert.equal(matchesSection(overlays, "dialog"), true);
  assert.equal(matchesSection(visualization, "relationship"), true);
  assert.equal(matchesSection(foundations, "dialog"), false);
});
