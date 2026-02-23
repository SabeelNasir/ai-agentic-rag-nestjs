const fs = require("fs");
const path = require("path");

/**
 * PM2 Ecosystem Configuration
 * This file configures PM2 to manage the NestJS application.
 * It dynamically reads the PORT from the root .env file.
 */

function getEnvConfig() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return { PORT: 3000 };
  }

  const content = fs.readFileSync(envPath, "utf8");
  const config = {};

  content.split("\n").forEach((line) => {
    // Match key=value, ignoring comments
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      config[match[1]] = value;
    }
  });

  return config;
}

const envConfig = getEnvConfig();

module.exports = {
  apps: [
    {
      name: "ai-agentic-rag-nestjs",
      script: "dist/main.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: envConfig.PORT || 3000,
        ...envConfig,
      },
    },
  ],
};
