import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { gunzipSync, gzipSync } from "node:zlib";

import { createZip, crc32, toDosDateTime } from "./zip";

const FIXED_DATE = new Date(2026, 6, 26, 10, 30, 20);

function readUint32(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

function readUint16(bytes: Uint8Array, offset: number) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(offset, true);
}

test("crc32 matches the known IEEE check value", () => {
  // The standard CRC-32 check vector: "123456789" -> 0xCBF43926.
  assert.equal(crc32(new TextEncoder().encode("123456789")), 0xcbf43926);
  assert.equal(crc32(new Uint8Array()), 0);
});

test("crc32 agrees with zlib for real content", () => {
  const payload = new TextEncoder().encode("# Lumen\n\nA design system.\n");
  // gzip stores the CRC-32 of the uncompressed data in its last 8 bytes.
  const gzipped = gzipSync(Buffer.from(payload));
  const expected = gzipped.readUInt32LE(gzipped.length - 8);

  assert.equal(crc32(payload), expected);
  assert.equal(gunzipSync(gzipped).toString(), "# Lumen\n\nA design system.\n");
});

test("dos timestamps encode the date and the two-second time resolution", () => {
  const { time, date } = toDosDateTime(FIXED_DATE);

  assert.equal((date >> 9) + 1980, 2026);
  assert.equal((date >> 5) & 0x0f, 7);
  assert.equal(date & 0x1f, 26);
  assert.equal(time >> 11, 10);
  assert.equal((time >> 5) & 0x3f, 30);
  assert.equal((time & 0x1f) * 2, 20);
});

test("dates before the DOS epoch are clamped rather than encoded negative", () => {
  const { date } = toDosDateTime(new Date(1970, 0, 1));

  assert.ok(date >= 0);
  assert.equal((date >> 9) + 1980, 1980);
});

test("an archive carries local headers, a central directory, and an end record", () => {
  const zip = createZip(
    [
      { path: "SKILL.md", content: "# Skill\n" },
      { path: "references/foundations.md", content: "# Foundations\n" },
    ],
    FIXED_DATE,
  );

  assert.equal(readUint32(zip, 0), 0x04034b50);

  const endOffset = zip.length - 22;

  assert.equal(readUint32(zip, endOffset), 0x06054b50);
  assert.equal(readUint16(zip, endOffset + 8), 2);
  assert.equal(readUint16(zip, endOffset + 10), 2);

  const directorySize = readUint32(zip, endOffset + 12);
  const directoryOffset = readUint32(zip, endOffset + 16);

  assert.equal(directoryOffset + directorySize, endOffset);
  assert.equal(readUint32(zip, directoryOffset), 0x02014b50);
});

test("stored entries record matching sizes and a real checksum", () => {
  const content = "# Skill\n";
  const zip = createZip([{ path: "SKILL.md", content }], FIXED_DATE);
  const expected = crc32(new TextEncoder().encode(content));

  assert.equal(readUint32(zip, 14), expected);
  assert.equal(readUint32(zip, 18), content.length);
  assert.equal(readUint32(zip, 22), content.length);
  assert.equal(readUint16(zip, 8), 0, "entries are stored, not deflated");
  assert.equal(readUint16(zip, 6) & 0x0800, 0x0800, "names are flagged UTF-8");
});

test("an empty archive is still a valid zip", () => {
  const zip = createZip([], FIXED_DATE);

  assert.equal(zip.length, 22);
  assert.equal(readUint32(zip, 0), 0x06054b50);
  assert.equal(readUint16(zip, 10), 0);
});

test("archives are byte-identical for the same input and timestamp", () => {
  const entries = [{ path: "a.md", content: "one" }];

  assert.deepEqual(createZip(entries, FIXED_DATE), createZip(entries, FIXED_DATE));
});

test("unzip accepts the archive and restores nested paths and UTF-8 content", (t) => {
  let unzip: string;

  try {
    unzip = execFileSync("which", ["unzip"], { encoding: "utf8" }).trim();
  } catch {
    t.skip("unzip is not available on this machine");
    return;
  }

  const directory = mkdtempSync(path.join(tmpdir(), "lumen-zip-"));
  const archivePath = path.join(directory, "skill.zip");

  try {
    const zip = createZip(
      [
        { path: "SKILL.md", content: "# Skill\n\nCalm hierarchy — 4px rhythm.\n" },
        { path: "references/foundations.md", content: "# Foundations\n" },
        { path: "assets/core.tokens.json", content: '{"color":{}}' },
      ],
      FIXED_DATE,
    );

    writeFileSync(archivePath, zip);

    // -t verifies every entry's CRC against its stored data.
    const tested = execFileSync(unzip, ["-t", archivePath], { encoding: "utf8" });

    assert.match(tested, /No errors detected/);

    const listed = execFileSync(unzip, ["-Z1", archivePath], { encoding: "utf8" });

    assert.deepEqual(listed.trim().split("\n").sort(), [
      "SKILL.md",
      "assets/core.tokens.json",
      "references/foundations.md",
    ]);

    execFileSync(unzip, ["-q", "-o", archivePath, "-d", directory]);

    const restored = execFileSync("cat", [path.join(directory, "SKILL.md")], { encoding: "utf8" });

    assert.equal(restored, "# Skill\n\nCalm hierarchy — 4px rhythm.\n");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
