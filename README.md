# Lumen UI Kit

Project-agnostic React components, Tailwind CSS 4 theme tokens, and Next.js adapters for product interfaces. The package currently lives in this repository and is shaped for extraction to `lumen-ui-kit` later.

## Components

- `Button`: native 44px default action control with primary, secondary, tertiary, ghost, and danger variants, pending state, and preserved raised/pressed depth.
- `Input` and `TextField`: softly rounded 42px input surfaces with balanced 14px inline padding, plus accessible label metadata, sublabel, persistent description, and error wiring.
- `Card`: composable, noninteractive content surface.
- `Dialog`: Radix-backed modal primitives with focus management, background blocking, Escape dismissal, focus restoration, labeling primitives, and an accessible close control.
- `GlobalHeader`, `AppShell`, `SideNav`, and `PageHeader`: composable product chrome with explicit landmarks, current-location styling, named sidebar regions, and an optional contextual rail.
- `PageContent` and `PageSection`: task-appropriate content widths and semantic page-section structure.
- `SectionStack` and `SectionBand`: contiguous product sections with shared seams, responsive insets, and opt-in accessible motion.
- `CardGroup` and tokenized layout gaps: connected boxes and zero-gap grids with optional reduced-motion-safe entrances.
- `PromptComposer`: a compact, glass-like chat/assistant input with an auto-growing field, attachment previews, an inset model/mode/context cluster, a token-breakdown context popover, and a raised Send control whose corners match the composer shell.
- `GraphExplorer`: an optional client-only relationship workbench with a compact search/facet command bar, searchable counted filters and legend, grouped viewport controls, non-remounting expanded view, worker-backed deterministic layout, semantic zoom and clustering, accessible selection, dragging, and responsive inspection.
- `NextLink` and `NextLinkButton`: Server-Component-compatible Next.js navigation adapters.

The expanded catalog also includes application shells and side navigation,
page headers and jump links, task and summary lists, avatar groups, error
summaries, memorable-date input, character count, password visibility, input
groups, inline editing, clipboard copy, callouts, and truncation. The workbench
currently covers 233 public APIs, including complete responsive shell
compositions, resource lists, adaptive complex-table chrome, a bottom-docked
prompt composer, the optional relationship-graph adapter, and the optional
curated icon entrypoint with a rich-text formatting family.

See [CATALOG.md](CATALOG.md) for the full normalized catalog, aliases across
the source systems, and the boundary between core components, composed recipes,
and dedicated integrations. See [LAYOUT.md](LAYOUT.md) for application headers,
sidebars, page headers, responsive shells, content widths, scrolling, and
landmark guidance with complete composition examples.
See [ICONS.md](ICONS.md) for installation, the curated icon set, accessible
labelling, sizing, semantic tones, extension, and upstream licensing.
See [DATA-DISPLAY.md](DATA-DISPLAY.md) for toolbar composition, resource lists,
sortable/selectable tables, responsive overflow, empty states, and the boundary
between native tables and specialist data-grid engines.
See [GRAPH.md](GRAPH.md) for graph installation, the controlled record contract,
filter semantics, layout behavior, accessibility, performance, and provenance.
See [MCP.md](MCP.md) for the MCP server that exposes the skill, styleguides,
components, and tokens to coding agents.

## Agent access

Coding agents can browse this kit over the Model Context Protocol:

```bash
npm run mcp
```

The server exposes the Lumen skill and styleguides, every export with its props
and real workbench examples, and the design tokens. It derives all of that from
the repository at call time, so it stays current as the kit changes. For a
shared, supervised instance there is an authenticated HTTP transport and a pm2
config. See [MCP.md](MCP.md) for tools, resources, deployment, and client
configuration.

The workbench also offers the skill as a download. Run `npm run dev`, open the
Guidelines section, and choose **Download skill** to get
`lumen-ui-kit-skill.zip`: `SKILL.md`, its references, the token bundle, and the
source map, laid out so it unzips straight into an agent's skills directory
(for example `.claude/skills/`).

## Tailwind CSS 4 setup

Published-package consumers should add the package stylesheet and explicitly register the package as a Tailwind source because dependencies are ignored by automatic source detection:

```css
@import "tailwindcss";
@import "lumen-ui-kit/styles.css";
@source "../node_modules/lumen-ui-kit/dist";
```

While developing from this monorepo, point the imports at the package source instead:

```css
@import "tailwindcss";
@import "../../ui-kit/src/styles.css";
@source "../../ui-kit/src";
```

Adjust relative paths from the consuming global stylesheet. Import global CSS once from the application's root layout.

Use the default light theme on `:root`. Add `data-lumen-theme="dark"` to a containing element or use `.lumen-dark` for the supplied dark theme. For the fixed-dark Brainapi palette, add `data-lumen-palette="brainapi"`; it remaps semantic variables to primary `#CFFE25`, secondary `#FFFFFF`, and background `#000000`. Brainapi separates quiet structural borders (`border-lumen-border`) from accessible interactive boundaries (`border-lumen-control-border`), and keeps neutral actions dark through the action-secondary tokens rather than using white as a button fill. Marks on lime controls use the dark on-primary treatment. Code examples use explicit dark editor and syntax-role tokens in both palettes, including a near-black Brainapi canvas. Keep component markup on semantic Tailwind utilities so palette changes require no component-specific classes.

## React usage

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TextField,
} from "lumen-ui-kit";

export function ProfileForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <TextField
            id="profile-name"
            name="name"
            label="Name"
            autoComplete="name"
          />
          <Button type="submit">Save profile</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

`TextField` requires an explicit stable `id` so its label, description, and error associations are deterministic in Server and Client Components.

## Next.js usage

```tsx
import { NextLink, NextLinkButton } from "lumen-ui-kit/next";

export function ReportNavigation() {
  return (
    <nav aria-label="Report navigation" className="flex items-center gap-3">
      <NextLink href="/reports">All reports</NextLink>
      <NextLinkButton href="/reports/new">Create report</NextLinkButton>
    </nav>
  );
}
```

The Next adapters do not declare `"use client"`. The dialog module does because the underlying Radix primitive requires client-side interaction. Keep all other page and layout composition server-rendered unless the application needs state, event handlers, or browser APIs.

## Public entrypoints

- `lumen-ui-kit`: React components and utilities.
- `lumen-ui-kit/next`: Next.js link adapters. `next` is an optional peer dependency for consumers that do not use this entrypoint.
- `lumen-ui-kit/icons`: curated Carbon React icon aliases and Lumen's accessible `Icon` adapter. `@carbon/icons-react` is an optional peer dependency used only by this entrypoint.
- `lumen-ui-kit/graph`: client-only `GraphExplorer`, `GraphInspector`, graph data and performance contracts, and topology/layout helpers. vis-network, vis-data, Graphology, Louvain, ForceAtlas2, and Noverlap are optional peers used only by this entrypoint; its enhanced controls use the optional `@carbon/icons-react` peer through `lumen-ui-kit/icons`.
- `lumen-ui-kit/graph/styles.css`: palette-aware Canvas2D graph chrome and responsive inspector styling; import it with the core stylesheet when using the graph adapter.
- `lumen-ui-kit/styles.css`: Tailwind theme variables, light/dark semantic CSS variables, and the Brainapi palette.
- `lumen-ui-kit/tokens`: stable-format DTCG JSON source tokens.

## Development

```bash
cd ui-kit
npm install
npm run dev
```

The development command opens the Lumen Workbench at
`http://localhost:5173`. It renders the package source directly with live
examples, searchable component families, Lumen/Brainapi palette selection,
light and dark Lumen themes, and desktop/tablet/mobile preview widths. Its searchable **Guidelines** area renders
the Markdown copied into `guidelines/`, so humans can read the rules beside the
live components while agents consume the same raw files directly. The copied
set includes the Lumen workflow, foundations, component rules, accessibility,
product patterns, React/Next.js guidance, package API, automation notes, and
attribution. Supporting provenance and token files remain beside the guides so
their relative references stay valid. The workbench application is
development-only; the raw guideline files are included in the package contents.

Run the full package checks with:

```bash
npm run test
npm run typecheck
npm run build
npm run build:showcase
```

## Publishing

The package is published to npm as `lumen-ui-kit` under the [MIT license](LICENSE). `npm publish` runs the type check, the test suite, and the build first.

```bash
npm publish --dry-run
```

Optional peer dependencies stay under their own licenses and are installed by the consumer: `@carbon/icons-react` is Apache-2.0, and the graph entrypoint's rendering and layout peers carry their own terms. Lumen links to them rather than vendoring their assets. See [REFERENCES.md](REFERENCES.md) for design provenance and the attribution boundary.
