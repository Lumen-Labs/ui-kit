import { chmod, cp, mkdir } from "node:fs/promises";

await mkdir(new URL("../dist/tokens/", import.meta.url), { recursive: true });
await cp(
  new URL("../src/styles.css", import.meta.url),
  new URL("../dist/styles.css", import.meta.url),
);
await mkdir(new URL("../dist/graph/", import.meta.url), { recursive: true });
await cp(
  new URL("../src/graph/styles.css", import.meta.url),
  new URL("../dist/graph/styles.css", import.meta.url),
);
await cp(
  new URL("../src/graph/community-worker.js", import.meta.url),
  new URL("../dist/graph/community-worker.js", import.meta.url),
);
await cp(
  new URL("../src/tokens/core.tokens.json", import.meta.url),
  new URL("../dist/tokens/core.tokens.json", import.meta.url),
);

// The MCP servers are `bin` entries, so their compiled entrypoints must be executable.
await chmod(new URL("../dist/mcp/index.js", import.meta.url), 0o755);
await chmod(new URL("../dist/mcp/http-entry.js", import.meta.url), 0o755);
