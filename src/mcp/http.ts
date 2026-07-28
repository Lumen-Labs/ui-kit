import { createHash, timingSafeEqual } from "node:crypto";
import { createServer as createHttpServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";

import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import { readKitPackage } from "./kit.js";
import { createServer } from "./server.js";

export const DEFAULT_HOST = "127.0.0.1";
export const DEFAULT_PORT = 1803;
export const MCP_PATH = "/mcp";
export const HEALTH_PATH = "/health";

export interface HttpConfig {
  host: string;
  port: number;
  /** When set, every `/mcp` request must present it as a bearer token. */
  token: string | null;
  /** Permitted `Host` header hostnames. Empty means the check is skipped. */
  allowedHosts: string[];
  /** Permitted `Origin` header values. Empty means any origin is refused a browser context. */
  allowedOrigins: string[];
}

/** Addresses that are only reachable from this machine. */
export function isLoopbackHost(host: string) {
  return host === "127.0.0.1" || host === "::1" || host === "localhost";
}

function splitList(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * Reads configuration from the environment.
 *
 * Binding beyond loopback publishes the kit's source over the network, so an
 * unauthenticated non-loopback bind is refused outright rather than started
 * and warned about.
 */
export function resolveHttpConfig(env: NodeJS.ProcessEnv = process.env): HttpConfig {
  const host = env.LUMEN_MCP_HOST?.trim() || DEFAULT_HOST;
  const rawPort = env.LUMEN_MCP_PORT?.trim();
  const port = rawPort ? Number(rawPort) : DEFAULT_PORT;

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`LUMEN_MCP_PORT must be a valid port number, received: ${rawPort}`);
  }

  const token = env.LUMEN_MCP_TOKEN?.trim() || null;

  if (!token && !isLoopbackHost(host)) {
    throw new Error(
      `Refusing to serve the Lumen MCP server on ${host} without LUMEN_MCP_TOKEN. ` +
        "This server exposes the ui-kit source, so a non-loopback bind must be authenticated. " +
        `Set LUMEN_MCP_TOKEN, or set LUMEN_MCP_HOST=${DEFAULT_HOST} to keep it local.`,
    );
  }

  return {
    host,
    port,
    token,
    allowedHosts: splitList(env.LUMEN_MCP_ALLOWED_HOSTS),
    allowedOrigins: splitList(env.LUMEN_MCP_ALLOWED_ORIGINS),
  };
}

/** Compares digests so the check does not leak the token's length or prefix. */
export function tokenMatches(expected: string, received: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();

  return timingSafeEqual(digest(expected), digest(received));
}

function bearerToken(header: string | undefined) {
  const match = /^Bearer\s+(.+)$/i.exec(header?.trim() ?? "");

  return match ? match[1].trim() : null;
}

export function isAuthorized(config: HttpConfig, header: string | undefined) {
  if (!config.token) return true;

  const received = bearerToken(header);

  return received === null ? false : tokenMatches(config.token, received);
}

/**
 * Host and Origin validation, kept here rather than in the transport because
 * the SDK's built-in DNS-rebinding options are deprecated in favour of
 * external middleware.
 */
export function isAllowedHost(config: HttpConfig, hostHeader: string | undefined) {
  if (!config.allowedHosts.length) return true;

  // Strip the port; IPv6 literals keep their brackets.
  const hostname = (hostHeader ?? "").replace(/:\d+$/, "");

  return config.allowedHosts.includes(hostname);
}

export function isAllowedOrigin(config: HttpConfig, origin: string | undefined) {
  if (!origin) return true;

  return config.allowedOrigins.includes(origin);
}

function sendJson(response: ServerResponse, status: number, body: unknown) {
  const payload = JSON.stringify(body);

  response.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  });
  response.end(payload);
}

/**
 * Handles one MCP request in stateless mode: a fresh server and transport per
 * request, both closed when the response finishes. The server is read-only
 * with no subscriptions, so there is no session state worth keeping, and each
 * request re-reads the repository and therefore never serves stale data.
 */
async function handleMcpRequest(request: IncomingMessage, response: ServerResponse) {
  const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
  const server = await createServer();

  response.on("close", () => {
    void transport.close();
    void server.close();
  });

  await server.connect(transport);
  await transport.handleRequest(request, response);
}

export function createRequestListener(config: HttpConfig, version: string, name: string) {
  return async function listener(request: IncomingMessage, response: ServerResponse) {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

    if (url.pathname === HEALTH_PATH) {
      sendJson(response, 200, { ok: true, name, version });
      return;
    }

    if (url.pathname !== MCP_PATH) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    if (!isAllowedHost(config, request.headers.host)) {
      sendJson(response, 403, { error: "Host not allowed" });
      return;
    }

    if (!isAllowedOrigin(config, request.headers.origin)) {
      sendJson(response, 403, { error: "Origin not allowed" });
      return;
    }

    if (!isAuthorized(config, request.headers.authorization)) {
      response.setHeader("WWW-Authenticate", 'Bearer realm="lumen-ui-kit"');
      sendJson(response, 401, { error: "Unauthorized" });
      return;
    }

    try {
      await handleMcpRequest(request, response);
    } catch (error) {
      if (response.headersSent) {
        response.end();
        return;
      }

      sendJson(response, 500, { error: (error as Error).message });
    }
  };
}

export interface RunningHttpServer {
  server: Server;
  host: string;
  /** The bound port, which is resolved when the configured port is 0. */
  port: number;
  close: () => Promise<void>;
}

export async function startHttpServer(
  config: HttpConfig = resolveHttpConfig(),
): Promise<RunningHttpServer> {
  const pkg = await readKitPackage();
  const server = createHttpServer(createRequestListener(config, pkg.version, pkg.name));

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(config.port, config.host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  const port = typeof address === "object" && address ? address.port : config.port;

  return {
    server,
    host: config.host,
    port,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.closeAllConnections();
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
