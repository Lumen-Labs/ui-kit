import assert from "node:assert/strict";
import test from "node:test";

import {
  getGraphFacets,
  getGraphTone,
  layoutGraph,
  matchGraph,
  moveGraphLayoutNode,
  normalizeGraph,
  seedGraphLayout,
  type GraphFilterState,
  type GraphNode,
  type GraphRelationship,
} from "./model";

const nodes: readonly GraphNode[] = [
  {
    id: "checkout",
    label: "Checkout API",
    labels: ["Service", "Critical"],
    properties: { owner: "Commerce", region: "eu-west-1" },
  },
  {
    id: "payments",
    label: "Payments worker",
    labels: ["Worker"],
    properties: { owner: "Payments", replicas: 4 },
  },
  {
    id: "ledger",
    label: "Ledger database",
    labels: ["Database"],
    position: { x: 320, y: 180 },
  },
  {
    id: "isolated",
    label: "Audit archive",
    labels: ["Database"],
  },
];

const relationships: readonly GraphRelationship[] = [
  {
    id: "checkout-payments",
    source: "checkout",
    target: "payments",
    type: "CALLS",
  },
  {
    id: "payments-ledger",
    source: "payments",
    target: "ledger",
    type: "WRITES_TO",
    properties: { encrypted: true },
  },
  {
    id: "dangling",
    source: "missing",
    target: "checkout",
    type: "CALLS",
  },
];

test("normalizeGraph preserves nodes and removes relationships with missing endpoints", () => {
  const normalized = normalizeGraph(nodes, relationships);

  assert.deepEqual(normalized.nodes, nodes);
  assert.deepEqual(
    normalized.relationships.map((relationship) => relationship.id),
    ["checkout-payments", "payments-ledger"],
  );
});

test("layoutGraph is deterministic and respects application-supplied positions", () => {
  const first = layoutGraph(nodes, relationships);
  const second = layoutGraph(nodes, relationships);

  assert.deepEqual(first, second);
  assert.deepEqual(
    first.find((node) => node.id === "ledger")?.position,
    { x: 320, y: 180 },
  );
  assert.ok(first.every((node) => Number.isFinite(node.position.x)));
  assert.ok(first.every((node) => Number.isFinite(node.position.y)));
});

test("seedGraphLayout prepares large topologies without running force simulation", () => {
  const first = seedGraphLayout(nodes);
  const second = seedGraphLayout(nodes);

  assert.deepEqual(first, second);
  assert.deepEqual(
    first.find((node) => node.id === "ledger")?.position,
    { x: 320, y: 180 },
  );
  assert.ok(first.every((node) => Number.isFinite(node.position.x)));
  assert.ok(first.every((node) => Number.isFinite(node.position.y)));
});

test("moveGraphLayoutNode persists a presentation position without mutating the layout", () => {
  const layout = seedGraphLayout(nodes);
  const originalCheckout = layout.find((node) => node.id === "checkout");
  const moved = moveGraphLayoutNode(layout, "checkout", { x: 720, y: -160 });

  assert.deepEqual(
    moved.find((node) => node.id === "checkout")?.position,
    { x: 720, y: -160 },
  );
  assert.deepEqual(
    layout.find((node) => node.id === "checkout")?.position,
    originalCheckout?.position,
  );
  assert.equal(
    moved.find((node) => node.id === "payments"),
    layout.find((node) => node.id === "payments"),
  );
});

test("layoutGraph settles cycles and isolated nodes without dropping either", () => {
  const cyclicRelationships: readonly GraphRelationship[] = [
    ...relationships,
    { id: "ledger-checkout", source: "ledger", target: "checkout", type: "REPLICATES_TO" },
  ];
  const result = layoutGraph(nodes, cyclicRelationships);

  assert.deepEqual(result.map((node) => node.id), nodes.map((node) => node.id));
  assert.ok(result.some((node) => node.id === "isolated"));
  assert.ok(result.every((node) => Number.isFinite(node.position.x) && Number.isFinite(node.position.y)));
});

test("layoutGraph leaves a readable safety lane between connected node boundaries", () => {
  const hubNodes: readonly GraphNode[] = Array.from({ length: 10 }, (_, index) => ({
    id: `hub-node-${index}`,
    label: `Hub node ${index}`,
    labels: [index === 0 ? "Gateway" : "Service"],
  }));
  const hubRelationships: readonly GraphRelationship[] = hubNodes.slice(1).map((node, index) => ({
    id: `hub-edge-${index}`,
    source: "hub-node-0",
    target: node.id,
    type: "CALLS",
  }));

  const result = layoutGraph(hubNodes, hubRelationships);
  const minimumCenterDistance = result.reduce((minimum, node, index) => {
    const nearest = result.slice(index + 1).reduce(
      (distance, candidate) => Math.min(
        distance,
        Math.hypot(
          node.position.x - candidate.position.x,
          node.position.y - candidate.position.y,
        ),
      ),
      Number.POSITIVE_INFINITY,
    );
    return Math.min(minimum, nearest);
  }, Number.POSITIVE_INFINITY);

  assert.ok(minimumCenterDistance >= 144, `closest node centers were ${minimumCenterDistance}`);
});

test("graph facets are stable, unique, and alphabetized", () => {
  assert.deepEqual(getGraphFacets(nodes, relationships), {
    nodeLabels: ["Critical", "Database", "Service", "Worker"],
    relationshipTypes: ["CALLS", "WRITES_TO"],
  });
});

test("matchGraph combines query and facet groups while retaining the full topology", () => {
  const filters: GraphFilterState = {
    query: "payments",
    nodeLabels: ["Worker"],
    relationshipTypes: ["CALLS"],
  };
  const matches = matchGraph(nodes, relationships, filters);

  assert.deepEqual([...matches.matchingNodeIds], ["payments"]);
  assert.deepEqual([...matches.matchingRelationshipIds], ["checkout-payments"]);
  assert.equal(matches.totalNodes, 4);
  assert.equal(matches.totalRelationships, 2);
});

test("graph tones are stable for the same label and stay within the six token slots", () => {
  const first = getGraphTone("Service");

  assert.equal(getGraphTone("Service"), first);
  assert.match(first, /^category-[1-6]$/);
});
