import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  BreadcrumbItem,
  Breadcrumbs,
  Pagination,
  PaginationItem,
  Step,
  Steps,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarLabel,
  ToolbarSeparator,
  ToolbarSpacer,
} from "./navigation";

test("navigation components expose landmarks, lists, and current state", () => {
  const html = renderToStaticMarkup(
    <>
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Reports</BreadcrumbItem>
      </Breadcrumbs>
      <Pagination>
        <PaginationItem href="?page=1" current>
          1
        </PaginationItem>
      </Pagination>
      <Steps>
        <Step status="complete">Details</Step>
        <Step status="current">Review</Step>
      </Steps>
    </>,
  );

  assert.match(html, /<nav[^>]*aria-label="Breadcrumb"/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /<nav[^>]*aria-label="Pagination"/);
  assert.match(html, /<ol[^>]*data-slot="steps"/);
  assert.match(html, /data-status="complete"/);
});

test("toolbar primitives expose a professional surface, density, and visible label", () => {
  const html = renderToStaticMarkup(
    <Toolbar aria-labelledby="report-controls" variant="surface" density="compact">
      <ToolbarLabel id="report-controls">Report controls</ToolbarLabel>
      <ToolbarGroup aria-label="View controls" variant="segmented">
        <ToolbarItem><button type="button">Columns</button></ToolbarItem>
        <ToolbarSeparator />
        <ToolbarItem><button type="button">Density</button></ToolbarItem>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarItem><button type="button">Export</button></ToolbarItem>
    </Toolbar>,
  );

  assert.match(html, /role="toolbar"[^>]*aria-labelledby="report-controls"/);
  assert.match(html, /data-variant="surface"/);
  assert.match(html, /data-density="compact"/);
  assert.match(html, /border-lumen-border/);
  assert.match(html, /rounded-lumen-toolbar/);
  assert.match(html, /data-slot="toolbar-label"[^>]*>Report controls<\/span>/);
  assert.match(html, /role="group"[^>]*aria-label="View controls"/);
  assert.match(html, /data-variant="segmented"/);
  assert.match(html, /rounded-lumen-button/);
  assert.match(html, /data-slot="toolbar-item"/);
  assert.match(html, /role="separator"[^>]*aria-orientation="vertical"/);
  assert.match(html, /data-slot="toolbar-spacer"[^>]*aria-hidden="true"/);
});
