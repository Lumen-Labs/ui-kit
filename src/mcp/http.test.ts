import assert from "node:assert/strict";
import test from "node:test";

import { readKitPackage } from "./kit";
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  isAllowedHost,
  isAllowedOrigin,
  isAuthorized,
  isLoopbackHost,
  resolveHttpConfig,
  startHttpServer,
  tokenMatches,
  type HttpConfig,
} from "./http";

const { name: PACKAGE } = await readKitPackage();

const BASE: HttpConfig = {
  host: DEFAULT_HOST,
  port: 0,
  token: null,
  allowedHosts: [],
  allowedOrigins: [],
};

test("loopback addresses are recognized", () => {
  assert.equal(isLoopbackHost("127.0.0.1"), true);
  assert.equal(isLoopbackHost("localhost"), true);
  assert.equal(isLoopbackHost("::1"), true);
  assert.equal(isLoopbackHost("0.0.0.0"), false);
  assert.equal(isLoopbackHost("10.0.0.4"), false);
});

test("the default configuration is loopback and unauthenticated", () => {
  const config = resolveHttpConfig({});

  assert.equal(config.host, DEFAULT_HOST);
  assert.equal(config.port, DEFAULT_PORT);
  assert.equal(config.token, null);
});

test("a non-loopback bind without a token is refused", () => {
  assert.throws(
    () => resolveHttpConfig({ LUMEN_MCP_HOST: "0.0.0.0" }),
    /Refusing to serve the Lumen MCP server on 0\.0\.0\.0 without LUMEN_MCP_TOKEN/,
  );

  const config = resolveHttpConfig({ LUMEN_MCP_HOST: "0.0.0.0", LUMEN_MCP_TOKEN: "secret" });

  assert.equal(config.host, "0.0.0.0");
  assert.equal(config.token, "secret");
});

test("a blank token is treated as absent", () => {
  assert.throws(
    () => resolveHttpConfig({ LUMEN_MCP_HOST: "0.0.0.0", LUMEN_MCP_TOKEN: "   " }),
    /without LUMEN_MCP_TOKEN/,
  );
});

test("an invalid port is rejected", () => {
  assert.throws(() => resolveHttpConfig({ LUMEN_MCP_PORT: "not-a-port" }), /valid port number/);
  assert.throws(() => resolveHttpConfig({ LUMEN_MCP_PORT: "70000" }), /valid port number/);
  assert.equal(resolveHttpConfig({ LUMEN_MCP_PORT: "1803" }).port, 1803);
});

test("allow lists are parsed from comma-separated values", () => {
  const config = resolveHttpConfig({
    LUMEN_MCP_ALLOWED_HOSTS: "mcp.internal, 10.0.0.4 ,",
    LUMEN_MCP_ALLOWED_ORIGINS: "https://studio.example",
  });

  assert.deepEqual(config.allowedHosts, ["mcp.internal", "10.0.0.4"]);
  assert.deepEqual(config.allowedOrigins, ["https://studio.example"]);
});

test("token comparison accepts the match and rejects near misses of any length", () => {
  assert.equal(tokenMatches("s3cret", "s3cret"), true);
  assert.equal(tokenMatches("s3cret", "s3cres"), false);
  assert.equal(tokenMatches("s3cret", "s3"), false);
  assert.equal(tokenMatches("s3cret", "s3cret-and-more"), false);
});

test("authorization is skipped only when no token is configured", () => {
  assert.equal(isAuthorized(BASE, undefined), true);

  const guarded = { ...BASE, token: "s3cret" };

  assert.equal(isAuthorized(guarded, "Bearer s3cret"), true);
  assert.equal(isAuthorized(guarded, "bearer s3cret"), true);
  assert.equal(isAuthorized(guarded, "Bearer  s3cret  "), true);
  assert.equal(isAuthorized(guarded, "Bearer wrong"), false);
  assert.equal(isAuthorized(guarded, "s3cret"), false);
  assert.equal(isAuthorized(guarded, undefined), false);
});

test("host and origin checks are opt-in but strict once configured", () => {
  assert.equal(isAllowedHost(BASE, "anything.example"), true);

  const guarded = { ...BASE, allowedHosts: ["mcp.internal"], allowedOrigins: ["https://ok.example"] };

  assert.equal(isAllowedHost(guarded, "mcp.internal"), true);
  assert.equal(isAllowedHost(guarded, "mcp.internal:1803"), true);
  assert.equal(isAllowedHost(guarded, "evil.example"), false);

  // A request without an Origin is not a browser request.
  assert.equal(isAllowedOrigin(guarded, undefined), true);
  assert.equal(isAllowedOrigin(guarded, "https://ok.example"), true);
  assert.equal(isAllowedOrigin(guarded, "https://evil.example"), false);
});

async function withServer(
  overrides: Partial<HttpConfig>,
  run: (base: string) => Promise<void>,
) {
  const running = await startHttpServer({ ...BASE, ...overrides });

  try {
    await run(`http://127.0.0.1:${running.port}`);
  } finally {
    await running.close();
  }
}

function rpc(base: string, body: unknown, token?: string) {
  return fetch(`${base}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

const INITIALIZE = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "http-test", version: "0.0.0" },
  },
};

test("health is served without authentication", async () => {
  await withServer({ token: "s3cret" }, async (base) => {
    const response = await fetch(`${base}/health`);

    assert.equal(response.status, 200);

    const body = (await response.json()) as { ok: boolean; name: string; version: string };

    assert.equal(body.ok, true);
    assert.equal(body.name, PACKAGE);
    assert.ok(body.version.length > 0);
  });
});

test("unknown paths are not found", async () => {
  await withServer({}, async (base) => {
    assert.equal((await fetch(`${base}/`)).status, 404);
    assert.equal((await fetch(`${base}/tools`)).status, 404);
  });
});

test("a guarded server refuses requests without a valid token", async () => {
  await withServer({ token: "s3cret" }, async (base) => {
    const missing = await rpc(base, INITIALIZE);

    assert.equal(missing.status, 401);
    assert.match(missing.headers.get("www-authenticate") ?? "", /^Bearer/);

    const wrong = await rpc(base, INITIALIZE, "nope");

    assert.equal(wrong.status, 401);
  });
});

test("a guarded server completes a real MCP session over HTTP", async () => {
  await withServer({ token: "s3cret" }, async (base) => {
    const initialize = await rpc(base, INITIALIZE, "s3cret");

    assert.equal(initialize.status, 200);

    const body = (await initialize.json()) as {
      result: { serverInfo: { name: string }; instructions: string };
    };

    assert.equal(body.result.serverInfo.name, "lumen-ui-kit");
    assert.match(body.result.instructions, /skill/);
  });
});

test("a disallowed host is refused before authentication runs", async () => {
  await withServer({ token: "s3cret", allowedHosts: ["mcp.internal"] }, async (base) => {
    const response = await rpc(base, INITIALIZE, "s3cret");

    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), { error: "Host not allowed" });
  });
});
