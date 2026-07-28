import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "./data-display";
import {
  TableBatchActions,
  TableAppliedFilters,
  TableEmptyState,
  TableFilterTag,
  TablePagination,
  TableRowActions,
  TableSelectionCell,
  TableSortAnnouncement,
  TableSortableHead,
  TableToolbar,
  TableToolbarActions,
  TableToolbarContent,
  TableToolbarDescription,
  TableToolbarFilters,
  TableToolbarHeader,
  TableToolbarTitle,
} from "./table-patterns";

test("complex table primitives compose selection, sorting, actions, and pagination semantically", () => {
  const html = renderToStaticMarkup(
    <section>
      <TableToolbar>
        <TableToolbarHeader>
          <div>
            <TableToolbarTitle>Workspace reports</TableToolbarTitle>
            <TableToolbarDescription>12 reports</TableToolbarDescription>
          </div>
          <TableToolbarActions aria-label="Table actions"><button type="button">Export</button></TableToolbarActions>
        </TableToolbarHeader>
        <TableToolbarFilters>
          <TableToolbarContent><label>Search <input type="search" /></label></TableToolbarContent>
        </TableToolbarFilters>
        <TableAppliedFilters clearAction={<button type="button">Clear filters</button>}>
          <TableFilterTag
            label="Status"
            value="Ready"
            removeLabel="Remove Status: Ready filter"
            onRemove={() => undefined}
          />
        </TableAppliedFilters>
      </TableToolbar>
      <TableBatchActions selectedCount={2} totalCount={12}>
        <button type="button">Archive</button>
      </TableBatchActions>
      <Table containerProps={{ "aria-label": "Scrollable reports table", tabIndex: 0 }}>
        <TableHeader>
          <TableRow>
            <TableSelectionCell as="th" label="Select all reports" inputProps={{ defaultChecked: true }} />
            <TableSortableHead direction="ascending">Report</TableSortableHead>
            <TableSortableHead>Owner</TableSortableHead>
            <TableSortableHead sortable={false}>Status</TableSortableHead>
            <th scope="col">Actions</th>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableSelectionCell label="Select Quarterly report" />
            <TableCell>Quarterly report</TableCell>
            <TableCell>Amira Reed</TableCell>
            <TableCell>Ready</TableCell>
            <TableRowActions><button type="button">More</button></TableRowActions>
          </TableRow>
          <TableEmptyState colSpan={5} title="No matching reports" description="Clear the filters and try again." />
        </TableBody>
      </Table>
      <TableSortAnnouncement>Sorted by report, ascending.</TableSortAnnouncement>
      <TablePagination start={1} end={20} total={86}><button type="button">Next</button></TablePagination>
    </section>,
  );

  assert.match(html, /data-slot="table-toolbar"/);
  assert.match(html, /data-slot="table-toolbar-header"/);
  assert.match(html, /<h2[^>]*data-slot="table-toolbar-title"[^>]*>Workspace reports<\/h2>/);
  assert.match(html, /data-slot="table-toolbar-description"[^>]*>12 reports/);
  assert.match(html, /data-slot="table-toolbar-filters"/);
  assert.match(html, /data-slot="table-applied-filters"/);
  assert.match(html, /data-slot="table-filter-tag"/);
  assert.match(html, /aria-label="Remove Status: Ready filter"/);
  assert.match(html, />Clear filters<\/button>/);
  assert.match(html, /data-slot="table-batch-actions"/);
  assert.match(html, /role="status"[^>]*aria-live="polite"[^>]*>2 of 12 selected/);
  assert.match(html, /aria-label="Scrollable reports table"[^>]*tabindex="0"/);
  assert.match(html, /<input[^>]*type="checkbox"[^>]*aria-label="Select all reports"[^>]*checked/);
  assert.match(html, /<th[^>]*aria-sort="ascending"[^>]*>.*<button[^>]*type="button"/);
  assert.match(html, /<th[^>]*aria-sort="none"[^>]*>.*Owner/);
  assert.match(html, /<th[^>]*>Status<\/th>/);
  assert.match(html, /data-slot="table-row-actions"/);
  assert.match(html, /colSpan="5"/);
  assert.match(html, /data-slot="table-sort-announcement"[^>]*role="status"/);
  assert.match(html, /Showing 1–20 of 86/);
});

test("table batch actions stay absent when no rows are selected", () => {
  assert.equal(renderToStaticMarkup(<TableBatchActions selectedCount={0}>Archive</TableBatchActions>), "");
});
