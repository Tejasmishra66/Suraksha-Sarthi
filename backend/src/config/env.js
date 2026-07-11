const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const INSECURE_DEFAULTS = ["super_secret_change_me", "fallback_secret_key", "changeme", ""];
const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key";

// In production, a weak or missing JWT_SECRET makes every token forgeable.
// Crash at startup rather than silently run insecure.
if (process.env.NODE_ENV === "production" && INSECURE_DEFAULTS.includes(jwtSecret)) {
  console.error("FATAL: JWT_SECRET is not set or is an insecure default. Set a strong secret in your .env file.");
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT || 4001),
  jwtSecret,
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || "BPl-...",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || "...",
  dbClient: process.env.DB_CLIENT || "sqlite",
  dbPath: path.resolve(process.cwd(), process.env.DB_PATH || "./data/sdrf.db"),
  postgresUrl: process.env.POSTGRES_URL || "",
  twilioEnabled: String(process.env.TWILIO_ENABLED || "false") === "true",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioFrom: process.env.TWILIO_FROM || "",
  smsGupshupEnabled: String(process.env.SMS_GUPSHUP_ENABLED || "false") === "true",
  smsGupshupApiKey: process.env.SMS_GUPSHUP_API_KEY || "",
  smsGupshupSource: process.env.SMS_GUPSHUP_SOURCE || "",
  smsGupshupUrl: process.env.SMS_GUPSHUP_URL || "https://api.gupshup.io/sm/api/v1/msg"
};
