const env = require("../config/env");

function sendSms(phone, message) {
  // Plugs into Twilio/Gupshup in production; logs in MVP mode.
  if (!env.twilioEnabled && !env.smsGupshupEnabled) {
    console.log(`[SMS-MOCK] ${phone}: ${message}`);
    return { provider: "mock", sent: true };
  }

  // Provider hooks can be added here with SDK integrations.
  console.log(`[SMS-PROVIDER] ${phone}: ${message}`);
  return { provider: "configured", sent: true };
}

module.exports = {
  sendSms
};
