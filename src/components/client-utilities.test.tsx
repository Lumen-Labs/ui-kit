import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { ClipboardCopy, InlineEdit } from "../index";

test("clipboard copy has an explicit accessible action", () => {
  const markup = renderToStaticMarkup(
    <ClipboardCopy value="npm install lumen-ui-kit" />,
  );

  assert.match(markup, /<code/);
  assert.match(markup, /<button[^>]*>Copy<\/button>/);
  assert.match(markup, /aria-live="polite"/);
});

test("inline edit begins in a readable non-form state", () => {
  const markup = renderToStaticMarkup(
    <InlineEdit label="Project name" value="Lumen" onSave={() => undefined} />,
  );

  assert.match(markup, /Project name/);
  assert.match(markup, />Lumen</);
  assert.match(markup, /<button[^>]*>Edit<\/button>/);
  assert.doesNotMatch(markup, /<form/);
});
