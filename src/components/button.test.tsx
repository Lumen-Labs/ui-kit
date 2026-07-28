import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "./button";

test("Button defaults to a non-submitting native button", () => {
  const html = renderToStaticMarkup(<Button>Open filters</Button>);

  assert.match(html, /^<button/);
  assert.match(html, /type="button"/);
  assert.match(html, /data-slot="button"/);
  assert.match(html, />Open filters<\/button>$/);
  assert.match(html, /tracking-\[-0\.01em\]/);
  assert.match(html, /h-11/);
  assert.match(html, /rounded-lumen-button/);
  assert.match(html, /shadow-lumen-button/);
});

test("Button exposes and blocks a pending action", () => {
  const html = renderToStaticMarkup(
    <Button isPending pendingLabel="Saving settings">
      Save settings
    </Button>,
  );

  assert.match(html, /aria-busy="true"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /data-pending="true"/);
  assert.match(
    html,
    /data-slot="button-label"[^>]*aria-hidden="true"[^>]*>Save settings<\/span>/,
  );
  assert.match(
    html,
    /data-slot="button-pending-label"[^>]*>Saving settings<\/span>/,
  );
  assert.match(html, /data-slot="button-spinner"/);
});

test("Button emits complete static classes for every variant", () => {
  const html = renderToStaticMarkup(
    <Button variant="danger" size="large">
      Delete account
    </Button>,
  );

  assert.match(html, /bg-lumen-danger/);
  assert.match(html, /h-12/);
  assert.doesNotMatch(html, /undefined/);
});

test("Button supports a quiet tertiary hierarchy and responsive full width", () => {
  const html = renderToStaticMarkup(
    <Button variant="tertiary" isFullWidth aria-pressed="true">
      Pin report
    </Button>,
  );

  assert.match(html, /data-variant="tertiary"/);
  assert.match(html, /w-full/);
  assert.match(html, /aria-pressed:bg-lumen-surface-muted/);
  assert.match(html, /border-lumen-control-border/);
});

test("secondary Button consumes palette-aware neutral action colors", () => {
  const html = renderToStaticMarkup(
    <Button variant="secondary">Export</Button>,
  );

  assert.match(html, /bg-lumen-action-secondary/);
  assert.match(html, /text-lumen-on-action-secondary/);
  assert.match(html, /hover:bg-lumen-action-secondary-hover/);
  assert.doesNotMatch(html, /bg-lumen-secondary(?:\s|$)/);
  assert.match(html, /border-lumen-control-border/);
});

test("small Button keeps a comfortable 36 pixel target", () => {
  const html = renderToStaticMarkup(<Button size="small">Compact action</Button>);

  assert.match(html, /h-9/);
});

test("icon-only Button provides a 44 pixel interactive target", () => {
  const html = renderToStaticMarkup(
    <Button size="icon" aria-label="Add item">
      +
    </Button>,
  );

  assert.match(html, /size-11/);
});
