const app = require("./app");
const env = require("./config/env");
const { runMigrations } = require("./db/database");
const { runSeed } = require("./db/seed-runtime");
const { startEscalationMonitor } = require("./services/alertingService");
const { startHeartbeatMonitor } = require("./services/statusService");
const logger = require("./utils/logger");

async function start() {
  // Boots database, seed data, monitors, and HTTP server.
  try {
    await runMigrations();
    await runSeed();
    startEscalationMonitor();
    startHeartbeatMonitor();

    app.listen(env.port, () => {
      logger.info(`SDRF Helping Hands backend listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start backend", error);
    process.exit(1);
  }
}

start();
