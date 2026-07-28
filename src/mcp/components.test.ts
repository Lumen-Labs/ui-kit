import assert from "node:assert/strict";
import test from "node:test";

import {
  extractTypeDeclarations,
  findComponent,
  listEntrypoints,
  parseExports,
  readPublicExports,
  relatedTypeNames,
} from "./components";
import { readKitPackage } from "./kit";

// Derived, not hardcoded: the package can be renamed or rescoped without
// these tests asserting a stale identity.
const { name: PACKAGE } = await readKitPackage();

test("re-export lists record their source module and separate types from values", () => {
  const parsed = parseExports(
    'export {\n  Button,\n  buttonVariants,\n  type ButtonProps,\n} from "./components/button";\n',
  );

  assert.deepEqual(parsed, [
    { name: "Button", kind: "value", from: "./components/button" },
    { name: "buttonVariants", kind: "value", from: "./components/button" },
    { name: "ButtonProps", kind: "type", from: "./components/button" },
  ]);
});

test("aliased exports are recorded under the public name", () => {
  const parsed = parseExports('export {\n  Add as AddIcon,\n  Checkmark as CheckIcon,\n};\n');

  assert.deepEqual(
    parsed.map((entry) => entry.name),
    ["AddIcon", "CheckIcon"],
  );
  assert.equal(parsed[0].from, null);
});

test("a whole-list type export marks every name as a type", () => {
  const parsed = parseExports('export type { GraphNode, GraphEdge } from "./model";');

  assert.deepEqual(
    parsed.map((entry) => entry.kind),
    ["type", "type"],
  );
});

test("direct declarations are captured alongside export lists", () => {
  const parsed = parseExports(
    "export interface NextLinkProps { href: string }\nexport const nextLinkVariants = cva();\nexport { NextLink };\n",
  );

  assert.deepEqual(parsed, [
    { name: "NextLink", kind: "value", from: null },
    { name: "NextLinkProps", kind: "type", from: null },
    { name: "nextLinkVariants", kind: "value", from: null },
  ]);
});

test("a name is only reported once even when re-exported twice", () => {
  const parsed = parseExports('export { Button } from "./a";\nexport { Button } from "./b";');

  assert.equal(parsed.length, 1);
});

test("entrypoints are derived from the package exports map", async () => {
  const entrypoints = await listEntrypoints();
  const specifiers = entrypoints.map((entry) => entry.specifier);

  assert.ok(specifiers.includes(PACKAGE));
  assert.ok(specifiers.includes(`${PACKAGE}/icons`));

  for (const entrypoint of entrypoints) {
    assert.match(entrypoint.path, /^src\/.*\.tsx?$/);
  }

  // Stylesheet and JSON subpaths are not importable modules.
  assert.ok(!specifiers.includes(`${PACKAGE}/styles.css`));
});

test("public exports resolve to the module that declares them", async () => {
  const exports = await readPublicExports();
  const button = exports.find((entry) => entry.name === "Button");

  assert.ok(button);
  assert.equal(button.entrypoint, PACKAGE);
  assert.equal(button.sourcePath, "src/components/button.tsx");
  assert.equal(button.sectionId, "actions");
});

test("composition parts inherit the section of the components they sit beside", async () => {
  const exports = await readPublicExports();
  const tableBody = exports.find((entry) => entry.name === "TableBody");

  assert.ok(tableBody, "TableBody is exported but not catalogued on its own");
  assert.equal(tableBody.sectionId, "data-display");
});

test("a component reports the siblings declared in the same module", async () => {
  const component = await findComponent("PromptComposer");

  assert.ok(component);
  assert.ok(component.siblings.includes("PromptComposerField"));
  assert.ok(!component.siblings.includes("PromptComposer"));
});

test("component lookup tolerates casing and rejects unknown names", async () => {
  assert.ok(await findComponent("button"));
  assert.equal(await findComponent("NotAComponent"), null);
});

test("interface and type declarations are extracted whole", () => {
  const source = [
    "interface Other { skip: true }",
    "export interface ButtonProps extends Base {",
    "  disabled?: boolean;",
    "  slots: { start: Node };",
    "}",
    "type ButtonVariantProps = VariantProps<typeof buttonVariants>;",
  ].join("\n");

  const declarations = extractTypeDeclarations(source, ["ButtonProps", "ButtonVariantProps"]);

  assert.deepEqual(
    declarations.map((entry) => entry.name),
    ["ButtonProps", "ButtonVariantProps"],
  );
  assert.ok(declarations[0].code.endsWith("}"));
  assert.ok(declarations[0].code.includes("slots: { start: Node };"));
  assert.ok(declarations[1].code.endsWith(";"));
});

test("related type names are matched by the props naming convention", async () => {
  const exports = await readPublicExports();

  assert.ok(relatedTypeNames("Button", exports).includes("ButtonProps"));
  assert.ok(!relatedTypeNames("Button", exports).includes("TableProps"));
});

test("a type belongs to the most specific export that owns it", async () => {
  const exports = await readPublicExports();
  const table = relatedTypeNames("Table", exports);

  assert.ok(table.includes("TableProps"));
  assert.ok(
    !table.includes("TableToolbarTitleProps"),
    "props of a nested part should not be repeated under its ancestor",
  );
  assert.ok(relatedTypeNames("TableToolbarTitle", exports).includes("TableToolbarTitleProps"));
});
