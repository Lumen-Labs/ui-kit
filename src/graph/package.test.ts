import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const packageUrl = new URL("../../package.json", import.meta.url);
const coreIndexUrl = new URL("../index.ts", import.meta.url);
const copyScriptUrl = new URL("../../scripts/copy-assets.mjs", import.meta.url);

test("the graph adapter is an isolated optional package entrypoint", () => {
  const manifest = JSON.parse(readFileSync(packageUrl, "utf8")) as {
    exports: Record<string, unknown>;
    peerDependencies: Record<string, string>;
    peerDependenciesMeta: Record<string, { optional?: boolean }>;
    sideEffects: string[];
  };
  const coreIndex = readFileSync(coreIndexUrl, "utf8");
  const copyScript = readFileSync(copyScriptUrl, "utf8");

  assert.ok(manifest.exports["./graph"]);
  assert.equal(manifest.exports["./graph/styles.css"], "./dist/graph/styles.css");
  for (const dependency of [
    "vis-network",
    "vis-data",
    "graphology",
    "graphology-layout-forceatlas2",
    "graphology-layout-noverlap",
    "graphology-communities-louvain",
  ]) {
    assert.ok(manifest.peerDependencies[dependency]);
    assert.equal(manifest.peerDependenciesMeta[dependency]?.optional, true);
  }
  assert.equal(manifest.peerDependencies["@xyflow/react"], undefined);
  assert.equal(manifest.peerDependencies["d3-force"], undefined);
  assert.equal(manifest.peerDependencies["sigma"], undefined);
  assert.equal(manifest.peerDependencies["@sigma/edge-curve"], undefined);
  assert.equal(manifest.peerDependencies["@sigma/node-border"], undefined);
  assert.ok(manifest.sideEffects.includes("./dist/graph/styles.css"));
  assert.doesNotMatch(coreIndex, /GraphExplorer|\.\/graph/);
  assert.match(copyScript, /src\/graph\/styles\.css/);
  assert.match(copyScript, /src\/graph\/community-worker\.js/);
});
