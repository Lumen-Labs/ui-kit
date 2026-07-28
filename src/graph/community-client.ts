import {
  buildGraphCommunityHierarchy,
  buildGraphCommunityHierarchyFromAssignments,
  type GraphCommunityHierarchy,
} from "./community";
import type { GraphLayoutNode, GraphRelationship } from "./model";

interface GraphCommunityWorkerRequest {
  compactBudget: number;
  edgeEndpoints: Uint32Array;
  labelHashes: Uint32Array;
  nodeCount: number;
  overviewBudget: number;
  requestId: number;
  resolution: number;
}

interface GraphCommunityWorkerResponse {
  compactAssignments?: Int32Array;
  error?: string;
  overviewAssignments?: Int32Array;
  requestId: number;
}

export interface GraphCommunityWorkerLike {
  onerror: ((event: ErrorEvent) => void) | null;
  onmessage: ((event: MessageEvent<GraphCommunityWorkerResponse>) => void) | null;
  postMessage: (message: GraphCommunityWorkerRequest, transfer: Transferable[]) => void;
  terminate: () => void;
}

export interface GraphCommunityTask {
  cancel: () => void;
  promise: Promise<GraphCommunityHierarchy>;
  requestId: number;
  usesWorker: boolean;
}

export interface CreateGraphCommunityTaskOptions {
  compactBudget?: number;
  overviewBudget?: number;
  resolution?: number;
  workerFactory?: () => GraphCommunityWorkerLike | null;
}

let nextRequestId = 0;

function defaultWorkerFactory(): GraphCommunityWorkerLike | null {
  if (typeof Worker === "undefined") return null;
  return new Worker(new URL("./community-worker.js", import.meta.url), {
    name: "lumen-graph-community",
    type: "module",
  });
}

function abortError(): Error {
  if (typeof DOMException === "function") return new DOMException("Graph community task was cancelled", "AbortError");
  const error = new Error("Graph community task was cancelled");
  error.name = "AbortError";
  return error;
}

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createGraphCommunityTask(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
  options: CreateGraphCommunityTaskOptions = {},
): GraphCommunityTask {
  const requestId = ++nextRequestId;
  const worker = (options.workerFactory ?? defaultWorkerFactory)();
  let settled = false;
  let rejectTask: (reason: unknown) => void = () => {};
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
  const finish = () => {
    if (settled) return false;
    settled = true;
    if (fallbackTimer) clearTimeout(fallbackTimer);
    worker?.terminate();
    return true;
  };

  const promise = new Promise<GraphCommunityHierarchy>((resolve, reject) => {
    rejectTask = reject;
    const hierarchyOptions = {
      compactBudget: options.compactBudget ?? 180,
      overviewBudget: options.overviewBudget ?? 60,
      resolution: options.resolution ?? 1,
    };
    if (!worker) {
      fallbackTimer = setTimeout(() => {
        if (!finish()) return;
        try { resolve(buildGraphCommunityHierarchy(nodes, relationships, hierarchyOptions)); }
        catch (error) { reject(error); }
      }, 0);
      return;
    }

    worker.onmessage = (event) => {
      if (event.data.requestId !== requestId || !finish()) return;
      if (event.data.error) return reject(new Error(event.data.error));
      resolve(buildGraphCommunityHierarchyFromAssignments(
        nodes,
        relationships,
        event.data.compactAssignments ?? new Int32Array(nodes.length),
        event.data.overviewAssignments ?? new Int32Array(nodes.length),
      ));
    };
    worker.onerror = (event) => {
      if (finish()) reject(new Error(event.message || "Graph community worker failed"));
    };

    const nodeIndex = new Map(nodes.map((node, index) => [node.id, index] as const));
    const validRelationships = relationships.filter((relationship) =>
      nodeIndex.has(relationship.source) && nodeIndex.has(relationship.target));
    const edgeEndpoints = new Uint32Array(validRelationships.length * 2);
    validRelationships.forEach((relationship, index) => {
      edgeEndpoints[index * 2] = nodeIndex.get(relationship.source) ?? 0;
      edgeEndpoints[index * 2 + 1] = nodeIndex.get(relationship.target) ?? 0;
    });
    const labelHashes = new Uint32Array(nodes.map((node) => hashText(node.labels[0] ?? "uncategorized")));
    worker.postMessage({
      ...hierarchyOptions,
      edgeEndpoints,
      labelHashes,
      nodeCount: nodes.length,
      requestId,
    }, [edgeEndpoints.buffer, labelHashes.buffer]);
  });

  return {
    cancel: () => { if (finish()) rejectTask(abortError()); },
    promise,
    requestId,
    usesWorker: Boolean(worker),
  };
}
