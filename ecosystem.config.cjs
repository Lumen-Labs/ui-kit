const fs = require("fs");
const path = require("path");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const env = {};

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key) env[key] = value;
  }

  return env;
}

const deployRoot = process.env.DEPLOY_ROOT;
const appRoot = deployRoot ? path.join(deployRoot, "pipeer", "ui-kit") : __dirname;

// `.env.mcp.local`, not `.env.production.local`: the repository's .gitignore
// force-includes the latter, so a bearer token placed there would be committed.
const localEnv = loadEnvFile(path.join(appRoot, ".env.mcp.local"));

const host = process.env.LUMEN_MCP_HOST ?? localEnv.LUMEN_MCP_HOST ?? "0.0.0.0";
const port = process.env.LUMEN_MCP_PORT ?? localEnv.LUMEN_MCP_PORT ?? 1803;
const token = process.env.LUMEN_MCP_TOKEN ?? localEnv.LUMEN_MCP_TOKEN;

// The server refuses to start on a non-loopback host without a token. Failing
// here instead gives a clearer message than a restart loop in `pm2 logs`.
if (!token && host !== "127.0.0.1" && host !== "localhost" && host !== "::1") {
  throw new Error(
    `LUMEN_MCP_TOKEN is required to serve the Lumen MCP server on ${host}. ` +
      `Set it in the environment or in ${path.join(appRoot, ".env.mcp.local")}, ` +
      "or set LUMEN_MCP_HOST=127.0.0.1 to keep the server local. " +
      "See ui-kit/.env.mcp.local.example.",
  );
}

const env = {
  NODE_ENV: "production",
  LUMEN_MCP_HOST: host,
  LUMEN_MCP_PORT: String(port),
};

if (token) env.LUMEN_MCP_TOKEN = token;

for (const key of ["LUMEN_MCP_ALLOWED_HOSTS", "LUMEN_MCP_ALLOWED_ORIGINS"]) {
  const value = process.env[key] ?? localEnv[key];
  if (value) env[key] = value;
}

module.exports = {
  apps: [
    {
      name: "lumen-ui-mcp",
      cwd: appRoot,
      script: "dist/mcp/http-entry.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 5,
      restart_delay: 5000,
      kill_timeout: 5000,
      max_memory_restart: "256M",
      env,
    },
  ],
};
