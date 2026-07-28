import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Grid, Inline, Stack } from "./layout";

test("layout primitives expose tokenized gaps including connected zero-gap composition", () => {
  const html = renderToStaticMarkup(
    <>
      <Stack gap="none">Stack</Stack>
      <Inline gap="xs">Inline</Inline>
      <Grid gap="lg">Grid</Grid>
    </>,
  );

  assert.match(html, /data-gap="none"[^>]*data-slot="stack"/);
  assert.match(html, /data-gap="xs"[^>]*data-slot="inline"/);
  assert.match(html, /data-gap="lg"[^>]*data-slot="grid"/);
  assert.match(html, /class="[^"]*gap-0/);
});
