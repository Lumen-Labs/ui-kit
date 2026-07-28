import assert from "node:assert/strict";
import test from "node:test";

import {
  extractSection,
  listSectionHeadings,
  listSkillDocuments,
  listStyleguideDocuments,
  parseFrontmatter,
  readDocument,
} from "./documents";

test("frontmatter fields and body are separated", () => {
  const { fields, body } = parseFrontmatter("---\nname: lumen\ndescription: A kit\n---\n\n# Title\n");

  assert.equal(fields.name, "lumen");
  assert.equal(fields.description, "A kit");
  assert.equal(body, "# Title\n");
});

test("a document without frontmatter is returned unchanged", () => {
  const { fields, body } = parseFrontmatter("# Title\n\nBody.");

  assert.deepEqual(fields, {});
  assert.equal(body, "# Title\n\nBody.");
});

test("a section is extracted up to the next heading of the same or higher level", () => {
  const content = ["# Doc", "", "## Alpha", "one", "", "### Nested", "two", "", "## Beta", "three"].join("\n");

  assert.equal(extractSection(content, "Alpha"), "## Alpha\none\n\n### Nested\ntwo");
  assert.equal(extractSection(content, "Beta"), "## Beta\nthree");
  assert.equal(extractSection(content, "Missing"), null);
});

test("section lookup ignores case and surrounding whitespace", () => {
  const content = "# Doc\n\n## Lumen Invariants\nrule\n";

  assert.equal(extractSection(content, "  lumen invariants "), "## Lumen Invariants\nrule");
});

test("headings are listed without their hashes", () => {
  const content = "# Doc\n\n## Alpha\n\n### Nested\n\n## Beta\n";

  assert.deepEqual(listSectionHeadings(content), ["Alpha", "Nested", "Beta"]);
});

test("the skill and its references are discovered with titles and summaries", async () => {
  const documents = await listSkillDocuments();
  const skill = documents.find((document) => document.id === "skill");

  assert.ok(skill, "the skill document should be listed");
  assert.equal(skill.kind, "skill");
  assert.match(skill.summary, /design system/i);

  const accessibility = documents.find((document) => document.id === "references/accessibility");

  assert.ok(accessibility, "reference documents should be listed");
  assert.equal(accessibility.kind, "reference");
  assert.ok(accessibility.summary.length > 0);
});

test("every listed document has a non-empty summary", async () => {
  const documents = [...(await listSkillDocuments()), ...(await listStyleguideDocuments())];

  for (const document of documents) {
    assert.ok(document.summary.trim().length > 0, `${document.id} has no summary`);
    assert.ok(document.title.trim().length > 0, `${document.id} has no title`);
  }
});

test("root styleguides are listed and readable by id", async () => {
  const documents = await listStyleguideDocuments();

  assert.ok(documents.some((document) => document.id === "catalog"));

  const catalog = await readDocument("catalog");

  assert.ok(catalog);
  assert.equal(catalog.path, "CATALOG.md");
  assert.ok(catalog.content.includes("# Lumen Component Catalog"));
});

test("document ids are unique and unknown ids resolve to null", async () => {
  const ids = [...(await listSkillDocuments()), ...(await listStyleguideDocuments())].map(
    (document) => document.id,
  );

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(await readDocument("does-not-exist"), null);
});
