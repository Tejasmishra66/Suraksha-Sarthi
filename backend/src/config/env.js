const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4001),
  jwtSecret: process.env.JWT_SECRET || "super_secret_change_me",
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
