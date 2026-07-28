import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";

import {
  PromptComposer,
  PromptComposerActions,
  PromptComposerAttachment,
  PromptComposerAttachments,
  PromptComposerControls,
  PromptComposerContextDetails,
  PromptComposerContextMeter,
  PromptComposerField,
  PromptComposerSubmit,
  PromptComposerToolbar,
} from "./prompt-composer";

test("PromptComposer surface exposes a cohesive field and focus-within affordance", () => {
  const html = renderToStaticMarkup(<PromptComposer>content</PromptComposer>);

  assert.match(html, /data-slot="prompt-composer"/);
  assert.match(html, /overflow-hidden/);
  assert.match(html, /rounded-lumen-composer/);
  assert.match(html, /backdrop-blur-xl/);
  assert.match(html, /shadow-\[var\(--lumen-shadow-card\)\]/);
  assert.match(html, /focus-within:ring-2/);
});

test("PromptComposerField keeps a programmatic label and native textarea", () => {
  const html = renderToStaticMarkup(
    <PromptComposerField id="composer-message" label="Message" placeholder="Ask anything" />,
  );

  assert.match(html, /<label[^>]*for="composer-message"[^>]*class="sr-only"[^>]*>Message<\/label>/);
  assert.match(html, /<textarea[^>]*id="composer-message"/);
  assert.match(html, /placeholder="Ask anything"/);
  assert.match(html, /min-h-\[4\.5rem\]/);
  assert.match(html, /text-\[0\.9375rem\]/);
  assert.doesNotMatch(html, /undefined/);
});

test("PromptComposerField wires description and error associations", () => {
  const html = renderToStaticMarkup(
    <PromptComposerField
      id="composer"
      label="Message"
      description="Shift+Enter adds a new line"
      error="Attachment is too large"
    />,
  );

  assert.match(html, /aria-describedby="composer-description composer-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /id="composer-error"[^>]*role="alert"/);
});

test("PromptComposerSubmit sends by default and stops while streaming", () => {
  const send = renderToStaticMarkup(
    <PromptComposerSubmit sendIcon={<svg />} sendLabel="Send message" />,
  );
  assert.match(send, /data-slot="prompt-composer-submit"/);
  assert.match(send, /data-variant="primary"/);
  assert.match(send, /aria-label="Send message"/);

  const stop = renderToStaticMarkup(
    <PromptComposerSubmit isStreaming stopIcon={<svg />} stopLabel="Stop generating" />,
  );
  assert.match(stop, /data-streaming="true"/);
  assert.match(stop, /data-variant="secondary"/);
  assert.match(stop, /aria-label="Stop generating"/);
});

test("PromptComposerAttachment names its item and remove control", () => {
  const html = renderToStaticMarkup(
    <PromptComposerAttachments>
      <PromptComposerAttachment name="chart.png" size="82 KB" onRemove={() => {}} />
    </PromptComposerAttachments>,
  );

  assert.match(html, /data-slot="prompt-composer-attachments"/);
  assert.match(html, /grid/);
  assert.match(html, /bg-lumen-surface-muted\/50/);
  assert.match(html, /chart\.png/);
  assert.match(html, /82 KB/);
  assert.match(html, /aria-label="Remove chart.png"/);
  assert.match(html, /min-h-11/);
});

test("PromptComposer regions compose without extra semantics", () => {
  const html = renderToStaticMarkup(
    <PromptComposerToolbar>
      <PromptComposerControls>controls</PromptComposerControls>
      <PromptComposerActions>actions</PromptComposerActions>
    </PromptComposerToolbar>,
  );

  assert.match(html, /data-slot="prompt-composer-toolbar"/);
  assert.doesNotMatch(html, /border-t/);
  assert.match(html, /bg-transparent/);
  assert.match(html, /flex-wrap/);
  assert.match(html, /data-slot="prompt-composer-controls"[^>]*rounded-lumen-field/);
  assert.match(html, /data-slot="prompt-composer-controls"[^>]*shadow-inner/);
  assert.match(html, /data-slot="prompt-composer-actions"/);
});

test("PromptComposerSubmit matches the composer shell radius without losing button depth", () => {
  const html = renderToStaticMarkup(
    <PromptComposerSubmit size="icon" sendIcon={<svg />} sendLabel="Send message" />,
  );

  assert.match(html, /data-slot="prompt-composer-submit"/);
  assert.match(html, /data-size="icon"/);
  assert.match(html, /rounded-lumen-composer/);
  assert.doesNotMatch(html, /rounded-full/);
  assert.match(html, /shadow-lumen-button/);
});

test("PromptComposerContextDetails exposes a labeled token breakdown", () => {
  const html = renderToStaticMarkup(
    <PromptComposerContextDetails
      used={14_400}
      total={80_000}
      reserved={8_000}
      segments={[
        { id: "system", label: "System prompt", tokens: 3_600, tone: "neutral" },
        { id: "messages", label: "Your messages", tokens: 4_200, tone: "primary" },
      ]}
    />,
  );

  assert.match(html, /data-slot="prompt-composer-context-details"/);
  assert.match(html, /18% of context used/);
  assert.match(html, /14\.4k of 80k tokens/);
  assert.match(html, /aria-label="Context usage breakdown"/);
  assert.match(html, /System prompt/);
  assert.match(html, /65\.6k/);
  assert.match(html, /8k tokens reserved for output/);
});

test("PromptComposerContextMeter provides an accessible popover trigger", () => {
  const html = renderToStaticMarkup(
    <PromptComposerContextMeter used={14_400} total={80_000} segments={[]} />,
  );

  assert.match(html, /data-slot="prompt-composer-context-trigger"/);
  assert.match(html, /aria-label="Context usage: 18 percent"/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /18% context/);
});
