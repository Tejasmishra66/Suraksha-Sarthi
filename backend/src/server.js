const app = require("./app");
const env = require("./config/env");
const { runMigrations } = require("./db/database");
const { runSeed } = require("./db/seed-runtime");
const { startEscalationMonitor } = require("./services/alertingService");
const { startWatchdogMonitor } = require("./services/watchdogServiceV2");
const logger = require("./utils/logger");

function start() {
  // Boots database, seed data, monitors, and HTTP server.
  try {
    runMigrations();
    runSeed();
    startEscalationMonitor();
    startWatchdogMonitor();

    app.listen(env.port, () => {
      logger.info(`SDRF Helping Hands backend listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error("Failed to start backend", error);
    process.exit(1);
  }
}

start();
