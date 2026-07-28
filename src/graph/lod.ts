import {
  getGraphTone,
  type GraphCategoryTone,
  type GraphLayoutNode,
  type GraphMatches,
  type GraphPosition,
  type GraphRelationship,
  type GraphSelection,
} from "./model";
import {
  buildGraphCommunityHierarchy,
  type GraphCommunityHierarchy,
} from "./community";

export interface GraphClusteringOptions {
  belowZoom?: number;
  minimumNodeCount?: number;
  resolution?: number;
  targetRenderedNodes?: number;
  targetRenderedRelationships?: number;
}

export interface GraphLayoutOptions {
  collisionPadding?: number;
  quality?: "fast" | "balanced" | "quality";
}

export interface GraphLabelVisibilityOptions {
  nodeMinZoom?: number;
  relationshipMinZoom?: number;
}

export interface GraphPerformanceOptions {
  clustering?: false | GraphClusteringOptions;
  labels?: GraphLabelVisibilityOptions;
  layout?: GraphLayoutOptions;
  workerThreshold?: number;
}

export interface ResolvedGraphPerformanceOptions {
  clusterBelowZoom: number;
  clusteringResolution: number;
  collisionPadding: number;
  isLargeGraph: boolean;
  layoutQuality: "fast" | "balanced" | "quality";
  minimumNodeCount: number;
  nodeLabelMinZoom: number;
  overviewRenderedNodes: number;
  overviewRenderedRelationships: number;
  relationshipLabelMinZoom: number;
  shouldCluster: boolean;
  shouldUseWorker: boolean;
  targetRenderedNodes: number;
  targetRenderedRelationships: number;
  workerThreshold: number;
}

export type GraphDetailLevel = "overview" | "compact" | "detail";

export interface GraphClusterBounds extends GraphPosition {
  height: number;
  width: number;
}

export interface GraphRenderNodeEntity {
  id: string;
  kind: "node";
  matched: boolean;
  node: GraphLayoutNode;
  position: GraphPosition;
  tone: GraphCategoryTone;
}

export interface GraphRenderNodeCluster {
  bounds: GraphClusterBounds;
  dominantLabel: string;
  id: string;
  kind: "cluster";
  labels: readonly string[];
  matched: boolean;
  matchedCount: number;
  memberIds: readonly string[];
  position: GraphPosition;
  tone: GraphCategoryTone;
}

export type GraphRenderNode = GraphRenderNodeEntity | GraphRenderNodeCluster;

export interface GraphRenderRelationshipEntity {
  count: 1;
  directed: boolean;
  id: string;
  kind: "relationship";
  matched: boolean;
  matchedCount: 0 | 1;
  relationship: GraphRelationship;
  source: string;
  target: string;
  types: readonly [string];
}

export interface GraphRenderRelationshipAggregate {
  count: number;
  directed: boolean;
  id: string;
  kind: "aggregate";
  matched: boolean;
  matchedCount: number;
  relationshipIds: readonly string[];
  source: string;
  target: string;
  types: readonly string[];
}

export type GraphRenderRelationship =
  | GraphRenderRelationshipEntity
  | GraphRenderRelationshipAggregate;

export interface GraphRenderStats {
  aggregateRelationships: number;
  internalRelationships: number;
  omittedRelationships: number;
  renderedNodes: number;
  renderedRelationships: number;
  sourceNodes: number;
  sourceRelationships: number;
}

export interface GraphRenderModel {
  detailLevel: GraphDetailLevel;
  nodes: readonly GraphRenderNode[];
  relationships: readonly GraphRenderRelationship[];
  showNodeLabels: boolean;
  showRelationshipLabels: boolean;
  stats: GraphRenderStats;
}

export interface BuildGraphRenderModelInput {
  hierarchy?: GraphCommunityHierarchy;
  matches: GraphMatches;
  nodes: readonly GraphLayoutNode[];
  options: ResolvedGraphPerformanceOptions;
  relationships: readonly GraphRelationship[];
  selection: GraphSelection;
  zoom: number;
}

const DEFAULT_WORKER_THRESHOLD = 150;
const DEFAULT_CLUSTER_NODE_THRESHOLD = 150;
const DEFAULT_CLUSTER_ZOOM = 0.85;
const DEFAULT_RENDERED_NODE_TARGET = 180;
const DEFAULT_RENDERED_RELATIONSHIP_TARGET = 360;
const DEFAULT_OVERVIEW_NODE_TARGET = 60;
const DEFAULT_OVERVIEW_RELATIONSHIP_TARGET = 90;
const DEFAULT_COLLISION_PADDING = 12;
const DEFAULT_CLUSTERING_RESOLUTION = 1;
const DEFAULT_NODE_LABEL_ZOOM = 0.6;
const DEFAULT_RELATIONSHIP_LABEL_ZOOM = 0.9;

function finiteNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function positiveInteger(value: number | undefined, fallback: number): number {
  return Math.max(1, Math.floor(finiteNumber(value, fallback)));
}

function zoomThreshold(value: number | undefined, fallback: number): number {
  return Math.max(0, finiteNumber(value, fallback));
}

export function resolveGraphPerformanceOptions(
  performance: false | GraphPerformanceOptions | undefined,
  nodeCount: number,
): ResolvedGraphPerformanceOptions {
  if (performance === false) {
    return {
      clusterBelowZoom: 0,
      clusteringResolution: DEFAULT_CLUSTERING_RESOLUTION,
      collisionPadding: DEFAULT_COLLISION_PADDING,
      isLargeGraph: false,
      layoutQuality: "balanced",
      minimumNodeCount: Number.POSITIVE_INFINITY,
      nodeLabelMinZoom: 0,
      overviewRenderedNodes: Number.MAX_SAFE_INTEGER,
      overviewRenderedRelationships: Number.MAX_SAFE_INTEGER,
      relationshipLabelMinZoom: 0,
      shouldCluster: false,
      shouldUseWorker: false,
      targetRenderedNodes: Number.MAX_SAFE_INTEGER,
      targetRenderedRelationships: Number.MAX_SAFE_INTEGER,
      workerThreshold: Number.POSITIVE_INFINITY,
    };
  }

  const clustering = performance?.clustering === false
    ? false
    : performance?.clustering ?? {};
  const minimumNodeCount = clustering === false
    ? Number.POSITIVE_INFINITY
    : positiveInteger(clustering.minimumNodeCount, DEFAULT_CLUSTER_NODE_THRESHOLD);
  const workerThreshold = positiveInteger(
    performance?.workerThreshold,
    DEFAULT_WORKER_THRESHOLD,
  );
  const isLargeGraph = nodeCount >= minimumNodeCount;

  return {
    clusterBelowZoom: clustering === false
      ? 0
      : zoomThreshold(clustering.belowZoom, DEFAULT_CLUSTER_ZOOM),
    clusteringResolution: Math.max(0.01, finiteNumber(
      clustering === false ? undefined : clustering.resolution,
      DEFAULT_CLUSTERING_RESOLUTION,
    )),
    collisionPadding: Math.max(0, finiteNumber(
      performance?.layout?.collisionPadding,
      DEFAULT_COLLISION_PADDING,
    )),
    isLargeGraph,
    layoutQuality: performance?.layout?.quality ?? "balanced",
    minimumNodeCount,
    nodeLabelMinZoom: zoomThreshold(
      performance?.labels?.nodeMinZoom,
      DEFAULT_NODE_LABEL_ZOOM,
    ),
    overviewRenderedNodes: clustering === false
      ? Number.MAX_SAFE_INTEGER
      : Math.min(
          positiveInteger(clustering.targetRenderedNodes, DEFAULT_RENDERED_NODE_TARGET),
          DEFAULT_OVERVIEW_NODE_TARGET,
        ),
    overviewRenderedRelationships: clustering === false
      ? Number.MAX_SAFE_INTEGER
      : Math.min(
          positiveInteger(clustering.targetRenderedRelationships, DEFAULT_RENDERED_RELATIONSHIP_TARGET),
          DEFAULT_OVERVIEW_RELATIONSHIP_TARGET,
        ),
    relationshipLabelMinZoom: zoomThreshold(
      performance?.labels?.relationshipMinZoom,
      DEFAULT_RELATIONSHIP_LABEL_ZOOM,
    ),
    shouldCluster: clustering !== false && isLargeGraph,
    shouldUseWorker: nodeCount >= workerThreshold,
    targetRenderedNodes: clustering === false
      ? Number.MAX_SAFE_INTEGER
      : positiveInteger(clustering.targetRenderedNodes, DEFAULT_RENDERED_NODE_TARGET),
    targetRenderedRelationships: clustering === false
      ? Number.MAX_SAFE_INTEGER
      : positiveInteger(
          clustering.targetRenderedRelationships,
          DEFAULT_RENDERED_RELATIONSHIP_TARGET,
        ),
    workerThreshold,
  };
}

export function getGraphDetailLevel(
  zoom: number,
  options: ResolvedGraphPerformanceOptions,
): GraphDetailLevel {
  if (!options.shouldCluster || zoom >= options.clusterBelowZoom) return "detail";
  if (zoom >= options.clusterBelowZoom * 0.55) return "compact";
  return "overview";
}

function mostCommon(values: readonly string[], fallback: string): string {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort(([leftValue, leftCount], [rightValue, rightCount]) =>
      rightCount - leftCount || leftValue.localeCompare(rightValue),
    )[0]?.[0] ?? fallback;
}

function protectedNodeIds(
  relationships: readonly GraphRelationship[],
  selection: GraphSelection,
): ReadonlySet<string> {
  if (!selection) return new Set();
  if (selection.kind === "node") return new Set([selection.id]);
  const relationship = relationships.find((candidate) => candidate.id === selection.id);
  return relationship
    ? new Set([relationship.source, relationship.target])
    : new Set();
}

function graphBounds(nodes: readonly GraphLayoutNode[]): GraphClusterBounds {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const node of nodes) {
    minX = Math.min(minX, node.position.x);
    maxX = Math.max(maxX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxY = Math.max(maxY, node.position.y);
  }
  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

const hierarchyCache = new WeakMap<
  readonly GraphLayoutNode[],
  WeakMap<readonly GraphRelationship[], Map<string, GraphCommunityHierarchy>>
>();

function cachedCommunityHierarchy(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
  compactBudget: number,
  overviewBudget: number,
  resolution: number,
): GraphCommunityHierarchy {
  let byRelationships = hierarchyCache.get(nodes);
  if (!byRelationships) {
    byRelationships = new WeakMap();
    hierarchyCache.set(nodes, byRelationships);
  }
  let byOptions = byRelationships.get(relationships);
  if (!byOptions) {
    byOptions = new Map();
    byRelationships.set(relationships, byOptions);
  }
  const key = `${compactBudget}:${overviewBudget}:${resolution}`;
  const cached = byOptions.get(key);
  if (cached) return cached;
  const hierarchy = buildGraphCommunityHierarchy(nodes, relationships, { compactBudget, overviewBudget, resolution });
  byOptions.set(key, hierarchy);
  return hierarchy;
}

function clusterNodes(
  nodes: readonly GraphLayoutNode[],
  relationships: readonly GraphRelationship[],
  matches: GraphMatches,
  protectedIds: ReadonlySet<string>,
  detailLevel: Exclude<GraphDetailLevel, "detail">,
  compactTarget: number,
  overviewTarget: number,
  resolution: number,
  suppliedHierarchy?: GraphCommunityHierarchy,
): {
  nodes: readonly GraphRenderNode[];
  renderIdByNodeId: ReadonlyMap<string, string>;
} {
  const protectedNodes = nodes.filter((node) => protectedIds.has(node.id));
  const candidates = nodes.filter((node) => !protectedIds.has(node.id));
  if (candidates.length === 0) {
    const rendered = protectedNodes.map((node): GraphRenderNodeEntity => ({
      id: node.id,
      kind: "node",
      matched: matches.matchingNodeIds.has(node.id),
      node,
      position: node.position,
      tone: node.tone ?? getGraphTone(node.labels[0] ?? node.label),
    }));
    return { nodes: rendered, renderIdByNodeId: new Map(rendered.map((node) => [node.id, node.id])) };
  }

  const candidateIds = new Set(candidates.map((node) => node.id));
  const candidateRelationships = protectedIds.size === 0
    ? relationships
    : relationships.filter((edge) => candidateIds.has(edge.source) && candidateIds.has(edge.target));
  const hierarchy = protectedIds.size === 0
    ? suppliedHierarchy ?? cachedCommunityHierarchy(nodes, relationships, compactTarget, overviewTarget, resolution)
    : buildGraphCommunityHierarchy(candidates, candidateRelationships, {
        compactBudget: compactTarget,
        overviewBudget: overviewTarget,
        resolution,
      });
  const groups = detailLevel === "overview" ? hierarchy.overview : hierarchy.compact;
  const nodeById = new Map(candidates.map((node) => [node.id, node]));

  const renderedNodes: GraphRenderNode[] = [];
  const renderIdByNodeId = new Map<string, string>();
  for (const node of protectedNodes) {
    renderedNodes.push({
      id: node.id,
      kind: "node",
      matched: matches.matchingNodeIds.has(node.id),
      node,
      position: node.position,
      tone: node.tone ?? getGraphTone(node.labels[0] ?? node.label),
    });
    renderIdByNodeId.set(node.id, node.id);
  }

  for (const group of groups) {
    const members = group.memberIds
      .map((id) => nodeById.get(id))
      .filter((node): node is GraphLayoutNode => Boolean(node));
    if (members.length === 1) {
      const node = members[0] as GraphLayoutNode;
      renderedNodes.push({
        id: node.id,
        kind: "node",
        matched: matches.matchingNodeIds.has(node.id),
        node,
        position: node.position,
        tone: node.tone ?? getGraphTone(node.labels[0] ?? node.label),
      });
      renderIdByNodeId.set(node.id, node.id);
      continue;
    }

    const memberBounds = graphBounds(members);
    const memberIds = members.map((node) => node.id).sort();
    const labels = [...new Set(members.flatMap((node) => node.labels))].sort();
    const dominantLabel = mostCommon(
      members.flatMap((node) => node.labels[0] ?? []),
      "Mixed entities",
    );
    const id = group.id;
    const matchedCount = memberIds.filter((nodeId) => matches.matchingNodeIds.has(nodeId)).length;
    const cluster: GraphRenderNodeCluster = {
      bounds: memberBounds,
      dominantLabel,
      id,
      kind: "cluster",
      labels,
      matched: matchedCount > 0,
      matchedCount,
      memberIds,
      position: {
        x: memberBounds.x + memberBounds.width / 2,
        y: memberBounds.y + memberBounds.height / 2,
      },
      tone: getGraphTone(dominantLabel),
    };
    renderedNodes.push(cluster);
    for (const memberId of memberIds) renderIdByNodeId.set(memberId, id);
  }

  return { nodes: renderedNodes, renderIdByNodeId };
}

function originalRelationship(
  relationship: GraphRelationship,
  matches: GraphMatches,
): GraphRenderRelationshipEntity {
  const matched = matches.matchingRelationshipIds.has(relationship.id);
  return {
    count: 1,
    directed: relationship.directed !== false,
    id: relationship.id,
    kind: "relationship",
    matched,
    matchedCount: matched ? 1 : 0,
    relationship,
    source: relationship.source,
    target: relationship.target,
    types: [relationship.type],
  };
}

function clusterRelationships(
  relationships: readonly GraphRelationship[],
  matches: GraphMatches,
  renderIdByNodeId: ReadonlyMap<string, string>,
  selection: GraphSelection,
  target: number,
): {
  aggregateRelationships: number;
  internalRelationships: number;
  omittedRelationships: number;
  relationships: readonly GraphRenderRelationship[];
} {
  const selectedRelationshipId = selection?.kind === "relationship" ? selection.id : null;
  const direct: GraphRenderRelationshipEntity[] = [];
  const groups = new Map<string, GraphRelationship[]>();
  let internalRelationships = 0;

  for (const relationship of relationships) {
    if (relationship.id === selectedRelationshipId) {
      direct.push(originalRelationship(relationship, matches));
      continue;
    }
    const source = renderIdByNodeId.get(relationship.source);
    const targetId = renderIdByNodeId.get(relationship.target);
    if (!source || !targetId) continue;
    if (source === targetId) {
      internalRelationships += 1;
      continue;
    }
    const key = `${source}\u0000${targetId}`;
    const group = groups.get(key);
    if (group) group.push(relationship);
    else groups.set(key, [relationship]);
  }

  const aggregate = [...groups.entries()].map(([key, members]): GraphRenderRelationshipAggregate => {
    const [source, targetId] = key.split("\u0000") as [string, string];
    const relationshipIds = members.map((relationship) => relationship.id).sort();
    const matchedCount = relationshipIds.filter((id) => matches.matchingRelationshipIds.has(id)).length;
    return {
      count: members.length,
      directed: members.some((relationship) => relationship.directed !== false),
      id: `aggregate:${source}:${targetId}`,
      kind: "aggregate",
      matched: matchedCount > 0,
      matchedCount,
      relationshipIds,
      source,
      target: targetId,
      types: [...new Set(members.map((relationship) => relationship.type))].sort(),
    };
  });
  aggregate.sort((left, right) =>
    Number(right.matched) - Number(left.matched) ||
    right.count - left.count ||
    left.id.localeCompare(right.id),
  );

  const budget = Math.max(direct.length, target);
  const candidates: GraphRenderRelationship[] = [...direct, ...aggregate];
  const visible = candidates.slice(0, budget);
  return {
    aggregateRelationships: candidates.length,
    internalRelationships,
    omittedRelationships: Math.max(0, candidates.length - visible.length),
    relationships: visible,
  };
}

function fullDetailModel({
  matches,
  nodes,
  options,
  relationships,
  zoom,
}: BuildGraphRenderModelInput): GraphRenderModel {
  const renderedNodes = nodes.map((node): GraphRenderNodeEntity => ({
    id: node.id,
    kind: "node",
    matched: matches.matchingNodeIds.has(node.id),
    node,
    position: node.position,
    tone: node.tone ?? getGraphTone(node.labels[0] ?? node.label),
  }));
  const renderedRelationships = relationships.map((relationship) =>
    originalRelationship(relationship, matches),
  );
  return {
    detailLevel: "detail",
    nodes: renderedNodes,
    relationships: renderedRelationships,
    showNodeLabels: zoom >= options.nodeLabelMinZoom,
    showRelationshipLabels: zoom >= options.relationshipLabelMinZoom,
    stats: {
      aggregateRelationships: relationships.length,
      internalRelationships: 0,
      omittedRelationships: 0,
      renderedNodes: renderedNodes.length,
      renderedRelationships: renderedRelationships.length,
      sourceNodes: nodes.length,
      sourceRelationships: relationships.length,
    },
  };
}

export function buildGraphRenderModel(
  input: BuildGraphRenderModelInput,
): GraphRenderModel {
  const detailLevel = getGraphDetailLevel(input.zoom, input.options);
  if (detailLevel === "detail") return fullDetailModel(input);

  const protectedIds = protectedNodeIds(input.relationships, input.selection);
  const clustered = clusterNodes(
    input.nodes,
    input.relationships,
    input.matches,
    protectedIds,
    detailLevel,
    input.options.targetRenderedNodes,
    input.options.overviewRenderedNodes,
    input.options.clusteringResolution,
    input.hierarchy,
  );
  const relationships = clusterRelationships(
    input.relationships,
    input.matches,
    clustered.renderIdByNodeId,
    input.selection,
    detailLevel === "overview"
      ? input.options.overviewRenderedRelationships
      : input.options.targetRenderedRelationships,
  );

  return {
    detailLevel,
    nodes: clustered.nodes,
    relationships: relationships.relationships,
    showNodeLabels: input.zoom >= input.options.nodeLabelMinZoom,
    showRelationshipLabels: input.zoom >= input.options.relationshipLabelMinZoom,
    stats: {
      aggregateRelationships: relationships.aggregateRelationships,
      internalRelationships: relationships.internalRelationships,
      omittedRelationships: relationships.omittedRelationships,
      renderedNodes: clustered.nodes.length,
      renderedRelationships: relationships.relationships.length,
      sourceNodes: input.nodes.length,
      sourceRelationships: input.relationships.length,
    },
  };
}
