import assert from "node:assert/strict";
import test from "node:test";

import { listEntrypoints } from "./components";
import {
  collectBarePackages,
  extractImportSpecifiers,
  formatInstall,
  isBareSpecifier,
  packageNameFor,
  peersForEntrypoint,
  readPackageIdentity,
  type PackageIdentity,
} from "./install";
import { readKitPackage } from "./kit";

// Derived, not hardcoded: the package can be renamed or rescoped without
// these tests asserting a stale identity.
const { name: PACKAGE } = await readKitPackage();

// A fixed identity for the pure formatting tests, independent of the real one.
const IDENTITY: PackageIdentity = {
  name: "example-ui-kit",
  version: "0.1.0",
  registryUrl: "https://www.npmjs.com/package/example-ui-kit",
  reactRange: ">=18.3 <20",
};

async function entrypointFor(specifier: string) {
  const entrypoint = (await listEntrypoints()).find((entry) => entry.specifier === specifier);

  assert.ok(entrypoint, `${specifier} should be a package entrypoint`);

  return entrypoint;
}

test("static, dynamic, and require specifiers are all extracted", () => {
  const source = [
    'import * as React from "react";',
    'import { cn } from "../lib/cn";',
    'export { Link } from "next/link";',
    'const mod = await import("graphology");',
    'const legacy = require("vis-network");',
  ].join("\n");

  assert.deepEqual(extractImportSpecifiers(source), [
    "react",
    "../lib/cn",
    "next/link",
    "graphology",
    "vis-network",
  ]);
});

test("a specifier is only counted once", () => {
  const source = 'import a from "react";\nimport b from "react";';

  assert.deepEqual(extractImportSpecifiers(source), ["react"]);
});

test("deep imports resolve to the providing package", () => {
  assert.equal(packageNameFor("next"), "next");
  assert.equal(packageNameFor("next/link"), "next");
  assert.equal(packageNameFor("@carbon/icons-react"), "@carbon/icons-react");
  assert.equal(packageNameFor("@sigma/node-border/dist/index.js"), "@sigma/node-border");
});

test("relative, absolute, and node builtin specifiers are not packages", () => {
  assert.equal(isBareSpecifier("react"), true);
  assert.equal(isBareSpecifier("@carbon/icons-react"), true);
  assert.equal(isBareSpecifier("./button"), false);
  assert.equal(isBareSpecifier("../lib/cn"), false);
  assert.equal(isBareSpecifier("/abs/path"), false);
  assert.equal(isBareSpecifier("node:fs"), false);
});

test("the module graph is walked transitively through relative imports", async () => {
  // The graph entrypoint re-exports from modules that hold the heavy imports,
  // so a shallow scan of the entrypoint alone would miss them.
  const packages = await collectBarePackages("src/graph/index.ts");

  assert.ok(packages.includes("react"));
  assert.ok(
    packages.length > 2,
    "walking only the barrel file would find almost nothing",
  );
});

test("the core entrypoint needs nothing beyond the React baseline", async () => {
  const peers = await peersForEntrypoint(await entrypointFor(PACKAGE));

  assert.deepEqual(peers, []);
});

test("the icons entrypoint requires the Carbon peer", async () => {
  const peers = await peersForEntrypoint(await entrypointFor(`${PACKAGE}/icons`));

  assert.deepEqual(
    peers.map((peer) => peer.name),
    ["@carbon/icons-react"],
  );
  assert.equal(peers[0].optional, true);
  assert.ok(peers[0].range.length > 0);
});

test("the next entrypoint requires next, matched through a deep import", async () => {
  const peers = await peersForEntrypoint(await entrypointFor(`${PACKAGE}/next`));

  assert.deepEqual(
    peers.map((peer) => peer.name),
    ["next"],
  );
});

test("declared peers that no entrypoint imports are not reported", async () => {
  const identity = (await readPackageIdentity()) as PackageIdentity & Record<string, unknown>;
  const entrypoints = await listEntrypoints();
  const reported = new Set<string>();

  for (const entrypoint of entrypoints) {
    for (const peer of await peersForEntrypoint(entrypoint)) reported.add(peer.name);
  }

  // React is the baseline and is reported on the package, never per entrypoint.
  assert.ok(!reported.has("react"));
  assert.ok(!reported.has("react-dom"));
  assert.ok(identity.reactRange);
});

test("package identity reports the registry URL and version", async () => {
  const identity = await readPackageIdentity();

  assert.equal(identity.name, PACKAGE);
  assert.equal(identity.registryUrl, `https://www.npmjs.com/package/${PACKAGE}`);
  assert.match(identity.version, /^\d+\.\d+\.\d+/);
});

test("the install block is just the package when there are no extra peers", () => {
  const rendered = formatInstall(IDENTITY, []);

  assert.equal(rendered, `\`\`\`bash\nnpm install ${IDENTITY.name}\n\`\`\``);
});

test("extra peers add a second command and are labelled optional", () => {
  const rendered = formatInstall(IDENTITY, [
    { name: "graphology", range: ">=0.26 <1", optional: true },
    { name: "next", range: ">=15 <17", optional: false },
  ]);

  assert.match(rendered, /npm install example-ui-kit/);
  assert.match(rendered, /`graphology` \(>=0\.26 <1, optional peer\)/);
  assert.match(rendered, /`next` \(>=15 <17\)/);
  // Required peers are listed before optional ones in the command.
  assert.match(rendered, /npm install next graphology/);
});
