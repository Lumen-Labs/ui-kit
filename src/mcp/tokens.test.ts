import assert from "node:assert/strict";
import test from "node:test";

import { flattenTokens, readTokenBundle, selectTokenGroup } from "./tokens";

const BUNDLE = {
  $schema: "https://www.designtokens.org/schemas/2025.10/format.json",
  color: {
    brand: {
      500: { $type: "color", $value: { colorSpace: "srgb", hex: "#0A66FF" } },
    },
  },
  space: { 4: { $type: "dimension", $value: "4px" } },
};

test("colors are flattened to their hex value and dimensions to their literal", () => {
  assert.deepEqual(flattenTokens(BUNDLE), [
    { path: "color.brand.500", type: "color", value: "#0A66FF" },
    { path: "space.4", type: "dimension", value: "4px" },
  ]);
});

test("schema and extension keys are not treated as tokens", () => {
  assert.ok(flattenTokens(BUNDLE).every((token) => !token.path.startsWith("$")));
});

test("a group selection keeps the full dotted path in flattened output", () => {
  const group = selectTokenGroup(BUNDLE, "color.brand");

  assert.deepEqual(flattenTokens(group, ["color", "brand"]), [
    { path: "color.brand.500", type: "color", value: "#0A66FF" },
  ]);
});

test("an unknown group resolves to undefined rather than throwing", () => {
  assert.equal(selectTokenGroup(BUNDLE, "color.nope.deeper"), undefined);
});

test("the shipped bundle loads and contains semantic color tokens", async () => {
  const bundle = await readTokenBundle();

  assert.ok(bundle, "the token bundle should be present in the repository");

  const tokens = flattenTokens(bundle);

  assert.ok(tokens.length > 0);
  assert.ok(tokens.some((token) => token.path.startsWith("color.")));
  assert.ok(tokens.every((token) => token.path.length > 0));
});
