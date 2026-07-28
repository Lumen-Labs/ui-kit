/**
 * A minimal ZIP writer.
 *
 * Entries are stored uncompressed: the skill bundle is a handful of Markdown
 * files, so deflating them would add a dependency (or a CompressionStream
 * async path) to save a few kilobytes. Store-mode archives are valid ZIPs that
 * every extractor accepts.
 */

export interface ZipEntry {
  /** Path inside the archive, using forward slashes. */
  path: string;
  content: string | Uint8Array;
}

const LOCAL_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;

/** Store, no compression. */
const METHOD_STORE = 0;
/** Bit 11 marks file names as UTF-8. */
const FLAG_UTF8 = 0x0800;
const VERSION = 20;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);

  for (let index = 0; index < 256; index += 1) {
    let value = index;

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    table[index] = value >>> 0;
  }

  return table;
})();

export function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

/** MS-DOS time and date, which is what the ZIP format stores. */
export function toDosDateTime(date: Date) {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day =
    ((Math.max(date.getFullYear(), 1980) - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();

  return { time: time & 0xffff, date: day & 0xffff };
}

class ByteWriter {
  private readonly chunks: Uint8Array[] = [];

  length = 0;

  push(bytes: Uint8Array) {
    this.chunks.push(bytes);
    this.length += bytes.length;
  }

  pushRecord(size: number, fill: (view: DataView) => void) {
    const bytes = new Uint8Array(size);

    fill(new DataView(bytes.buffer));
    this.push(bytes);
  }

  toUint8Array() {
    const result = new Uint8Array(this.length);
    let offset = 0;

    for (const chunk of this.chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  }
}

/**
 * Builds a ZIP archive.
 *
 * `modifiedAt` is injectable so callers (and tests) can produce byte-identical
 * archives instead of embedding the current clock.
 */
export function createZip(entries: readonly ZipEntry[], modifiedAt = new Date()): Uint8Array {
  const encoder = new TextEncoder();
  const { time, date } = toDosDateTime(modifiedAt);
  const body = new ByteWriter();
  const directory = new ByteWriter();

  for (const entry of entries) {
    const name = encoder.encode(entry.path);
    const content =
      typeof entry.content === "string" ? encoder.encode(entry.content) : entry.content;
    const checksum = crc32(content);
    const localHeaderOffset = body.length;

    body.pushRecord(30, (view) => {
      view.setUint32(0, LOCAL_HEADER_SIGNATURE, true);
      view.setUint16(4, VERSION, true);
      view.setUint16(6, FLAG_UTF8, true);
      view.setUint16(8, METHOD_STORE, true);
      view.setUint16(10, time, true);
      view.setUint16(12, date, true);
      view.setUint32(14, checksum, true);
      view.setUint32(18, content.length, true);
      view.setUint32(22, content.length, true);
      view.setUint16(26, name.length, true);
      view.setUint16(28, 0, true);
    });
    body.push(name);
    body.push(content);

    directory.pushRecord(46, (view) => {
      view.setUint32(0, CENTRAL_HEADER_SIGNATURE, true);
      view.setUint16(4, VERSION, true);
      view.setUint16(6, VERSION, true);
      view.setUint16(8, FLAG_UTF8, true);
      view.setUint16(10, METHOD_STORE, true);
      view.setUint16(12, time, true);
      view.setUint16(14, date, true);
      view.setUint32(16, checksum, true);
      view.setUint32(20, content.length, true);
      view.setUint32(24, content.length, true);
      view.setUint16(28, name.length, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint16(36, 0, true);
      view.setUint32(38, 0, true);
      view.setUint32(42, localHeaderOffset, true);
    });
    directory.push(name);
  }

  const archive = new ByteWriter();

  archive.push(body.toUint8Array());
  archive.push(directory.toUint8Array());
  archive.pushRecord(22, (view) => {
    view.setUint32(0, END_OF_CENTRAL_DIRECTORY_SIGNATURE, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, entries.length, true);
    view.setUint16(10, entries.length, true);
    view.setUint32(12, directory.length, true);
    view.setUint32(16, body.length, true);
    view.setUint16(20, 0, true);
  });

  return archive.toUint8Array();
}
