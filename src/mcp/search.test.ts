import assert from "node:assert/strict";
import test from "node:test";

import { parseQuery, searchKit } from "./search";

test("a query is split into deduplicated terms", () => {
  assert.deepEqual(parseQuery("Sortable  table, sortable").terms, ["sortable", "table"]);
});

test("single characters are dropped but a lone short query survives", () => {
  assert.deepEqual(parseQuery("a table").terms, ["table"]);
  assert.deepEqual(parseQuery("x").terms, ["x"]);
});

test("an empty query returns no results", async () => {
  assert.deepEqual(await searchKit("   "), []);
});

test("a multi-word query finds the component that covers every term", async () => {
  const results = await searchKit("sortable table", 10);

  assert.equal(results[0].type, "component");
  assert.equal(results[0].id, "TableSortableHead");
});

test("results are ranked by score and respect the limit", async () => {
  const results = await searchKit("table", 5);

  assert.equal(results.length, 5);

  for (let index = 1; index < results.length; index += 1) {
    assert.ok(results[index - 1].score >= results[index].score);
  }
});

test("an exact component name outranks its longer relatives", async () => {
  const results = await searchKit("EmptyState", 10);

  assert.equal(results[0].id, "EmptyState");
});

test("prose that only appears in the guides is still findable", async () => {
  const results = await searchKit("focus ring", 10);
  const documents = results.filter((result) => result.type === "document");

  assert.ok(documents.length > 0);
  assert.ok(documents[0].snippet.toLowerCase().includes("focus"));
});

test("token paths are searchable and carry their value in the snippet", async () => {
  const results = await searchKit("color.brand", 20);
  const token = results.find((result) => result.type === "token");

  assert.ok(token);
  assert.match(token.snippet, /color: #/);
});

test("a query matching nothing returns an empty list", async () => {
  assert.deepEqual(await searchKit("zzzqqqnotathing"), []);
});
