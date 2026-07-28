# Lumen Product Patterns

## Navigation

- Use persistent left navigation for deep hierarchical products.
- Use top navigation for shallow, task-focused products.
- Apply progressive disclosure to nested sections and avoid exposing deep menus on small screens.
- Make the current location perceivable without relying on color alone.
- Keep global navigation stable across related routes.

## Application shell

Use a header, persistent navigation when needed, a primary content region, and an optional contextual rail. Keep text-heavy content at a readable width; let tables, canvases, and editors expand when the task benefits.

When `lumen-ui-kit` is available, implement these regions with `GlobalHeader`, `AppShell`, the named `AppShellSidebar` regions, `AppShellMain`, optional `AppShellRail`, `PageContent`, `PageHeader`, and `PageSection` rather than rebuilding their styling locally.

On narrow screens, preserve the primary task and collapse secondary navigation or contextual tools behind clearly labeled controls. Do not simply shrink a desktop shell.

Use the Lumen shell dimensions consistently: a 56px global header, 240px persistent sidebar, 272px contextual rail, and 16/24px responsive page insets. Keep fields at a 10px radius, buttons at 8px, compact controls at 6px, and structural shell surfaces square.

### Choose the shell

- Use header-only navigation for a shallow product whose primary destinations fit comfortably without persistent submenus.
- Add side navigation for stable local hierarchy or repeated movement among related product areas. Keep global and local navigation responsibilities distinct; do not duplicate the same destinations in both.
- Use a minimal shell for focused workflows where broader navigation is unnecessary or distracting.
- Keep product identity and global actions in the global header. Put the route title, description, and page-scoped actions in a separate page header inside the main content region.

### Side navigation

- Prefer one or two visible levels and validate deeper hierarchies with users.
- Keep labels short, stable, and organized by user task or product domain rather than company structure.
- Indicate exactly one current page with `aria-current="page"` plus a visible noncolor cue.
- Do not place unbounded user-created collections in persistent navigation; link to an index or drill-down view.
- On narrow screens, present the same information architecture in an overlay drawer that traps focus, closes on Escape and selection, blocks background interaction, and restores focus to its labeled trigger.
- Keep the sidebar persistent from 1024px upward. Below 1024px, remove the persistent copy from the tab order and open the existing `Drawer side="left"` from a named menu trigger.
- Keep the contextual rail persistent from 1280px upward. Below 1280px, move its content after the main task in a compact collapsible section titled “Workspace context.”
- Give every navigation landmark a distinct accessible label when the page contains more than one `nav`.

### Local navigation

- Use `Link`'s default `inline` variant inside prose, `standalone` for independent destinations, and `muted` for quiet metadata navigation.
- Keep back links and back-to-top links as semantic anchors with standalone spacing and visible focus.
- Give jump-link navigation a visible “On this page” title and expose the active destination with `aria-current="location"` plus a noncolor indicator.
- Stack standalone links on narrow screens so labels and focus rings do not collide.

### Layout and content regions

- Preserve parity between visual order and DOM order when columns stack or panels move.
- Use exactly one `main` landmark and provide a skip link when repeated chrome precedes it.
- Start with one column. Use media queries for shell changes and container queries for reusable panel content.
- Constrain prose and ordinary forms to a readable measure; allow tables, editors, dashboards, and comparison views to use more width when the task benefits.
- Prefer one document scroll container. Account for sticky headers in offsets and scroll margins, and ensure sticky regions never cover focus, errors, anchors, or final content.
- Use `section` only with a meaningful heading and `aside` only for genuinely complementary content.

When the local `ui-kit/LAYOUT.md` or published `lumen-ui-kit` layout guide is available, treat it as the package-specific composition reference.

### Contiguous product sections

- Use `SectionStack` with the `SectionBand` family for related product narratives, operational overviews, and feature sequences that should read as one bounded surface.
- Let adjacent bands share one divider and no outer gap, while retaining responsive internal insets and meaningful headings.
- Use aligned grids, structured status, or product visuals to carry hierarchy. Avoid floating-card grids inside every band.
- Keep `PageSection` for ordinary settings, forms, and unrelated page regions that need standard vertical rhythm.
- Use opt-in entrance or data-flow motion only when it clarifies appearance, progress, or direction. Equivalent status must remain understandable when motion is disabled.

## Lists, cards, and tables

- Use a table when users must compare values across rows and columns.
- Use a resource list for title-led records with descriptions, metadata, or actions that do not share enough comparable columns for a table.
- Use a simple list for sequential or homogeneous items without cross-column comparison.
- Keep `ul`, `ol`, and `dl` semantics even when list rows receive richer visual hierarchy. Use palette-aware markers or indices as reinforcement, not as a replacement for list structure.
- Use cards for self-contained summaries or mixed-content collections with a clear hierarchy.
- Put global search, filters, display settings, and export controls above the data. Keep their placement predictable across related views.
- Give complex table chrome a heading and short description or live result count. Keep one stable dataset action, such as Export, in that header row.
- Keep search full width on mobile. From 640px upward, show common labeled filters inline; below 640px, move them into a Filters popover with an applied-count badge.
- Show removable applied-filter tags and a clear-all action. Let tags wrap inside the table surface without widening the page.
- When rows are selected, replace the normal filter row with restrained batch actions, communicate the selection count, and provide a clear-selection action.
- Put sortable state on the column header, use a native button for the sort action, and announce the resulting row order through a polite live region.
- Keep row actions in a visible, named actions column; do not reveal essential controls only on hover.
- Preserve headers, labels, row identity, and actions in responsive representations. If comparison matters, keep the table and provide a labeled, keyboard-focusable horizontal overflow region. Only that table container should overflow horizontally.
- Use a specialist data-grid engine for virtualization, column resizing or reordering, spreadsheet keyboard models, editable matrices, or tree data.

When the local `ui-kit/DATA-DISPLAY.md` or published `lumen-ui-kit` data-display guide is available, treat it as the package-specific composition reference.

### Code examples

- Keep source inside native `pre` and `code` elements. Give horizontally scrollable examples an accessible label and keyboard access when the overflow cannot otherwise be reached.
- Use `CodeBlock` for the editor surface and `CodeToken` for explicit syntax roles. A build-time highlighter may generate those spans; do not ship a client boundary solely for decorative highlighting.
- Keep syntax color secondary to the code text itself. Do not communicate errors, additions, or removals through color alone.
- Use the semantic code variables rather than generic foreground/background inversion. Code surfaces remain intentionally dark in Lumen and Brainapi; Brainapi maps them to near-black surfaces with its own readable syntax palette.
- Preserve whitespace, allow horizontal scrolling inside the code block only, and never force long source lines to widen the page.

## Relationship graphs

- Use `lumen-ui-kit/graph` for read-only exploration of entities and their directed relationships. Do not use it for execution flows, workflow editing, or charts whose primary task is comparing quantitative values.
- Keep search and node-label/relationship-type facets above the canvas. Preserve the whole topology and dim nonmatches so users retain structural context.
- Put visible category names in circular nodes and the legend; use categorical rings as a supplementary scan cue. Label directed relationships and keep selected or focused entities fully legible.
- Keep selection and filters controlled by the application. Use the inspector for the selected entity's labels, description, route, and displayed properties; do not expose authorization-sensitive properties merely because they exist in the source record.
- Keep pan, zoom, Fit, dragging, and Reflow presentational. Querying, pagination, persistence, mutations, and permission checks belong to the application.
- Keep one compact command bar above the canvas: full-width search, Node and Relationship facet triggers, active-filter context, live results, and one applied-filter row only when needed. Give each facet a local search, source counts, selected summary, scroll boundary, empty-search feedback, and Clear action.
- Group Zoom, Fit, Center selection, Reflow, minimap, legend, help, and expanded-view actions in one restrained viewport rail. Disable Center without a selection and keep icon-only actions named and tooled with concise help.
- Use a searchable toggle panel for node categories and relationship types instead of a permanent legend strip. Let entries act as keyboard-operable filters while retaining visible labels, markers, and counts.
- Below 768px, keep search full width, move facets into the focus-managed Filters Drawer, condense applied state, and move secondary viewport actions into an overflow menu. Do not let controls delay or cover the primary canvas.
- Implement expanded graph viewing on the mounted explorer rather than native fullscreen so camera, worker, selection, filters, and positions remain stable; Escape exits and restores focus.
- Join the inspector to the canvas when its container is at least 1024px wide; use a focus-managed Drawer in narrower compositions.
- Use application query limits for graphs too dense to understand. Stable positions and progressive dataset expansion are preferable to rerunning layout after every filter.

## Forms

- Place labels above inputs by default for scanability and narrow-screen compatibility.
- Keep the primary label concise. Put status such as “Optional” in `FieldLabelMeta`, short context in `FieldSublabel`, and persistent usage guidance in `FieldDescription`; do not concatenate all of them into the accessible name.
- Keep text-like controls on the shared 42px visual shell with 14px inline padding. Use native input types where their browser behavior is useful, including search, number, file, URL, date, time, and color.
- Group related fields with `fieldset` and `legend` where appropriate.
- Compose checkboxes, radios, and switches with `ChoiceField`; associate the visible label with `htmlFor` and supporting copy with `aria-describedby`.
- Use checkboxes for independent or submit-time choices, radios for one visible choice from a set, and switches for settings that take effect immediately.
- Validate predictable errors near the field using concise, actionable language.
- Provide an error summary for long or multi-section forms and move focus to it after failed submission.
- Keep entered values after validation errors.
- Distinguish optional fields clearly; do not rely on placeholder text as a label.
- End ordinary forms with a clearly separated action row. Keep one primary submit action, retain Lumen's raised button affordance, and use lower-emphasis variants for cancel or reset.

## Prompt composer

Use a prompt composer for the persistent message input in assistant, chat, and command surfaces. When `lumen-ui-kit` is available, compose it from the `PromptComposer` primitives (`PromptComposerField`, `PromptComposerAttachments`, `PromptComposerToolbar`, `PromptComposerContextMeter`, `PromptComposerActions`, and `PromptComposerSubmit`) rather than rebuilding the field, submit, attachment, or context-usage behavior; keep token estimates, model, transport, streaming, and command state in the application.

- Dock the composer to the bottom of the conversation region inside its own bar with a top divider, and constrain its content to the same readable measure as the transcript rather than the full viewport width.
- Treat the composer as one compound field: use its dedicated 14px shell radius, semantic translucent surface, restrained elevation, and visible focus treatment. Attachments, draft content, context, and actions should feel like regions of one control rather than unrelated rows.
- Start the textarea compact and let it grow to a bounded maximum. Keep the utility footer visually integrated with the writing surface, cluster model/mode/context controls inside one quiet inset group, keep attachment icon actions circular, and give the raised Send/Stop action the same 14px radius as the composer shell.
- Make context usage inspectable when the product can estimate it. Use `PromptComposerContextMeter` with application-supplied totals and semantic segments to open a focus-managed popover showing the percentage, used and total tokens, segment breakdown, free capacity, and reserved output. Keep the visible percentage and text complete without relying on ring color.
- Build the entry field on a native auto-growing `textarea` that expands with content up to a bounded maximum height and then scrolls. Keep one visible placeholder and never treat the placeholder as the only label.
- Submit on Enter and insert a newline on Shift+Enter. Mirror the submit action in a visible, accessibly named control so keyboard and pointer users share one path.
- Present the primary control as Send when a draft or attachment exists and swap it to Stop while a response streams. Keep Send unavailable when the field is empty with no attachment, using programmatic disabled state rather than opacity alone.
- Group secondary controls—model, mode, tools, context or usage meters, and attachment—in a single toolbar region beneath the field, and keep the field itself uncluttered. Let the controls wrap by group on narrow screens; do not truncate the active model, hide usage status, or displace the Send/Stop action.
- Support attachments with a preview strip above the field that names each item, shows its size, and offers an accessibly named remove control per item. Report validation failures in a text region associated with the field, not through color alone.
- When offering slash commands or mentions, anchor the suggestion list to the composer, keep focus in the `textarea`, and drive selection through the field's own Arrow, Enter, and Escape handling so assistive technology follows the typed query.
- Reflect busy, disabled, and error states without hiding the field. A streaming response must not remove the ability to read the draft or stop generation.

## Empty, loading, and error states

- Explain what happened, why it matters, and the next available action.
- Use skeletons only when they preserve the expected layout; otherwise use concise status text.
- Prevent layout shifts when loading content can be reasonably sized in advance.
- Make retry and recovery actions explicit.
- Avoid celebratory or decorative empty-state art when it competes with the next step.

## Destructive actions

- Use a confirmation dialog only when the consequence is difficult to reverse or costly.
- Name the affected object and consequence in the dialog.
- Use a specific action label such as “Delete report,” not a generic “Confirm.”
- Prefer undo for cheap, reversible actions.

## Source basis

These patterns synthesize Atlassian, Carbon, Elastic UI, GitLab Pajamas, PatternFly, GOV.UK, and USWDS guidance. The prompt composer pattern additionally reflects common conversational-assistant input conventions; the separate Pipeer product composer informed its compact glass shell, inset control cluster, and inspectable context-usage breakdown without contributing application state or dependencies. In particular, table and list guidance draws on Atlassian Dynamic Table, Carbon Data Table, Elastic Data Grid, GitLab Pajamas Table, PatternFly Toolbar/Table/Data List, GOV.UK Summary List, and USWDS Table/Collection. See [attribution.md](attribution.md) and [source-to-claim-map.csv](source-to-claim-map.csv) for provenance.
