import { buildGraphCommunityHierarchy } from "./community.js";

self.addEventListener("message", (event) => {
  const { compactBudget, edgeEndpoints, labelHashes, nodeCount, overviewBudget, requestId, resolution } = event.data;
  try {
    const nodes = Array.from({ length: nodeCount }, (_, index) => ({
      id: String(index),
      label: String(index),
      labels: [String(labelHashes[index])],
      position: { x: 0, y: 0 },
    }));
    const relationships = Array.from({ length: edgeEndpoints.length / 2 }, (_, index) => ({
      id: String(index),
      source: String(edgeEndpoints[index * 2]),
      target: String(edgeEndpoints[index * 2 + 1]),
      type: "relationship",
    }));
    const hierarchy = buildGraphCommunityHierarchy(nodes, relationships, {
      compactBudget,
      overviewBudget,
      resolution,
    });
    const compactByNode = new Map(hierarchy.compact.flatMap((cluster, index) =>
      cluster.memberIds.map((id) => [id, index])));
    const overviewByNode = new Map(hierarchy.overview.flatMap((cluster, index) =>
      cluster.memberIds.map((id) => [id, index])));
    const compactAssignments = new Int32Array(nodeCount);
    const overviewAssignments = new Int32Array(nodeCount);
    for (let index = 0; index < nodeCount; index += 1) {
      compactAssignments[index] = compactByNode.get(String(index)) ?? index;
      overviewAssignments[index] = overviewByNode.get(String(index)) ?? index;
    }
    self.postMessage({ requestId, compactAssignments, overviewAssignments }, [compactAssignments.buffer, overviewAssignments.buffer]);
  } catch (error) {
    self.postMessage({ requestId, error: error instanceof Error ? error.message : "Graph community detection failed" });
  }
});
