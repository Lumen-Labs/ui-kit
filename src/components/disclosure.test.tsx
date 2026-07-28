import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Disclosure, DisclosureContent, DisclosureTrigger } from "./disclosure";

test("Disclosure uses native details and summary behavior", () => {
  const html = renderToStaticMarkup(
    <Disclosure>
      <DisclosureTrigger>Advanced settings</DisclosureTrigger>
      <DisclosureContent>Optional controls</DisclosureContent>
    </Disclosure>,
  );

  assert.match(html, /^<details/);
  assert.match(html, /<summary/);
  assert.match(html, /Optional controls/);
});
