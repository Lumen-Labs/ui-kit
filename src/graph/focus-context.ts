import type { GraphRenderRelationship } from "./lod";
import type { GraphSelection } from "./model";

export interface GraphFocusContext {
  active: boolean;
  labeledNodeIds: ReadonlySet<string>;
  labeledRelationshipIds: ReadonlySet<string>;
  nodeIds: ReadonlySet<string>;
  relationshipIds: ReadonlySet<string>;
}

const MAX_CONTEXT_LABELS = 8;

export function createGraphFocusContext(
  relationships: readonly GraphRenderRelationship[],
  activeItem: GraphSelection,
): GraphFocusContext {
  const nodeIds = new Set<string>();
  const relationshipIds = new Set<string>();
  const labeledNodeIds = new Set<string>();
  const labeledRelationshipIds = new Set<string>();
  if (!activeItem) {
    return { active: false, labeledNodeIds, labeledRelationshipIds, nodeIds, relationshipIds };
  }

  if (activeItem.kind === "relationship") {
    const relationship = relationships.find((candidate) => candidate.id === activeItem.id);
    if (relationship) {
      relationshipIds.add(relationship.id);
      labeledRelationshipIds.add(relationship.id);
      nodeIds.add(relationship.source);
      nodeIds.add(relationship.target);
      labeledNodeIds.add(relationship.source);
      labeledNodeIds.add(relationship.target);
    }
    return { active: true, labeledNodeIds, labeledRelationshipIds, nodeIds, relationshipIds };
  }

  nodeIds.add(activeItem.id);
  for (const relationship of relationships) {
    if (relationship.source !== activeItem.id && relationship.target !== activeItem.id) continue;
    relationshipIds.add(relationship.id);
    nodeIds.add(relationship.source);
    nodeIds.add(relationship.target);
  }
  labeledNodeIds.add(activeItem.id);
  const labeledIds = [...relationshipIds].sort().slice(0, MAX_CONTEXT_LABELS);
  for (const relationshipId of labeledIds) {
    const relationship = relationships.find((candidate) => candidate.id === relationshipId);
    if (!relationship) continue;
    labeledRelationshipIds.add(relationshipId);
    labeledNodeIds.add(relationship.source);
    labeledNodeIds.add(relationship.target);
  }
  return { active: true, labeledNodeIds, labeledRelationshipIds, nodeIds, relationshipIds };
}
