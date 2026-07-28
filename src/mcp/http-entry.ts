#!/usr/bin/env node
import { isLoopbackHost, resolveHttpConfig, startHttpServer } from "./http.js";

const config = resolveHttpConfig();
const running = await startHttpServer(config);

const reachability = isLoopbackHost(config.host) ? "local only" : "reachable off-box";
const authentication = config.token ? "bearer token required" : "unauthenticated";

console.log(
  `Lumen MCP server listening on http://${config.host}:${running.port}/mcp (${reachability}, ${authentication})`,
);

// pm2 sends SIGINT on restart and SIGTERM on stop; drain connections for both.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void running.close().then(
      () => process.exit(0),
      () => process.exit(1),
    );
  });
}
