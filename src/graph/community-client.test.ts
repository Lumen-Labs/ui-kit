import assert from "node:assert/strict";
import test from "node:test";

import { createGraphCommunityTask, type GraphCommunityWorkerLike } from "./community-client";
import type { GraphLayoutNode, GraphRelationship } from "./model";

const nodes: readonly GraphLayoutNode[] = [
  { id: "service", label: "Checkout", labels: ["Service"], position: { x: 0, y: 0 }, properties: { private: "not transferred" } },
  { id: "database", label: "Orders", labels: ["Database"], position: { x: 160, y: 0 } },
];
const relationships: readonly GraphRelationship[] = [
  { id: "writes", source: "service", target: "database", type: "WRITES_TO", properties: { private: true } },
];

class FakeWorker implements GraphCommunityWorkerLike {
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  posted: unknown[] = [];
  terminated = false;
  postMessage(message: unknown) { this.posted.push(message); }
  terminate() { this.terminated = true; }
}

test("community worker receives compact numeric topology without application properties", async () => {
  const worker = new FakeWorker();
  const task = createGraphCommunityTask(nodes, relationships, { workerFactory: () => worker });
  const posted = worker.posted[0] as { edgeEndpoints: Uint32Array; labelHashes: Uint32Array; nodeCount: number; requestId: number };

  assert.equal(posted.requestId, task.requestId);
  assert.equal(posted.nodeCount, 2);
  assert.deepEqual([...posted.edgeEndpoints], [0, 1]);
  assert.equal(posted.labelHashes.length, 2);
  assert.doesNotMatch(JSON.stringify(posted), /private|Checkout|WRITES_TO/);

  task.cancel();
  await assert.rejects(task.promise, { name: "AbortError" });
});

test("community worker assignments rehydrate the original Lumen records", async () => {
  const worker = new FakeWorker();
  const task = createGraphCommunityTask(nodes, relationships, { workerFactory: () => worker });
  worker.onmessage?.(new MessageEvent("message", { data: {
    requestId: task.requestId,
    compactAssignments: new Int32Array([0, 0]),
    overviewAssignments: new Int32Array([0, 0]),
  } }));

  const hierarchy = await task.promise;
  assert.equal(hierarchy.detail.length, 2);
  assert.deepEqual(hierarchy.compact[0]?.memberIds, ["database", "service"]);
  assert.equal(worker.terminated, true);
});
