import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Alert, Badge, EmptyState, Progress, Spinner } from "./feedback";

test("feedback components expose text and programmatic state", () => {
  const html = renderToStaticMarkup(
    <>
      <Alert variant="danger" title="Upload failed">
        Try a smaller file.
      </Alert>
      <Badge variant="success">Active</Badge>
      <Progress value={35} max={100} aria-label="Import progress" />
      <Spinner label="Loading results" />
    </>,
  );

  assert.match(html, /role="alert"/);
  assert.match(html, /Upload failed/);
  assert.match(html, /Active/);
  assert.match(html, /<progress[^>]*value="35"[^>]*max="100"/);
  assert.match(html, /Loading results/);
});

test("EmptyState keeps the next action in normal document flow", () => {
  const html = renderToStaticMarkup(
    <EmptyState title="No reports" description="Create a report to begin.">
      <button type="button">Create report</button>
    </EmptyState>,
  );

  assert.match(html, /<section[^>]*data-slot="empty-state"/);
  assert.match(html, /<h2/);
  assert.match(html, /Create report/);
});
