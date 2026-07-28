import assert from "node:assert/strict";
import test from "node:test";

import { extractStories, listExamples, listExamplesFor, storyUsesComponent } from "./examples";

const WORKBENCH = [
  '      <Story title="Action hierarchy" description="One clear primary action." wide>',
  "        <Inline>",
  "          <Button>Create report</Button>",
  "        </Inline>",
  "      </Story>",
  '      <Story title="Sizes" description="Choose by density.">',
  "        <Button size=\"small\">Small</Button>",
  "      </Story>",
].join("\n");

test("stories are extracted with their title, description, and dedented body", () => {
  const stories = extractStories(WORKBENCH);

  assert.equal(stories.length, 2);
  assert.equal(stories[0].title, "Action hierarchy");
  assert.equal(stories[0].description, "One clear primary action.");
  assert.equal(
    stories[0].code,
    ["<Inline>", "  <Button>Create report</Button>", "</Inline>"].join("\n"),
  );
});

test("a story without a description still yields usable code", () => {
  const stories = extractStories('<Story title="Bare">\n  <Button />\n</Story>');

  assert.equal(stories[0].description, "");
  assert.equal(stories[0].code, "<Button />");
});

test("an unterminated story is skipped rather than swallowing the rest of the file", () => {
  assert.deepEqual(extractStories('<Story title="Open">\n  <Button />'), []);
});

test("component matching requires a rendered element, not a mention", () => {
  const story = { title: "", description: "", code: '<Button>Use the ButtonGroup helper</Button>' };

  assert.equal(storyUsesComponent(story, "Button"), true);
  assert.equal(storyUsesComponent(story, "ButtonGroup"), false);
});

test("the workbench yields real examples for a catalogued component", async () => {
  const stories = await listExamples();

  assert.ok(stories.length > 0, "the workbench should contain stories");

  const buttonExamples = await listExamplesFor("Button");

  assert.ok(buttonExamples.length > 0);
  assert.ok(buttonExamples.every((example) => example.code.includes("<Button")));
});
