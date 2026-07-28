import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  DateInput,
  ErrorSummary,
  ErrorSummaryItem,
  ErrorSummaryList,
  ErrorSummaryTitle,
  Input,
  InputGroup,
  InputGroupAddon,
} from "../index";

test("error summary is focusable and links back to invalid fields", () => {
  const markup = renderToStaticMarkup(
    <ErrorSummary>
      <ErrorSummaryTitle>There is a problem</ErrorSummaryTitle>
      <ErrorSummaryList>
        <ErrorSummaryItem href="#email">Enter a work email</ErrorSummaryItem>
      </ErrorSummaryList>
    </ErrorSummary>,
  );

  assert.match(markup, /role="alert"/);
  assert.match(markup, /tabindex="-1"/);
  assert.match(markup, /href="#email"/);
});

test("error summary title can match the surrounding heading level", () => {
  const markup = renderToStaticMarkup(
    <ErrorSummary>
      <ErrorSummaryTitle as="h4">There is a problem</ErrorSummaryTitle>
    </ErrorSummary>,
  );

  assert.match(markup, /<h4[^>]*>There is a problem<\/h4>/);
});

test("date input groups memorable date segments with one legend", () => {
  const markup = renderToStaticMarkup(
    <DateInput
      id="start-date"
      legend="Start date"
      description="For example, 31 3 2026"
      error="Enter a complete date"
    />,
  );

  assert.match(markup, /<fieldset[^>]*aria-describedby="start-date-description start-date-error"/);
  assert.match(markup, /<legend[^>]*>Start date<\/legend>/);
  assert.match(markup, /id="start-date-day"/);
  assert.match(markup, /id="start-date-month"/);
  assert.match(markup, /id="start-date-year"/);
});

test("input groups keep addons and controls in one named composition", () => {
  const markup = renderToStaticMarkup(
    <InputGroup aria-label="Website address">
      <InputGroupAddon>https://</InputGroupAddon>
      <Input aria-label="Domain" />
    </InputGroup>,
  );

  assert.match(markup, /role="group"/);
  assert.match(markup, /aria-label="Website address"/);
  assert.match(markup, /data-slot="input-group-addon"/);
  assert.match(markup, /min-h-\[var\(--lumen-field-height\)\]/);
  assert.match(markup, /rounded-l-lumen-field/);
  assert.match(markup, /rounded-r-lumen-field/);
});
