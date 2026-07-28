import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";

export type GraphPropertyScalar = string | number | boolean | null;
export type GraphPropertyValue =
  | GraphPropertyScalar
  | readonly GraphPropertyScalar[];

export type GraphCategoryTone =
  | "category-1"
  | "category-2"
  | "category-3"
  | "category-4"
  | "category-5"
  | "category-6";

export interface GraphPosition {
  x: number;
  y: number;
}

export interface GraphNode {
  id: string;
  label: string;
  labels: readonly string[];
  description?: string;
  properties?: Readonly<Record<string, GraphPropertyValue>>;
  position?: GraphPosition;
  tone?: GraphCategoryTone;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
  directed?: boolean;
  properties?: Readonly<Record<string, GraphPropertyValue>>;
}

export interface GraphFilterState {
  query: string;
  nodeLabels: readonly string[];
  relationshipTypes: readonly string[];
}

export type GraphSelection =
  | { kind: "node"; id: string }
  | { kind: "relationship"; id: string }
  | null;

export interface GraphLayoutNode extends GraphNode {
  position: GraphPosition;
}

export interface GraphLayoutConfiguration {
  collisionPadding?: number;
  quality?: "fast" | "balanced" | "quality";
}

export interface NormalizedGraph {
  nodes: readonly GraphNode[];
  relationships: readonly GraphRelationship[];
}

export interface GraphFacets {
  nodeLabels: readonly string[];
  relationshipTypes: readonly string[];
}

export interface GraphMatches {
  matchingNodeIds: ReadonlySet<string>;
  matchingRelationshipIds: ReadonlySet<string>;
  totalNodes: number;
  totalRelationships: number;
}

const graphTones: readonly GraphCategoryTone[] = [
  "category-1",
  "category-2",
  "category-3",
  "category-4",
  "category-5",
  "category-6",
];

function hashText(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function searchableProperties(
  properties: Readonly<Record<string, GraphPropertyValue>> | undefined,
): string {
  if (!properties) return "";
  return Object.entries(properties)
    .flatMap(([key, value]) => [key, ...(Array.isArray(value) ? value : [value])])
    .filter((value): value is Exclude<GraphPropertyScalar, null> => value !== null)
    .join(" ")
    .toLocaleLowerCase();
}

function nodeSearchText(node: GraphNode): string {
  return [
    node.label,
    node.description,
    ...node.labels,
    searchableProperties(node.properties),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

function relationshipSearchText(relationship: GraphRelationship): string {
  return [
    relationship.type,
    relationship.label,
    searchableProperties(relationship.properties),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

export function normalizeGraph(
  nodes: readonly GraphNode[],
  relationships: readonly GraphRelationship[],
): NormalizedGraph {
  const nodeIds = new Set(nodes.map((node) => node.id));
  return {
    nodes,
    relationships: relationships.filter(
      (relationship) =>
        nodeIds.has(relationship.source) && nodeIds.has(relationship.target),
    ),
  };
}

export function seedGraphLayout(
  nodes: readonly GraphNode[],
): readonly GraphLayoutNode[] {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return nodes.map((node, index) => {
    if (node.position) return { ...node, position: node.position };
    const radius = 48 * Math.sqrt(index);
    const angle = index * goldenAngle;
    return {
      ...node,
      position: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      },
    };
  });
}

export function moveGraphLayoutNode(
  nodes: readonly GraphLayoutNode[],
  id: string,
  position: GraphPosition,
): readonly GraphLayoutNode[] {
  return nodes.map((node) => node.id === id ? { ...node, position } : node);
}

export function layoutGraph(
  nodes: readonly GraphNode[],
  relationships: readonly GraphRelationship[],
  configuration: GraphLayoutConfiguration = {},
): readonly GraphLayoutNode[] {
  if (nodes.length === 0) return [];

  const normalized = normalizeGraph(nodes, relationships);
  const seeded = seedGraphLayout(nodes);
  const graph = new Graph({ multi: false, type: "undirected" });
  for (const node of [...seeded].sort((a, b) => a.id.localeCompare(b.id))) {
    graph.addNode(node.id, { x: node.position.x, y: node.position.y, size: 72 });
  }
  for (const relationship of [...normalized.relationships].sort((a, b) => a.id.localeCompare(b.id))) {
    if (relationship.source === relationship.target) continue;
    const existing = graph.edge(relationship.source, relationship.target);
    if (existing) graph.updateEdgeAttribute(existing, "weight", (weight = 1) => weight + 1);
    else graph.addEdge(relationship.source, relationship.target, { weight: 1 });
  }

  forceAtlas2.assign(graph, {
    iterations: configuration.quality === "fast"
      ? 48
      : configuration.quality === "quality"
        ? nodes.length > 200 ? 160 : 260
        : nodes.length > 200 ? 80 : 180,
    getEdgeWeight: "weight",
    settings: {
      adjustSizes: true,
      barnesHutOptimize: nodes.length >= 150,
      barnesHutTheta: 0.6,
      gravity: 0.08,
      linLogMode: true,
      scalingRatio: 18,
      slowDown: 4,
    },
  });
  noverlap.assign(graph, {
    maxIterations: configuration.quality === "quality" ? 180 : 120,
    settings: { gridSize: 24, margin: configuration.collisionPadding ?? 12, ratio: 1, speed: 3 },
  });

  const supplied = new Map(nodes.filter((node) => node.position).map((node) => [node.id, node.position] as const));
  for (const [id, position] of supplied) {
    graph.setNodeAttribute(id, "x", position?.x ?? 0);
    graph.setNodeAttribute(id, "y", position?.y ?? 0);
  }
  if (supplied.size > 0) {
    const minimumDistance = 144 + (configuration.collisionPadding ?? 12) * 2;
    const automaticIds = nodes.map((node) => node.id).filter((id) => !supplied.has(id)).sort();
    for (let pass = 0; pass < 8; pass += 1) {
      let moved = false;
      for (const id of automaticIds) {
        let x = graph.getNodeAttribute(id, "x") as number;
        let y = graph.getNodeAttribute(id, "y") as number;
        for (const [fixedId, fixedPosition] of supplied) {
          const dx = x - (fixedPosition?.x ?? 0);
          const dy = y - (fixedPosition?.y ?? 0);
          const distance = Math.hypot(dx, dy);
          if (distance >= minimumDistance) continue;
          const angle = distance > 0.001
            ? Math.atan2(dy, dx)
            : (hashText(`${id}:${fixedId}`) / 0xffffffff) * Math.PI * 2;
          x = (fixedPosition?.x ?? 0) + Math.cos(angle) * minimumDistance;
          y = (fixedPosition?.y ?? 0) + Math.sin(angle) * minimumDistance;
          moved = true;
        }
        graph.setNodeAttribute(id, "x", x);
        graph.setNodeAttribute(id, "y", y);
      }
      if (!moved) break;
    }
  }

  return nodes.map((node) => ({
    ...node,
    position: {
      x: graph.getNodeAttribute(node.id, "x"),
      y: graph.getNodeAttribute(node.id, "y"),
    },
  }));
}

export function getGraphFacets(
  nodes: readonly GraphNode[],
  relationships: readonly GraphRelationship[],
): GraphFacets {
  const normalized = normalizeGraph(nodes, relationships);
  return {
    nodeLabels: [...new Set(nodes.flatMap((node) => node.labels))].sort((a, b) =>
      a.localeCompare(b),
    ),
    relationshipTypes: [
      ...new Set(normalized.relationships.map((relationship) => relationship.type)),
    ].sort((a, b) => a.localeCompare(b)),
  };
}

export function matchGraph(
  nodes: readonly GraphNode[],
  relationships: readonly GraphRelationship[],
  filters: GraphFilterState,
): GraphMatches {
  const normalized = normalizeGraph(nodes, relationships);
  const query = filters.query.trim().toLocaleLowerCase();
  const selectedLabels = new Set(filters.nodeLabels);
  const selectedRelationshipTypes = new Set(filters.relationshipTypes);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const queryNodeIds = new Set(
    nodes
      .filter((node) => !query || nodeSearchText(node).includes(query))
      .map((node) => node.id),
  );
  const labelNodeIds = new Set(
    nodes
      .filter(
        (node) =>
          selectedLabels.size === 0 ||
          node.labels.some((label) => selectedLabels.has(label)),
      )
      .map((node) => node.id),
  );
  const matchingNodeIds = new Set(
    nodes
      .filter(
        (node) => queryNodeIds.has(node.id) && labelNodeIds.has(node.id),
      )
      .map((node) => node.id),
  );

  const matchingRelationshipIds = new Set(
    normalized.relationships
      .filter((relationship) => {
        const typeMatches =
          selectedRelationshipTypes.size === 0 ||
          selectedRelationshipTypes.has(relationship.type);
        if (!typeMatches) return false;

        const source = nodeById.get(relationship.source);
        const target = nodeById.get(relationship.target);
        const queryMatches =
          !query ||
          relationshipSearchText(relationship).includes(query) ||
          queryNodeIds.has(relationship.source) ||
          queryNodeIds.has(relationship.target);
        const labelsMatch =
          selectedLabels.size === 0 ||
          (source?.labels.some((label) => selectedLabels.has(label)) ?? false) ||
          (target?.labels.some((label) => selectedLabels.has(label)) ?? false);
        return queryMatches && labelsMatch;
      })
      .map((relationship) => relationship.id),
  );

  return {
    matchingNodeIds,
    matchingRelationshipIds,
    totalNodes: nodes.length,
    totalRelationships: normalized.relationships.length,
  };
}

export function getGraphTone(label: string): GraphCategoryTone {
  return graphTones[hashText(label) % graphTones.length] ?? "category-1";
}
