import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Workbench } from "./workbench";

const workbenchCss = readFileSync(new URL("./workbench.css", import.meta.url), "utf8");

test("workbench preview controls form one named device and theme console", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /data-lumen-palette="lumen"/);
  assert.match(html, /data-slot="preview-toolbar"/);
  assert.match(html, /aria-label="Workbench preview controls"/);
  assert.match(html, /aria-label="Preview palette"/);
  assert.match(html, /<option value="lumen" selected="">Lumen<\/option>/);
  assert.match(html, /<option value="brainapi">Brainapi<\/option>/);
  assert.match(html, /aria-label="Preview at desktop width"[^>]*aria-pressed="true"/);
  assert.match(html, /aria-label="Preview at tablet width"[^>]*aria-pressed="false"/);
  assert.match(html, /aria-label="Preview at mobile width"[^>]*aria-pressed="false"/);
  assert.match(html, /aria-label="Use dark theme"[^>]*aria-pressed="false"/);
  assert.match(html, /--lumen-color-control-border/);
  assert.match(html, /--lumen-color-action-secondary/);
});

test("assistant showcase presents the composer in a responsive product context", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /class="assistant-composer-demo"/);
  assert.match(html, /class="assistant-composer-shell"/);
  assert.match(html, /aria-label="Attached files"/);
  assert.match(html, /placeholder="Ask Lumen to analyze this workspace…"/);
  assert.match(
    html,
    /data-slot="prompt-composer-submit"[^>]*class="[^"]*rounded-lumen-composer/,
  );
  assert.match(html, /data-slot="prompt-composer-context-trigger"/);
  assert.match(html, /aria-label="Context usage: 18 percent"/);
  assert.match(html, /Agent<\/button>/);
});

test("icon showcase uses a connected, labeled specimen grid", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /class="icon-section-summary"/);
  assert.match(html, /<ul class="icon-gallery" aria-label="Curated icon library">/);
  assert.match(html, /<li class="icon-sample" data-icon-index="01">/);
  assert.match(html, /class="icon-sample__glyph"/);
  assert.match(html, /<code>AddIcon<\/code>/);
});

test("lists and code showcase presents structured lists and highlighted source", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /class="content-specimen"/);
  assert.match(html, /aria-label="Workspace setup checklist"/);
  assert.match(html, /class="code-example__header"/);
  assert.match(html, /<span id="code-example-title">button-example\.tsx<\/span>/);
  assert.match(html, /data-tone="keyword"/);
  assert.match(html, /data-tone="string"/);
  assert.match(html, /data-tone="function"/);
  assert.match(html, /data-tone="comment"/);
});

test("contiguous section progress uses fitted text statuses instead of badges", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /Motion confirms progress, never meaning/);
  assert.equal((html.match(/section-band-demo__step-status/g) ?? []).length, 3);
  assert.match(html, /data-slot="status-indicator"[^>]*>.*Done<\/span>/);
  assert.match(html, /data-slot="status-indicator"[^>]*>.*Running<\/span>/);
  assert.match(html, /data-slot="status-indicator"[^>]*>.*Queued<\/span>/);
  assert.doesNotMatch(html, /data-slot="badge"[^>]*>Done<\/span>/);
});

test("application shell showcase includes nested navigation and contextual popovers", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /aria-label="Switch workspace"/);
  assert.match(html, /aria-label="Actions for Daily operations"/);
  assert.match(html, /aria-label="Open account menu"/);
  assert.match(html, /data-slot="side-nav-nested-list"/);
  assert.match(html, /data-depth="1"/);
  assert.match(html, /data-shell-expression="compact"/);
  assert.match(html, /data-expression="compact"/);
  assert.match(html, /data-popover-expression="cyber-grid"/);
  assert.match(html, />Core<\/span>/);
  assert.match(html, />Analytics<\/span>/);
  assert.doesNotMatch(html, /01 \/ CORE|02 \/ ANALYTICS/);
  assert.match(html, /Daily operations/);
});

test("application shell account footer and row actions use cohesive sidebar spacing", () => {
  assert.match(
    workbenchCss,
    /\.app-shell-desktop-sidebar\s*>\s*\[data-slot="app-shell-sidebar-footer"\]\s*\{[^}]*padding:\s*0\.5rem;/s,
  );
  assert.match(
    workbenchCss,
    /\.workspace-nav-row-menu:is\(:hover,\s*:focus-visible,\s*\[aria-expanded="true"\]\)\s*\{[^}]*background:\s*color-mix\(in srgb,\s*var\(--lumen-color-primary\)/s,
  );
  assert.match(
    workbenchCss,
    /\.workspace-nav-action-row:has\(\.workspace-nav-row-menu\[aria-expanded="true"\]\)\s+\.workspace-nav-action-row__link/s,
  );
});

test("visualization showcase presents an interactive service relationship graph", () => {
  const html = renderToStaticMarkup(React.createElement(Workbench));

  assert.match(html, /id="visualization"/);
  assert.match(html, /data-demo="graph-explorer"/);
  assert.match(html, /aria-label="Commerce platform dependency graph"/);
  assert.match(html, /placeholder="Search names, labels, types, and properties"/);
  assert.match(html, /aria-label="Show graph legend"/);
  assert.match(html, /data-detail-level="detail"/);
  assert.match(html, /Relationship types/);
  assert.match(html, /aria-label="Graph dataset density"/);
  assert.match(html, /<option value="1000">1,000 entities/);
  assert.match(html, /<option value="5000">5,000 entities/);
  assert.match(html, /ForceAtlas2 physics on/);
  assert.match(html, /data-physics-enabled="true"/);
  assert.match(html, /ForceAtlas2 physics on · semantic zoom · keyboard navigation/);
});
