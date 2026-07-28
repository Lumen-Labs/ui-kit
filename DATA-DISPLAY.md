# Toolbars, Resource Lists, and Tables

Lumen provides composable visual and semantic primitives. The consuming application owns records, remote loading, filters, selection, sorting, pagination, authorization, and mutations.

## Choose the structure first

- Use a `ResourceList` when each item has a title and description but its supporting metadata or actions may differ. Keep the outer `ul` and each `li` so assistive technology can enumerate the collection.
- Use a native `Table` when users need to compare the same attributes across rows or columns. Include a caption unless an immediately preceding heading already names the data clearly.
- Use a specialist data-grid engine for virtualization, column resizing or reordering, spreadsheet navigation, tree data, editable cell matrices, or user-configurable schemas. Style its stable public parts with Lumen tokens instead of rebuilding its interaction model.

## Toolbars

`Toolbar` is an ARIA toolbar for three or more related controls. Give it an accessible name with `aria-label`, or pair a visible `ToolbarLabel` with `aria-labelledby`. It manages one Tab stop and moves focus with Left/Right Arrow (Up/Down for a vertical toolbar), Home, and End. Compose `ToolbarGroup`, `ToolbarItem`, `ToolbarSeparator`, and `ToolbarSpacer` for grouping and alignment; use a segmented group only for a small set of mutually related view or formatting choices whose selected state is exposed with `aria-pressed`.

The default `surface` variant provides a bordered, elevated enterprise command region; use `subtle` inside an already-defined panel and `plain` when the surrounding component owns the surface. Choose `compact` density for data-heavy product UI and `comfortable` for general actions. Keep text fields and controls that consume the same arrow keys outside the toolbar, or place them last and verify the keyboard interaction carefully.

Use `TableToolbar` instead for search, filters, export, display settings, and
other controls that affect an entire data set. It is a layout region rather than
an ARIA toolbar, so native controls remain in the normal Tab sequence.

Build the table chrome in this order:

1. `TableToolbarHeader` containing a `TableToolbarTitle`, optional
   `TableToolbarDescription`, live result count, and a small stable set of
   dataset actions in `TableToolbarActions`.
2. `TableToolbarFilters` containing full-text search in
   `TableToolbarContent`, then visible labeled attribute filters.
3. `TableAppliedFilters` containing one semantic `TableFilterTag` per active
   filter and a “Clear filters” action.
4. The native table and pagination.

Keep Export in the heading row when it is the main dataset action. Move less
frequent actions into an overflow menu. Use sentence-case labels and keep every
field label visible.

At widths below 640px, search uses the full available width and attribute
filters move into a `Popover` opened by a named Filters button. Show the number
of applied filters in text or a badge. From 640px upward, render the commonly
used filters inline. The same controlled filter state must drive both
representations.

When selection becomes active, replace the normal filter/action row with
`TableBatchActions`; do not stack a second dominant toolbar on top of it.
Include the selected count, relevant bulk actions, and a clear-selection
control. Return focus logically after the selection is cleared.

## Resource lists

Compose each item from:

- `ResourceListContent` for the flexible main column.
- `ResourceListTitle`, which defaults to `h3` and accepts `as="h2"` through `as="h6"` so the page outline remains correct.
- `ResourceListDescription` for concise supporting text.
- `ResourceListMetadata` and `ResourceListMetadataItem` for date, type, source, tags, or attribution.
- `ResourceListActions` for always-visible actions that do not duplicate the title link.

Give the list a descriptive visible heading or `aria-label`. When an item contains several content blocks, connect the item to its unique title with `aria-labelledby`.

## Complex tables

Start with the native `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell` components. Add only the behaviors the task needs:

- `TableSortableHead` places `aria-sort` on the column header and uses a native button. The application controls `direction` and `onSort`.
- `TableSortAnnouncement` is a polite live region for the result of a sort. Update its text after the row order changes.
- `TableSelectionCell` renders a named native checkbox in a header or row cell. The application controls checked state. A select-all checkbox can set its native `indeterminate` property from a small client boundary when only part of the visible set is selected.
- `TableBatchActions` appears when `selectedCount` is positive and announces the selection count. Disable row-specific actions while a conflicting batch mutation is running.
- Keep the batch surface restrained: use a visible accent and selected
  background without turning the entire strip into a dominant primary block.
- `TableRowActions` keeps a visible actions column at the far edge. Use one direct action or a named overflow menu rather than hover-only controls.
- `TableEmptyState` spans the supplied number of columns and keeps a recovery action in the table.
- `TablePagination` shows the visible range and hosts native buttons, links, or the Lumen `Pagination` component.

For horizontally overflowing tables, pass a unique label and `tabIndex: 0` to the container so keyboard users can focus and scroll it:

```tsx
<Table
  containerProps={{
    "aria-label": "Scrollable workspace reports",
    tabIndex: 0,
  }}
>
  {/* caption, header, and body */}
</Table>
```

Keep column labels short, use consistent formatting within each column, right-align comparable numeric values, and keep an explicit visible `Actions` header. For complex headers with multiple levels, give every header a unique `id` and each data cell a `headers` attribute listing all related headers.

## Responsive behavior

Preserve the table when cross-row comparison matters and allow labeled
horizontal scrolling. Transform records into a resource-list or grouped-card
presentation only when each row can stand alone; repeat every essential label
and keep actions visible. Do not merely hide important columns at small widths.

- Keep search usable and full width on mobile.
- Allow applied-filter tags to wrap inside the table surface; they must not
  widen the page.
- Keep horizontal overflow on the labeled table container only. The title,
  search, filters, applied tags, batch actions, and pagination must reflow
  without horizontal page scrolling.
- Update the result count through a polite live region and show an actionable
  empty state when no records match.

## Source basis

These patterns synthesize official guidance from [Atlassian Dynamic Table](https://atlassian.design/components/dynamic-table), [Carbon Data Table](https://carbondesignsystem.com/components/data-table/usage/), [Elastic Data Grid](https://eui.elastic.co/docs/components/tabular-content/data-grid/), [GitLab Pajamas Table](https://design.gitlab.com/components/table/), [PatternFly Toolbar](https://www.patternfly.org/components/toolbar/), [PatternFly Table](https://www.patternfly.org/components/table/), [PatternFly Data List](https://www.patternfly.org/components/data-list/), [GOV.UK Summary List](https://design-system.service.gov.uk/components/summary-list/), [USWDS Table](https://designsystem.digital.gov/components/table/), and [USWDS Collection](https://designsystem.digital.gov/components/collection/). Lumen uses original code and its own public API.
