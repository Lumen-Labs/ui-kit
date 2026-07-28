import assert from "node:assert/strict";
import test from "node:test";

import type { GraphRenderModel } from "./lod";
import {
  resolveDraggedVisPosition,
  resolveVisLodPositions,
} from "./vis-positions";

const emptyStats = {
  aggregateRelationships: 0,
  internalRelationships: 0,
  omittedRelationships: 0,
  renderedNodes: 0,
  renderedRelationships: 0,
  sourceNodes: 2,
  sourceRelationships: 0,
};

const overview: GraphRenderModel = {
  detailLevel: "overview",
  showNodeLabels: true,
  showRelationshipLabels: false,
  nodes: [{
    id: "cluster:payments",
    kind: "cluster",
    bounds: { x: 960, y: -540, width: 80, height: 80 },
    dominantLabel: "Service",
    labels: ["Service"],
    matched: true,
    matchedCount: 2,
    memberIds: ["api", "worker"],
    position: { x: 1000, y: -500 },
    tone: "category-1",
  }],
  relationships: [],
  stats: { ...emptyStats, renderedNodes: 1 },
};

const detail: GraphRenderModel = {
  detailLevel: "detail",
  showNodeLabels: true,
  showRelationshipLabels: true,
  nodes: [
    {
      id: "api",
      kind: "node",
      matched: true,
      node: { id: "api", label: "Payments API", labels: ["Service"], position: { x: -4000, y: 2000 } },
      position: { x: -4000, y: 2000 },
      tone: "category-1",
    },
    {
      id: "worker",
      kind: "node",
      matched: true,
      node: { id: "worker", label: "Payments worker", labels: ["Worker"], position: { x: 5000, y: -3000 } },
      position: { x: 5000, y: -3000 },
      tone: "category-2",
    },
  ],
  relationships: [],
  stats: { ...emptyStats, renderedNodes: 2 },
};

test("expanding a community seeds every child around its live parent position", () => {
  const positions = resolveVisLodPositions({
    nextModel: detail,
    previousModel: overview,
    previousPositions: new Map([["cluster:payments", { x: 120, y: 80 }]]),
  });

  const api = positions.get("api")!;
  const worker = positions.get("worker")!;
  assert.ok(Math.hypot(api.x - 120, api.y - 80) < 72);
  assert.ok(Math.hypot(worker.x - 120, worker.y - 80) < 72);
  assert.notDeepEqual(api, worker);
});

test("collapsing detail derives a community center from its live members", () => {
  const positions = resolveVisLodPositions({
    nextModel: overview,
    previousModel: detail,
    previousPositions: new Map([
      ["api", { x: 80, y: 60 }],
      ["worker", { x: 160, y: 100 }],
    ]),
  });

  assert.deepEqual(positions.get("cluster:payments"), { x: 120, y: 80 });
});

test("a settled cache remains authoritative when returning to a previous level", () => {
  const positions = resolveVisLodPositions({
    cachedPositions: new Map([["api", { x: 16, y: 24 }]]),
    nextModel: detail,
    previousModel: overview,
    previousPositions: new Map([["cluster:payments", { x: 120, y: 80 }]]),
  });

  assert.deepEqual(positions.get("api"), { x: 16, y: 24 });
});

test("dragging a rendered cluster pins its local position without exposing its presentational id", () => {
  const result = resolveDraggedVisPosition({
    id: "cluster:payments",
    model: overview,
    position: { x: 240, y: 160 },
    positions: new Map([["cluster:payments", { x: 120, y: 80 }]]),
  });

  assert.equal(result?.sourceNodeId, null);
  assert.deepEqual(result?.positions.get("cluster:payments"), { x: 240, y: 160 });
});

test("dragging a source node retains its public position callback id", () => {
  const result = resolveDraggedVisPosition({
    id: "api",
    model: detail,
    position: { x: 80, y: 120 },
  });

  assert.equal(result?.sourceNodeId, "api");
  assert.deepEqual(result?.positions.get("api"), { x: 80, y: 120 });
});
