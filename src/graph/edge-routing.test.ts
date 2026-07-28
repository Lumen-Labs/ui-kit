import assert from "node:assert/strict";
import test from "node:test";

import {
  createRoutedEdgeGeometry,
  getCollisionAwareRouteOffsets,
  getEdgeHandleSides,
  getRelationshipRouteOffsets,
} from "./edge-routing";

test("single relationships use the direct route", () => {
  const offsets = getRelationshipRouteOffsets([
    { id: "checkout-ledger", source: "checkout", target: "ledger" },
  ]);

  assert.equal(offsets.get("checkout-ledger"), 0);
});

test("parallel and reciprocal relationships receive stable separated routes", () => {
  const relationships = [
    { id: "writes", source: "checkout", target: "ledger" },
    { id: "reads", source: "checkout", target: "ledger" },
    { id: "reports", source: "ledger", target: "checkout" },
  ] as const;

  const first = getRelationshipRouteOffsets(relationships);
  const second = getRelationshipRouteOffsets([...relationships].reverse());

  assert.notEqual(first.get("writes"), first.get("reads"));
  assert.ok((first.get("reports") ?? 0) > 0);
  assert.deepEqual([...first.entries()].sort(), [...second.entries()].sort());
});

test("directed edge geometry stops before the node and draws a compact arrow", () => {
  const geometry = createRoutedEdgeGeometry({
    directed: true,
    routeOffset: 0,
    source: { x: 100, y: 120 },
    sourceDirection: { x: 1, y: 0 },
    target: { x: 300, y: 120 },
    targetDirection: { x: -1, y: 0 },
  });

  assert.match(geometry.path, /^M 102 120 C /);
  assert.equal(geometry.end.x, 291);
  assert.equal(geometry.end.y, 120);
  assert.ok(geometry.arrowPoints);
  assert.ok((geometry.arrowPoints?.split(" ").length ?? 0) === 3);
});

test("route offsets bend otherwise overlapping paths and move their labels", () => {
  const direct = createRoutedEdgeGeometry({
    directed: false,
    routeOffset: 0,
    source: { x: 80, y: 100 },
    sourceDirection: { x: 1, y: 0 },
    target: { x: 280, y: 100 },
    targetDirection: { x: -1, y: 0 },
  });
  const routed = createRoutedEdgeGeometry({
    directed: false,
    routeOffset: 24,
    source: { x: 80, y: 100 },
    sourceDirection: { x: 1, y: 0 },
    target: { x: 280, y: 100 },
    targetDirection: { x: -1, y: 0 },
  });

  assert.notEqual(routed.path, direct.path);
  assert.notEqual(routed.labelY, direct.labelY);
  assert.equal(routed.arrowPoints, null);
});

test("relationships attach to the nearest horizontal or vertical node sides", () => {
  assert.deepEqual(
    getEdgeHandleSides({ x: 40, y: 60 }, { x: 240, y: 80 }),
    { source: "right", target: "left" },
  );
  assert.deepEqual(
    getEdgeHandleSides({ x: 240, y: 80 }, { x: 40, y: 60 }),
    { source: "left", target: "right" },
  );
  assert.deepEqual(
    getEdgeHandleSides({ x: 80, y: 40 }, { x: 60, y: 240 }),
    { source: "bottom", target: "top" },
  );
  assert.deepEqual(
    getEdgeHandleSides({ x: 60, y: 240 }, { x: 80, y: 40 }),
    { source: "top", target: "bottom" },
  );
});

test("clear relationships keep their direct route", () => {
  const offsets = getCollisionAwareRouteOffsets(
    [{ id: "direct", source: "source", target: "target" }],
    [
      { id: "source", x: 0, y: 0, radius: 24 },
      { id: "target", x: 300, y: 0, radius: 24 },
      { id: "clear", x: 150, y: 120, radius: 32 },
    ],
  );

  assert.equal(offsets.get("direct"), 0);
});

test("relationships detour deterministically around intervening nodes", () => {
  const relationships = [
    { id: "source-target", source: "source", target: "target" },
  ] as const;
  const nodes = [
    { id: "source", x: 0, y: 0, radius: 24 },
    { id: "blocking", x: 150, y: 0, radius: 42 },
    { id: "target", x: 300, y: 0, radius: 24 },
  ] as const;

  const first = getCollisionAwareRouteOffsets(relationships, nodes);
  const second = getCollisionAwareRouteOffsets(relationships, [...nodes].reverse());

  assert.ok(Math.abs(first.get("source-target") ?? 0) >= 72);
  assert.equal(first.get("source-target"), second.get("source-target"));
});

test("parallel relationships share a collision-free lane without overlapping", () => {
  const offsets = getCollisionAwareRouteOffsets(
    [
      { id: "alpha", source: "source", target: "target" },
      { id: "beta", source: "source", target: "target" },
    ],
    [
      { id: "source", x: 0, y: 0, radius: 24 },
      { id: "blocking", x: 150, y: 0, radius: 42 },
      { id: "target", x: 300, y: 0, radius: 24 },
    ],
  );

  assert.notEqual(offsets.get("alpha"), offsets.get("beta"));
  assert.ok(Math.sign(offsets.get("alpha") ?? 0) === Math.sign(offsets.get("beta") ?? 0));
});
