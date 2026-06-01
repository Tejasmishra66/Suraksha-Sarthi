const env = require("../config/env");

function getProvider(config = env) {
  if (config.twilioEnabled) {
    return "twilio";
  }
  if (config.smsGupshupEnabled) {
    return "gupshup";
  }
  return "mock";
}

function validateProviderConfig(provider, config = env) {
  if (provider === "twilio") {
    return Boolean(config.twilioAccountSid && config.twilioAuthToken && config.twilioFrom);
  }

  if (provider === "gupshup") {
    return Boolean(config.smsGupshupApiKey && config.smsGupshupSource && config.smsGupshupUrl);
  }

  return true;
}

function buildTwilioRequest(phone, message, config = env) {
  const body = new URLSearchParams({
    To: phone,
    From: config.twilioFrom,
    Body: message
  });

  const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString("base64");

  return {
    url: `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`,
    options: {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  };
}

function buildGupshupRequest(phone, message, config = env) {
  const body = new URLSearchParams({
    channel: "sms",
    source: config.smsGupshupSource,
    destination: phone,
    message
  });

  return {
    url: config.smsGupshupUrl,
    options: {
      method: "POST",
      headers: {
        apikey: config.smsGupshupApiKey,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  };
}

async function dispatchSms(phone, message, options = {}) {
  const config = options.config || env;
  const fetchImpl = options.fetchImpl || global.fetch;
  const provider = getProvider(config);

  if (!phone) {
    return { provider: "skipped", sent: false };
  }

  if (provider === "mock") {
    console.log(`[SMS-MOCK] ${phone}: ${message}`);
    return { provider: "mock", sent: true };
  }

  if (!validateProviderConfig(provider, config)) {
    const error = new Error(`SMS provider ${provider} is enabled but required configuration is missing`);
    error.provider = provider;
    throw error;
  }

  if (typeof fetchImpl !== "function") {
    const error = new Error("SMS provider dispatch requires fetch support");
    error.provider = provider;
    throw error;
  }

  const request = provider === "twilio"
    ? buildTwilioRequest(phone, message, config)
    : buildGupshupRequest(phone, message, config);

  const response = await fetchImpl(request.url, request.options);
  if (!response.ok) {
    const body = typeof response.text === "function" ? await response.text() : "";
    const error = new Error(`SMS provider ${provider} failed with status ${response.status}`);
    error.provider = provider;
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return { provider, sent: true, status: response.status };
}

function sendSms(phone, message) {
  // Dispatches real SMS when configured; logs in local MVP/mock mode.
  const provider = getProvider(env);

  if (!phone) {
    return { provider: "skipped", sent: false };
  }

  if (provider === "mock") {
    console.log(`[SMS-MOCK] ${phone}: ${message}`);
    return { provider: "mock", sent: true };
  }

  dispatchSms(phone, message).catch((error) => {
    console.error(`[SMS-ERROR] ${error.provider || provider}: ${error.message}`);
  });

  return { provider, sent: true, queued: true };
}

module.exports = {
  buildGupshupRequest,
  buildTwilioRequest,
  dispatchSms,
  getProvider,
  sendSms,
  validateProviderConfig
};
