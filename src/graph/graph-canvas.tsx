"use client";

import * as React from "react";
import type { DataSet } from "vis-data";
import type { Edge, Network, Node, Options } from "vis-network";

import { GraphViewportControls } from "./graph-controls";
import { createGraphHoverIntent } from "./hover-intent";
import {
  buildGraphCommunityHierarchy,
  buildProvisionalCommunityHierarchy,
  type GraphCommunityHierarchy,
} from "./community";
import { createGraphCommunityTask } from "./community-client";
import {
  buildGraphRenderModel,
  getGraphDetailLevel,
  type GraphDetailLevel,
  type GraphRenderModel,
  type ResolvedGraphPerformanceOptions,
} from "./lod";
import {
  moveGraphLayoutNode,
  seedGraphLayout,
  type GraphLayoutNode,
  type GraphMatches,
  type GraphNode,
  type GraphPosition,
  type GraphRelationship,
  type GraphSelection,
} from "./model";
import {
  buildVisNetworkRecords,
  describeRenderEntity,
  resolveVisNetworkOptions,
  toVisEdgeVisualUpdate,
  toVisInitialNode,
  toVisNodeVisualUpdate,
  type GraphCanvasPalette,
  type VisEdgeRecord,
  type VisNodeRecord,
} from "./vis-model";
import {
  resolveDraggedVisPosition,
  resolveVisLodPositions,
} from "./vis-positions";

export interface GraphCanvasProps {
  ariaLabel: string;
  expanded?: boolean;
  legend: React.ReactNode;
  matches: GraphMatches;
  nodes: readonly GraphNode[];
  onExpandedChange?: (expanded: boolean) => void;
  onNodePositionChange?: (id: string, position: GraphPosition) => void;
  onPhysicsEnabledChange: (enabled: boolean) => void;
  onSelectionChange: (selection: GraphSelection) => void;
  performanceOptions: ResolvedGraphPerformanceOptions;
  physicsEnabled: boolean;
  relationships: readonly GraphRelationship[];
  selection: GraphSelection;
  showMiniMap?: boolean;
}

type GraphLayoutStatus = "error" | "loading" | "ready";

const fallbackPalette: GraphCanvasPalette = {
  canvas: "#101828",
  edge: "rgba(102, 112, 133, 0.62)",
  edgeDimmed: "rgba(102, 112, 133, 0.16)",
  nodeBorder: "#1d2939",
  nodeBorderActive: "#ffffff",
  nodeDimmed: "#475467",
  primary: "#175cd3",
  text: "#f9fafb",
  tones: {
    "category-1": "#2e90fa",
    "category-2": "#9b8afb",
    "category-3": "#32d583",
    "category-4": "#f79009",
    "category-5": "#ee46bc",
    "category-6": "#06aed4",
  },
};

function graphTopologyKey(nodes: readonly GraphNode[], relationships: readonly GraphRelationship[]): string {
  return `${nodes.map((node) => node.id).join("|")}::${relationships
    .map((relationship) => `${relationship.id}:${relationship.source}:${relationship.target}`)
    .join("|")}`;
}

function presentationKey(zoom: number, options: ResolvedGraphPerformanceOptions): string {
  return [getGraphDetailLevel(zoom, options), zoom >= options.nodeLabelMinZoom, zoom >= options.relationshipLabelMinZoom].join(":");
}

function initialZoom(options: ResolvedGraphPerformanceOptions): number {
  if (!options.isLargeGraph) return 1;
  return Math.max(0.25, Math.min(0.4, options.clusterBelowZoom * 0.4));
}

function stripPositions(nodes: readonly GraphNode[]): readonly GraphNode[] {
  return nodes.map(({ position: _position, ...node }): GraphNode => node);
}

function cssValue(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  return styles.getPropertyValue(name).trim() || fallback;
}

function withAlpha(color: string, alpha: number, fallback: string): string {
  const hex = color.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (hex) return `rgba(${Number.parseInt(hex[1] ?? "0", 16)}, ${Number.parseInt(hex[2] ?? "0", 16)}, ${Number.parseInt(hex[3] ?? "0", 16)}, ${alpha})`;
  const rgb = color.match(/^rgb\(([^)]+)\)$/i);
  return rgb ? `rgba(${rgb[1]}, ${alpha})` : fallback;
}

function resolvePalette(element: HTMLElement): GraphCanvasPalette {
  const styles = getComputedStyle(element);
  const muted = cssValue(styles, "--lumen-color-muted-foreground", "#667085");
  const canvas = cssValue(styles, "--lumen-graph-canvas", cssValue(styles, "--lumen-color-surface", fallbackPalette.canvas));
  return {
    canvas,
    edge: withAlpha(muted, 0.62, fallbackPalette.edge),
    edgeDimmed: withAlpha(muted, 0.16, fallbackPalette.edgeDimmed),
    nodeBorder: cssValue(styles, "--lumen-color-control-border", fallbackPalette.nodeBorder),
    nodeBorderActive: cssValue(styles, "--lumen-color-foreground", fallbackPalette.nodeBorderActive),
    nodeDimmed: cssValue(styles, "--lumen-graph-node-dimmed", fallbackPalette.nodeDimmed),
    primary: cssValue(styles, "--lumen-color-primary", fallbackPalette.primary),
    text: cssValue(styles, "--lumen-color-foreground", fallbackPalette.text),
    tones: Object.fromEntries(Array.from({ length: 6 }, (_, index) => {
      const tone = `category-${index + 1}`;
      return [tone, cssValue(styles, `--lumen-graph-${tone}`, fallbackPalette.tones[tone] ?? fallbackPalette.primary)];
    })),
  };
}

function reducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function sameIds(current: readonly (string | number)[], next: readonly { id: string }[]): boolean {
  if (current.length !== next.length) return false;
  const currentIds = new Set(current.map(String));
  return next.every((item) => currentIds.has(item.id));
}

function MiniMap({ model, network, revision }: { model: GraphRenderModel; network: Network | null; revision: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || model.nodes.length === 0) return;
    let live: Record<string, GraphPosition> = {};
    try {
      live = network?.getPositions(model.nodes.map((node) => node.id)) ?? {};
    } catch {
      // The retained renderer may be between destroy and replacement during HMR or a rapid unmount.
    }
    const positions = new Map(model.nodes.map((node) => [node.id, live[node.id] ?? node.position] as const));
    const xs = [...positions.values()].map((position) => position.x);
    const ys = [...positions.values()].map((position) => position.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const scaleX = (value: number) => 8 + ((value - minX) / Math.max(1, maxX - minX)) * (canvas.width - 16);
    const scaleY = (value: number) => 8 + ((value - minY) / Math.max(1, maxY - minY)) * (canvas.height - 16);
    const styles = getComputedStyle(canvas);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = cssValue(styles, "--lumen-graph-edge", fallbackPalette.edge);
    context.globalAlpha = 0.3;
    for (const edge of model.relationships) {
      const source = positions.get(edge.source);
      const target = positions.get(edge.target);
      if (!source || !target) continue;
      context.beginPath();
      context.moveTo(scaleX(source.x), scaleY(source.y));
      context.lineTo(scaleX(target.x), scaleY(target.y));
      context.stroke();
    }
    context.globalAlpha = 0.9;
    context.fillStyle = cssValue(styles, "--lumen-color-primary", fallbackPalette.primary);
    for (const node of model.nodes) {
      const position = positions.get(node.id);
      if (!position) continue;
      context.beginPath();
      context.arc(scaleX(position.x), scaleY(position.y), node.kind === "cluster" ? 2.8 : 1.8, 0, Math.PI * 2);
      context.fill();
    }
  }, [model, network, revision]);
  return <canvas ref={canvasRef} className="graph-canvas__minimap" width={176} height={104} aria-label="Graph overview" />;
}

export function GraphCanvas({
  ariaLabel,
  expanded = false,
  legend,
  matches,
  nodes,
  onExpandedChange = () => {},
  onNodePositionChange,
  onPhysicsEnabledChange,
  onSelectionChange,
  performanceOptions,
  physicsEnabled,
  relationships,
  selection,
  showMiniMap = true,
}: GraphCanvasProps) {
  const topologyKey = graphTopologyKey(nodes, relationships);
  const initialLayout = React.useMemo(() => seedGraphLayout(nodes), [topologyKey]);
  const [layoutNodes, setLayoutNodes] = React.useState<readonly GraphLayoutNode[]>(initialLayout);
  const [hierarchy, setHierarchy] = React.useState<GraphCommunityHierarchy | undefined>(() =>
    Number.isFinite(performanceOptions.minimumNodeCount)
      ? (performanceOptions.shouldUseWorker
        ? buildProvisionalCommunityHierarchy(initialLayout, relationships, {
          compactBudget: performanceOptions.targetRenderedNodes,
          overviewBudget: performanceOptions.overviewRenderedNodes,
          resolution: performanceOptions.clusteringResolution,
        })
        : buildGraphCommunityHierarchy(initialLayout, relationships, {
          compactBudget: performanceOptions.targetRenderedNodes,
          overviewBudget: performanceOptions.overviewRenderedNodes,
          resolution: performanceOptions.clusteringResolution,
        }))
      : undefined);
  const [layoutRevision, setLayoutRevision] = React.useState(0);
  const [layoutStatus, setLayoutStatus] = React.useState<GraphLayoutStatus>(performanceOptions.shouldUseWorker ? "loading" : "ready");
  const [layoutProgress, setLayoutProgress] = React.useState<number | null>(null);
  const [viewport, setViewport] = React.useState(() => ({ topologyKey, zoom: initialZoom(performanceOptions) }));
  const zoom = viewport.topologyKey === topologyKey ? viewport.zoom : initialZoom(performanceOptions);
  const [activeEntity, setActiveEntity] = React.useState<GraphSelection>(null);
  const [rendererError, setRendererError] = React.useState(false);
  const [miniMapVisible, setMiniMapVisible] = React.useState(showMiniMap);
  const [miniMapRevision, setMiniMapRevision] = React.useState(0);
  const [networkReady, setNetworkReady] = React.useState(false);
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const focusRef = React.useRef<HTMLDivElement>(null);
  const networkRef = React.useRef<Network | null>(null);
  const nodeDataRef = React.useRef<DataSet<Node> | null>(null);
  const edgeDataRef = React.useRef<DataSet<Edge> | null>(null);
  const modelRef = React.useRef<GraphRenderModel | null>(null);
  const networkModelRef = React.useRef<GraphRenderModel | null>(null);
  const selectionRef = React.useRef(selection);
  const selectionCallbackRef = React.useRef(onSelectionChange);
  const positionCallbackRef = React.useRef(onNodePositionChange);
  const physicsRef = React.useRef(physicsEnabled);
  const performanceRef = React.useRef(performanceOptions);
  const topologyKeyRef = React.useRef(topologyKey);
  const paletteRef = React.useRef<GraphCanvasPalette>(fallbackPalette);
  const pinnedNodeIdsRef = React.useRef(new Set(nodes.filter((node) => node.position).map((node) => node.id)));
  const positionCacheRef = React.useRef(new Map<GraphDetailLevel, Map<string, GraphPosition>>());
  const currentLevelRef = React.useRef<GraphDetailLevel>(getGraphDetailLevel(zoom, performanceOptions));
  const nodeRecordsRef = React.useRef(new Map<string, VisNodeRecord>());
  const edgeRecordsRef = React.useRef(new Map<string, VisEdgeRecord>());
  const hoverRef = React.useRef<GraphSelection>(null);
  const communityPendingRef = React.useRef(performanceOptions.shouldUseWorker);
  const physicsPendingRef = React.useRef(false);
  const reflowPendingRef = React.useRef(false);
  const miniMapFrameRef = React.useRef(0);
  const previousExpandedRef = React.useRef(expanded);
  const renderModelCacheRef = React.useRef<{ context: readonly unknown[]; models: Map<string, GraphRenderModel> }>({ context: [], models: new Map() });
  const descriptionId = React.useId();
  selectionRef.current = selection;
  selectionCallbackRef.current = onSelectionChange;
  positionCallbackRef.current = onNodePositionChange;
  physicsRef.current = physicsEnabled;
  performanceRef.current = performanceOptions;
  topologyKeyRef.current = topologyKey;

  const syncLayoutStatus = React.useCallback(() => {
    setLayoutStatus(communityPendingRef.current || physicsPendingRef.current ? "loading" : "ready");
  }, []);

  const scheduleMiniMap = React.useCallback(() => {
    if (miniMapFrameRef.current) return;
    miniMapFrameRef.current = window.requestAnimationFrame(() => {
      miniMapFrameRef.current = 0;
      setMiniMapRevision((value) => value + 1);
    });
  }, []);

  const emitSelection = React.useCallback((next: GraphSelection) => {
    const current = selectionRef.current;
    if (next?.kind === current?.kind && next?.id === current?.id) return;
    selectionRef.current = next;
    selectionCallbackRef.current(next);
  }, []);

  const commitRenderedNodePosition = React.useCallback((id: string, position: GraphPosition) => {
    const activeModel = networkModelRef.current ?? modelRef.current;
    if (!activeModel) return;
    const resolved = resolveDraggedVisPosition({
      id,
      model: activeModel,
      position,
      positions: positionCacheRef.current.get(activeModel.detailLevel),
    });
    if (!resolved) return;

    pinnedNodeIdsRef.current.add(id);
    positionCacheRef.current.set(activeModel.detailLevel, new Map(resolved.positions));
    const sourceNodeId = resolved.sourceNodeId;
    if (sourceNodeId) {
      setLayoutNodes((current) => moveGraphLayoutNode(current, sourceNodeId, position));
      positionCallbackRef.current?.(sourceNodeId, position);
    }
    scheduleMiniMap();
  }, [scheduleMiniMap]);

  const commitSemanticZoom = React.useCallback((scale: number) => {
    const currentTopology = topologyKeyRef.current;
    const currentOptions = performanceRef.current;
    setViewport((current) => {
      const currentZoom = current.topologyKey === currentTopology
        ? current.zoom
        : initialZoom(currentOptions);
      return presentationKey(currentZoom, currentOptions) === presentationKey(scale, currentOptions)
        ? current
        : { topologyKey: currentTopology, zoom: scale };
    });
  }, []);

  React.useEffect(() => () => {
    if (miniMapFrameRef.current) window.cancelAnimationFrame(miniMapFrameRef.current);
  }, []);

  React.useEffect(() => setMiniMapVisible(showMiniMap), [showMiniMap]);

  React.useEffect(() => {
    const previous = previousExpandedRef.current;
    previousExpandedRef.current = expanded;
    const frame = window.requestAnimationFrame(() => {
      networkRef.current?.redraw();
      if (previous && !expanded) {
        const controls = focusRef.current?.closest(".graph-canvas")?.querySelectorAll<HTMLButtonElement>("[data-graph-expand-return]");
        [...(controls ?? [])].find((control) => control.getClientRects().length > 0)?.focus();
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [expanded]);

  React.useEffect(() => {
    let active = true;
    const reflow = layoutRevision > 0;
    const sourceNodes = reflow ? stripPositions(nodes) : nodes;
    const seeded = seedGraphLayout(sourceNodes);
    if (!reflow) pinnedNodeIdsRef.current = new Set(nodes.filter((node) => node.position).map((node) => node.id));
    setLayoutNodes(seeded);
    const canBuildCommunities = Number.isFinite(performanceOptions.minimumNodeCount);
    const provisional = canBuildCommunities
      ? (performanceOptions.shouldUseWorker
        ? buildProvisionalCommunityHierarchy(seeded, relationships, {
          compactBudget: performanceOptions.targetRenderedNodes,
          overviewBudget: performanceOptions.overviewRenderedNodes,
          resolution: performanceOptions.clusteringResolution,
        })
        : buildGraphCommunityHierarchy(seeded, relationships, {
          compactBudget: performanceOptions.targetRenderedNodes,
          overviewBudget: performanceOptions.overviewRenderedNodes,
          resolution: performanceOptions.clusteringResolution,
        }))
      : undefined;
    setHierarchy(provisional);
    if (!performanceOptions.shouldUseWorker || !performanceOptions.shouldCluster) {
      communityPendingRef.current = false;
      syncLayoutStatus();
      return;
    }
    communityPendingRef.current = true;
    syncLayoutStatus();
    const task = createGraphCommunityTask(seeded, relationships, {
      compactBudget: performanceOptions.targetRenderedNodes,
      overviewBudget: performanceOptions.overviewRenderedNodes,
      resolution: performanceOptions.clusteringResolution,
    });
    task.promise.then((nextHierarchy) => {
      if (!active) return;
      setHierarchy(nextHierarchy);
      communityPendingRef.current = false;
      syncLayoutStatus();
    }).catch((error: unknown) => {
      if (!active || (error instanceof Error && error.name === "AbortError")) return;
      communityPendingRef.current = false;
      setLayoutStatus("error");
    });
    return () => { active = false; task.cancel(); };
  }, [layoutRevision, performanceOptions, relationships, syncLayoutStatus, topologyKey]);

  const renderModel = React.useMemo(() => {
    const context = [hierarchy, layoutNodes, matches, performanceOptions, relationships, selection] as const;
    const cache = renderModelCacheRef.current;
    if (context.some((value, index) => value !== cache.context[index])) {
      cache.context = context;
      cache.models.clear();
    }
    const key = presentationKey(zoom, performanceOptions);
    const cached = cache.models.get(key);
    if (cached) return cached;
    const model = buildGraphRenderModel({ hierarchy, matches, nodes: layoutNodes, options: performanceOptions, relationships, selection, zoom });
    cache.models.set(key, model);
    return model;
  }, [hierarchy, layoutNodes, matches, performanceOptions, relationships, selection, zoom]);
  modelRef.current = renderModel;
  const communityByNode = React.useMemo(() => {
    const mapping = new Map<string, string>();
    if (renderModel.detailLevel !== "detail") return mapping;
    for (const cluster of hierarchy?.compact ?? []) {
      for (const id of cluster.memberIds) mapping.set(id, cluster.id);
    }
    return mapping;
  }, [hierarchy, renderModel.detailLevel]);
  const communityByNodeRef = React.useRef<ReadonlyMap<string, string>>(communityByNode);
  communityByNodeRef.current = communityByNode;

  React.useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;
    let disposed = false;
    let dispose = () => {};
    void Promise.all([import("vis-network"), import("vis-data")]).then(([networkModule, dataModule]) => {
      if (disposed) return;
      paletteRef.current = resolvePalette(container);
      const records = buildVisNetworkRecords(modelRef.current ?? renderModel, paletteRef.current, communityByNodeRef.current);
      nodeRecordsRef.current = new Map(records.nodes.map((node) => [node.id, node]));
      edgeRecordsRef.current = new Map(records.edges.map((edge) => [edge.id, edge]));
      const supplied = pinnedNodeIdsRef.current;
      const initialNodes = records.nodes.map((node) => {
        const fixed = supplied.has(node.id);
        return {
          ...toVisInitialNode(node, fixed),
          ...(fixed ? { fixed: { x: true, y: true } } : {}),
        };
      }) as Node[];
      const initialEdges = records.edges as unknown as Edge[];
      const nodeData = new dataModule.DataSet<Node>();
      const edgeData = new dataModule.DataSet<Edge>();
      let network: Network;
      try {
        const base = resolveVisNetworkOptions(performanceRef.current, physicsRef.current);
        network = new networkModule.Network(container, { nodes: nodeData, edges: edgeData }, {
          ...base,
          autoResize: true,
          configure: false,
          manipulation: false,
          nodes: {
            chosen: { node: (values: { borderWidth: number; size: number }) => { values.borderWidth = 3; values.size += 6; } },
          },
          edges: {
            chosen: { edge: (values: { width: number }) => { values.width = 3; } },
          },
        } as unknown as Options);
      } catch {
        setRendererError(true);
        return;
      }
      networkRef.current = network;
      nodeDataRef.current = nodeData;
      edgeDataRef.current = edgeData;

      const updateHover = (next: GraphSelection) => {
        const previous = hoverRef.current;
        const restoreNodes = new Set<string>();
        const restoreEdges = new Set<string>();
        if (previous?.kind === "node") {
          restoreNodes.add(previous.id);
          network.getConnectedEdges(previous.id).forEach((id) => restoreEdges.add(String(id)));
        } else if (previous?.kind === "relationship") {
          restoreEdges.add(previous.id);
          const edge = edgeRecordsRef.current.get(previous.id);
          if (edge) { restoreNodes.add(edge.from); restoreNodes.add(edge.to); }
        }
        nodeData.update([...restoreNodes].map((id) => nodeRecordsRef.current.get(id)).filter(Boolean).map((item) => toVisNodeVisualUpdate(item as VisNodeRecord)) as Node[]);
        edgeData.update([...restoreEdges].map((id) => edgeRecordsRef.current.get(id)).filter(Boolean).map((item) => toVisEdgeVisualUpdate(item as VisEdgeRecord)) as Edge[]);
        hoverRef.current = next;
        if (next?.kind === "node") {
          const baseNode = nodeRecordsRef.current.get(next.id);
          if (baseNode) nodeData.update({ id: next.id, borderWidth: 3, label: baseNode.title.split("\n")[0], color: { ...baseNode.color, border: paletteRef.current.nodeBorderActive } } as Node);
          const incident = network.getConnectedEdges(next.id).map(String);
          edgeData.update(incident.map((id) => {
            const edge = edgeRecordsRef.current.get(id);
            return edge ? { id, color: { ...edge.color, color: paletteRef.current.primary }, label: edge.fullLabel, width: 3 } : null;
          }).filter(Boolean) as Edge[]);
        } else if (next?.kind === "relationship") {
          const edge = edgeRecordsRef.current.get(next.id);
          if (edge) {
            edgeData.update({ id: edge.id, color: { ...edge.color, color: paletteRef.current.primary }, label: edge.fullLabel, width: 3 } as Edge);
            nodeData.update([edge.from, edge.to].map((id) => ({ id, borderWidth: 3 })) as Node[]);
          }
        }
      };
      const hoverIntent = createGraphHoverIntent(updateHover);
      network.on("hoverNode", ({ node }) => hoverIntent.enter({ kind: "node", id: String(node) }));
      network.on("blurNode", () => hoverIntent.leave());
      network.on("hoverEdge", ({ edge }) => hoverIntent.enter({ kind: "relationship", id: String(edge) }));
      network.on("blurEdge", () => hoverIntent.leave());
      network.on("click", ({ nodes: selectedNodes, edges: selectedEdges }) => {
        const nodeId = selectedNodes[0] ? String(selectedNodes[0]) : null;
        const edgeId = selectedEdges[0] ? String(selectedEdges[0]) : null;
        if (nodeId) {
          const entity = modelRef.current?.nodes.find((item) => item.id === nodeId);
          if (entity?.kind === "cluster") {
            const scale = network.getScale() * 2.2;
            network.focus(nodeId, { scale, animation: reducedMotion() ? false : { duration: 180, easingFunction: "easeInOutQuad" } });
            commitSemanticZoom(scale);
          }
          else emitSelection({ kind: "node", id: nodeId });
        } else if (edgeId) {
          const entity = modelRef.current?.relationships.find((item) => item.id === edgeId);
          if (entity?.kind === "aggregate") {
            const positions = network.getPositions([entity.source, entity.target]);
            const source = positions[entity.source];
            const target = positions[entity.target];
            if (source && target) {
              const scale = network.getScale() * 1.8;
              network.moveTo({ position: { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 }, scale, animation: reducedMotion() ? false : { duration: 180, easingFunction: "easeInOutQuad" } });
              commitSemanticZoom(scale);
            }
          } else emitSelection({ kind: "relationship", id: edgeId });
        } else emitSelection(null);
      });
      network.on("dragEnd", ({ nodes: draggedNodes }) => {
        for (const rawId of draggedNodes) {
          const id = String(rawId);
          const position = network.getPosition(id);
          network.moveNode(id, position.x, position.y);
          nodeData.update({ id, fixed: { x: true, y: true } } as Node);
          commitRenderedNodePosition(id, position);
        }
      });
      network.on("zoom", ({ scale }) => {
        commitSemanticZoom(scale);
        scheduleMiniMap();
      });
      network.on("animationFinished", () => commitSemanticZoom(network.getScale()));
      network.on("stabilizationProgress", ({ iterations, total }) => {
        physicsPendingRef.current = true;
        setLayoutProgress(total > 0 ? Math.round((iterations / total) * 100) : null);
        syncLayoutStatus();
      });
      const settle = () => {
        physicsPendingRef.current = false;
        setLayoutProgress(null);
        syncLayoutStatus();
        const activeModel = networkModelRef.current;
        if (activeModel) {
          const positions = network.getPositions(activeModel.nodes.map((node) => node.id));
          positionCacheRef.current.set(activeModel.detailLevel, new Map(Object.entries(positions)));
          if (reflowPendingRef.current && activeModel.detailLevel === "detail") {
            for (const node of activeModel.nodes) {
              if (node.kind !== "node") continue;
              const position = positions[node.id];
              if (position) positionCallbackRef.current?.(node.id, position);
            }
          }
        }
        reflowPendingRef.current = false;
        scheduleMiniMap();
      };
      network.on("stabilizationIterationsDone", settle);
      let initialFitPending = true;
      network.on("stabilized", () => {
        settle();
        if (!initialFitPending) return;
        initialFitPending = false;
        network.fit({ animation: reducedMotion() ? false : { duration: 350, easingFunction: "easeInOutQuad" } });
      });
      network.on("afterDrawing", scheduleMiniMap);

      networkModelRef.current = modelRef.current ?? renderModel;
      nodeData.add(initialNodes);
      edgeData.add(initialEdges);
      setNetworkReady(true);
      physicsPendingRef.current = physicsRef.current;
      syncLayoutStatus();
      network.moveTo({ position: { x: 0, y: 0 }, scale: initialZoom(performanceRef.current) });
      if (!physicsRef.current) network.fit({ animation: false });
      else if (reducedMotion()) {
        const iterations = resolveVisNetworkOptions(performanceRef.current, true).physics.stabilization.iterations;
        network.stabilize(iterations);
      }

      const observer = new MutationObserver(() => {
        paletteRef.current = resolvePalette(container);
        const next = buildVisNetworkRecords(modelRef.current ?? renderModel, paletteRef.current, communityByNodeRef.current);
        nodeRecordsRef.current = new Map(next.nodes.map((node) => [node.id, node]));
        edgeRecordsRef.current = new Map(next.edges.map((edge) => [edge.id, edge]));
        nodeData.update(next.nodes.map(toVisNodeVisualUpdate) as Node[]);
        edgeData.update(next.edges.map(toVisEdgeVisualUpdate) as Edge[]);
        network.redraw();
      });
      observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "data-lumen-palette", "data-lumen-theme"] });
      dispose = () => {
        observer.disconnect();
        hoverIntent.cancel();
        network.destroy();
        networkRef.current = null;
        networkModelRef.current = null;
        nodeDataRef.current = null;
        edgeDataRef.current = null;
      };
    }).catch(() => setRendererError(true));
    return () => { disposed = true; dispose(); };
  }, [commitSemanticZoom, scheduleMiniMap, syncLayoutStatus]);

  React.useEffect(() => {
    const network = networkRef.current;
    const nodeData = nodeDataRef.current;
    const edgeData = edgeDataRef.current;
    const container = canvasRef.current;
    if (!network || !nodeData || !edgeData || !container) return;
    paletteRef.current = resolvePalette(container);
    const records = buildVisNetworkRecords(renderModel, paletteRef.current, communityByNode);
    nodeRecordsRef.current = new Map(records.nodes.map((node) => [node.id, node]));
    edgeRecordsRef.current = new Map(records.edges.map((edge) => [edge.id, edge]));
    const sameTopology = sameIds(nodeData.getIds(), records.nodes) && sameIds(edgeData.getIds(), records.edges);
    if (sameTopology) {
      nodeData.update(records.nodes.map(toVisNodeVisualUpdate) as Node[]);
      edgeData.update(records.edges.map(toVisEdgeVisualUpdate) as Edge[]);
      networkModelRef.current = renderModel;
      network.redraw();
      return;
    }
    const previousModel = networkModelRef.current;
    let previousPositions = new Map<string, GraphPosition>();
    if (previousModel) {
      const live = network.getPositions(nodeData.getIds().map(String));
      previousPositions = new Map(Object.entries(live));
      positionCacheRef.current.set(currentLevelRef.current, previousPositions);
    }
    const viewPosition = network.getViewPosition();
    const scale = network.getScale();
    const cached = positionCacheRef.current.get(renderModel.detailLevel);
    const inheritedPositions = resolveVisLodPositions({
      cachedPositions: cached,
      nextModel: renderModel,
      previousModel,
      previousPositions,
    });
    edgeData.clear();
    nodeData.clear();
    nodeData.add(records.nodes.map((node) => {
      const position = inheritedPositions.get(node.id) ?? { x: node.x, y: node.y };
      const fixed = pinnedNodeIdsRef.current.has(node.id);
      return { ...node, x: position.x, y: position.y, ...(fixed ? { fixed: { x: true, y: true } } : {}) };
    }) as Node[]);
    edgeData.add(records.edges as unknown as Edge[]);
    currentLevelRef.current = renderModel.detailLevel;
    networkModelRef.current = renderModel;
    network.moveTo({ position: viewPosition, scale });
    if (physicsRef.current) {
      physicsPendingRef.current = true;
      syncLayoutStatus();
      if (reducedMotion()) {
        const iterations = resolveVisNetworkOptions(performanceRef.current, true).physics.stabilization.iterations;
        network.stabilize(iterations);
      } else network.startSimulation();
    }
  }, [communityByNode, networkReady, renderModel, syncLayoutStatus]);

  React.useEffect(() => {
    const network = networkRef.current;
    if (!network) return;
    network.setOptions(resolveVisNetworkOptions(performanceOptions, physicsEnabled) as unknown as Options);
    if (physicsEnabled) {
      physicsPendingRef.current = true;
      syncLayoutStatus();
      if (reducedMotion()) {
        const iterations = resolveVisNetworkOptions(performanceOptions, true).physics.stabilization.iterations;
        network.stabilize(iterations);
      } else network.startSimulation();
    } else {
      network.stopSimulation();
      physicsPendingRef.current = false;
      syncLayoutStatus();
    }
  }, [networkReady, performanceOptions, physicsEnabled, syncLayoutStatus]);

  React.useEffect(() => {
    const network = networkRef.current;
    if (!network) return;
    if (selection?.kind === "node") network.selectNodes([selection.id], false);
    else if (selection?.kind === "relationship") network.selectEdges([selection.id]);
    else network.unselectAll();
    network.redraw();
  }, [networkReady, selection]);

  const currentPoints = React.useCallback(() => {
    const network = networkRef.current;
    const model = modelRef.current;
    if (!network || !model) return [];
    const positions = network.getPositions(model.nodes.map((node) => node.id));
    const nodePoints = model.nodes.map((node) => ({ id: node.id, kind: "node" as const, position: positions[node.id] ?? node.position }));
    const edgePoints = model.relationships.map((edge) => {
      const source = positions[edge.source] ?? { x: 0, y: 0 };
      const target = positions[edge.target] ?? { x: 0, y: 0 };
      return { id: edge.id, kind: "relationship" as const, position: { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 } };
    });
    return [...nodePoints, ...edgePoints];
  }, []);

  const activate = React.useCallback((entity: GraphSelection) => {
    const network = networkRef.current;
    const model = modelRef.current;
    if (!entity || !network || !model) return;
    if (entity.kind === "node") {
      const node = model.nodes.find((item) => item.id === entity.id);
      if (node?.kind === "cluster") {
        const scale = network.getScale() * 2.2;
        network.focus(node.id, { scale, animation: reducedMotion() ? false : { duration: 180, easingFunction: "easeInOutQuad" } });
        commitSemanticZoom(scale);
        return;
      }
    } else {
      const edge = model.relationships.find((item) => item.id === entity.id);
      if (edge?.kind === "aggregate") {
        const scale = network.getScale() * 1.8;
        network.moveTo({ scale, animation: reducedMotion() ? false : { duration: 180, easingFunction: "easeInOutQuad" } });
        commitSemanticZoom(scale);
        return;
      }
    }
    emitSelection(entity);
  }, [commitSemanticZoom, emitSelection]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      if (expanded) return;
      event.preventDefault();
      setActiveEntity(null);
      emitSelection(null);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && activeEntity) {
      event.preventDefault();
      activate(activeEntity);
      return;
    }
    const points = currentPoints();
    if (!event.key.startsWith("Arrow") || points.length === 0) return;
    event.preventDefault();
    const current = points.find((point) => point.id === activeEntity?.id && point.kind === activeEntity.kind) ?? points[0];
    if (!current) return;
    if (event.shiftKey && current.kind === "node") {
      const node = modelRef.current?.nodes.find((item) => item.id === current.id);
      if (!node) return;
      const delta = 24;
      const position = {
        x: current.position.x + (event.key === "ArrowRight" ? delta : event.key === "ArrowLeft" ? -delta : 0),
        y: current.position.y + (event.key === "ArrowDown" ? delta : event.key === "ArrowUp" ? -delta : 0),
      };
      networkRef.current?.moveNode(node.id, position.x, position.y);
      nodeDataRef.current?.update({ id: node.id, fixed: { x: true, y: true } } as Node);
      commitRenderedNodePosition(node.id, position);
      return;
    }
    const direction = { x: event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0, y: event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0 };
    const next = points.filter((point) => point.id !== current.id || point.kind !== current.kind).map((point) => {
      const dx = point.position.x - current.position.x;
      const dy = point.position.y - current.position.y;
      return { point, forward: dx * direction.x + dy * direction.y, score: Math.hypot(dx, dy) + Math.abs(dx * direction.y - dy * direction.x) * 1.5 };
    }).filter((item) => item.forward > 0).sort((left, right) => left.score - right.score || left.point.id.localeCompare(right.point.id))[0]?.point;
    if (next) setActiveEntity({ kind: next.kind, id: next.id });
  };

  const animation = () => reducedMotion() ? false : { duration: 180, easingFunction: "easeInOutQuad" as const };
  const fitGraph = () => networkRef.current?.fit({ animation: animation() });
  const centerSelection = () => {
    const network = networkRef.current;
    if (!network || !selection) return;
    if (selection.kind === "node") network.focus(selection.id, { scale: Math.max(network.getScale(), 1), animation: animation() });
    else {
      const edge = edgeRecordsRef.current.get(selection.id);
      if (!edge) return;
      const positions = network.getPositions([edge.from, edge.to]);
      const source = positions[edge.from];
      const target = positions[edge.to];
      if (source && target) network.moveTo({ position: { x: (source.x + target.x) / 2, y: (source.y + target.y) / 2 }, scale: Math.max(network.getScale(), 1), animation: animation() });
    }
  };
  const reflowGraph = () => {
    const network = networkRef.current;
    const nodeData = nodeDataRef.current;
    if (!network || !nodeData) return;
    pinnedNodeIdsRef.current.clear();
    positionCacheRef.current.clear();
    reflowPendingRef.current = true;
    const seeded = seedGraphLayout(stripPositions(nodes));
    setLayoutNodes(seeded);
    const resetModel = buildGraphRenderModel({
      hierarchy,
      matches,
      nodes: seeded,
      options: performanceOptions,
      relationships,
      selection,
      zoom,
    });
    const resetPositions = new Map(resetModel.nodes.map((node) => [node.id, node.position] as const));
    nodeData.update(nodeData.getIds().map((rawId) => {
      const id = String(rawId);
      const position = resetPositions.get(id);
      return { id, ...(position ? { x: position.x, y: position.y } : {}), fixed: false };
    }) as Node[]);
    physicsPendingRef.current = true;
    setLayoutProgress(0);
    syncLayoutStatus();
    setLayoutRevision((current) => current + 1);
    if (!physicsRef.current) onPhysicsEnabledChange(true);
    network.setOptions(resolveVisNetworkOptions(performanceOptions, true) as unknown as Options);
    network.stabilize(performanceOptions.layoutQuality === "fast" ? 100 : performanceOptions.layoutQuality === "quality" ? 400 : 200);
  };

  const statusLabel = renderModel.detailLevel === "detail"
    ? `${renderModel.stats.renderedNodes} entities`
    : `${renderModel.stats.renderedNodes} groups · ${renderModel.stats.sourceNodes} entities`;
  const layoutLabel = layoutStatus === "loading"
    ? `Laying out${layoutProgress === null ? "" : ` · ${layoutProgress}%`}`
    : layoutStatus === "error"
      ? "Provisional communities"
      : physicsEnabled
        ? "Physics ready"
        : "Physics paused";

  return (
    <div
      data-slot="graph-canvas"
      data-detail-level={renderModel.detailLevel}
      data-layout-status={layoutStatus}
      data-physics-enabled={physicsEnabled}
      data-rendered-node-count={renderModel.stats.renderedNodes}
      data-rendered-relationship-count={renderModel.stats.renderedRelationships}
      data-source-node-count={renderModel.stats.sourceNodes}
      data-source-relationship-count={renderModel.stats.sourceRelationships}
      data-expanded={expanded || undefined}
      className="graph-canvas"
      aria-busy={layoutStatus === "loading" || undefined}
    >
      <div
        ref={focusRef}
        className="graph-canvas__focus-target"
        role="application"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-activedescendant={activeEntity ? descriptionId : undefined}
        onFocus={() => { const first = currentPoints()[0]; if (!activeEntity && first) setActiveEntity({ kind: first.kind, id: first.id }); }}
        onKeyDown={handleKeyDown}
      >
        <div ref={canvasRef} className="graph-canvas__vis" aria-hidden="true" />
        <span id={descriptionId} className="sr-only">{describeRenderEntity(renderModel, activeEntity)}</span>
      </div>
      <div className="graph-canvas__status" aria-live="polite">
        <span>{renderModel.detailLevel}</span>
        <strong>{statusLabel}</strong>
        <span>{layoutLabel}</span>
      </div>
      <GraphViewportControls
        canCenter={selection !== null}
        expanded={expanded}
        layoutPending={layoutStatus === "loading"}
        legend={legend}
        miniMapEnabled={showMiniMap}
        miniMapVisible={miniMapVisible}
        physicsEnabled={physicsEnabled}
        onCenter={centerSelection}
        onExpandedChange={onExpandedChange}
        onFit={fitGraph}
        onMiniMapVisibleChange={setMiniMapVisible}
        onPhysicsEnabledChange={onPhysicsEnabledChange}
        onReflow={reflowGraph}
        onZoomIn={() => {
          const network = networkRef.current;
          if (!network) return;
          const scale = network.getScale() * 1.2;
          network.moveTo({ scale, animation: animation() });
          commitSemanticZoom(scale);
        }}
        onZoomOut={() => {
          const network = networkRef.current;
          if (!network) return;
          const scale = network.getScale() / 1.2;
          network.moveTo({ scale, animation: animation() });
          commitSemanticZoom(scale);
        }}
      />
      {showMiniMap && miniMapVisible ? <MiniMap model={renderModel} network={networkRef.current} revision={miniMapRevision} /> : null}
      {layoutStatus === "error" ? <div className="graph-canvas__layout-error" role="alert">Community detection could not finish. Showing provisional groups.</div> : null}
      {rendererError ? (
        <div className="graph-canvas__fallback" role="status">
          <strong>Interactive graph unavailable</strong>
          <span>{matches.matchingNodeIds.size} matching nodes and {matches.matchingRelationshipIds.size} matching relationships.</span>
          <ul>{nodes.filter((node) => matches.matchingNodeIds.has(node.id)).slice(0, 20).map((node) => <li key={node.id}>{node.label}</li>)}</ul>
        </div>
      ) : null}
    </div>
  );
}
