import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  Checkbox,
  ChoiceField,
  ChoiceFieldDescription,
  ChoiceFieldLabel,
  FieldLabel,
  FieldLabelRow,
  FieldLabelMeta,
  FieldSublabel,
  FileInput,
  Radio,
  Select,
  Switch,
  Textarea,
} from "./forms";

test("form primitives preserve native controls", () => {
  const html = renderToStaticMarkup(
    <form>
      <Textarea id="notes" name="notes" />
      <Select id="country" name="country" defaultValue="it">
        <option value="it">Italy</option>
      </Select>
      <Checkbox id="terms" name="terms" aria-label="Accept terms" />
      <Radio id="plan" name="plan" value="pro" aria-label="Pro plan" />
    </form>,
  );

  assert.match(html, /<textarea[^>]*id="notes"/);
  assert.match(html, /<select[^>]*id="country"/);
  assert.match(html, /<select[^>]*class="[^"]*pr-11/);
  assert.match(html, /<input[^>]*type="checkbox"[^>]*id="terms"/);
  assert.match(html, /<input[^>]*type="radio"[^>]*id="plan"/);
});

test("Select keeps its default field treatment and supports a ghost variant", () => {
  const html = renderToStaticMarkup(
    <>
      <Select aria-label="Default team" defaultValue="design">
        <option value="design">Design</option>
      </Select>
      <Select aria-label="Ghost team" defaultValue="platform" variant="ghost">
        <option value="platform">Platform</option>
      </Select>
    </>,
  );

  assert.match(html, /<select[^>]*data-variant="default"/);
  assert.match(
    html,
    /<select[^>]*data-variant="ghost"[^>]*class="[^"]*border-transparent[^"]*bg-transparent[^"]*shadow-none/,
  );
  assert.match(html, /hover:border-lumen-control-border/);
  assert.match(html, /focus-visible:bg-lumen-surface/);
});

test("FileInput centers its selector button within the shared field shell", () => {
  const html = renderToStaticMarkup(
    <FileInput id="attachment" aria-label="Attachment" />,
  );

  assert.match(html, /<input[^>]*type="file"/);
  assert.match(html, /class="[^"]*p-1[^"]*file:h-8/);
  assert.match(html, /file:align-middle/);
  assert.match(html, /file:rounded-lumen-button/);
  assert.match(html, /file:border-lumen-control-border/);
  assert.doesNotMatch(html, /p-1\.5/);
});

test("native color inputs expose an edge-to-edge swatch without nested chrome", () => {
  const styles = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

  assert.match(
    styles,
    /\[data-slot="input"\]\[type="color"\]\s*\{[^}]*overflow:\s*hidden;[^}]*padding:\s*0;/s,
  );
  assert.match(
    styles,
    /::-webkit-color-swatch-wrapper\s*\{[^}]*padding:\s*0;/s,
  );
  assert.match(
    styles,
    /::-webkit-color-swatch\s*\{[^}]*border:\s*0;/s,
  );
  assert.match(styles, /::-moz-color-swatch\s*\{[^}]*border:\s*0;/s);
});

test("field and choice anatomy supports labels, metadata, sublabels, and large click targets", () => {
  const html = renderToStaticMarkup(
    <>
      <FieldLabelRow>
        <FieldLabel htmlFor="region">Region</FieldLabel>
        <FieldLabelMeta>Required</FieldLabelMeta>
      </FieldLabelRow>
      <FieldSublabel>Controls where data is stored.</FieldSublabel>
      <ChoiceField>
        <Checkbox id="digest" aria-describedby="digest-description" />
        <span>
          <ChoiceFieldLabel htmlFor="digest">Weekly digest</ChoiceFieldLabel>
          <ChoiceFieldDescription id="digest-description">Receive one summary every Monday.</ChoiceFieldDescription>
        </span>
      </ChoiceField>
    </>,
  );

  assert.match(html, /data-slot="field-label-meta"[^>]*>Required</);
  assert.match(html, /data-slot="field-label-row"/);
  assert.match(html, /data-slot="field-sublabel"/);
  assert.match(html, /data-slot="choice-field"/);
  assert.match(html, /data-slot="choice-field-label"/);
  assert.match(html, /<label[^>]*for="digest"/);
  assert.match(html, /aria-describedby="digest-description"/);
  assert.match(html, /data-slot="choice-field-description"/);
  assert.match(html, /class="[^"]*min-h-11/);
});

test("choice controls use custom enterprise geometry without losing native inputs", () => {
  const html = renderToStaticMarkup(
    <>
      <Checkbox aria-label="Select row" />
      <Radio aria-label="Daily" />
      <Switch aria-label="Automatic refresh" />
    </>,
  );

  assert.match(html, /data-slot="checkbox"[^>]*class="[^"]*appearance-none/);
  assert.match(html, /data-slot="radio"[^>]*class="[^"]*appearance-none/);
  assert.match(html, /data-slot="switch-track"/);
  assert.match(html, /data-slot="switch-thumb"/);
});

test("Switch retains native checkbox behavior and exposes switch semantics", () => {
  const html = renderToStaticMarkup(
    <Switch id="alerts" name="alerts" aria-label="Email alerts" />,
  );

  assert.match(html, /<input[^>]*type="checkbox"/);
  assert.match(html, /role="switch"/);
  assert.match(html, /id="alerts"/);
});
