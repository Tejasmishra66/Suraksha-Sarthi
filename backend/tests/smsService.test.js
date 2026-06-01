const {
  buildGupshupRequest,
  buildTwilioRequest,
  dispatchSms,
  getProvider,
  validateProviderConfig
} = require("../src/services/smsService");

describe("SMS service", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("uses mock provider when no live provider is enabled", async () => {
    const result = await dispatchSms("+919999999999", "Test alert", {
      config: {
        twilioEnabled: false,
        smsGupshupEnabled: false
      }
    });

    expect(result).toEqual({ provider: "mock", sent: true });
    expect(consoleSpy).toHaveBeenCalledWith("[SMS-MOCK] +919999999999: Test alert");
  });

  test("selects Twilio before Gupshup when both providers are enabled", () => {
    expect(
      getProvider({
        twilioEnabled: true,
        smsGupshupEnabled: true
      })
    ).toBe("twilio");
  });

  test("validates required Twilio config", () => {
    expect(
      validateProviderConfig("twilio", {
        twilioAccountSid: "sid",
        twilioAuthToken: "token",
        twilioFrom: "+15005550006"
      })
    ).toBe(true);

    expect(
      validateProviderConfig("twilio", {
        twilioAccountSid: "sid",
        twilioAuthToken: "",
        twilioFrom: "+15005550006"
      })
    ).toBe(false);
  });

  test("builds Twilio HTTP request with form body and basic auth", () => {
    const request = buildTwilioRequest("+919999999999", "Alert body", {
      twilioAccountSid: "AC123",
      twilioAuthToken: "secret",
      twilioFrom: "+15005550006"
    });

    expect(request.url).toBe("https://api.twilio.com/2010-04-01/Accounts/AC123/Messages.json");
    expect(request.options.method).toBe("POST");
    expect(request.options.headers.Authorization).toBe(`Basic ${Buffer.from("AC123:secret").toString("base64")}`);
    expect(request.options.body.get("To")).toBe("+919999999999");
    expect(request.options.body.get("Body")).toBe("Alert body");
  });

  test("dispatches through Gupshup fetch adapter", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      status: 202
    });

    const result = await dispatchSms("+919999999999", "Alert body", {
      fetchImpl,
      config: {
        twilioEnabled: false,
        smsGupshupEnabled: true,
        smsGupshupApiKey: "api-key",
        smsGupshupSource: "SDRF",
        smsGupshupUrl: "https://example.test/sms"
      }
    });

    expect(result).toEqual({ provider: "gupshup", sent: true, status: 202 });
    expect(fetchImpl).toHaveBeenCalledWith("https://example.test/sms", expect.objectContaining({ method: "POST" }));
  });

  test("builds Gupshup HTTP request with API key and sender source", () => {
    const request = buildGupshupRequest("+919999999999", "Alert body", {
      smsGupshupApiKey: "api-key",
      smsGupshupSource: "SDRF",
      smsGupshupUrl: "https://example.test/sms"
    });

    expect(request.url).toBe("https://example.test/sms");
    expect(request.options.headers.apikey).toBe("api-key");
    expect(request.options.body.get("destination")).toBe("+919999999999");
    expect(request.options.body.get("source")).toBe("SDRF");
  });
});
