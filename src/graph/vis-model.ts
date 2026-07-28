import type {
  GraphRenderModel,
  GraphRenderNode,
  GraphRenderRelationship,
  ResolvedGraphPerformanceOptions,
} from "./lod";
import type { GraphSelection } from "./model";

export interface GraphCanvasPalette {
  canvas: string;
  edge: string;
  edgeDimmed: string;
  nodeBorder: string;
  nodeBorderActive: string;
  nodeDimmed: string;
  primary: string;
  text: string;
  tones: Readonly<Record<string, string>>;
}

export interface VisNodeRecord {
  borderWidth: number;
  borderWidthSelected: number;
  color: {
    background: string;
    border: string;
    highlight: { background: string; border: string };
    hover: { background: string; border: string };
  };
  entityKind: GraphRenderNode["kind"];
  font: { color: string; face: string; size: number; strokeColor: string; strokeWidth: number };
  id: string;
  label: string;
  matched: boolean;
  renderEntity: GraphRenderNode;
  shadow: { color: string; enabled: boolean; size: number; x: number; y: number };
  shape: "dot";
  size: number;
  title: string;
  x: number;
  y: number;
}

export interface VisEdgeRecord {
  arrows?: { to: { enabled: true; scaleFactor: number } };
  color: { color: string; highlight: string; hover: string; inherit: false; opacity: number };
  dashes: boolean;
  entityKind: GraphRenderRelationship["kind"];
  font: { align: "middle"; background: string; color: string; face: string; size: number; strokeWidth: number };
  fullLabel: string;
  id: string;
  label: string;
  length?: number;
  matched: boolean;
  renderEntity: GraphRenderRelationship;
  selectionWidth: number;
  smooth: { enabled: true; forceDirection: "none"; roundness: number; type: "continuous" };
  title: string;
  to: string;
  from: string;
  width: number;
}

export interface VisNetworkRecords {
  edges: readonly VisEdgeRecord[];
  nodes: readonly VisNodeRecord[];
}

export type VisInitialNodeRecord = Omit<VisNodeRecord, "x" | "y"> &
  Partial<Pick<VisNodeRecord, "x" | "y">>;

export function toVisInitialNode(
  record: VisNodeRecord,
  preservePosition: boolean,
): VisInitialNodeRecord {
  if (preservePosition) return record;
  const { x: _x, y: _y, ...automatic } = record;
  return automatic;
}

export function toVisNodeVisualUpdate(
  record: VisNodeRecord,
): Omit<VisNodeRecord, "x" | "y"> {
  const { x: _x, y: _y, ...visual } = record;
  return visual;
}

export function toVisEdgeVisualUpdate(
  record: VisEdgeRecord,
): Omit<VisEdgeRecord, "from" | "to"> {
  const { from: _from, to: _to, ...visual } = record;
  return visual;
}

export function resolveVisRelationshipLength(
  source: string,
  target: string,
  communityByNode: ReadonlyMap<string, string> | undefined,
): number | undefined {
  const sourceCommunity = communityByNode?.get(source);
  const targetCommunity = communityByNode?.get(target);
  if (!sourceCommunity || !targetCommunity) return undefined;
  return sourceCommunity === targetCommunity ? 110 : 240;
}

export interface VisNetworkPhysicsOptions {
  interaction: {
    dragNodes: true;
    dragView: true;
    hover: true;
    keyboard: false;
    multiselect: false;
    navigationButtons: false;
    tooltipDelay: number;
    zoomView: true;
  };
  layout: { improvedLayout: true };
  physics: {
    enabled: boolean;
    forceAtlas2Based: {
      avoidOverlap: number;
      centralGravity: number;
      damping: number;
      gravitationalConstant: number;
      springConstant: number;
      springLength: number;
    };
    solver: "forceAtlas2Based";
    stabilization: { enabled: true; iterations: number; updateInterval: number };
  };
}

function nodeLabel(node: GraphRenderNode): string {
  return node.kind === "cluster"
    ? `${node.memberIds.length} ${node.dominantLabel}`
    : node.node.label;
}

function relationshipLabel(relationship: GraphRenderRelationship): string {
  return relationship.kind === "aggregate"
    ? `${relationship.count} relationships · ${relationship.types.join(", ")}`
    : relationship.relationship.label ?? relationship.relationship.type;
}

function nodeTitle(node: GraphRenderNode): string {
  if (node.kind === "cluster") {
    return `${node.dominantLabel}\n${node.memberIds.length} entities\n${node.matchedCount} matching`;
  }
  return [node.node.label, node.node.labels.join(", "), node.node.description, node.node.id]
    .filter(Boolean)
    .join("\n");
}

export function buildVisNetworkRecords(
  model: GraphRenderModel,
  palette: GraphCanvasPalette,
  communityByNode?: ReadonlyMap<string, string>,
): VisNetworkRecords {
  const nodes = model.nodes.map((node): VisNodeRecord => {
    const count = node.kind === "cluster" ? node.memberIds.length : 1;
    const tone = palette.tones[node.tone] ?? palette.primary;
    return {
      borderWidth: 2,
      borderWidthSelected: 3,
      color: {
        background: node.matched ? tone : palette.nodeDimmed,
        border: palette.nodeBorder,
        highlight: { background: tone, border: palette.nodeBorderActive },
        hover: { background: tone, border: palette.nodeBorderActive },
      },
      entityKind: node.kind,
      font: {
        color: palette.text,
        face: "Inter, ui-sans-serif, system-ui, sans-serif",
        size: 13,
        strokeColor: palette.canvas,
        strokeWidth: 3,
      },
      id: node.id,
      label: model.showNodeLabels ? nodeLabel(node) : "",
      matched: node.matched,
      renderEntity: node,
      shadow: { color: "rgba(0, 0, 0, 0.35)", enabled: true, size: 8, x: 0, y: 2 },
      shape: "dot",
      size: node.kind === "cluster" ? Math.min(42, 22 + Math.sqrt(count) * 2.4) : 22,
      title: nodeTitle(node),
      x: node.position.x,
      y: node.position.y,
    };
  });

  const edges = [...model.relationships]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((relationship): VisEdgeRecord => {
      const color = relationship.matched ? palette.edge : palette.edgeDimmed;
      const fullLabel = relationshipLabel(relationship);
      return {
        ...(relationship.directed ? { arrows: { to: { enabled: true as const, scaleFactor: 0.8 } } } : {}),
        color: { color, highlight: palette.primary, hover: palette.primary, inherit: false, opacity: 1 },
        dashes: false,
        entityKind: relationship.kind,
        font: {
          align: "middle",
          background: palette.canvas,
          color: palette.text,
          face: "Inter, ui-sans-serif, system-ui, sans-serif",
          size: 12,
          strokeWidth: 0,
        },
        from: relationship.source,
        fullLabel,
        id: relationship.id,
        label: model.showRelationshipLabels && model.relationships.length <= 240 ? fullLabel : "",
        length: resolveVisRelationshipLength(
          relationship.source,
          relationship.target,
          communityByNode,
        ),
        matched: relationship.matched,
        renderEntity: relationship,
        selectionWidth: 3,
        smooth: {
          enabled: true,
          forceDirection: "none",
          roundness: 0.35,
          type: "continuous",
        },
        title: fullLabel,
        to: relationship.target,
        width: 2,
      };
    });

  return { nodes, edges };
}

export function resolveVisNetworkOptions(
  options: ResolvedGraphPerformanceOptions,
  enabled: boolean,
): VisNetworkPhysicsOptions {
  const iterations = options.layoutQuality === "fast"
    ? 100
    : options.layoutQuality === "quality"
      ? 400
      : 200;
  return {
    interaction: {
      dragNodes: true,
      dragView: true,
      hover: true,
      keyboard: false,
      multiselect: false,
      navigationButtons: false,
      tooltipDelay: 120,
      zoomView: true,
    },
    layout: { improvedLayout: true },
    physics: {
      enabled,
      solver: "forceAtlas2Based",
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springLength: 160,
        springConstant: 0.08,
        damping: 0.4,
        avoidOverlap: Math.max(0, Math.min(1, options.collisionPadding / 24)),
      },
      stabilization: { enabled: true, iterations, updateInterval: 25 },
    },
  };
}

export function describeRenderEntity(
  model: GraphRenderModel,
  selection: GraphSelection,
): string {
  if (!selection) return "Use arrow keys to move through graph entities.";
  if (selection.kind === "node") {
    const node = model.nodes.find((item) => item.id === selection.id);
    if (!node) return "Graph entity unavailable.";
    if (node.kind === "cluster") {
      return `${node.dominantLabel} cluster, ${node.memberIds.length} entities, ${node.matchedCount} matching current filters. Press Enter to expand.`;
    }
    return `${node.node.label}, ${node.node.labels.join(", ") || "uncategorized"}${node.matched ? "" : ", outside current filters"}.`;
  }
  const edge = model.relationships.find((item) => item.id === selection.id);
  if (!edge) return "Graph relationship unavailable.";
  return `${relationshipLabel(edge)}, from ${edge.source} to ${edge.target}, ${edge.matchedCount} matching current filters.`;
}
