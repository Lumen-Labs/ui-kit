import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { NextLink, NextLinkButton } from "./index";

test("NextLink renders semantic internal navigation without a client boundary", () => {
  const html = renderToStaticMarkup(<NextLink href="/reports">Reports</NextLink>);

  assert.match(html, /^<a[^>]*href="\/reports"/);
  assert.match(html, /text-lumen-link/);
});

test("NextLinkButton stays a link while using button presentation", () => {
  const html = renderToStaticMarkup(
    <NextLinkButton href="/onboarding" variant="primary">
      Start setup
    </NextLinkButton>,
  );

  assert.match(html, /^<a[^>]*href="\/onboarding"/);
  assert.match(html, /bg-lumen-primary/);
  assert.doesNotMatch(html, /role="button"/);
});
