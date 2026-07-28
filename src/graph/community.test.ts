import assert from "node:assert/strict";
import test from "node:test";

import { buildGraphCommunityHierarchy } from "./community";
import type { GraphLayoutNode, GraphRelationship } from "./model";

function fixture() {
  const nodes: GraphLayoutNode[] = Array.from({ length: 14 }, (_, index) => ({
    id: `node-${index}`,
    label: `Node ${index}`,
    labels: [index < 6 ? "Service" : index < 12 ? "Database" : "Queue"],
    position: { x: index < 7 ? index * 12 : 500 + index * 12, y: index % 3 },
  }));
  const relationships: GraphRelationship[] = [];
  for (let index = 0; index < 5; index += 1) {
    relationships.push({ id: `left-${index}`, source: `node-${index}`, target: `node-${index + 1}`, type: "CALLS" });
    relationships.push({ id: `right-${index}`, source: `node-${index + 6}`, target: `node-${index + 7}`, type: "READS" });
  }
  relationships.push({ id: "bridge", source: "node-5", target: "node-6", type: "BRIDGE" });
  relationships.push({ id: "parallel-a", source: "node-0", target: "node-1", type: "CALLS" });
  relationships.push({ id: "parallel-b", source: "node-1", target: "node-0", type: "RETURNS" });
  relationships.push({ id: "cross-a", source: "node-1", target: "node-8", type: "CALLS" });
  relationships.push({ id: "cross-b", source: "node-1", target: "node-8", type: "CALLS" });
  return { nodes, relationships };
}

test("community hierarchy is deterministic and topology-aware", () => {
  const { nodes, relationships } = fixture();
  const first = buildGraphCommunityHierarchy(nodes, relationships, { compactBudget: 6, overviewBudget: 3, resolution: 1 });
  const second = buildGraphCommunityHierarchy(nodes, [...relationships].reverse(), { compactBudget: 6, overviewBudget: 3, resolution: 1 });

  assert.deepEqual(first, second);
  assert.equal(first.detail.length, nodes.length);
  assert.ok(first.overview.length <= 3);
  assert.ok(first.compact.length <= 6);
  assert.ok(first.overview.every((cluster) => cluster.id.startsWith("cluster:")));
  assert.ok(first.overview.some((cluster) => cluster.memberIds.includes("node-12") && cluster.memberIds.includes("node-13")));
});

test("community hierarchy preserves original edge direction and parallel records at detail", () => {
  const { nodes, relationships } = fixture();
  const hierarchy = buildGraphCommunityHierarchy(nodes, relationships, { compactBudget: 4, overviewBudget: 2, resolution: 1 });
  const parallelA = hierarchy.relationships.detail.find((edge) => edge.id === "parallel-a");
  const parallelB = hierarchy.relationships.detail.find((edge) => edge.id === "parallel-b");

  assert.ok(parallelA);
  assert.ok(parallelB);
  assert.notEqual(parallelA.source, parallelB.source);
  assert.notEqual(parallelA.target, parallelB.target);
  assert.equal(relationships.find((edge) => edge.id === "parallel-b")?.source, "node-1");
});
