const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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
const muteRoutes = require("./routes/muteRoutes");
const auditRoutes = require("./routes/auditRoutes");
const pushRoutes = require("./routes/pushRoutes");
const hpsdmaRoutes = require("./routes/hpsdmaRoutes");

const app = express();

// Apply security headers
app.use(helmet());

// Global Rate Limiting (e.g., 1000 requests per 15 mins per IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" }
});
app.use(globalLimiter);

// Restrict CORS to localhost dev origins only.
// In production, replace with an explicit allowlist of your deployed domain(s).
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g. curl, Postman, server-to-server).
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    // Allow local network IP addresses for mobile testing/dev
    if (/^http:\/\/(10|192\.168|172\.(1[6-9]|2[0-9]|3[0-1]))\.\d+\.\d+\.\d+:\d+$/.test(origin)) {
      return callback(null, true);
    }
    // Allow VS Code dev tunnels
    if (/\.devtunnels\.ms$/.test(new URL(origin).hostname)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin '${origin}' is not allowed`), false);
  },
  credentials: true,
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
app.use("/alerts", alertRoutes);
app.use("/ping", authMiddleware, pingRoutes);
app.use("/verify", authMiddleware, verifyRoutes);
app.use("/volunteers", authMiddleware, volunteerRoutes);
app.use("/resources", authMiddleware, resourceRoutes);
app.use("/agencies", authMiddleware, agencyRoutes);
app.use("/agencies", authMiddleware, agencyMemberRoutes);
app.use("/bulletins", bulletinRoutes);
app.use("/intel", authMiddleware, intelRoutes);
app.use("/sync", authMiddleware, syncRoutes);
app.use("/incidents", incidentRoutes);
app.use("/status", authMiddleware, statusRoutes);
app.use("/equipment", authMiddleware, equipmentRoutes);
app.use("/mutes", authMiddleware, muteRoutes);
app.use("/audit", authMiddleware, auditRoutes);
app.use("/push", pushRoutes);
app.use("/hpsdma", hpsdmaRoutes);
app.use("/export", authMiddleware, require("./routes/exportRoutes"));
app.use("/guides", require("./routes/guides"));

// 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

app.use(errorHandler);

module.exports = app;
