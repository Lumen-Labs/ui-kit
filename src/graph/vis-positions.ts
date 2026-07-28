import type { GraphRenderModel, GraphRenderNode } from "./lod";
import type { GraphPosition } from "./model";

interface ResolveVisLodPositionsInput {
  cachedPositions?: ReadonlyMap<string, GraphPosition>;
  nextModel: GraphRenderModel;
  previousModel?: GraphRenderModel | null;
  previousPositions?: ReadonlyMap<string, GraphPosition>;
}

interface ResolveDraggedVisPositionInput {
  id: string;
  model: GraphRenderModel;
  position: GraphPosition;
  positions?: ReadonlyMap<string, GraphPosition>;
}

export interface ResolvedDraggedVisPosition {
  positions: ReadonlyMap<string, GraphPosition>;
  sourceNodeId: string | null;
}

function memberIds(node: GraphRenderNode): readonly string[] {
  return node.kind === "cluster" ? node.memberIds : [node.id];
}

function sharedMemberCount(left: readonly string[], right: ReadonlySet<string>): number {
  let count = 0;
  for (const id of left) if (right.has(id)) count += 1;
  return count;
}

function hashAngle(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) / 0xffffffff) * Math.PI * 2;
}

function expansionOffset(id: string, siblingIndex: number): GraphPosition {
  const radius = 22 + Math.min(34, Math.sqrt(siblingIndex + 1) * 10);
  const angle = hashAngle(id) + siblingIndex * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

export function resolveDraggedVisPosition({
  id,
  model,
  position,
  positions = new Map(),
}: ResolveDraggedVisPositionInput): ResolvedDraggedVisPosition | null {
  const entity = model.nodes.find((node) => node.id === id);
  if (!entity) return null;

  const nextPositions = new Map(positions);
  nextPositions.set(id, position);
  return {
    positions: nextPositions,
    sourceNodeId: entity.kind === "node" ? entity.node.id : null,
  };
}

export function resolveVisLodPositions({
  cachedPositions,
  nextModel,
  previousModel,
  previousPositions = new Map(),
}: ResolveVisLodPositionsInput): ReadonlyMap<string, GraphPosition> {
  const resolved = new Map<string, GraphPosition>();
  const previousNodes = previousModel?.nodes ?? [];

  for (const nextNode of nextModel.nodes) {
    const cached = cachedPositions?.get(nextNode.id);
    if (cached) {
      resolved.set(nextNode.id, cached);
      continue;
    }

    const sameEntity = previousPositions.get(nextNode.id);
    if (sameEntity) {
      resolved.set(nextNode.id, sameEntity);
      continue;
    }

    const nextMembers = memberIds(nextNode);
    const nextMemberSet = new Set(nextMembers);
    const anchors = previousNodes.flatMap((previousNode) => {
      const weight = sharedMemberCount(memberIds(previousNode), nextMemberSet);
      const position = previousPositions.get(previousNode.id);
      return weight > 0 && position ? [{ node: previousNode, position, weight }] : [];
    });

    if (anchors.length === 0) {
      resolved.set(nextNode.id, nextNode.position);
      continue;
    }

    const totalWeight = anchors.reduce((sum, anchor) => sum + anchor.weight, 0);
    const center = anchors.reduce((position, anchor) => ({
      x: position.x + anchor.position.x * anchor.weight,
      y: position.y + anchor.position.y * anchor.weight,
    }), { x: 0, y: 0 });
    center.x /= totalWeight;
    center.y /= totalWeight;

    const parent = anchors.length === 1 && anchors[0]?.node.kind === "cluster"
      ? anchors[0].node
      : null;
    const expanding = parent && nextMembers.length < parent.memberIds.length;
    if (!expanding) {
      resolved.set(nextNode.id, center);
      continue;
    }

    const siblingIndex = [...parent.memberIds].sort().findIndex((id) => id === nextMembers[0]);
    const offset = expansionOffset(nextNode.id, Math.max(0, siblingIndex));
    resolved.set(nextNode.id, { x: center.x + offset.x, y: center.y + offset.y });
  }

  return resolved;
}
