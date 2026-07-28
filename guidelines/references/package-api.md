# Lumen Package API

Use this reference when a repository contains a local `ui-kit/` package or depends on `lumen-ui-kit`.

## Entrypoints

- `lumen-ui-kit`: accessible controls, content patterns, global header and shell composition, side navigation, page layout, dialog composition, and `cn`.
- `lumen-ui-kit/next`: `NextLink` and `NextLinkButton`.
- `lumen-ui-kit/icons`: the accessible `Icon` adapter and curated product icon aliases. This entrypoint requires the optional `@carbon/icons-react` peer.
- `lumen-ui-kit/graph`: the client-only relationship explorer, inspector, graph and performance contracts, and pure normalization, layout, facet, matching, semantic-zoom, and tone helpers. This entrypoint requires the optional vis-network, vis-data, and Graphology peers listed in `GRAPH.md`.
- `lumen-ui-kit/graph/styles.css`: palette-aware Canvas2D graph chrome and responsive inspector styling.
- `lumen-ui-kit/styles.css`: Tailwind CSS 4 theme variables, light/dark semantic custom properties, and the opt-in Brainapi palette.
- `lumen-ui-kit/tokens`: stable-format DTCG JSON.

The package also ships `CATALOG.md`, which is authoritative for normalized source-system names, implemented primitives, composed recipes, deprecated aliases, and specialist integration boundaries. Read it before adding a new foundational component. Read `LAYOUT.md` before composing application headers, sidebars, page headers, content regions, or responsive shell behavior. Read `DATA-DISPLAY.md` before building toolbars, resource lists, sortable or selectable tables, or specialist data-grid integrations. Read `ICONS.md` before using, extending, or licensing icons. Read `GRAPH.md` before integrating, filtering, inspecting, or extending graph data.

Import public entrypoints only. Do not reach into `src/`, `dist/components/`, or implementation files from a consuming application.

## Tailwind CSS 4

Published-package consumers register both the stylesheet and the package source in their global CSS:

```css
@import "tailwindcss";
@import "lumen-ui-kit/styles.css";
@source "../node_modules/lumen-ui-kit/dist";
```

For a local monorepo package, adjust paths to `ui-kit/src/styles.css` and `ui-kit/src`. Tailwind ignores dependency sources by default, so the explicit `@source` is required after publication.

## Palette selection

Lumen is the default palette. Set `data-lumen-palette="brainapi"` on the application root or a preview boundary to select Brainapi's fixed-dark expression. It maps the semantic primary, secondary, background, foreground, border, focus, and state variables to an accessible black, lime, and white scheme; components continue to use the same public props and semantic utilities.

Brainapi deliberately separates quiet `--lumen-color-border` dividers from `--lumen-color-control-border` interaction boundaries. Use `border-lumen-border` for structure and `border-lumen-control-border` for idle fields, choices, and bounded actions; focus and selected states continue to use the semantic primary token.

Do not use Brainapi's white `--lumen-color-secondary` directly as a button background. Lumen's `Button` maps its secondary variant to `--lumen-color-action-secondary`, `--lumen-color-action-secondary-hover`, and `--lumen-color-on-action-secondary`; in Brainapi these produce dark neutral controls with white content. Checked marks use the palette-specific `--lumen-checkbox-mark`, aligned with `--lumen-color-on-primary`.

```tsx
<div data-lumen-palette="brainapi">{children}</div>
```

Use a labeled native `Select` when exposing palette choice in a workbench or application setting. Brainapi does not offer a separate light appearance, so disable or hide a light/dark control while it is active and explain the constraint in the control's accessible name or description.

## React components

- Use `Button` for actions. It defaults to `type="button"`; set `type="submit"` deliberately. Use `isPending` and `pendingLabel` to block duplicate submission and expose busy state.
- Use `Input` as a low-level primitive only when the application owns label, description, and error associations.
- Prefer `TextField` for ordinary text controls. Provide a stable explicit `id`; the component wires its label, optional `labelMeta`, `sublabel`, persistent description, and error message without folding metadata into the accessible name.
- For custom field layouts, compose `Field`, `FieldLabelRow`, `FieldLabel`, `FieldLabelMeta`, `FieldSublabel`, the native control, `FieldDescription`, and `FieldError` in that order. Wire the label with `htmlFor` and supporting/error IDs with `aria-describedby`.
- Compose `Checkbox`, `Radio`, or `Switch` with `ChoiceField`, `ChoiceFieldLabel`, and `ChoiceFieldDescription`. Keep choice labels concise and descriptions separately associated. Use `Fieldset` and `Legend` for radio groups.
- `Select` uses `variant="default"` for ordinary form fields and `variant="ghost"` for low-chrome toolbar or contextual selection. Both variants remain native selects and preserve the shared height, padding, arrow, focus ring, disabled state, and invalid semantics.
- `CharacterCount` and `PasswordField` accept the same `labelMeta` and `sublabel` anatomy. Text-like controls and input groups share the 42px height, 14px inline padding, and 10px field radius; buttons use an 8px button radius while compact actions retain the 6px control radius.
- Use `Button` for the form action row. The default medium size remains a 44px action target beside the slightly lower 42px field shell, and all raised variants retain the package's button and pressed-shadow tokens.
- Compose `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`. Cards are noninteractive by default. Wrap related peer cards in `CardGroup` for a zero-gap boxed composition with shared seams; use its `columns` and optional `motion="stagger"` props rather than recreating border-collapse CSS locally.
- Compose `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, and `DialogClose`. The dialog entry is a Client Component because it delegates interaction and focus behavior to Radix.
- Reuse the expanded form, navigation, feedback, data, disclosure, layout, tab, menu, popover, tooltip, and drawer exports before creating local equivalents.
- Compose product chrome with `GlobalHeader`, `GlobalHeaderInner`, brand/navigation/action regions, `AppShell`, named sidebar regions, `AppShellMain`, and optional `AppShellRail`.
- `SideNav` supports its calm default plus `expression="compact"` for dense application navigation with quiet section labels, divider-free rows, subtle four-pixel corners, and an indented current indicator. Use one expression throughout a sidebar and its mobile drawer copy. The legacy `cyber-grid` value remains accepted for compatibility.
- Keep persistent header navigation and `AppShellSidebar` from 1024px upward. Below that breakpoint, compose the same destinations into the existing Radix-backed `Drawer` with a named trigger and visible close action. Keep `AppShellRail` persistent from 1280px upward and expose the same context in a compact post-content disclosure below that breakpoint.
- Use `Link` with `inline` (default), `standalone`, or `muted`. `JumpLinks` has a visible configurable title; set `current` on the active `JumpLink` to expose `aria-current="location"`.
- Use `PageContent` for readable-to-full task widths and the `PageSection` family for titled page regions. Keep route identity in the separate `PageHeader` family.
- Use `SectionStack`, `SectionBand`, `SectionBandHeader`, `SectionBandEyebrow`, `SectionBandTitle`, `SectionBandDescription`, and `SectionBandContent` when related product sections should meet at shared seams. Preserve internal insets, semantic heading order, and server rendering. `SectionBand` supports `default`, `muted`, and `accent` tones plus opt-in `motion="enter"`.
- Compose assistant entry with `PromptComposer`, `PromptComposerField`, `PromptComposerAttachments`, `PromptComposerAttachment`, `PromptComposerToolbar`, `PromptComposerControls`, `PromptComposerContextMeter`, `PromptComposerActions`, and `PromptComposerSubmit`. The compound field owns the compact glass-like 14px shell, focus treatment, auto-growing textarea, attachment band, inset control cluster, responsive utility footer, and shell-matched Send/Stop styling; the application owns draft, attachment, token estimates, model, transport, and streaming state. Pass semantic token segments to `PromptComposerContextMeter`; it opens `PromptComposerContextDetails` in the existing Radix popover and reports used, free, and reserved capacity without coupling the kit to a tokenizer. Keep Send available when either a draft or attachment exists and switch the same control to Stop while streaming.
- `Stack`, `Inline`, and `Grid` accept tokenized `gap` values: `none`, `xs`, `sm`, `md`, and `lg`. Use `none` only when child borders or backgrounds provide a deliberate connected structure.
- Compose compact control regions with `Toolbar`, `ToolbarGroup`, `ToolbarItem`, `ToolbarSeparator`, and `ToolbarSpacer`. The compound wrapper uses the 10px toolbar radius and segmented groups expose 8px outer button corners while keeping touching inner edges square. Give an ARIA toolbar an accessible name and keep actions as native buttons or links.
- Use the `ResourceList` family for title-led records with variable metadata or actions. Use a native `Table` when users need cross-row or cross-column comparison.
- Use `List` and `DescriptionList` for native structured content. `CodeBlock` owns the dark, horizontally scrollable source surface; nest `CodeToken` spans with a semantic `tone` (`comment`, `keyword`, `function`, `string`, `property`, `punctuation`, or `tag`) when formatted source is supplied by the application or a build-time highlighter.
- Add table behavior with `TableToolbar`, `TableToolbarHeader`, `TableToolbarTitle`, `TableToolbarDescription`, `TableToolbarFilters`, `TableToolbarContent`, `TableToolbarActions`, `TableAppliedFilters`, `TableFilterTag`, `TableBatchActions`, `TableSelectionCell`, `TableSortableHead`, `TableRowActions`, `TableEmptyState`, `TablePagination`, and `TableSortAnnouncement`. Keep records, filters, selection, ordering, pages, and mutations controlled by the application.
- Put search at full width below 640px, move attribute filters into a Filters popover with an applied count, and show removable applied-filter tags with a clear-all action. When selection is active, replace the filter row with restrained batch actions and a clear-selection action.
- Label focusable horizontal table containers through `Table.containerProps`. Use a maintained grid engine for virtualization, spreadsheet navigation, column resizing or reordering, editable matrices, and tree data.

## Next.js adapters

Use `NextLink` for ordinary internal navigation and `NextLinkButton` when a destination needs button presentation. Both remain links and do not add `role="button"`. Neither declares a client boundary, so they can be rendered from Server Components.

## Graph adapter

Install the graph peers only when the application uses the relationship explorer:

```bash
npm install lumen-ui-kit @carbon/icons-react@^11.84 vis-network@^10 vis-data@^8 graphology@^0.26 graphology-layout-forceatlas2@^0.10 graphology-layout-noverlap@^0.4 graphology-communities-louvain@^2
```

Import `lumen-ui-kit/graph/styles.css` after the core stylesheet and import graph APIs only from `lumen-ui-kit/graph`. The entrypoint is client-only. Keep `GraphFilterState` and `GraphSelection` controlled, preserve stable node and relationship arrays, and pass `onNodePositionChange` only when the application stores presentation positions. Physics starts enabled and may be controlled with `physicsEnabled` and `onPhysicsEnabledChange`. `GraphExplorer.performance` accepts stabilization quality, overlap padding, Louvain resolution, clustering budgets, and label thresholds; pass `false` only to disable adaptive clustering, not Canvas2D rendering.

Filtering dims rather than removes nonmatches. Values within a facet use OR; search, node-label, and relationship-type groups combine with AND. Supplied positions and pointer or Shift+Arrow moves remain pinned, including moves of semantic overview and compact clusters; cluster IDs remain private and only source-node moves invoke `onNodePositionChange`. Filtering does not restart physics, and Reflow is the explicit reset. Louvain runs in the packaged numeric-topology worker; vis-network owns live physics and positions. Automatic nodes are staged without preset coordinates for a visible initial settle, detail relationships use shorter intra-community and longer bridge springs, and semantic expansion inherits the live parent center. Reduced motion stabilizes immediately. ForceAtlas2 and Noverlap remain public pure helpers. Overview and compact modes use stable topology communities and aggregate endpoints; detail restores every source entity. Querying, authorization, persistence, pagination, and graph editing stay in the consuming application.

The enterprise workbench keeps one compact search-and-facet command bar, searchable counted facet panels, one conditional applied-filter row, a searchable node/relationship legend, and grouped viewport actions including Physics. Below a 768px container, facets move into the existing focus-managed Drawer and secondary viewport actions move into an overflow menu. `showMiniMap={false}` removes the minimap and its control; otherwise visibility is local UI state. Expanded view fixes the mounted explorer to the viewport and preserves the Network, worker, camera, filter, selection, physics, and position state.

## Icon adapter

Install `@carbon/icons-react` alongside Lumen only when the application uses icons:

```bash
npm install lumen-ui-kit @carbon/icons-react
```

```tsx
import { Button } from "lumen-ui-kit";
import { AddIcon, Icon } from "lumen-ui-kit/icons";

<Button><Icon source={AddIcon} />Add report</Button>
```

Keep the child icon decorative when visible text or its containing control supplies the name. Put `aria-label` on an icon-only button or link. Use `label` only for a standalone informative `Icon`. Prefer the curated aliases; pass a directly imported Carbon source to `Icon` only for a product-specific need. This entrypoint has no `"use client"` directive and is Server-Component-compatible.

## Extension rules

- Extend `className` and documented variants before changing component internals.
- Add variants additively; do not rename or remove existing public props without a migration.
- Keep semantic `lumen-*` utilities and CSS variables at component call sites.
- Keep Next.js-specific imports behind `lumen-ui-kit/next` so React-only consumers do not require Next.js.
- Keep Carbon imports behind `lumen-ui-kit/icons` so consumers that do not render icons do not require the optional peer.
- Keep vis-network, vis-data, and Graphology imports behind `lumen-ui-kit/graph` so core consumers do not load graph code or CSS.
- Test components in the consuming application's actual content and interaction context; the package alone does not guarantee accessibility conformance.
