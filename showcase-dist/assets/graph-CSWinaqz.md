# Lumen Relationship Graph

`GraphExplorer` is a read-only client-side relationship explorer for React and Next.js. It keeps application-owned records, controlled filters and selection, responsive inspection, Lumen palettes, semantic zoom, and accessible keyboard navigation while rendering and simulating through vis-network Canvas2D. It does not query Neo4j, execute Cypher, authorize records, persist positions, or edit graph data.

## Install and import

The adapter is isolated from Lumen core. Install its optional peers only in graph-consuming applications:

```bash
npm install lumen-ui-kit @carbon/icons-react@^11.84 vis-network@^10 vis-data@^8 graphology@^0.26 graphology-layout-forceatlas2@^0.10 graphology-layout-noverlap@^0.4 graphology-communities-louvain@^2
```

Import both stylesheets once:

```css
@import "lumen-ui-kit/styles.css";
@import "lumen-ui-kit/graph/styles.css";
```

Use a small Client Component. Keep fetching, authorization, record limits, and normalization on the server, then pass serializable graph records across the boundary.

```tsx
"use client";

import * as React from "react";
import {
  GraphExplorer,
  type GraphFilterState,
  type GraphNode,
  type GraphRelationship,
  type GraphSelection,
} from "lumen-ui-kit/graph";

export function DependencyGraph({
  nodes,
  relationships,
}: {
  nodes: readonly GraphNode[];
  relationships: readonly GraphRelationship[];
}) {
  const [filterState, setFilterState] = React.useState<GraphFilterState>({
    query: "",
    nodeLabels: [],
    relationshipTypes: [],
  });
  const [selection, setSelection] = React.useState<GraphSelection>(null);
  const [physicsEnabled, setPhysicsEnabled] = React.useState(true);

  return (
    <GraphExplorer
      ariaLabel="Service dependency graph"
      nodes={nodes}
      relationships={relationships}
      filterState={filterState}
      selection={selection}
      physicsEnabled={physicsEnabled}
      onFilterStateChange={setFilterState}
      onSelectionChange={setSelection}
      onPhysicsEnabledChange={setPhysicsEnabled}
    />
  );
}
```

## Controlled contract

- `filterState` and `selection` remain controlled.
- Physics is uncontrolled by default and starts enabled. Use `defaultPhysicsEnabled` for an alternate initial state, or pair `physicsEnabled` with `onPhysicsEnabledChange` for controlled state.
- `onNodePositionChange` reports pointer and Shift+Arrow moves for source nodes. Every rendered node, including semantic clusters, can be moved and pinned; presentational cluster IDs remain internal and are not emitted through the callback.
- `renderInspector` replaces the default inspector while retaining the desktop panel and compact Drawer contract.
- `showMiniMap` defaults to true. Passing `false` removes the minimap and its control.
- `performance={false}` disables adaptive clustering but retains the Canvas2D renderer.
- `performance.layout.quality` maps to 100, 200, or 400 stabilization iterations. `collisionPadding` maps to vis-network overlap avoidance; the default 12 resolves to `avoidOverlap: 0.5`.
- Supplied positions are fixed on initial render. Reflow intentionally clears supplied and dragged positions and calculates a new arrangement.
- Do not expose vis-network, Graphology, cluster records, or aggregate relationships through application state. Cluster IDs are presentational.

## Physics and visual model

The balanced default matches the BrainAPI console reference:

```ts
{
  solver: "forceAtlas2Based",
  gravitationalConstant: -50,
  centralGravity: 0.01,
  springLength: 160,
  springConstant: 0.08,
  damping: 0.4,
  avoidOverlap: 0.5,
  stabilization: { enabled: true, iterations: 200, updateInterval: 25 },
  layout: { improvedLayout: true },
}
```

Nodes are filled with semantic category colors and retain text category cues. Individual nodes use a 22px dot, selected nodes gain size and border emphasis, and clusters scale sublinearly with member count. Directed relationships keep visible target arrows and stable curved lanes; active relationships gain contrast and labels. Labels are suppressed while visually impractical at low zoom, but accessible names and the searchable legend remain available.

Automatic nodes enter the retained Network without Lumen-authored coordinates. Lumen stages the initial records after the canvas is mounted so vis-network's live ForceAtlas2 movement is visible, then performs the same settled fit used by the BrainAPI reference; supplied positions remain fixed. At detail zoom, the compact Louvain partition provides topology-aware spring lengths: relationships inside a community settle closer while bridges remain longer. Expanding a semantic cluster seeds its children around the live parent center, so zooming in reveals a coherent neighborhood instead of redistributing members across the canvas. These community springs and inheritance rules are original Lumen behavior layered over the shared BrainAPI physics preset.

Filtering, hovering, selection, palette changes, minimap visibility, and expanded view update retained `DataSet` records and never restart physics. Topology changes, Reflow, and explicit physics activation may restart stabilization. Reduced motion replaces the visible live settle with immediate stabilization and removes camera animation.

## Workbench and semantic zoom

The joined command bar contains search, Node and Relationship facets, applied filters, and live result counts. The right-side rail contains Zoom, Fit, Center selection, Reflow, Physics, minimap, legend, keyboard help, and expanded view. Below 768px, facets use the focus-managed Filters Drawer and secondary tools move into overflow.

From 150 nodes, Lumen begins in semantic overview:

- overview: at most 60 community nodes and 90 aggregate relationships;
- compact: at most 180 communities and 360 aggregate relationships;
- detail: every original node and relationship, including 1,000–5,000-node datasets.

A deterministic weighted projection feeds Louvain in a cancellable module worker. Only numeric endpoints and category hashes cross the worker boundary; labels, descriptions, properties, and live coordinates stay on the main thread. vis-network owns live positions and physics. Position caches for overview, compact, and detail preserve spatial continuity while the mounted Network, filters, selection, and camera remain intact.

## Interaction and accessibility

The canvas is one named keyboard stop with `aria-activedescendant` and one hidden active-entity description rather than one DOM element per graph record.

- Arrow keys move the virtual cursor to the nearest rendered entity.
- Shift+Arrow repositions and pins the active rendered node or semantic cluster.
- Enter or Space selects an entity or expands a cluster/aggregate relationship.
- Escape clears selection.
- Pointer users can pan, zoom, drag every visible node or cluster, Fit, Center, Reflow, and pause or resume physics.
- Hover updates only affected `DataSet` records and does not cause React commits.
- The inspector joins at 1024px and becomes a focus-managed Drawer below it.
- Every icon-only viewport action has an accessible name and tooltip.
- Canvas initialization failure produces an accessible filtered-results fallback.

Verify keyboard-only use, focus restoration, 200% zoom, 320px reflow, touch, high contrast, reduced motion, and Lumen light, Lumen dark, and Brainapi.

## Performance and provenance

The showcase includes 14, 250, 1,000, and 5,000-node graphs. At detail zoom, every entity is drawn on Canvas2D without creating a DOM node per entity. Prefer stable node and relationship arrays, application-bounded subgraphs, and persisted positions for repeatedly visited dense datasets.

The renderer and physics treatment are original Lumen integration work informed by the separate BrainAPI console's vis-network configuration. No BrainAPI application state, queries, backend behavior, assets, or source code are distributed. vis-network and vis-data are separately installed under their upstream Apache-2.0-or-MIT licensing terms. Graphology Louvain remains the community engine; ForceAtlas2 and Noverlap remain installed for Lumen's public pure layout helpers.

- [vis-network documentation](https://visjs.github.io/vis-network/docs/network/)
- [vis-network repository](https://github.com/visjs/vis-network)
- [Graphology Louvain](https://graphology.github.io/standard-library/communities-louvain.html)
- [Neo4j Explore visual tour](https://neo4j.com/docs/desktop/current/explore/)
- [Neo4j NVL license](https://neo4j.com/docs/reference/license/nvl/)
