import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { CharacterCount, PasswordField } from "../index";

test("character count describes the field with its remaining count", () => {
  const markup = renderToStaticMarkup(
    <CharacterCount
      id="summary"
      label="Summary"
      maxLength={20}
      defaultValue="Lumen"
    />,
  );

  assert.match(markup, /maxLength="20"/);
  assert.match(markup, /aria-describedby="summary-count"/);
  assert.match(markup, />15 characters remaining</);
});

test("password field starts concealed with a named reveal control", () => {
  const markup = renderToStaticMarkup(
    <PasswordField id="password" label="Password" />,
  );

  assert.match(markup, /type="password"/);
  assert.match(markup, /aria-controls="password"/);
  assert.match(markup, />Show password</);
});

test("composed fields expose label metadata and sublabel associations", () => {
  const markup = renderToStaticMarkup(
    <>
      <CharacterCount
        id="release-note"
        label="Release note"
        labelMeta="Optional"
        sublabel="Shown in the activity feed."
        maxLength={80}
      />
      <PasswordField
        id="new-password"
        label="Password"
        labelMeta="Required"
        sublabel="Use a unique workspace password."
      />
    </>,
  );

  assert.match(markup, /data-slot="field-label-meta"[^>]*>Optional</);
  assert.match(markup, /id="release-note-sublabel"/);
  assert.match(markup, /aria-describedby="release-note-sublabel release-note-count"/);
  assert.match(markup, /data-slot="field-label-meta"[^>]*>Required</);
  assert.match(markup, /aria-describedby="new-password-sublabel"/);
});
