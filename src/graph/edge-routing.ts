export interface EdgeRouteRelationship {
  directed?: boolean;
  id: string;
  source: string;
  target: string;
}

export interface EdgePoint {
  x: number;
  y: number;
}

export type EdgeHandleSide = "top" | "right" | "bottom" | "left";

export interface EdgeHandleSides {
  source: EdgeHandleSide;
  target: EdgeHandleSide;
}

export interface EdgeRouteNode extends EdgePoint {
  id: string;
  radius: number;
}

export interface RoutedEdgeGeometryInput {
  arrowSize?: number;
  directed: boolean;
  routeOffset: number;
  source: EdgePoint;
  sourceDirection: EdgePoint;
  target: EdgePoint;
  targetDirection: EdgePoint;
}

export interface RoutedEdgeGeometry {
  arrowPoints: string | null;
  controlPoints: {
    end: EdgePoint;
    first: EdgePoint;
    second: EdgePoint;
    start: EdgePoint;
  };
  end: EdgePoint;
  labelX: number;
  labelY: number;
  path: string;
}

const PARALLEL_ROUTE_STEP = 24;
const RECIPROCAL_ROUTE_START = 18;
const ROUTING_CELL_SIZE = 160;
const ROUTING_CLEARANCE = 14;
const ROUTING_DETOURS = [40, 72, 104, 136, 168, 200, 232] as const;

function pairKey(relationship: EdgeRouteRelationship): string {
  return relationship.source < relationship.target
    ? `${relationship.source}\u0000${relationship.target}`
    : `${relationship.target}\u0000${relationship.source}`;
}

function directionKey(relationship: EdgeRouteRelationship): string {
  return `${relationship.source}\u0000${relationship.target}`;
}

export function getRelationshipRouteOffsets(
  relationships: readonly EdgeRouteRelationship[],
): ReadonlyMap<string, number> {
  const groups = new Map<string, EdgeRouteRelationship[]>();
  for (const relationship of relationships) {
    const key = pairKey(relationship);
    const group = groups.get(key);
    if (group) group.push(relationship);
    else groups.set(key, [relationship]);
  }

  const offsets = new Map<string, number>();
  for (const group of groups.values()) {
    if (group.length === 1) {
      offsets.set(group[0]!.id, 0);
      continue;
    }

    const directions = new Map<string, EdgeRouteRelationship[]>();
    for (const relationship of group) {
      const key = directionKey(relationship);
      const direction = directions.get(key);
      if (direction) direction.push(relationship);
      else directions.set(key, [relationship]);
    }

    const hasReciprocalRoutes = directions.size > 1;
    for (const direction of directions.values()) {
      direction.sort((left, right) => left.id.localeCompare(right.id));
      direction.forEach((relationship, index) => {
        const offset = hasReciprocalRoutes
          ? RECIPROCAL_ROUTE_START + index * PARALLEL_ROUTE_STEP
          : (index - (direction.length - 1) / 2) * PARALLEL_ROUTE_STEP;
        offsets.set(relationship.id, offset);
      });
    }
  }
  return offsets;
}

export function getEdgeHandleSides(
  source: EdgePoint,
  target: EdgePoint,
): EdgeHandleSides {
  const horizontalDistance = target.x - source.x;
  const verticalDistance = target.y - source.y;
  if (Math.abs(horizontalDistance) >= Math.abs(verticalDistance)) {
    return horizontalDistance >= 0
      ? { source: "right", target: "left" }
      : { source: "left", target: "right" };
  }
  return verticalDistance >= 0
    ? { source: "bottom", target: "top" }
    : { source: "top", target: "bottom" };
}

function sideDirection(side: EdgeHandleSide): EdgePoint {
  if (side === "left") return { x: -1, y: 0 };
  if (side === "right") return { x: 1, y: 0 };
  if (side === "top") return { x: 0, y: -1 };
  return { x: 0, y: 1 };
}

function circleEdgePoint(node: EdgeRouteNode, side: EdgeHandleSide): EdgePoint {
  const direction = sideDirection(side);
  return {
    x: node.x + direction.x * node.radius,
    y: node.y + direction.y * node.radius,
  };
}

function normalized(point: EdgePoint): EdgePoint {
  const length = Math.hypot(point.x, point.y);
  if (length === 0) return { x: 1, y: 0 };
  return { x: point.x / length, y: point.y / length };
}

function format(value: number): number {
  return Number(value.toFixed(2));
}

function pointText(point: EdgePoint): string {
  return `${format(point.x)},${format(point.y)}`;
}

function cubicPoint(
  start: EdgePoint,
  firstControl: EdgePoint,
  secondControl: EdgePoint,
  end: EdgePoint,
  time: number,
): EdgePoint {
  const inverse = 1 - time;
  return {
    x: inverse ** 3 * start.x +
      3 * inverse ** 2 * time * firstControl.x +
      3 * inverse * time ** 2 * secondControl.x +
      time ** 3 * end.x,
    y: inverse ** 3 * start.y +
      3 * inverse ** 2 * time * firstControl.y +
      3 * inverse * time ** 2 * secondControl.y +
      time ** 3 * end.y,
  };
}

export function createRoutedEdgeGeometry({
  arrowSize = 7,
  directed,
  routeOffset,
  source,
  sourceDirection,
  target,
  targetDirection,
}: RoutedEdgeGeometryInput): RoutedEdgeGeometry {
  const sourceVector = normalized(sourceDirection);
  const targetVector = normalized(targetDirection);
  const start = {
    x: source.x + sourceVector.x * 2,
    y: source.y + sourceVector.y * 2,
  };
  const targetInset = directed ? arrowSize + 2 : 2;
  const end = {
    x: target.x + targetVector.x * targetInset,
    y: target.y + targetVector.y * targetInset,
  };
  const direct = normalized({ x: end.x - start.x, y: end.y - start.y });
  const perpendicular = { x: -direct.y, y: direct.x };
  const distance = Math.hypot(end.x - start.x, end.y - start.y);
  const controlDistance = Math.max(48, Math.min(160, distance * 0.42));
  const firstControl = {
    x: start.x + sourceVector.x * controlDistance + perpendicular.x * routeOffset,
    y: start.y + sourceVector.y * controlDistance + perpendicular.y * routeOffset,
  };
  const secondControl = {
    x: end.x + targetVector.x * controlDistance + perpendicular.x * routeOffset,
    y: end.y + targetVector.y * controlDistance + perpendicular.y * routeOffset,
  };
  const label = cubicPoint(start, firstControl, secondControl, end, 0.5);
  const tangent = normalized({
    x: end.x - secondControl.x,
    y: end.y - secondControl.y,
  });
  const arrowPerpendicular = { x: -tangent.y, y: tangent.x };
  const arrowBase = {
    x: end.x - tangent.x * arrowSize,
    y: end.y - tangent.y * arrowSize,
  };
  const arrowHalfWidth = arrowSize * 0.46;
  const arrowPoints = directed
    ? [
        end,
        {
          x: arrowBase.x + arrowPerpendicular.x * arrowHalfWidth,
          y: arrowBase.y + arrowPerpendicular.y * arrowHalfWidth,
        },
        {
          x: arrowBase.x - arrowPerpendicular.x * arrowHalfWidth,
          y: arrowBase.y - arrowPerpendicular.y * arrowHalfWidth,
        },
      ].map(pointText).join(" ")
    : null;

  return {
    arrowPoints,
    controlPoints: {
      end,
      first: firstControl,
      second: secondControl,
      start,
    },
    end,
    labelX: format(label.x),
    labelY: format(label.y),
    path: `M ${format(start.x)} ${format(start.y)} C ${format(firstControl.x)} ${format(firstControl.y)}, ${format(secondControl.x)} ${format(secondControl.y)}, ${format(end.x)} ${format(end.y)}`,
  };
}

export function createNodeRoutedEdgeGeometry(
  source: EdgeRouteNode,
  target: EdgeRouteNode,
  routeOffset: number,
  directed: boolean,
  arrowSize?: number,
): RoutedEdgeGeometry {
  const sides = getEdgeHandleSides(source, target);
  return createRoutedEdgeGeometry({
    arrowSize,
    directed,
    routeOffset,
    source: circleEdgePoint(source, sides.source),
    sourceDirection: sideDirection(sides.source),
    target: circleEdgePoint(target, sides.target),
    targetDirection: sideDirection(sides.target),
  });
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function routingCell(value: number): number {
  return Math.floor(value / ROUTING_CELL_SIZE);
}

function routingCellKey(column: number, row: number): string {
  return `${column}:${row}`;
}

function createRoutingIndex(
  nodes: readonly EdgeRouteNode[],
): ReadonlyMap<string, readonly EdgeRouteNode[]> {
  const index = new Map<string, EdgeRouteNode[]>();
  for (const node of nodes) {
    const key = routingCellKey(routingCell(node.x), routingCell(node.y));
    const cell = index.get(key);
    if (cell) cell.push(node);
    else index.set(key, [node]);
  }
  return index;
}

function nearbyObstacles(
  source: EdgeRouteNode,
  target: EdgeRouteNode,
  index: ReadonlyMap<string, readonly EdgeRouteNode[]>,
): readonly EdgeRouteNode[] {
  const distance = Math.hypot(target.x - source.x, target.y - source.y);
  const steps = Math.max(1, Math.ceil(distance / (ROUTING_CELL_SIZE * 0.65)));
  const found = new Map<string, EdgeRouteNode>();
  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const x = source.x + (target.x - source.x) * progress;
    const y = source.y + (target.y - source.y) * progress;
    const column = routingCell(x);
    const row = routingCell(y);
    for (let columnOffset = -2; columnOffset <= 2; columnOffset += 1) {
      for (let rowOffset = -2; rowOffset <= 2; rowOffset += 1) {
        const cell = index.get(routingCellKey(column + columnOffset, row + rowOffset));
        if (!cell) continue;
        for (const node of cell) {
          if (node.id !== source.id && node.id !== target.id) found.set(node.id, node);
        }
      }
    }
  }
  return [...found.values()];
}

function geometryCollisionScore(
  geometry: RoutedEdgeGeometry,
  obstacles: readonly EdgeRouteNode[],
): number {
  if (obstacles.length === 0) return 0;
  const { start, first, second, end } = geometry.controlPoints;
  const controlLength =
    Math.hypot(first.x - start.x, first.y - start.y) +
    Math.hypot(second.x - first.x, second.y - first.y) +
    Math.hypot(end.x - second.x, end.y - second.y);
  const steps = Math.max(16, Math.min(72, Math.ceil(controlLength / 18)));
  let collisions = 0;
  let penetration = 0;
  for (const obstacle of obstacles) {
    let minimumDistance = Number.POSITIVE_INFINITY;
    for (let step = 1; step < steps; step += 1) {
      const point = cubicPoint(start, first, second, end, step / steps);
      minimumDistance = Math.min(
        minimumDistance,
        Math.hypot(point.x - obstacle.x, point.y - obstacle.y),
      );
    }
    const clearance = obstacle.radius + ROUTING_CLEARANCE;
    if (minimumDistance < clearance) {
      collisions += 1;
      penetration += clearance - minimumDistance;
    }
  }
  return collisions * 100_000 + penetration * 100;
}

function routeCandidates(baseOffset: number, preferredDirection: 1 | -1): readonly number[] {
  return [
    baseOffset,
    ...ROUTING_DETOURS.flatMap((detour) => [
      baseOffset + detour * preferredDirection,
      baseOffset - detour * preferredDirection,
    ]),
  ];
}

export function getCollisionAwareRouteOffsets(
  relationships: readonly EdgeRouteRelationship[],
  nodes: readonly EdgeRouteNode[],
): ReadonlyMap<string, number> {
  const baseOffsets = getRelationshipRouteOffsets(relationships);
  const nodesById = new Map(nodes.map((node) => [node.id, node] as const));
  const routingIndex = createRoutingIndex(nodes);
  const offsets = new Map<string, number>();
  const laneOffsets = new Map<string, number>();

  for (const relationship of relationships) {
    const source = nodesById.get(relationship.source);
    const target = nodesById.get(relationship.target);
    const baseOffset = baseOffsets.get(relationship.id) ?? 0;
    if (!source || !target) {
      offsets.set(relationship.id, baseOffset);
      continue;
    }
    const laneKey = directionKey(relationship);
    const existingLane = laneOffsets.get(laneKey);
    if (existingLane !== undefined) {
      offsets.set(relationship.id, existingLane + baseOffset);
      continue;
    }
    const obstacles = nearbyObstacles(source, target, routingIndex);
    if (obstacles.length === 0) {
      laneOffsets.set(laneKey, 0);
      offsets.set(relationship.id, baseOffset);
      continue;
    }

    const preferredDirection = hashString(pairKey(relationship)) % 2 === 0 ? 1 : -1;
    let bestOffset = 0;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const candidate of routeCandidates(0, preferredDirection)) {
      const geometry = createNodeRoutedEdgeGeometry(
        source,
        target,
        candidate,
        relationship.directed !== false,
      );
      const collisionScore = geometryCollisionScore(geometry, obstacles);
      const score = collisionScore + Math.abs(candidate) * 2.1;
      if (score < bestScore) {
        bestScore = score;
        bestOffset = candidate;
      }
      if (collisionScore === 0 && candidate === 0) break;
    }
    laneOffsets.set(laneKey, bestOffset);
    offsets.set(relationship.id, bestOffset + baseOffset);
  }
  return offsets;
}
