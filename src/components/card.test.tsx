import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardTitle,
} from "./card";

test("Card composes semantic content without forcing interaction", () => {
  const html = renderToStaticMarkup(
    <Card>
      <CardHeader>
        <CardTitle>Workspace usage</CardTitle>
        <CardDescription>Current billing period</CardDescription>
      </CardHeader>
      <CardContent>42 hours</CardContent>
      <CardFooter>Updated today</CardFooter>
    </Card>,
  );

  assert.match(html, /^<div[^>]*data-slot="card"/);
  assert.match(html, /<h3[^>]*data-slot="card-title"/);
  assert.match(html, /data-slot="card-description"/);
  assert.match(html, /data-slot="card-content"/);
  assert.match(html, /data-slot="card-footer"/);
  assert.doesNotMatch(html, /tabindex|role="button"/i);
});

test("CardGroup joins cards into one boxed surface and exposes opt-in motion", () => {
  const html = renderToStaticMarkup(
    <>
      <CardGroup columns={3} motion="stagger">
        <Card><CardContent>Search</CardContent></Card>
        <Card><CardContent>Analyze</CardContent></Card>
        <Card><CardContent>Publish</CardContent></Card>
      </CardGroup>
      <Card motion="enter"><CardContent>Standalone</CardContent></Card>
    </>,
  );

  assert.match(html, /data-slot="card-group"/);
  assert.match(html, /data-columns="3"/);
  assert.match(html, /data-lumen-motion="card-stagger"/);
  assert.match(html, /data-lumen-motion="card-enter"/);
  assert.equal((html.match(/data-slot="card"/g) ?? []).length, 4);
});
