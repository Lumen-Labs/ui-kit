import assert from "node:assert/strict";
import test from "node:test";

import {
  buildVisNetworkRecords,
  describeRenderEntity,
  resolveVisRelationshipLength,
  resolveVisNetworkOptions,
  toVisEdgeVisualUpdate,
  toVisInitialNode,
  toVisNodeVisualUpdate,
  type GraphCanvasPalette,
} from "./vis-model";
import { resolveGraphPerformanceOptions, type GraphRenderModel } from "./lod";

const palette: GraphCanvasPalette = {
  canvas: "#101828",
  edge: "#667085",
  edgeDimmed: "#344054",
  nodeBorder: "#1d2939",
  nodeBorderActive: "#ffffff",
  nodeDimmed: "#475467",
  primary: "#175cd3",
  text: "#f9fafb",
  tones: { "category-1": "#2e90fa" },
};

const model: GraphRenderModel = {
  detailLevel: "overview",
  showNodeLabels: true,
  showRelationshipLabels: true,
  nodes: [
    { id: "cluster:a", kind: "cluster", bounds: { x: 0, y: 0, width: 10, height: 10 }, dominantLabel: "Service", labels: ["Service"], matched: true, matchedCount: 3, memberIds: ["a", "b", "c"], position: { x: 5, y: 5 }, tone: "category-1" },
    { id: "cluster:b", kind: "cluster", bounds: { x: 80, y: 0, width: 10, height: 10 }, dominantLabel: "Database", labels: ["Database"], matched: false, matchedCount: 0, memberIds: ["d", "e"], position: { x: 85, y: 5 }, tone: "category-1" },
  ],
  relationships: [
    { id: "aggregate:a:b", kind: "aggregate", count: 4, directed: true, matched: true, matchedCount: 2, relationshipIds: ["1", "2", "3", "4"], source: "cluster:a", target: "cluster:b", types: ["CALLS"] },
  ],
  stats: { aggregateRelationships: 1, internalRelationships: 2, omittedRelationships: 0, renderedNodes: 2, renderedRelationships: 1, sourceNodes: 5, sourceRelationships: 6 },
};

test("vis-network records use the BrainAPI filled-node and continuous-edge treatment", () => {
  const records = buildVisNetworkRecords(model, palette);

  assert.equal(records.nodes.length, 2);
  assert.equal(records.nodes[0]?.shape, "dot");
  assert.equal(records.nodes[0]?.color.background, "#2e90fa");
  assert.equal(records.nodes[1]?.color.background, "#475467");
  assert.deepEqual(records.edges[0]?.arrows, { to: { enabled: true, scaleFactor: 0.8 } });
  assert.equal(records.edges[0]?.smooth.type, "continuous");
  assert.equal(records.edges[0]?.smooth.roundness, 0.35);
  assert.equal(records.edges[0]?.width, 2);
});

test("visual-only updates cannot overwrite live positions or graph topology", () => {
  const records = buildVisNetworkRecords(model, palette);
  const nodeUpdate = toVisNodeVisualUpdate(records.nodes[0]!);
  const edgeUpdate = toVisEdgeVisualUpdate(records.edges[0]!);

  assert.equal("x" in nodeUpdate, false);
  assert.equal("y" in nodeUpdate, false);
  assert.equal("from" in edgeUpdate, false);
  assert.equal("to" in edgeUpdate, false);
  assert.equal(nodeUpdate.id, "cluster:a");
  assert.equal(edgeUpdate.id, "aggregate:a:b");
});

test("automatic nodes enter vis-network without coordinates so live physics owns the initial layout", () => {
  const record = buildVisNetworkRecords(model, palette).nodes[0]!;
  const automatic = toVisInitialNode(record, false);
  const supplied = toVisInitialNode(record, true);

  assert.equal("x" in automatic, false);
  assert.equal("y" in automatic, false);
  assert.equal(supplied.x, record.x);
  assert.equal(supplied.y, record.y);
});

test("topology communities use short internal springs and longer bridge springs", () => {
  const communities = new Map([
    ["checkout", "commerce"],
    ["catalog", "commerce"],
    ["ledger", "payments"],
  ]);

  assert.equal(resolveVisRelationshipLength("checkout", "catalog", communities), 110);
  assert.equal(resolveVisRelationshipLength("checkout", "ledger", communities), 240);
  assert.equal(resolveVisRelationshipLength("checkout", "unknown", communities), undefined);
});

test("balanced vis-network physics matches the BrainAPI console preset", () => {
  const options = resolveVisNetworkOptions(resolveGraphPerformanceOptions(undefined, 250), true);

  assert.equal(options.layout.improvedLayout, true);
  assert.equal(options.interaction.dragNodes, true);
  assert.equal(options.interaction.dragView, true);
  assert.equal(options.interaction.zoomView, true);
  assert.equal(options.physics.enabled, true);
  assert.equal(options.physics.solver, "forceAtlas2Based");
  assert.deepEqual(options.physics.forceAtlas2Based, {
    gravitationalConstant: -50,
    centralGravity: 0.01,
    springLength: 160,
    springConstant: 0.08,
    damping: 0.4,
    avoidOverlap: 0.5,
  });
  assert.deepEqual(options.physics.stabilization, {
    enabled: true,
    iterations: 200,
    updateInterval: 25,
  });
});

test("physics quality and collision padding retain the existing performance controls", () => {
  const fast = resolveVisNetworkOptions(resolveGraphPerformanceOptions({
    layout: { quality: "fast", collisionPadding: 24 },
  }, 20), false);
  const quality = resolveVisNetworkOptions(resolveGraphPerformanceOptions({
    layout: { quality: "quality", collisionPadding: 48 },
  }, 20), true);

  assert.equal(fast.physics.enabled, false);
  assert.equal(fast.physics.stabilization.iterations, 100);
  assert.equal(fast.physics.forceAtlas2Based.avoidOverlap, 1);
  assert.equal(quality.physics.stabilization.iterations, 400);
  assert.equal(quality.physics.forceAtlas2Based.avoidOverlap, 1);
});

test("virtual cursor descriptions retain cluster and filter context", () => {
  assert.match(describeRenderEntity(model, { kind: "node", id: "cluster:a" }), /3 entities, 3 matching/);
  assert.match(describeRenderEntity(model, { kind: "relationship", id: "aggregate:a:b" }), /4 relationships/);
});
