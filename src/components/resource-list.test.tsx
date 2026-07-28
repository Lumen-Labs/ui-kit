import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  ResourceList,
  ResourceListActions,
  ResourceListContent,
  ResourceListDescription,
  ResourceListItem,
  ResourceListMetadata,
  ResourceListMetadataItem,
  ResourceListTitle,
} from "./resource-list";

test("resource lists preserve list, heading, metadata, and action semantics", () => {
  const html = renderToStaticMarkup(
    <ResourceList aria-label="Recent reports">
      <ResourceListItem aria-labelledby="quarterly-report-title">
        <ResourceListContent>
          <ResourceListTitle id="quarterly-report-title" as="h4">
            <a href="/reports/quarterly">Quarterly report</a>
          </ResourceListTitle>
          <ResourceListDescription>Revenue and retention trends.</ResourceListDescription>
          <ResourceListMetadata aria-label="Report metadata">
            <ResourceListMetadataItem>Updated today</ResourceListMetadataItem>
            <ResourceListMetadataItem>PDF</ResourceListMetadataItem>
          </ResourceListMetadata>
        </ResourceListContent>
        <ResourceListActions aria-label="Quarterly report actions">
          <button type="button">Download</button>
        </ResourceListActions>
      </ResourceListItem>
    </ResourceList>,
  );

  assert.match(html, /<ul[^>]*data-slot="resource-list"[^>]*aria-label="Recent reports"/);
  assert.match(html, /<li[^>]*data-slot="resource-list-item"[^>]*aria-labelledby="quarterly-report-title"/);
  assert.match(html, /<h4[^>]*id="quarterly-report-title"/);
  assert.match(html, /<ul[^>]*data-slot="resource-list-metadata"[^>]*aria-label="Report metadata"/);
  assert.match(html, /data-slot="resource-list-actions"[^>]*aria-label="Quarterly report actions"/);
});
