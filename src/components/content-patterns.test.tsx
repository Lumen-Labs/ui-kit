import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  Avatar,
  AvatarGroup,
  AvatarGroupItem,
  Callout,
  SummaryDetails,
  SummaryList,
  SummaryRow,
  SummaryTerm,
  TaskList,
  TaskListItem,
  Truncate,
} from "../index";

test("content patterns preserve list and description-list semantics", () => {
  const markup = renderToStaticMarkup(
    <>
      <AvatarGroup aria-label="Project members">
        <AvatarGroupItem><Avatar alt="" fallback="AR" /></AvatarGroupItem>
        <AvatarGroupItem><Avatar alt="" fallback="MB" /></AvatarGroupItem>
      </AvatarGroup>
      <SummaryList>
        <SummaryRow><SummaryTerm>Owner</SummaryTerm><SummaryDetails>Amira Reed</SummaryDetails></SummaryRow>
      </SummaryList>
    </>,
  );

  assert.match(markup, /<ul[^>]*aria-label="Project members"/);
  assert.doesNotMatch(markup, /data-slot=avatar\]\]:block/);
  assert.match(markup, /<dl/);
  assert.match(markup, /<dt[^>]*>Owner<\/dt>/);
  assert.match(markup, /<dd[^>]*>Amira Reed<\/dd>/);
});

test("task list links announce hint and status text", () => {
  const markup = renderToStaticMarkup(
    <TaskList>
      <TaskListItem
        href="/profile"
        title="Contact details"
        hint="Add a work email"
        status="Incomplete"
      />
    </TaskList>,
  );

  assert.match(markup, /<ol/);
  assert.match(markup, /href="\/profile"/);
  assert.match(markup, /aria-describedby="[^"]+ [^"]+"/);
  assert.match(markup, />Incomplete</);
});

test("callouts and truncation are informational rather than live alerts", () => {
  const markup = renderToStaticMarkup(
    <>
      <Callout title="Before you continue">Keep your recovery code nearby.</Callout>
      <Truncate lines={2}>A deliberately long supporting explanation.</Truncate>
    </>,
  );

  assert.doesNotMatch(markup, /role="alert"/);
  assert.match(markup, /data-slot="callout"/);
  assert.match(markup, /data-lines="2"/);
});
