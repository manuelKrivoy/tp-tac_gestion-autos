import { jest } from "@jest/globals";

// MOCK Prisma antes de importar app
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    turno: { update: jest.fn(), delete: jest.fn() },
  },
}));

let app;
let prisma;
let request;

beforeAll(async () => {
  ({ prisma } = await import("../src/lib/prisma.js"));
  ({ default: app } = await import("../src/index.js"));
  request = (await import("supertest")).default;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("ADMIN /admin/appointments", () => {
  it("PATCH /admin/appointments/:id -> actualiza estado", async () => {
    prisma.turno.update.mockResolvedValue({ id: 1, estado: "completado" });

    const res = await request(app).patch("/admin/appointments/1").send({ estado: "completado" });

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe("completado");
  });

  it("DELETE /admin/appointments/:id -> elimina", async () => {
    prisma.turno.delete.mockResolvedValue(true);

    const res = await request(app).delete("/admin/appointments/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Turno eliminado");
  });
});
