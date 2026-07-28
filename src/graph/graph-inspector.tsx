import * as React from "react";

import { Button } from "../components/button";
import { cn } from "../lib/cn";
import type {
  GraphNode,
  GraphPropertyValue,
  GraphRelationship,
  GraphSelection,
} from "./model";

export interface GraphInspectorProps extends React.ComponentProps<"aside"> {
  nodes: readonly GraphNode[];
  onClose: () => void;
  relationships: readonly GraphRelationship[];
  selection: Exclude<GraphSelection, null>;
}

function formatPropertyValue(value: GraphPropertyValue): string {
  if (value === null) return "—";
  if (Array.isArray(value)) return value.map((item) => item ?? "—").join(", ");
  return String(value);
}

function GraphProperties({
  properties,
}: {
  properties: Readonly<Record<string, GraphPropertyValue>> | undefined;
}) {
  const entries = Object.entries(properties ?? {});
  if (entries.length === 0) {
    return <p className="text-sm text-lumen-muted-foreground">No additional properties.</p>;
  }

  return (
    <dl className="graph-inspector__properties">
      {entries.map(([key, value]) => (
        <React.Fragment key={key}>
          <dt>{key}</dt>
          <dd>{formatPropertyValue(value)}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

export function GraphInspector({
  className,
  nodes,
  onClose,
  relationships,
  selection,
  ...props
}: GraphInspectorProps) {
  const headingId = React.useId();
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const selectedNode =
    selection.kind === "node"
      ? nodes.find((node) => node.id === selection.id)
      : undefined;
  const selectedRelationship =
    selection.kind === "relationship"
      ? relationships.find((relationship) => relationship.id === selection.id)
      : undefined;

  if (!selectedNode && !selectedRelationship) return null;

  const title = selectedNode?.label ?? selectedRelationship?.label ?? selectedRelationship?.type;
  const eyebrow = selectedNode ? "Node" : "Relationship";

  return (
    <aside
      data-slot="graph-inspector"
      aria-labelledby={headingId}
      className={cn("graph-inspector", className)}
      {...props}
    >
      <header className="graph-inspector__header">
        <div className="min-w-0">
          <p className="graph-inspector__eyebrow">{eyebrow}</p>
          <h3 id={headingId} className="graph-inspector__title">{title}</h3>
        </div>
        <Button
          aria-label="Close graph inspector"
          size="icon"
          variant="ghost"
          className="graph-inspector__close"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </Button>
      </header>

      {selectedNode ? (
        <>
          {selectedNode.description ? (
            <p className="graph-inspector__description">{selectedNode.description}</p>
          ) : null}
          <ul aria-label="Node labels" className="graph-inspector__labels">
            {selectedNode.labels.map((label) => <li key={label}>{label}</li>)}
          </ul>
          <p className="graph-inspector__connection-count">
            {relationships.filter(
              (relationship) =>
                relationship.source === selectedNode.id || relationship.target === selectedNode.id,
            ).length} connected relationships
          </p>
          <GraphProperties properties={selectedNode.properties} />
        </>
      ) : null}

      {selectedRelationship ? (
        <>
          <div className="graph-inspector__route" aria-label="Relationship direction">
            <span>{nodeById.get(selectedRelationship.source)?.label ?? selectedRelationship.source}</span>
            <span aria-hidden="true">{selectedRelationship.directed === false ? "—" : "→"}</span>
            <span>{nodeById.get(selectedRelationship.target)?.label ?? selectedRelationship.target}</span>
          </div>
          <GraphProperties properties={selectedRelationship.properties} />
        </>
      ) : null}
    </aside>
  );
}
