import assert from "node:assert/strict";
import test from "node:test";

import { createGraphFocusContext } from "./focus-context";
import type { GraphRenderRelationship } from "./lod";

const relationships: readonly GraphRenderRelationship[] = [
  {
    count: 1,
    directed: true,
    id: "checkout-payments",
    kind: "relationship",
    matched: true,
    matchedCount: 1,
    relationship: {
      id: "checkout-payments",
      source: "checkout",
      target: "payments",
      type: "CALLS",
    },
    source: "checkout",
    target: "payments",
    types: ["CALLS"],
  },
  {
    count: 1,
    directed: true,
    id: "payments-ledger",
    kind: "relationship",
    matched: true,
    matchedCount: 1,
    relationship: {
      id: "payments-ledger",
      source: "payments",
      target: "ledger",
      type: "WRITES_TO",
    },
    source: "payments",
    target: "ledger",
    types: ["WRITES_TO"],
  },
];

test("node focus isolates its one-hop neighborhood and incident relationships", () => {
  const context = createGraphFocusContext(relationships, { kind: "node", id: "payments" });

  assert.deepEqual([...context.nodeIds].sort(), ["checkout", "ledger", "payments"]);
  assert.deepEqual([...context.relationshipIds].sort(), ["checkout-payments", "payments-ledger"]);
});

test("relationship focus isolates only the relationship and its endpoints", () => {
  const context = createGraphFocusContext(relationships, {
    kind: "relationship",
    id: "checkout-payments",
  });

  assert.deepEqual([...context.nodeIds].sort(), ["checkout", "payments"]);
  assert.deepEqual([...context.relationshipIds], ["checkout-payments"]);
});

test("high-degree node focus caps visible labels without hiding its connections", () => {
  const manyRelationships: readonly GraphRenderRelationship[] = Array.from(
    { length: 14 },
    (_, index) => ({
      count: 1,
      directed: true,
      id: `hub-service-${index}`,
      kind: "relationship",
      matched: true,
      matchedCount: 1,
      relationship: {
        id: `hub-service-${index}`,
        source: "hub",
        target: `service-${index}`,
        type: "CALLS",
      },
      source: "hub",
      target: `service-${index}`,
      types: ["CALLS"],
    }),
  );

  const context = createGraphFocusContext(manyRelationships, { kind: "node", id: "hub" });

  assert.equal(context.relationshipIds.size, 14);
  assert.equal(context.labeledRelationshipIds.size, 8);
  assert.equal(context.labeledNodeIds.size, 9);
});
