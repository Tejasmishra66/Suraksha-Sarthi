const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authMiddleware = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./utils/logger");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const alertRoutes = require("./routes/alertRoutes");
const pingRoutes = require("./routes/pingRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const syncRoutes = require("./routes/syncRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const bulletinRoutes = require("./routes/bulletinRoutes");
const agencyRoutes = require("./routes/agencyRoutes");
const agencyMemberRoutes = require("./routes/agencyMemberRoutes");
const intelRoutes = require("./routes/intelRoutes");
const statusRoutes = require("./routes/statusRoutes");
const equipmentRoutes = require("./routes/equipment");

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow browser-based local dev from the frontend Vite server.
    if (!origin || origin.indexOf('localhost') !== -1) return callback(null, true);
    return callback(null, true);
  }
}));
app.use(express.json({ limit: "10mb" }));
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);
app.use("/uploads", express.static(path.resolve(__dirname, "./uploads")));

app.get("/", (_req, res) => {
  // Basic health endpoint for local checks.
  res.json({ service: "SDRF Helping Hands API", status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/tasks", authMiddleware, taskRoutes);
app.use("/alerts", authMiddleware, alertRoutes);
app.use("/ping", authMiddleware, pingRoutes);
app.use("/verify", authMiddleware, verifyRoutes);
app.use("/volunteers", authMiddleware, volunteerRoutes);
app.use("/resources", authMiddleware, resourceRoutes);
app.use("/agencies", authMiddleware, agencyRoutes);
app.use("/agencies", authMiddleware, agencyMemberRoutes);
app.use("/bulletins", authMiddleware, bulletinRoutes);
app.use("/intel", authMiddleware, intelRoutes);
app.use("/sync", authMiddleware, syncRoutes);
app.use("/incidents", authMiddleware, incidentRoutes);
app.use("/status", authMiddleware, statusRoutes);
app.use("/equipment", authMiddleware, equipmentRoutes);

app.use(errorHandler);

module.exports = app;
