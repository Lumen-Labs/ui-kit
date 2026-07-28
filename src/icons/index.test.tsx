import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  AddIcon,
  CenterSelectionIcon,
  FitIcon,
  Icon,
  MapIcon,
  MaximizeIcon,
  PhysicsIcon,
  RestartIcon,
  SearchIcon,
  WarningFilledIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "./index";

test("icons are decorative and unfocusable by default", () => {
  const markup = renderToStaticMarkup(<Icon source={AddIcon} />);

  assert.match(markup, /data-slot="icon"/);
  assert.match(markup, /aria-hidden="true"/);
  assert.match(markup, /focusable="false"/);
  assert.doesNotMatch(markup, /role="img"/);
});

test("graph viewport icons are available through curated Lumen aliases", () => {
  const markup = renderToStaticMarkup(
    <>
      {[ZoomInIcon, ZoomOutIcon, FitIcon, CenterSelectionIcon, RestartIcon, MapIcon, MaximizeIcon, PhysicsIcon]
        .map((source, index) => <Icon key={index} source={source} />)}
    </>,
  );

  assert.equal((markup.match(/<svg/g) ?? []).length, 8);
});

test("informative icons expose one accessible image label", () => {
  const markup = renderToStaticMarkup(
    <Icon source={WarningFilledIcon} label="Warning" size={24} tone="warning" />,
  );

  assert.match(markup, /role="img"/);
  assert.match(markup, /aria-label="Warning"/);
  assert.doesNotMatch(markup, /aria-hidden="true"/);
  assert.match(markup, /width="24"/);
  assert.match(markup, /height="24"/);
  assert.match(markup, /text-lumen-warning/);
});

test("curated icon sources remain composable and tree-shakeable", () => {
  const markup = renderToStaticMarkup(
    <>
      <Icon source={AddIcon} />
      <Icon source={SearchIcon} tone="muted" />
    </>,
  );

  assert.match(markup, /text-lumen-muted-foreground/);
  assert.equal((markup.match(/<svg/g) ?? []).length, 2);
});
