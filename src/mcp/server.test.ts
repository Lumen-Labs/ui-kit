import assert from "node:assert/strict";
import test from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

import { escapeRegExp, readKitPackage, resolveKitPath } from "./kit";
import { callTool, createServer, SERVER_NAME, tools } from "./server";

// Derived, not hardcoded: the package can be renamed or rescoped without
// these tests asserting a stale identity.
const { name: PACKAGE } = await readKitPackage();
const PKG = escapeRegExp(PACKAGE);

async function connect() {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = await createServer();

  await server.connect(serverTransport);

  const client = new Client({ name: "test-client", version: "0.0.0" });

  await client.connect(clientTransport);

  return { client, async close() { await client.close(); await server.close(); } };
}

test("the kit reader refuses to escape the package", () => {
  assert.throws(() => resolveKitPath("../../../etc/passwd"), /Refusing to read outside the kit/);
  assert.ok(resolveKitPath("README.md").endsWith("README.md"));
  assert.ok(resolveKitPath(".").length > 0);
});

test("every tool declares a unique name and an object schema", () => {
  const names = tools.map((tool) => tool.name);

  assert.equal(new Set(names).size, names.length);

  for (const tool of tools) {
    assert.ok(tool.description.length > 0, `${tool.name} needs a description`);
    assert.equal(tool.inputSchema.type, "object");
  }
});

test("skills and styleguides are browsable and point at read_document", async () => {
  const skills = await callTool("list_skills");

  assert.match(skills, /`skill`/);
  assert.match(skills, /`references\/accessibility`/);
  assert.match(skills, /read_document/);

  const styleguides = await callTool("list_styleguides");

  assert.match(styleguides, /`catalog`/);
  assert.match(styleguides, /`layout`/);
});

test("a document can be read whole, by section, or as an outline", async () => {
  const whole = await callTool("read_document", { id: "skill" });

  assert.match(whole, /## Lumen Invariants/);

  const section = await callTool("read_document", { id: "skill", section: "Lumen Invariants" });

  assert.match(section, /^<!-- guidelines\/SKILL\.md -->/);
  assert.match(section, /## Lumen Invariants/);
  assert.ok(!section.includes("## Review Output"));

  const outline = await callTool("read_document", { id: "skill", headings_only: true });

  assert.match(outline, /- Workflow/);
  assert.ok(!outline.includes("Treat [core.tokens.json]"));
});

test("unknown documents and sections fail with a recoverable message", async () => {
  await assert.rejects(
    () => callTool("read_document", { id: "nope" }),
    /Unknown document `nope`. Available ids: skill/,
  );
  await assert.rejects(
    () => callTool("read_document", { id: "skill", section: "Nope" }),
    /headings_only/,
  );
});

test("components can be filtered by query, section, and entrypoint", async () => {
  const byQuery = await callTool("list_components", { query: "breadcrumb" });

  assert.match(byQuery, /`Breadcrumbs`/);
  assert.ok(!byQuery.includes("`Button`"));

  const bySection = await callTool("list_components", { section: "overlays" });

  assert.match(bySection, /`Dialog`/);
  assert.ok(!bySection.includes("`Breadcrumbs`"));

  const byEntrypoint = await callTool("list_components", { entrypoint: `${PACKAGE}/icons` });

  assert.match(byEntrypoint, /`AddIcon`/);
  assert.ok(!byEntrypoint.includes("`Dialog`"));

  assert.equal(await callTool("list_components", { query: "zzzz" }), "No exports matched that filter.");
});

test("types are excluded from the component listing unless asked for", async () => {
  assert.ok(!(await callTool("list_components", { query: "ButtonProps" })).includes("ButtonProps"));
  assert.match(
    await callTool("list_components", { query: "ButtonProps", include_types: true }),
    /ButtonProps/,
  );
});

test("a component reports its import, props, and real workbench examples", async () => {
  const detail = await callTool("get_component", { name: "Button" });

  assert.match(detail, new RegExp(`import \\{ Button \\} from "${PKG}";`));
  assert.match(detail, /\*\*Section\*\*: Actions/);
  assert.match(detail, /interface ButtonProps/);
  assert.match(detail, /## Examples/);
  assert.match(detail, /<Button/);
});

test("examples and source are opt-out and opt-in respectively", async () => {
  const lean = await callTool("get_component", { name: "Button", include_examples: false });

  assert.ok(!lean.includes("## Examples"));
  assert.ok(!lean.includes("## Source"));

  const full = await callTool("get_component", { name: "Button", include_source: true });

  assert.match(full, /## Source \(`src\/components\/button\.tsx`\)/);
});

test("a subpath export resolves to its own entrypoint", async () => {
  const detail = await callTool("get_component", { name: "GraphExplorer" });

  assert.match(detail, new RegExp(`import \\{ GraphExplorer \\} from "${PKG}\\/graph";`));
});

test("a component points at the published package and how to install it", async () => {
  const detail = await callTool("get_component", { name: "Button", include_examples: false });

  assert.match(detail, new RegExp(`\\*\\*Package\\*\\*: \`${PKG}@\\d+\\.\\d+\\.\\d+\``));
  assert.match(detail, new RegExp(`https:\\/\\/www\\.npmjs\\.com\\/package\\/${PKG}`));
  assert.match(detail, /## Install/);
  assert.match(detail, new RegExp(`npm install ${PKG}`));

  // The core entrypoint needs no extra peers, so no second command appears.
  assert.ok(!detail.includes("This entrypoint also needs"));
});

test("an entrypoint with extra peers says so in its install block", async () => {
  const detail = await callTool("get_component", { name: "Icon", include_examples: false });

  assert.match(detail, /This entrypoint also needs .*@carbon\/icons-react/);
  assert.match(detail, /npm install @carbon\/icons-react/);
});

test("server instructions name the published package", async () => {
  const { client, close } = await connect();

  try {
    const instructions = client.getInstructions() ?? "";

    assert.match(instructions, new RegExp(`npm install ${PKG}`));
    assert.match(instructions, /get_component/);
  } finally {
    await close();
  }
});

test("an unknown component name points back at discovery tools", async () => {
  await assert.rejects(
    () => callTool("get_component", { name: "Buttonn" }),
    /list_components.*search/s,
  );
});

test("tokens are readable flat, scoped to a group, and as raw DTCG json", async () => {
  const flat = await callTool("get_tokens", { group: "color.brand" });

  assert.match(flat, /`color\.brand\.500` \(color\): #/);

  const json = await callTool("get_tokens", { group: "color.brand", format: "json" });

  assert.ok(JSON.parse(json));

  await assert.rejects(() => callTool("get_tokens", { group: "nope" }), /No token group/);
});

test("arguments are validated before the tool runs", async () => {
  await assert.rejects(() => callTool("read_document", {}), /`id` is required/);
  await assert.rejects(() => callTool("search", { query: "table", limit: "5" }), /`limit` must be a number/);
  await assert.rejects(
    () => callTool("list_components", { query: 5 }),
    /`query` must be a string/,
  );
  await assert.rejects(() => callTool("nonexistent_tool", {}), /Unknown tool/);
});

test("the server advertises its tools and instructions over the protocol", async () => {
  const { client, close } = await connect();

  try {
    const listed = await client.listTools();

    assert.deepEqual(
      listed.tools.map((tool) => tool.name).sort(),
      tools.map((tool) => tool.name).sort(),
    );

    assert.equal(client.getServerVersion()?.name, SERVER_NAME);
    assert.match(client.getInstructions() ?? "", /read the `skill` document/);
  } finally {
    await close();
  }
});

test("tool failures surface as isError results rather than transport errors", async () => {
  const { client, close } = await connect();

  try {
    const ok = await client.callTool({ name: "search", arguments: { query: "dialog" } });

    assert.ok(!ok.isError);
    assert.match((ok.content as { text: string }[])[0].text, /Dialog/);

    const failed = await client.callTool({ name: "read_document", arguments: { id: "nope" } });

    assert.equal(failed.isError, true);
    assert.match((failed.content as { text: string }[])[0].text, /Unknown document/);
  } finally {
    await close();
  }
});

test("documents, tokens, and the catalog are exposed as resources", async () => {
  const { client, close } = await connect();

  try {
    const { resources } = await client.listResources();
    const uris = resources.map((resource) => resource.uri);

    assert.ok(uris.includes("lumen://document/skill"));
    assert.ok(uris.includes("lumen://tokens"));
    assert.ok(uris.includes("lumen://catalog"));

    const skill = await client.readResource({ uri: "lumen://document/skill" });

    assert.match((skill.contents[0] as { text: string }).text, /Lumen Invariants/);

    const catalog = await client.readResource({ uri: "lumen://catalog" });
    const sections = JSON.parse((catalog.contents[0] as { text: string }).text);

    assert.ok(Array.isArray(sections));
    assert.ok(sections.some((section: { id: string }) => section.id === "forms"));

    await assert.rejects(
      () => client.readResource({ uri: "lumen://document/nope" }),
      /Unknown resource/,
    );
  } finally {
    await close();
  }
});
