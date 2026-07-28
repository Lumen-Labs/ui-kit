"use client";

import * as React from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../components/interactive";
import { cn } from "../lib/cn";
import { GraphCanvas } from "./graph-canvas";
import { countGraphFacetValues } from "./graph-facets";
import { GraphFilters, GraphLegend } from "./graph-filters";
import { GraphInspector } from "./graph-inspector";
import {
  resolveGraphPerformanceOptions,
  type GraphPerformanceOptions,
} from "./lod";
import {
  getGraphFacets,
  matchGraph,
  normalizeGraph,
  type GraphFilterState,
  type GraphMatches,
  type GraphNode,
  type GraphPosition,
  type GraphRelationship,
  type GraphSelection,
} from "./model";

export interface GraphInspectorRenderContext {
  close: () => void;
  nodes: readonly GraphNode[];
  relationships: readonly GraphRelationship[];
  selection: Exclude<GraphSelection, null>;
}

export interface GraphExplorerProps
  extends Omit<React.ComponentProps<"section">, "children"> {
  ariaLabel: string;
  filterState: GraphFilterState;
  nodes: readonly GraphNode[];
  defaultPhysicsEnabled?: boolean;
  onFilterStateChange: (next: GraphFilterState) => void;
  onNodePositionChange?: (id: string, position: GraphPosition) => void;
  onPhysicsEnabledChange?: (enabled: boolean) => void;
  onSelectionChange: (selection: GraphSelection) => void;
  performance?: false | GraphPerformanceOptions;
  physicsEnabled?: boolean;
  relationships: readonly GraphRelationship[];
  renderInspector?: (context: GraphInspectorRenderContext) => React.ReactNode;
  selection: GraphSelection;
  showMiniMap?: boolean;
}

function useDesktopInspector(
  containerRef: React.RefObject<HTMLElement | null>,
  active: boolean,
): boolean | undefined {
  const [isDesktop, setIsDesktop] = React.useState<boolean>();

  React.useEffect(() => {
    if (!active) {
      setIsDesktop(undefined);
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const update = (width: number) => setIsDesktop(width >= 1024);
    update(container.getBoundingClientRect().width);

    if (typeof ResizeObserver === "undefined") {
      const media = window.matchMedia("(min-width: 1024px)");
      const updateFromViewport = () => setIsDesktop(media.matches);
      updateFromViewport();
      media.addEventListener("change", updateFromViewport);
      return () => media.removeEventListener("change", updateFromViewport);
    }

    let frame = 0;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => update(entry.contentRect.width));
    });
    observer.observe(container);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [active, containerRef]);

  return isDesktop;
}

function ResponsiveInspector({
  nodes,
  onClose,
  relationships,
  renderInspector,
  selection,
  isDesktop,
}: {
  isDesktop: boolean | undefined;
  nodes: readonly GraphNode[];
  onClose: () => void;
  relationships: readonly GraphRelationship[];
  renderInspector?: GraphExplorerProps["renderInspector"];
  selection: GraphSelection;
}) {
  if (!selection || isDesktop === undefined) return null;

  const content = renderInspector?.({
    close: onClose,
    nodes,
    relationships,
    selection,
  }) ?? (
    <GraphInspector
      nodes={nodes}
      relationships={relationships}
      selection={selection}
      onClose={onClose}
    />
  );

  if (isDesktop) return <div className="graph-explorer__desktop-inspector">{content}</div>;

  return (
    <Drawer open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DrawerContent side="right" className="graph-explorer__drawer">
        <DrawerTitle className="sr-only">Graph details</DrawerTitle>
        <DrawerDescription className="sr-only">
          Properties for the selected graph node or relationship.
        </DrawerDescription>
        {content}
      </DrawerContent>
    </Drawer>
  );
}

export function GraphExplorer({
  ariaLabel,
  className,
  defaultPhysicsEnabled = true,
  filterState,
  nodes,
  onFilterStateChange,
  onNodePositionChange,
  onPhysicsEnabledChange,
  onSelectionChange,
  performance,
  physicsEnabled: controlledPhysicsEnabled,
  relationships,
  renderInspector,
  selection,
  showMiniMap = true,
  ...props
}: GraphExplorerProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [internalPhysicsEnabled, setInternalPhysicsEnabled] = React.useState(defaultPhysicsEnabled);
  const physicsEnabled = controlledPhysicsEnabled ?? internalPhysicsEnabled;
  const setPhysicsEnabled = React.useCallback((enabled: boolean) => {
    if (controlledPhysicsEnabled === undefined) setInternalPhysicsEnabled(enabled);
    onPhysicsEnabledChange?.(enabled);
  }, [controlledPhysicsEnabled, onPhysicsEnabledChange]);
  const isDesktop = useDesktopInspector(containerRef, selection !== null);
  const normalized = React.useMemo(
    () => normalizeGraph(nodes, relationships),
    [nodes, relationships],
  );
  const facets = React.useMemo(
    () => getGraphFacets(normalized.nodes, normalized.relationships),
    [normalized],
  );
  const facetCounts = React.useMemo(
    () => countGraphFacetValues(normalized.nodes, normalized.relationships),
    [normalized],
  );
  const matches: GraphMatches = React.useMemo(
    () => matchGraph(normalized.nodes, normalized.relationships, filterState),
    [filterState, normalized],
  );
  const performanceOptions = React.useMemo(
    () => resolveGraphPerformanceOptions(performance, normalized.nodes.length),
    [normalized.nodes.length, performance],
  );
  const selectedExists = selection
    ? selection.kind === "node"
      ? normalized.nodes.some((node) => node.id === selection.id)
      : normalized.relationships.some((relationship) => relationship.id === selection.id)
    : false;
  const resolvedSelection = selectedExists ? selection : null;

  React.useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[role="dialog"], [role="menu"]')) return;
      event.preventDefault();
      event.stopPropagation();
      setExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [expanded]);

  return (
    <section
      ref={containerRef}
      data-slot="graph-explorer"
      data-expanded={expanded || undefined}
      className={cn("graph-explorer", className)}
      {...props}
    >
      <GraphFilters
        counts={facetCounts}
        facets={facets}
        filterState={filterState}
        matches={matches}
        onFilterStateChange={onFilterStateChange}
      />
      {normalized.nodes.length === 0 ? (
        <div data-slot="graph-empty-state" className="graph-empty-state" role="status">
          <h3>No graph data</h3>
          <p>Provide at least one node to begin exploring relationships.</p>
        </div>
      ) : (
        <div className="graph-explorer__body" data-inspector-open={resolvedSelection || undefined}>
          <GraphCanvas
            ariaLabel={ariaLabel}
            expanded={expanded}
            legend={(
              <GraphLegend
                counts={facetCounts}
                labels={facets.nodeLabels}
                relationshipTypes={facets.relationshipTypes}
                selectedLabels={filterState.nodeLabels}
                selectedRelationshipTypes={filterState.relationshipTypes}
                onLabelsChange={(nodeLabels) =>
                  onFilterStateChange({ ...filterState, nodeLabels })
                }
                onRelationshipTypesChange={(relationshipTypes) =>
                  onFilterStateChange({ ...filterState, relationshipTypes })
                }
              />
            )}
            nodes={normalized.nodes}
            relationships={normalized.relationships}
            matches={matches}
            performanceOptions={performanceOptions}
            physicsEnabled={physicsEnabled}
            selection={resolvedSelection}
            onSelectionChange={onSelectionChange}
            onExpandedChange={setExpanded}
            onNodePositionChange={onNodePositionChange}
            onPhysicsEnabledChange={setPhysicsEnabled}
            showMiniMap={showMiniMap}
          />
          <ResponsiveInspector
            nodes={normalized.nodes}
            relationships={normalized.relationships}
            selection={resolvedSelection}
            isDesktop={isDesktop}
            onClose={() => onSelectionChange(null)}
            renderInspector={renderInspector}
          />
        </div>
      )}
    </section>
  );
}
