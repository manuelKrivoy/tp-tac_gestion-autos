import { jest } from "@jest/globals";

// MOCK Prisma antes de importar app
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    vehiculo: { findMany: jest.fn(), create: jest.fn() },
    turno: { findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() },
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

describe("PUBLIC /api", () => {
  it("GET /api/vehiculos -> lista", async () => {
    prisma.vehiculo.findMany.mockResolvedValue([{ id: 1, marca: "Toyota" }]);

    const res = await request(app).get("/api/vehiculos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, marca: "Toyota" }]);
  });

  it("POST /api/appointments -> crea turno nuevo", async () => {
    prisma.turno.findFirst.mockResolvedValue(null);
    prisma.vehiculo.create.mockResolvedValue({ id: 10 });
    prisma.turno.create.mockResolvedValue({ id: 5, verificationCode: "abcd1234" });

    const body = {
      marca: "Toyota",
      modelo: "Corolla",
      anio: 2020,
      propietarioNombre: "Manuel",
      propietarioEmail: "manuel@test.com",
      fechaTurno: "2025-10-16T12:00:00Z",
      detalle: "cambio de aceite",
      kms: 50000,
    };

    const res = await request(app).post("/api/appointments").send(body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("verificationCode");
  });

  it("POST /api/appointments -> 409 si fecha/hora ocupada", async () => {
    prisma.turno.findFirst.mockResolvedValue({ id: 1 });

    const res = await request(app).post("/api/appointments").send({
      marca: "Toyota",
      modelo: "Corolla",
      fechaTurno: "2025-10-16T12:00:00Z",
    });

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  it("GET /api/appointments -> { data, count }", async () => {
    prisma.turno.findMany.mockResolvedValue([
      { id: 1, fechaTurno: new Date("2025-10-16T12:00:00Z"), vehiculo: {}, revision: null },
    ]);

    const res = await request(app).get("/api/appointments?tz=America/Argentina/Cordoba");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("count", 1);
  });
});
