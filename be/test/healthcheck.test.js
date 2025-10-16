import request from "supertest";
import app from "../src/index.js";

describe("Healthcheck", () => {
  it("GET /health -> 200 { ok: true }", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
