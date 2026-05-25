const request = require("supertest");
const app = require("../src/app");
const { runMigrations } = require("../src/db/database");
const { runSeed } = require("../src/db/seed-runtime");

describe("SDRF Helping Hands API", () => {
  let token = "";

  beforeAll(() => {
    // Ensures schema and seed records exist before API tests.
    runMigrations();
    runSeed();
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

  test("POST /ping records heartbeat", async () => {
    const response = await request(app)
      .post("/ping")
      .set("Authorization", `Bearer ${token}`)
      .send({ agency: "SDRF" });

    expect(response.statusCode).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
