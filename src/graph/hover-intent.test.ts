import assert from "node:assert/strict";
import test from "node:test";

import { createGraphHoverIntent } from "./hover-intent";
import type { GraphSelection } from "./model";

function createScheduler() {
  let nextId = 0;
  const tasks = new Map<number, () => void>();
  return {
    scheduler: {
      clear(id: unknown) {
        tasks.delete(id as number);
      },
      set(callback: () => void) {
        const id = ++nextId;
        tasks.set(id, callback);
        return id;
      },
    },
    flush() {
      const pending = [...tasks.values()];
      tasks.clear();
      for (const task of pending) task();
    },
  };
}

test("relationship re-entry cancels a transient hover leave", () => {
  const changes: GraphSelection[] = [];
  const { scheduler, flush } = createScheduler();
  const intent = createGraphHoverIntent((selection) => changes.push(selection), 80, scheduler);
  const relationship = { kind: "relationship", id: "checkout-payments" } as const;

  intent.enter(relationship);
  intent.leave();
  intent.enter(relationship);
  flush();

  assert.deepEqual(changes, [relationship, relationship]);
});

test("a deliberate hover exit clears after the grace period", () => {
  const changes: GraphSelection[] = [];
  const { scheduler, flush } = createScheduler();
  const intent = createGraphHoverIntent((selection) => changes.push(selection), 80, scheduler);
  const node = { kind: "node", id: "checkout" } as const;

  intent.enter(node);
  intent.leave();
  assert.deepEqual(changes, [node]);

  flush();
  assert.deepEqual(changes, [node, null]);
});
