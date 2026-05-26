const request = require("supertest");
const app = require("../src/app");
const { runMigrations } = require("../src/db/database");
const { runSeed } = require("../src/db/seed-runtime");

describe("SDRF Helping Hands API", () => {
  let token = "";
  let consoleSpy;

  beforeAll(() => {
    // Ensures schema and seed records exist before API tests.
    runMigrations();
    runSeed();
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("POST /auth/login returns JWT", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "officer@sdrf.local", password: "password123" });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
    token = response.body.token;
  });

  test("GET /tasks returns task list", async () => {
    const response = await request(app).get("/tasks").set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /agencies returns agency list for the task picker", async () => {
    const response = await request(app).get("/agencies").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining(["SDRF", "Police", "Medical", "Utility", "Connectivity", "Fire Brigade", "HPEB"])
    );
  });

  test("GET /bulletins returns the bulletin feed", async () => {
    const response = await request(app).get("/bulletins").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("POST /bulletins creates a new bulletin for officers", async () => {
    const response = await request(app)
      .post("/bulletins")
      .set("Authorization", `Bearer ${token}`)
      .send({ category: "Connectivity", message: "Backup radio channel live for the next hour." });

    expect(response.statusCode).toBe(201);
    expect(response.body.category).toBe("Connectivity");
  });

  test("GET /intel returns intel pins", async () => {
    const response = await request(app).get("/intel").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /intel creates an intel pin", async () => {
    const response = await request(app)
      .post("/intel")
      .set("Authorization", `Bearer ${token}`)
      .send({ lat: 28.61, lon: 77.21, department: "Utility", note: "Transformer inspection underway." });

    expect(response.statusCode).toBe(201);
    expect(response.body.department).toBe("Utility");
  });

  test("GET /status returns heartbeat monitoring feed", async () => {
    const response = await request(app).get("/status").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((row) => row.agency_id)).toBe(true);
  });

  test("GET /agencies/:agency/members returns agency members", async () => {
    const response = await request(app).get("/agencies/Police/members").set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((member) => member.role === "agency_head")).toBe(true);
  });

  test("POST /agencies/:agency/members creates a new member", async () => {
    const createResponse = await request(app)
      .post("/agencies/Medical/members")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Dr. Neha Sharma",
        role: "officer",
        phone: "+919812345678",
        address: "Medical Block A"
      });

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.email).toContain("medical");

    const listResponse = await request(app).get("/agencies/Medical/members").set("Authorization", `Bearer ${token}`);
    expect(listResponse.body.some((member) => member.phone === "+919812345678")).toBe(true);
  });

  test("POST /tasks notifies selected agency heads by SMS", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        incidentId: 1,
        title: "Coordinate evacuation",
        details: "Notify local command centers immediately",
        assignedAgency: "SDRF",
        notificationAgencies: ["Police", "Medical"],
        status: "New"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.notifiedAgencies).toEqual(["Police", "Medical"]);
    expect(consoleSpy.mock.calls.flat().some((entry) => String(entry).includes("[SMS-MOCK] +919000000001"))).toBe(true);
    expect(consoleSpy.mock.calls.flat().some((entry) => String(entry).includes("[SMS-MOCK] +919000000002"))).toBe(true);
  });

  test("POST /ping records heartbeat", async () => {
    const response = await request(app)
      .post("/ping")
      .set("Authorization", `Bearer ${token}`)
      .send({ agency: "SDRF" });

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
