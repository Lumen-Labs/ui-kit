import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  CodeBlock,
  CodeToken,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./data-display";

test("data components retain native table and description-list semantics", () => {
  const html = renderToStaticMarkup(
    <>
      <Table containerClassName="records-scroll" containerProps={{ "aria-label": "Scrollable records", tabIndex: 0 }}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Quarterly report</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <DescriptionList>
        <DescriptionTerm>Status</DescriptionTerm>
        <DescriptionDetails>Ready</DescriptionDetails>
      </DescriptionList>
    </>,
  );

  assert.match(html, /<table/);
  assert.match(html, /data-slot="table-container"[^>]*aria-label="Scrollable records"[^>]*tabindex="0"[^>]*class="[^"]*records-scroll/);
  assert.match(html, /<th[^>]*scope="col"/);
  assert.match(html, /<dl/);
  assert.match(html, /<dt/);
  assert.match(html, /<dd/);
});

test("lists and code examples expose semantic structure and syntax roles", () => {
  const html = renderToStaticMarkup(
    <>
      <List aria-label="Setup steps">
        <ListItem>Connect a data source</ListItem>
      </List>
      <CodeBlock aria-label="React example">
        <code>
          <CodeToken tone="keyword">import</CodeToken>{" { Button } "}
          <CodeToken tone="keyword">from</CodeToken>{" "}
          <CodeToken tone="string">&quot;lumen-ui-kit&quot;</CodeToken>
        </code>
      </CodeBlock>
    </>,
  );

  assert.match(html, /<ul[^>]*data-slot="list"[^>]*aria-label="Setup steps"/);
  assert.match(html, /<li[^>]*data-slot="list-item"/);
  assert.match(html, /<pre[^>]*data-slot="code-block"[^>]*aria-label="React example"/);
  assert.match(html, /<code><span data-slot="code-token" data-tone="keyword"/);
  assert.match(html, /data-tone="string"/);
});
