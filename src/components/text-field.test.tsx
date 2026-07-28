import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { TextField } from "./text-field";

test("TextField wires its label and description to the input", () => {
  const html = renderToStaticMarkup(
    <TextField
      id="profile-email"
      name="email"
      label="Email address"
      description="Use your work email."
      type="email"
    />,
  );

  assert.match(html, /<label[^>]*for="profile-email"/);
  assert.match(html, /<input[^>]*id="profile-email"/);
  assert.match(html, /aria-describedby="profile-email-description"/);
  assert.match(html, /id="profile-email-description"/);
});

test("TextField announces an error without relying on color", () => {
  const html = renderToStaticMarkup(
    <TextField
      id="profile-name"
      name="name"
      label="Name"
      error="Enter your name."
    />,
  );

  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="profile-name-error"/);
  assert.match(html, /id="profile-name-error"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /Enter your name\./);
});

test("TextField retains both description and error associations", () => {
  const html = renderToStaticMarkup(
    <TextField
      id="display-name"
      name="displayName"
      label="Display name"
      description="Shown to teammates."
      error="Enter a display name."
    />,
  );

  assert.match(
    html,
    /aria-describedby="display-name-description display-name-error"/,
  );
});

test("TextField separates label metadata, sublabel context, and persistent help", () => {
  const html = renderToStaticMarkup(
    <TextField
      id="workspace-slug"
      label="Workspace URL"
      labelMeta="Optional"
      sublabel="Used in links shared with your team."
      description="Lowercase letters, numbers, and hyphens only."
      placeholder="operations-eu"
    />,
  );

  assert.match(html, /data-slot="field-label-row"/);
  assert.match(html, /data-slot="field-label-meta"[^>]*>Optional</);
  assert.match(html, /id="workspace-slug-sublabel"/);
  assert.match(html, /id="workspace-slug-description"/);
  assert.match(html, /aria-describedby="workspace-slug-sublabel workspace-slug-description"/);
  assert.match(
    html,
    /class="[^"]*h-\[var\(--lumen-field-height\)\][^"]*px-3\.5[^"]*text-\[0\.9375rem\]/,
  );
  assert.match(html, /rounded-lumen-field/);
  assert.match(html, /border-lumen-control-border/);
  assert.doesNotMatch(html, /rounded-lumen-control/);
});
