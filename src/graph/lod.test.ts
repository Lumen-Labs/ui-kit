import assert from "node:assert/strict";
import test from "node:test";

import {
  buildGraphRenderModel,
  getGraphDetailLevel,
  resolveGraphPerformanceOptions,
} from "./lod";
import type {
  GraphLayoutNode,
  GraphMatches,
  GraphRelationship,
} from "./model";

function createMatches(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
): GraphMatches {
  return {
    matchingNodeIds: new Set(nodes.map((node) => node.id)),
    matchingRelationshipIds: new Set(relationships.map((relationship) => relationship.id)),
    totalNodes: nodes.length,
    totalRelationships: relationships.length,
  };
}

test("large-graph defaults preserve full detail for small datasets", () => {
  const small = resolveGraphPerformanceOptions(undefined, 40);
  const large = resolveGraphPerformanceOptions(undefined, 1_000);

  assert.equal(small.isLargeGraph, false);
  assert.equal(small.shouldCluster, false);
  assert.equal(small.shouldUseWorker, false);
  assert.equal(large.isLargeGraph, true);
  assert.equal(large.shouldCluster, true);
  assert.equal(large.shouldUseWorker, true);
  assert.equal(large.minimumNodeCount, 150);
  assert.equal(large.overviewRenderedNodes, 60);
  assert.equal(large.overviewRenderedRelationships, 90);
  assert.equal(large.targetRenderedNodes, 180);
  assert.equal(large.targetRenderedRelationships, 360);
  assert.equal(large.layoutQuality, "balanced");
  assert.equal(large.collisionPadding, 12);
  assert.equal(large.clusteringResolution, 1);
});

test("layout quality, collision padding, and community resolution are configurable", () => {
  const resolved = resolveGraphPerformanceOptions({
    layout: { quality: "quality", collisionPadding: 18 },
    clustering: { resolution: 1.4 },
  }, 1_000);

  assert.equal(resolved.layoutQuality, "quality");
  assert.equal(resolved.collisionPadding, 18);
  assert.equal(resolved.clusteringResolution, 1.4);
});

test("performance=false restores the original unclustered presentation", () => {
  const resolved = resolveGraphPerformanceOptions(false, 5_000);

  assert.equal(resolved.isLargeGraph, false);
  assert.equal(resolved.shouldCluster, false);
  assert.equal(resolved.shouldUseWorker, false);
  assert.equal(resolved.nodeLabelMinZoom, 0);
  assert.equal(resolved.relationshipLabelMinZoom, 0);
});

test("detail levels change only at stable semantic zoom thresholds", () => {
  const options = resolveGraphPerformanceOptions(undefined, 1_000);

  assert.equal(getGraphDetailLevel(0.2, options), "overview");
  assert.equal(getGraphDetailLevel(0.65, options), "compact");
  assert.equal(getGraphDetailLevel(1, options), "detail");
});

test("nearby nodes collapse into deterministic clusters and relationships aggregate", () => {
  const nodes: readonly GraphLayoutNode[] = Array.from({ length: 12 }, (_, index) => ({
    id: `node-${index}`,
    label: `Node ${index}`,
    labels: [index < 6 ? "Service" : "Database"],
    position: index < 6
      ? { x: (index % 3) * 10, y: Math.floor(index / 3) * 10 }
      : { x: 600 + (index % 3) * 10, y: 400 + Math.floor(index / 3) * 10 },
  }));
  const relationships: readonly GraphRelationship[] = Array.from(
    { length: 6 },
    (_, index) => ({
      id: `relationship-${index}`,
      source: `node-${index}`,
      target: `node-${index + 6}`,
      type: index % 2 ? "READS_FROM" : "WRITES_TO",
    }),
  );
  const options = resolveGraphPerformanceOptions({
    clustering: {
      minimumNodeCount: 1,
      belowZoom: 0.9,
      targetRenderedNodes: 4,
      targetRenderedRelationships: 2,
    },
  }, nodes.length);

  const first = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: null,
    zoom: 0.2,
    options,
  });
  const second = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: null,
    zoom: 0.2,
    options,
  });

  assert.deepEqual(first, second);
  assert.equal(first.detailLevel, "overview");
  assert.ok(first.nodes.length <= 4);
  assert.ok(first.nodes.every((node) => node.kind === "cluster"));
  assert.ok(first.relationships.length <= 2);
  assert.ok(first.relationships.every((relationship) => relationship.kind === "aggregate"));
});

test("selected entities stay individually addressable inside an overview cluster", () => {
  const nodes: readonly GraphLayoutNode[] = Array.from({ length: 8 }, (_, index) => ({
    id: `node-${index}`,
    label: `Node ${index}`,
    labels: ["Service"],
    position: { x: index * 4, y: index * 3 },
  }));
  const relationships: readonly GraphRelationship[] = [
    { id: "selected-edge", source: "node-0", target: "node-1", type: "CALLS" },
  ];
  const options = resolveGraphPerformanceOptions({
    clustering: { minimumNodeCount: 1, targetRenderedNodes: 1 },
  }, nodes.length);

  const selectedNodeModel = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: { kind: "node", id: "node-0" },
    zoom: 0.2,
    options,
  });
  const selectedRelationshipModel = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: { kind: "relationship", id: "selected-edge" },
    zoom: 0.2,
    options,
  });

  assert.ok(selectedNodeModel.nodes.some((node) => node.kind === "node" && node.id === "node-0"));
  assert.ok(selectedRelationshipModel.nodes.some((node) => node.kind === "node" && node.id === "node-0"));
  assert.ok(selectedRelationshipModel.nodes.some((node) => node.kind === "node" && node.id === "node-1"));
  assert.ok(selectedRelationshipModel.relationships.some((relationship) => relationship.id === "selected-edge"));
});

test("overview rendering uses a quieter relationship budget", () => {
  const nodes: readonly GraphLayoutNode[] = Array.from({ length: 1_000 }, (_, index) => ({
    id: `node-${index}`,
    label: `Node ${index}`,
    labels: [`Group ${index % 8}`],
    position: { x: (index % 50) * 24, y: Math.floor(index / 50) * 24 },
  }));
  const relationships: readonly GraphRelationship[] = Array.from(
    { length: 2_000 },
    (_, index) => ({
      id: `relationship-${index}`,
      source: `node-${index % nodes.length}`,
      target: `node-${(index * 17 + 31) % nodes.length}`,
      type: `TYPE_${index % 5}`,
    }),
  );
  const options = resolveGraphPerformanceOptions({
    clustering: {
      targetRenderedNodes: 120,
      targetRenderedRelationships: 240,
    },
  }, nodes.length);

  const model = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: null,
    zoom: 0.2,
    options,
  });

  assert.ok(model.nodes.length <= 46);
  assert.ok(model.relationships.length <= 43);
  assert.equal(model.stats.sourceNodes, 1_000);
  assert.equal(model.stats.sourceRelationships, 2_000);
  assert.equal(
    model.stats.renderedRelationships + model.stats.omittedRelationships,
    model.stats.aggregateRelationships,
  );
});

test("compact rendering increases relationship context without using the full budget", () => {
  const nodes: readonly GraphLayoutNode[] = Array.from({ length: 500 }, (_, index) => ({
    id: `node-${index}`,
    label: `Node ${index}`,
    labels: [`Group ${index % 8}`],
    position: { x: (index % 25) * 40, y: Math.floor(index / 25) * 40 },
  }));
  const relationships: readonly GraphRelationship[] = Array.from(
    { length: 1_000 },
    (_, index) => ({
      id: `relationship-${index}`,
      source: `node-${index % nodes.length}`,
      target: `node-${(index * 11 + 17) % nodes.length}`,
      type: `TYPE_${index % 5}`,
    }),
  );
  const options = resolveGraphPerformanceOptions({
    clustering: {
      belowZoom: 1,
      targetRenderedNodes: 120,
      targetRenderedRelationships: 240,
    },
  }, nodes.length);

  const model = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: null,
    zoom: 0.7,
    options,
  });

  assert.equal(model.detailLevel, "compact");
  assert.ok(model.relationships.length <= 240);
  assert.ok(model.relationships.every((relationship) => relationship.kind === "aggregate"));
});

test("detail zoom restores original graph entities", () => {
  const nodes: readonly GraphLayoutNode[] = Array.from({ length: 250 }, (_, index) => ({
    id: `node-${index}`,
    label: `Node ${index}`,
    labels: ["Service"],
    position: { x: index * 10, y: index % 7 },
  }));
  const relationships: readonly GraphRelationship[] = [
    { id: "relationship", source: "node-0", target: "node-1", type: "CALLS" },
  ];
  const options = resolveGraphPerformanceOptions(undefined, nodes.length);

  const model = buildGraphRenderModel({
    nodes,
    relationships,
    matches: createMatches(nodes, relationships),
    selection: null,
    zoom: 1,
    options,
  });

  assert.equal(model.detailLevel, "detail");
  assert.deepEqual(model.nodes.map((node) => node.id), nodes.map((node) => node.id));
  assert.deepEqual(model.relationships.map((relationship) => relationship.id), ["relationship"]);
});
