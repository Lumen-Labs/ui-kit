# Lumen Component Catalog

This catalog normalizes the overlapping concepts in Atlassian Design, Carbon, Elastic UI, GitLab Pajamas, PatternFly, GOV.UK Design System, and USWDS. Lumen exposes one semantic API for equivalent behavior rather than cloning branded implementations.

## Implemented core

### Foundations and layout

- `Container`, `Stack`, `Inline`, `Grid`, `Separator`, and `VisuallyHidden` cover box, flex, cluster, grid, divider, spacer, and screen-reader-only patterns.
- The Tailwind theme provides semantic color, radius, shadow, typography, focus, dark-theme, and reduced-motion decisions.

### Icons

- `Icon` supplies Lumen sizing, semantic color roles, ref forwarding, and decorative-by-default accessibility around Carbon React icon sources.
- `lumen-ui-kit/icons` exports 57 curated, product-agnostic aliases for common actions, navigation, status, identity, visibility, and rich-text formatting metaphors.
- The icon entrypoint is isolated from core and backed by the optional `@carbon/icons-react` peer so React consumers pay for icons only when they import them.

See [ICONS.md](ICONS.md) for the complete export list, accessible naming,
optical sizing, extension rules, and licensing boundary.

### Actions and forms

- `Button` and `ButtonGroup` cover primary, secondary, tertiary, ghost, danger, pending, pressed, full-width, and grouped actions. `Toolbar`, `ToolbarGroup`, `ToolbarItem`, `ToolbarLabel`, `ToolbarSeparator`, and `ToolbarSpacer` compose labeled, responsive control regions while application state remains controlled by the consumer.
- `Input`, `TextField`, `Textarea`, `Select`, `NumberInput`, `SearchInput`, `FileInput`, `Checkbox`, `Radio`, `Switch`, and `Slider` preserve native controls. `Select` provides bordered `default` and low-chrome `ghost` treatments without replacing native select behavior.
- `Field`, `FieldLabelRow`, `FieldLabel`, `FieldLabelMeta`, `FieldSublabel`, `FieldDescription`, `FieldError`, `Fieldset`, and `Legend` compose custom field layouts with explicit accessible associations.
- `InputGroup` and `InputGroupAddon` visually and semantically unite related prefixes, suffixes, actions, and controls without replacing the native input.
- `CharacterCount` exposes a live remaining-character message, while `PasswordField` provides an explicitly named visibility toggle.
- `DateInput` groups day, month, and year segments for memorable dates without bundling locale parsing or a calendar engine.
- `ErrorSummary` composition provides a focusable validation overview whose links return users to invalid controls.

### Assistant surfaces

- `PromptComposer` and its `PromptComposerField`, `PromptComposerAttachments`, `PromptComposerAttachment`, `PromptComposerToolbar`, `PromptComposerControls`, `PromptComposerContextMeter`, `PromptComposerContextDetails`, `PromptComposerActions`, and `PromptComposerSubmit` primitives compose a bottom-docked chat, assistant, or command input. The compact glass-like 14px shell contains an auto-growing native `textarea` with Enter-to-send and Shift+Enter for a newline, a dense attachment band, an inset model/mode/context cluster, and a raised submit control whose 14px corners match the shell. `PromptComposerContextMeter` opens a focus-managed token breakdown while the application retains ownership of token estimates, model, transport, streaming, attachment, and command state.

### Navigation

- `Breadcrumbs`, `Pagination`, `Steps`, `SkipLink`, `Tabs`, and `DropdownMenu` cover location, paging, progress tracking, bypass navigation, content switching, and menus.
- `Link` provides `inline`, `standalone`, and `muted` variants. `BackLink`, `BackToTop`, `JumpLinks`, and `JumpLink` cover return paths, long-page shortcuts, visible on-page navigation titles, and current-location semantics.
- `PageHeader` composition separates page identity, supporting context, and actions. Its title defaults to `h1` but can use a lower heading when embedded.
- `GlobalHeader`, its brand/navigation/action regions, `SideNav`, `SideNavNestedList`, and `AppShell` provide responsive product structure while preserving explicit header, navigation, `aside`, and `main` semantics. `SideNav` keeps the calm default and adds `expression="compact"` for dense navigation with quiet section labels, divider-free rows, subtle four-pixel corners, and an indented current-state marker; the legacy `cyber-grid` value remains accepted for compatibility. Nested links retain explicit depth and `aria-current` semantics in every expression.
- `AppShellSidebarHeader`, `AppShellSidebarContent`, and `AppShellSidebarFooter` structure persistent local navigation; `AppShellRail` provides complementary context without competing with main content.
- `NextLink` and `NextLinkButton` add Next.js navigation without a client boundary.

### Page layout

- `PageContent` provides readable, standard, wide, and full content measures without scattering maximum-width utilities across pages.
- `PageSection`, `PageSectionHeader`, `PageSectionTitle`, `PageSectionDescription`, `PageSectionActions`, and `PageSectionContent` provide semantic, responsive section composition.
- `SectionStack` and the `SectionBand` family compose related full-width sections with shared seams, responsive internal insets, semantic headings, surface tones, and optional reduced-motion-safe entrance behavior.
- `Stack`, `Inline`, and `Grid` expose tokenized gap values, including `none` for deliberate shared-edge composition.

See [LAYOUT.md](LAYOUT.md) for shell selection, global-header recipes,
responsive sidebar behavior, page-header composition, content regions, sticky
UI, and accessibility requirements.

### Content and data

- `Card` composition also represents a neutral panel. It remains noninteractive by default. `CardGroup` joins related cards into one boxed responsive grid with shared seams and optional staggered entrance motion.
- `Table` composition preserves native table semantics and can label and focus its horizontal overflow region. `TableSortableHead`, `TableSelectionCell`, `TableRowActions`, and `TableSortAnnouncement` add explicit sorting, selection, row actions, and assistive announcements.
- `TableToolbar`, `TableToolbarHeader`, `TableToolbarTitle`, `TableToolbarDescription`, `TableToolbarFilters`, `TableToolbarContent`, `TableToolbarActions`, `TableAppliedFilters`, `TableFilterTag`, `TableBatchActions`, `TableEmptyState`, and `TablePagination` compose dataset identity, result counts, adaptive search and filters, removable filter state, bulk actions, no-result feedback, and paging while the application owns the controlled state.
- `ResourceList` and its title, description, metadata, and action primitives provide a semantic list for related resources whose records do not share enough comparable columns for a table.
- `DescriptionList` and `List` cover native structured content with palette-aware markers. `CodeBlock` provides the scrollable code surface and `CodeToken` applies semantic syntax roles (`comment`, `keyword`, `function`, `string`, `property`, `punctuation`, or `tag`) without coupling the package to a highlighter. `Stat`, `Avatar`, `Badge`, `Tag`, and `StatusIndicator` cover metrics, identity, labels, lozenges, health, and status.
- `AvatarGroup` keeps compact identity collections as lists; `SummaryList` adds responsive key/value/action rows for review screens and entity attributes.
- `TaskList` gives each task a concise link, optional hint, and programmatically associated text status.
- `Callout` covers non-live inset text, hints, and summary boxes without misusing alert semantics. `Truncate` provides one-to-three-line visual clamping without deleting source content.
- `ClipboardCopy` reports copy success or failure through a polite live region. `InlineEdit` owns the read/edit transition, validation, pending state, and focus restoration for short text values.
- `Disclosure` and its `Accordion` aliases use native `details` and `summary` behavior.

### Visualization

- `lumen-ui-kit/graph` exposes the client-only `GraphExplorer`, `GraphInspector`, controlled filter and selection contracts, deterministic layout and semantic-zoom helpers, graph performance options, and semantic record types without loading graph code from Lumen core.
- The relationship explorer preserves source topology while dimming nonmatches, supports a compact search/facet command bar, searchable counted facet panels and legend, grouped viewport tools, non-remounting expanded view, deterministic Louvain communities and aggregate relationships below detail zoom, label suppression below rendered-size thresholds, and a property inspector that adapts from a joined panel to a focus-managed Drawer.
- A packaged worker computes deterministic Louvain communities from compact numeric topology while vis-network owns live ForceAtlas2 physics, collision avoidance, and positions. Overview is capped at 60 communities and 90 aggregate relationships; compact mode at 180 communities and 360 aggregate relationships; detail restores every original entity without mounting a DOM element per entity.
- vis-network, vis-data, Graphology, Graphology ForceAtlas2, Noverlap, and Louvain are optional peers installed only by graph consumers. ForceAtlas2 and Noverlap remain available through Lumen's public pure layout helpers; Graph querying, authorization, pagination, persistence, and editing remain application responsibilities.

See [GRAPH.md](GRAPH.md) before integrating relationship data or extending the graph adapter.

### Feedback

- `Alert` and its `Banner` alias cover inline messages, callouts, notifications, and high-priority failures.
- `EmptyState`, `Progress`, `Spinner`, and `Skeleton` cover no-data, determinate progress, indeterminate work, and loading placeholders.
- Application-level toast queues should use the package's alert styling around an established live-region/toast state manager.

### Overlays

- `Dialog` and `Drawer` use Radix Dialog for modal focus management, Escape dismissal, background blocking, and focus restoration.
- `Popover`, `Tooltip`, and `DropdownMenu` use Radix primitives for positioning, dismissal, and keyboard behavior.

## Compose as recipes

Build these from core components rather than introducing separate foundational implementations:

- Panel, dashboard panel, footer, and responsive action bar. Follow [LAYOUT.md](LAYOUT.md) so these
  recipes preserve the shell hierarchy and landmarks.
- Filter bar, segmented control, notification drawer, and tag group.
- Login form, wizard, progress stepper, password generator/strength display, upload manager, error page, maintenance page, and unauthorized/empty/missing states.
- Slash-command or mention menu for the `PromptComposer`: anchor an application-owned suggestion list (built with `Popover`) to the composer and keep command state in the application. The composer itself is implemented core (see Assistant surfaces).
- Column visibility menus and expandable table rows, while keeping application state outside the visual primitives.
- Avatar group, tag group, button group, card group, and status summary.

Recipes must keep domain data, routing, validation, authorization, and asynchronous state in the consuming application.

## Dedicated integrations

These catalog families require mature engines or domain packages. Lumen should style and adapt them rather than ship incomplete replacements:

- Accessible comboboxes, multiselects, creatable selects, and dual-list selectors: use an ARIA-complete selection primitive.
- Calendar, date, date-time, date-range, timezone, recurrence, and auto-refresh controls: use a maintained date engine.
- Virtualized, resizable, reorderable, tree, spreadsheet, and in-memory data grids: use TanStack Table/Virtual or an equivalent grid engine.
- Charts, gauges, heatmaps, Sankey diagrams, and execution-flow editors: use ECharts or another specialist visualization engine. Use Lumen's optional graph adapter for read-only node-and-relationship exploration.
- Markdown, rich-text, code, query, and log editors: use CodeMirror, Monaco, Tiptap, or another maintained editor with project-owned sanitization.
- Drag-and-drop, resize, and spatial collision behavior: use an accessible sensor/collision engine.
- Tree views with virtualization, sitewide search, query expressions, and advanced filter builders: package separately around the application's data model.
- Chatbot, console, quick-start, catalog, service, CI/CD, Ansible, and other vendor/product-specific components: keep in feature or domain packages.
- Brand logos, illustrations, and vendor-specific objects: consume licensed asset packs; do not copy them into core. General interface icons use the dedicated Lumen icon adapter; product-specific icon families remain external.

Deprecated source components are mapped to current equivalents instead of receiving new implementations: chip to `Tag`, tile to a selectable card recipe, and legacy navigation/layout systems to current shell primitives.

## Acceptance rule for new components

Add a core component only when it has cross-system semantics, can be implemented accessibly without duplicating a specialist engine, uses semantic Lumen tokens, has a stable public contract, and includes behavior-focused tests. Otherwise add a recipe or adapter entrypoint.
