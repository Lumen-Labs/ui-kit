import type { GraphNode, GraphRelationship } from "./model";

export interface GraphFacetCounts {
  nodeLabels: ReadonlyMap<string, number>;
  relationshipTypes: ReadonlyMap<string, number>;
}

function increment(map: Map<string, number>, value: string): void {
  map.set(value, (map.get(value) ?? 0) + 1);
}

export function countGraphFacetValues(
  nodes: readonly GraphNode[],
  relationships: readonly GraphRelationship[],
): GraphFacetCounts {
  const nodeLabels = new Map<string, number>();
  const relationshipTypes = new Map<string, number>();
  nodes.forEach((node) => new Set(node.labels).forEach((label) => increment(nodeLabels, label)));
  relationships.forEach((relationship) => increment(relationshipTypes, relationship.type));
  return { nodeLabels, relationshipTypes };
}

export function filterGraphFacetOptions(
  options: readonly string[],
  query: string,
): readonly string[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return options;
  return options.filter((option) => option.toLocaleLowerCase().includes(normalized));
}
