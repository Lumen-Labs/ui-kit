import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const tokensUrl = new URL("./core.tokens.json", import.meta.url);
const stylesUrl = new URL("../styles.css", import.meta.url);

test("token bundle uses the stable DTCG token shape", () => {
  const tokens = JSON.parse(readFileSync(tokensUrl, "utf8")) as Record<
    string,
    unknown
  >;
  const primary = (
    tokens.color as {
      brand: { 500: { $type: string; $value: unknown } };
    }
  ).brand[500];

  assert.equal(
    tokens.$schema,
    "https://www.designtokens.org/schemas/2025.10/format.json",
  );
  assert.equal(primary.$type, "color");
  assert.ok(primary.$value);

  const shell = (
    tokens.layout as {
      shell: {
        headerHeight: { $type: string; $value: { unit: string; value: number } };
        railWidth: { $type: string; $value: { unit: string; value: number } };
        sidebarWidth: { $type: string; $value: { unit: string; value: number } };
      };
    }
  ).shell;

  assert.deepEqual(shell.headerHeight, {
    $type: "dimension",
    $value: { value: 56, unit: "px" },
  });
  assert.deepEqual(shell.sidebarWidth.$value, { value: 240, unit: "px" });
  assert.deepEqual(shell.railWidth.$value, { value: 272, unit: "px" });

  const motion = tokens.motion as {
    duration: { fast: { $value: { unit: string; value: number } }; standard: { $value: { unit: string; value: number } } };
    easing: { productive: { $value: number[] } };
  };

  assert.deepEqual(motion.duration.fast.$value, { value: 120, unit: "ms" });
  assert.deepEqual(motion.duration.standard.$value, { value: 180, unit: "ms" });
  assert.deepEqual(motion.easing.productive.$value, [0.2, 0, 0, 1]);

  const radius = tokens.radius as {
    button: { $value: { unit: string; value: number } };
    composer: { $value: { unit: string; value: number } };
    control: { $value: { unit: string; value: number } };
    field: { $value: { unit: string; value: number } };
    toolbar: { $value: { unit: string; value: number } };
  };

  assert.deepEqual(radius.control.$value, { value: 6, unit: "px" });
  assert.deepEqual(radius.button.$value, { value: 8, unit: "px" });
  assert.deepEqual(radius.field.$value, { value: 10, unit: "px" });
  assert.deepEqual(radius.composer.$value, { value: 14, unit: "px" });
  assert.deepEqual(radius.toolbar.$value, { value: 10, unit: "px" });

  const controls = tokens.control as {
    fieldHeight: { $value: { unit: string; value: number } };
  };

  assert.deepEqual(controls.fieldHeight.$value, { value: 42, unit: "px" });
});

test("token bundle exposes the requested Brainapi palette", () => {
  const tokens = JSON.parse(readFileSync(tokensUrl, "utf8")) as {
    color: {
      palette: {
        brainapi: Record<
          | "actionSecondary"
          | "actionSecondaryHover"
          | "background"
          | "border"
          | "controlBorder"
          | "codeBackground"
          | "codeForeground"
          | "primary"
          | "secondary",
          { $type: string; $value: { hex: string } }
        >;
      };
    };
  };
  const brainapi = tokens.color.palette.brainapi;

  assert.equal(brainapi.primary.$type, "color");
  assert.equal(brainapi.primary.$value.hex, "#CFFE25");
  assert.equal(brainapi.secondary.$value.hex, "#FFFFFF");
  assert.equal(brainapi.background.$value.hex, "#000000");
  assert.equal(brainapi.border.$value.hex, "#262626");
  assert.equal(brainapi.controlBorder.$value.hex, "#595959");
  assert.equal(brainapi.codeBackground.$value.hex, "#050505");
  assert.equal(brainapi.codeForeground.$value.hex, "#F5F5F5");
  assert.equal(brainapi.actionSecondary.$value.hex, "#171717");
  assert.equal(brainapi.actionSecondaryHover.$value.hex, "#262626");
});

test("Brainapi palette maps its colors onto the semantic CSS contract", () => {
  const styles = readFileSync(stylesUrl, "utf8");

  assert.match(styles, /\[data-lumen-palette="brainapi"\]\s*\{/);
  assert.match(styles, /--lumen-color-primary:\s*#cffe25;/i);
  assert.match(styles, /--lumen-color-secondary:\s*#ffffff;/i);
  assert.match(styles, /--lumen-color-background:\s*#000000;/i);
  assert.match(styles, /--lumen-color-border:\s*#262626;/i);
  assert.match(styles, /--lumen-color-control-border:\s*#595959;/i);
  assert.match(styles, /--lumen-color-action-secondary:\s*#171717;/i);
  assert.match(styles, /--lumen-color-action-secondary-hover:\s*#262626;/i);
  assert.match(styles, /--lumen-color-on-action-secondary:\s*#ffffff;/i);
  assert.match(styles, /--lumen-color-on-primary:\s*#000000;/i);
  assert.match(styles, /--lumen-code-background:\s*#050505;/i);
  assert.match(styles, /--lumen-code-foreground:\s*#f5f5f5;/i);
  assert.match(styles, /--lumen-code-keyword:\s*#d8ff64;/i);
  assert.match(styles, /--color-lumen-secondary:\s*var\(--lumen-color-secondary\);/);
  assert.match(
    styles,
    /--color-lumen-control-border:\s*var\(--lumen-color-control-border\);/,
  );
  assert.match(
    styles,
    /--color-lumen-action-secondary:\s*var\(--lumen-color-action-secondary\);/,
  );
  assert.match(
    styles,
    /\[data-lumen-palette="brainapi"\][^}]*--lumen-checkbox-mark:[^;]*stroke='%23000000'/s,
  );
  assert.match(
    styles,
    /\[data-slot="checkbox"\]:checked\s*\{[^}]*background-image:\s*var\(--lumen-checkbox-mark\);/s,
  );
});

test("graph category tokens expose six palette-aware ring colors", () => {
  const styles = readFileSync(stylesUrl, "utf8");
  const tokens = JSON.parse(readFileSync(tokensUrl, "utf8")) as {
    color: {
      data: Record<string, { $type: string; $value: { hex: string } }>;
      palette: {
        lumenDark: {
          data: Record<string, { $type: string; $value: { hex: string } }>;
        };
        brainapi: {
          data: Record<string, { $type: string; $value: { hex: string } }>;
        };
      };
    };
  };

  assert.deepEqual(Object.keys(tokens.color.data), [
    "category1",
    "category2",
    "category3",
    "category4",
    "category5",
    "category6",
  ]);
  assert.deepEqual(Object.keys(tokens.color.palette.brainapi.data), [
    "category1",
    "category2",
    "category3",
    "category4",
    "category5",
    "category6",
  ]);
  assert.deepEqual(Object.keys(tokens.color.palette.lumenDark.data), [
    "category1",
    "category2",
    "category3",
    "category4",
    "category5",
    "category6",
  ]);

  for (let index = 1; index <= 6; index += 1) {
    assert.equal(tokens.color.data[`category${index}`]?.$type, "color");
    assert.equal(tokens.color.palette.lumenDark.data[`category${index}`]?.$type, "color");
    assert.match(tokens.color.data[`category${index}`]?.$value.hex ?? "", /^#[0-9A-F]{6}$/);
    assert.match(
      styles,
      new RegExp(`--lumen-graph-category-${index}:\\s*#[0-9a-f]{6};`, "i"),
    );
  }
});
