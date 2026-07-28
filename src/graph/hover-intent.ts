import type { GraphSelection } from "./model";

export interface GraphHoverScheduler {
  clear: (id: unknown) => void;
  set: (callback: () => void, delay: number) => unknown;
}

export interface GraphHoverIntent {
  cancel: () => void;
  enter: (selection: Exclude<GraphSelection, null>) => void;
  leave: () => void;
}

const browserScheduler: GraphHoverScheduler = {
  clear: (id) => window.clearTimeout(id as number),
  set: (callback, delay) => window.setTimeout(callback, delay),
};

export function createGraphHoverIntent(
  onChange: (selection: GraphSelection) => void,
  delay = 64,
  scheduler: GraphHoverScheduler = browserScheduler,
): GraphHoverIntent {
  let pending: unknown;
  return {
    cancel() {
      if (pending !== undefined) scheduler.clear(pending);
      pending = undefined;
    },
    enter(selection) {
      if (pending !== undefined) scheduler.clear(pending);
      pending = undefined;
      onChange(selection);
    },
    leave() {
      if (pending !== undefined) scheduler.clear(pending);
      pending = scheduler.set(() => {
        pending = undefined;
        onChange(null);
      }, delay);
    },
  };
}
