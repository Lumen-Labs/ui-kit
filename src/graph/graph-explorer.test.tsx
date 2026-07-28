import assert from "node:assert/strict";
import test from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { GraphExplorer, GraphInspector } from "./index";
import type {
  GraphFilterState,
  GraphNode,
  GraphRelationship,
  GraphSelection,
} from "./model";

const nodes: readonly GraphNode[] = [
  {
    id: "checkout",
    label: "Checkout API",
    labels: ["Service", "Critical"],
    description: "Creates and prices customer orders.",
    properties: { owner: "Commerce", replicas: 6 },
  },
  {
    id: "ledger",
    label: "Ledger database",
    labels: ["Database"],
  },
];

const relationships: readonly GraphRelationship[] = [
  {
    id: "checkout-ledger",
    source: "checkout",
    target: "ledger",
    type: "WRITES_TO",
    properties: { encrypted: true },
  },
];

const filterState: GraphFilterState = {
  query: "",
  nodeLabels: [],
  relationshipTypes: [],
};

test("GraphInspector exposes selected node labels and properties as structured details", () => {
  const html = renderToStaticMarkup(
    <GraphInspector
      nodes={nodes}
      relationships={relationships}
      selection={{ kind: "node", id: "checkout" }}
      onClose={() => {}}
    />,
  );

  assert.match(html, /data-slot="graph-inspector"/);
  assert.match(html, /Checkout API/);
  assert.match(html, /Creates and prices customer orders/);
  assert.match(html, /aria-label="Node labels"/);
  assert.match(html, /<dt>owner<\/dt><dd>Commerce<\/dd>/);
  assert.match(html, /aria-label="Close graph inspector"/);
});

test("GraphInspector describes relationship direction and properties", () => {
  const html = renderToStaticMarkup(
    <GraphInspector
      nodes={nodes}
      relationships={relationships}
      selection={{ kind: "relationship", id: "checkout-ledger" }}
      onClose={() => {}}
    />,
  );

  assert.match(html, /WRITES_TO/);
  assert.match(html, /Checkout API/);
  assert.match(html, /Ledger database/);
  assert.match(html, /<dt>encrypted<\/dt><dd>true<\/dd>/);
});

test("GraphExplorer renders a named toolbar, live match summary, and graph canvas", () => {
  const selection: GraphSelection = null;
  const html = renderToStaticMarkup(
    <GraphExplorer
      ariaLabel="Service dependency graph"
      nodes={nodes}
      relationships={relationships}
      filterState={filterState}
      onFilterStateChange={() => {}}
      selection={selection}
      onSelectionChange={() => {}}
    />,
  );

  assert.match(html, /data-slot="graph-explorer"/);
  assert.match(html, /aria-label="Graph filters"/);
  assert.match(html, /aria-label="Search graph"/);
  assert.match(html, /aria-label="Open graph filters"/);
  assert.match(html, /Node labels/);
  assert.match(html, /Relationship types/);
  assert.match(html, /role="status"[^>]*>2 of 2 nodes · 1 of 1 relationships/);
  assert.doesNotMatch(html, />Clear filters<\/button>/);
  assert.match(html, /aria-label="Service dependency graph"/);
  assert.match(html, /aria-label="Zoom in"/);
  assert.match(html, /aria-label="Zoom out"/);
  assert.match(html, /aria-label="Fit graph"/);
  assert.match(html, /disabled=""[^>]*aria-label="Center selected entity"/);
  assert.match(html, /aria-label="Reflow graph"/);
  assert.match(html, /aria-label="Pause graph physics"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-label="Hide minimap"/);
  assert.match(html, /aria-label="Expand graph"/);
  assert.match(html, /aria-label="Show keyboard shortcuts"/);
  assert.match(html, /aria-label="Show graph legend"/);
  assert.match(html, /data-detail-level="detail"/);
  assert.doesNotMatch(html, /aria-busy="true"/);
});

test("GraphExplorer exposes controlled physics state without changing the graph records", () => {
  const html = renderToStaticMarkup(
    <GraphExplorer
      ariaLabel="Static dependency graph"
      nodes={nodes}
      relationships={relationships}
      filterState={filterState}
      onFilterStateChange={() => {}}
      selection={null}
      onSelectionChange={() => {}}
      physicsEnabled={false}
      onPhysicsEnabledChange={() => {}}
    />,
  );

  assert.match(html, /aria-label="Resume graph physics"/);
  assert.match(html, /aria-pressed="false"/);
});

test("GraphExplorer gives search and facet actions one shared toolbar height", () => {
  const html = renderToStaticMarkup(
    <GraphExplorer
      ariaLabel="Service dependency graph"
      nodes={nodes}
      relationships={relationships}
      filterState={filterState}
      onFilterStateChange={() => {}}
      selection={null}
      onSelectionChange={() => {}}
    />,
  );

  const search = html.match(/<input[^>]*aria-label="Search graph"[^>]*>/)?.[0] ?? "";
  const nodeFacet = html.match(/<button[^>]*aria-label="Node labels: all values"[^>]*>/)?.[0] ?? "";
  const relationshipFacet = html.match(/<button[^>]*aria-label="Relationship types: all values"[^>]*>/)?.[0] ?? "";
  const mobileFilters = html.match(/<button[^>]*aria-label="Open graph filters"[^>]*>/)?.[0] ?? "";

  for (const control of [search, nodeFacet, relationshipFacet, mobileFilters]) {
    assert.match(control, /graph-filter__toolbar-control/);
  }
});

test("GraphExplorer removes the minimap and its toggle when showMiniMap is false", () => {
  const html = renderToStaticMarkup(
    <GraphExplorer
      ariaLabel="Service dependency graph"
      nodes={nodes}
      relationships={relationships}
      filterState={filterState}
      onFilterStateChange={() => {}}
      selection={null}
      onSelectionChange={() => {}}
      showMiniMap={false}
    />,
  );

  assert.doesNotMatch(html, /aria-label="Graph overview"/);
  assert.doesNotMatch(html, /aria-label="Hide minimap"/);
  assert.doesNotMatch(html, /aria-label="Show minimap"/);
});

test("GraphExplorer shows clear filters only when filters are applied", () => {
  const html = renderToStaticMarkup(
    <GraphExplorer
      ariaLabel="Filtered dependency graph"
      nodes={nodes}
      relationships={relationships}
      filterState={{ ...filterState, nodeLabels: ["Service"] }}
      onFilterStateChange={() => {}}
      selection={null}
      onSelectionChange={() => {}}
    />,
  );

  assert.match(html, />Applied filters<\/span>/);
  assert.match(html, /Label: Service/);
  assert.match(html, />Clear filters<\/button>/);
  assert.match(html, /aria-label="Edit graph filters"/);
  assert.match(html, /aria-label="Clear graph filters"/);
});

test("GraphExplorer starts large datasets in a worker-backed semantic overview", () => {
  const denseNodes: readonly GraphNode[] = Array.from({ length: 250 }, (_, index) => ({
    id: `node-${index}`,
    label: `Service ${index}`,
    labels: [index % 2 === 0 ? "Service" : "Database"],
  }));

  const html = renderToStaticMarkup(
    <GraphExplorer
      ariaLabel="Dense dependency graph"
      nodes={denseNodes}
      relationships={[]}
      filterState={filterState}
      onFilterStateChange={() => {}}
      selection={null}
      onSelectionChange={() => {}}
      performance={{
        workerThreshold: 200,
        clustering: { minimumNodeCount: 200, targetRenderedNodes: 80 },
      }}
    />,
  );

  assert.match(html, /data-detail-level="overview"/);
  assert.match(html, /data-layout-status="loading"/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /aria-label="Dense dependency graph"/);
});
