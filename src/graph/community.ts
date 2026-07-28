import Graph from "graphology";
import louvain from "graphology-communities-louvain";

import type { GraphLayoutNode, GraphRelationship } from "./model";

export interface GraphCommunityCluster {
  id: string;
  memberIds: readonly string[];
}

export interface GraphCommunityRelationship {
  count: number;
  directed: boolean;
  id: string;
  relationshipIds: readonly string[];
  source: string;
  target: string;
  types: readonly string[];
}

export interface GraphCommunityHierarchy {
  compact: readonly GraphCommunityCluster[];
  detail: readonly GraphCommunityCluster[];
  overview: readonly GraphCommunityCluster[];
  relationships: {
    compact: readonly GraphCommunityRelationship[];
    detail: readonly GraphCommunityRelationship[];
    overview: readonly GraphCommunityRelationship[];
  };
}

export interface GraphCommunityOptions {
  compactBudget: number;
  overviewBudget: number;
  resolution: number;
}

function hashIds(ids: readonly string[]): string {
  let hash = 2166136261;
  for (const id of ids) {
    for (let index = 0; index < id.length; index += 1) {
      hash ^= id.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= 31;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function seededRandom(seed: number): () => number {
  let value = seed || 1;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function cluster(memberIds: readonly string[]): GraphCommunityCluster {
  const sorted = [...memberIds].sort();
  return { id: `cluster:${hashIds(sorted)}`, memberIds: sorted };
}

function mergeToBudget(
  initial: readonly GraphCommunityCluster[],
  relationships: readonly GraphRelationship[],
  budget: number,
): GraphCommunityCluster[] {
  const groups = initial.map((item) => [...item.memberIds]);
  const limit = Math.max(1, Math.floor(budget));
  while (groups.length > limit) {
    const groupByNode = new Map<string, number>();
    groups.forEach((members, index) => members.forEach((id) => groupByNode.set(id, index)));
    const strengths = new Map<string, number>();
    for (const relationship of relationships) {
      const source = groupByNode.get(relationship.source);
      const target = groupByNode.get(relationship.target);
      if (source === undefined || target === undefined || source === target) continue;
      const left = Math.min(source, target);
      const right = Math.max(source, target);
      const key = `${left}:${right}`;
      strengths.set(key, (strengths.get(key) ?? 0) + 1);
    }
    const strongest = [...strengths.entries()].sort(([leftKey, left], [rightKey, right]) =>
      right - left || leftKey.localeCompare(rightKey),
    )[0];
    let left = 0;
    let right = 1;
    if (strongest) [left, right] = strongest[0].split(":").map(Number) as [number, number];
    else {
      const ordered = groups
        .map((members, index) => ({ index, key: members[0] ?? "", size: members.length }))
        .sort((a, b) => a.size - b.size || a.key.localeCompare(b.key));
      left = ordered[0]?.index ?? 0;
      right = ordered[1]?.index ?? 1;
      if (left > right) [left, right] = [right, left];
    }
    groups[left] = [...(groups[left] ?? []), ...(groups[right] ?? [])].sort();
    groups.splice(right, 1);
  }
  return groups.map(cluster).sort((a, b) => a.id.localeCompare(b.id));
}

function aggregateRelationships(
  clusters: readonly GraphCommunityCluster[],
  relationships: readonly GraphRelationship[],
): GraphCommunityRelationship[] {
  const clusterByNode = new Map<string, string>();
  clusters.forEach((item) => item.memberIds.forEach((id) => clusterByNode.set(id, item.id)));
  const groups = new Map<string, GraphRelationship[]>();
  for (const relationship of [...relationships].sort((a, b) => a.id.localeCompare(b.id))) {
    const source = clusterByNode.get(relationship.source);
    const target = clusterByNode.get(relationship.target);
    if (!source || !target || source === target) continue;
    const key = `${source}\u0000${target}`;
    const current = groups.get(key);
    if (current) current.push(relationship);
    else groups.set(key, [relationship]);
  }
  return [...groups.entries()].map(([key, members]) => {
    const [source, target] = key.split("\u0000") as [string, string];
    const relationshipIds = members.map((item) => item.id).sort();
    return {
      count: members.length,
      directed: members.some((item) => item.directed !== false),
      id: `aggregate:${source}:${target}`,
      relationshipIds,
      source,
      target,
      types: [...new Set(members.map((item) => item.type))].sort(),
    };
  }).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

function clustersFromAssignments(
  nodes: readonly GraphLayoutNode[],
  assignments: ArrayLike<number>,
): GraphCommunityCluster[] {
  const groups = new Map<number, string[]>();
  nodes.forEach((node, index) => {
    const assignment = assignments[index] ?? index;
    const members = groups.get(assignment);
    if (members) members.push(node.id);
    else groups.set(assignment, [node.id]);
  });
  return [...groups.values()].map(cluster).sort((a, b) => a.id.localeCompare(b.id));
}

export function buildGraphCommunityHierarchyFromAssignments(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
  compactAssignments: ArrayLike<number>,
  overviewAssignments: ArrayLike<number>,
): GraphCommunityHierarchy {
  const compact = clustersFromAssignments(nodes, compactAssignments);
  const overview = clustersFromAssignments(nodes, overviewAssignments);
  const detail = [...nodes].sort((a, b) => a.id.localeCompare(b.id)).map((node) => cluster([node.id]));
  return {
    compact,
    detail,
    overview,
    relationships: {
      compact: aggregateRelationships(compact, relationships),
      detail: [...relationships].sort((a, b) => a.id.localeCompare(b.id)).map((edge) => ({
        count: 1,
        directed: edge.directed !== false,
        id: edge.id,
        relationshipIds: [edge.id],
        source: cluster([edge.source]).id,
        target: cluster([edge.target]).id,
        types: [edge.type],
      })),
      overview: aggregateRelationships(overview, relationships),
    },
  };
}

export function buildProvisionalCommunityHierarchy(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
  options: GraphCommunityOptions,
): GraphCommunityHierarchy {
  const byLabel = new Map<string, string[]>();
  for (const node of [...nodes].sort((a, b) => a.id.localeCompare(b.id))) {
    const label = node.labels[0] ?? "Uncategorized";
    const members = byLabel.get(label);
    if (members) members.push(node.id);
    else byLabel.set(label, [node.id]);
  }
  const base = [...byLabel.values()].map(cluster).sort((a, b) => a.id.localeCompare(b.id));
  const compact = mergeToBudget(base, relationships, options.compactBudget);
  const overview = mergeToBudget(compact, relationships, options.overviewBudget);
  const compactByNode = new Map(compact.flatMap((item, index) => item.memberIds.map((id) => [id, index] as const)));
  const overviewByNode = new Map(overview.flatMap((item, index) => item.memberIds.map((id) => [id, index] as const)));
  return buildGraphCommunityHierarchyFromAssignments(
    nodes,
    relationships,
    nodes.map((node, index) => compactByNode.get(node.id) ?? index),
    nodes.map((node, index) => overviewByNode.get(node.id) ?? index),
  );
}

export function buildGraphCommunityHierarchy(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
  options: GraphCommunityOptions,
): GraphCommunityHierarchy {
  const sortedNodes = [...nodes].sort((a, b) => a.id.localeCompare(b.id));
  const nodeIds = new Set(sortedNodes.map((node) => node.id));
  const topology = new Graph({ multi: false, type: "undirected" });
  for (const node of sortedNodes) topology.addNode(node.id);
  for (const relationship of [...relationships].sort((a, b) => a.id.localeCompare(b.id))) {
    if (!nodeIds.has(relationship.source) || !nodeIds.has(relationship.target) || relationship.source === relationship.target) continue;
    const edge = topology.edge(relationship.source, relationship.target);
    if (edge) topology.updateEdgeAttribute(edge, "weight", (weight = 1) => weight + 1);
    else topology.addEdge(relationship.source, relationship.target, { weight: 1 });
  }

  const seed = Number.parseInt(hashIds(sortedNodes.map((node) => node.id)), 36) || 1;
  const mapping = topology.size > 0
    ? louvain(topology, { getEdgeWeight: "weight", randomWalk: false, resolution: options.resolution, rng: seededRandom(seed) })
    : Object.fromEntries(sortedNodes.map((node, index) => [node.id, index]));
  const grouped = new Map<number, string[]>();
  for (const node of sortedNodes) {
    const community = mapping[node.id] ?? Number.MAX_SAFE_INTEGER;
    const members = grouped.get(community);
    if (members) members.push(node.id);
    else grouped.set(community, [node.id]);
  }

  const labelById = new Map(sortedNodes.map((node) => [node.id, node.labels[0] ?? "Uncategorized"]));
  const connectedIds = new Set(relationships.flatMap((edge) => [edge.source, edge.target]));
  const connected = [...grouped.values()]
    .map((members) => members.filter((id) => connectedIds.has(id)))
    .filter((members) => members.length > 0)
    .map(cluster);
  const isolatedByLabel = new Map<string, string[]>();
  for (const node of sortedNodes) {
    if (connectedIds.has(node.id)) continue;
    const label = labelById.get(node.id) ?? "Uncategorized";
    const members = isolatedByLabel.get(label);
    if (members) members.push(node.id);
    else isolatedByLabel.set(label, [node.id]);
  }
  const base = [...connected, ...[...isolatedByLabel.values()].map(cluster)]
    .sort((a, b) => a.id.localeCompare(b.id));
  const compact = mergeToBudget(base, relationships, options.compactBudget);
  const overview = mergeToBudget(compact, relationships, options.overviewBudget);
  const detail = sortedNodes.map((node) => cluster([node.id]));

  return {
    compact,
    detail,
    overview,
    relationships: {
      compact: aggregateRelationships(compact, relationships),
      detail: [...relationships].sort((a, b) => a.id.localeCompare(b.id)).map((edge) => ({
        count: 1,
        directed: edge.directed !== false,
        id: edge.id,
        relationshipIds: [edge.id],
        source: cluster([edge.source]).id,
        target: cluster([edge.target]).id,
        types: [edge.type],
      })),
      overview: aggregateRelationships(overview, relationships),
    },
  };
}
