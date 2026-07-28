import assert from "node:assert/strict";
import test from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { countGraphFacetValues, filterGraphFacetOptions } from "./graph-facets";
import {
  GraphFacetPanel,
  GraphKeyboardHelp,
} from "./graph-filters";

test("facet helpers count source values and filter locally without changing graph state", () => {
  const counts = countGraphFacetValues(
    [
      { id: "api", label: "API", labels: ["Service", "Critical", "Service"] },
      { id: "worker", label: "Worker", labels: ["Service"] },
    ],
    [
      { id: "calls", source: "api", target: "worker", type: "CALLS" },
      { id: "retries", source: "worker", target: "api", type: "RETRIES" },
    ],
  );

  assert.equal(counts.nodeLabels.get("Service"), 2);
  assert.equal(counts.nodeLabels.get("Critical"), 1);
  assert.equal(counts.relationshipTypes.get("CALLS"), 1);
  assert.deepEqual(
    filterGraphFacetOptions(["Database", "Gateway", "Service"], "way"),
    ["Gateway"],
  );
});

test("node-label facet panel presents dense enterprise filter structure", () => {
  const html = renderToStaticMarkup(
    <GraphFacetPanel
      kind="node-label"
      options={["Database", "Gateway", "Service"]}
      selected={["Database", "Service"]}
      counts={new Map([["Database", 12], ["Gateway", 4], ["Service", 28]])}
      onChange={() => {}}
    />,
  );

  assert.match(html, /data-slot="graph-facet-panel"/);
  assert.match(html, /aria-label="Search node labels"/);
  assert.match(html, /Node labels/);
  assert.match(html, /Match any selected label/);
  assert.match(html, /data-selected="true"/);
  assert.match(html, /graph-filter__option-count[^>]*>28</);
  assert.match(html, /2 of 3 selected/);
  assert.match(html, /aria-label="Clear node label filters"/);
});

test("keyboard help describes the complete graph command model", () => {
  const html = renderToStaticMarkup(<GraphKeyboardHelp />);

  assert.match(html, /Graph keyboard shortcuts/);
  assert.match(html, /Arrow keys/);
  assert.match(html, /Shift \+ Arrow/);
  assert.match(html, /Enter or Space/);
  assert.match(html, /Escape/);
});

test("relationship facet panel distinguishes connection types without color alone", () => {
  const html = renderToStaticMarkup(
    <GraphFacetPanel
      kind="relationship-type"
      options={["CALLS", "READS_FROM", "WRITES_TO"]}
      selected={[]}
      onChange={() => {}}
    />,
  );

  assert.match(html, /Relationship types/);
  assert.match(html, /Match any selected relationship type/);
  assert.match(html, /aria-label="Search relationship types"/);
  assert.match(html, /graph-filter__option-marker--relationship/);
  assert.match(html, /0 of 3 selected/);
  assert.match(html, /aria-label="Clear relationship type filters"/);
});
