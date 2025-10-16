import { jest } from "@jest/globals";
import bcrypt from "bcrypt";

// MOCKS (deben declararse antes de importar app/prisma)
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    usuario: { findUnique: jest.fn() },
  },
}));

jest.unstable_mockModule("../src/utils/jwt.js", () => ({
  generarToken: jest.fn().mockReturnValue("fake-jwt-token"),
}));

let app;
let prisma;

beforeAll(async () => {
  // Importar después de registrar los mocks
  ({ prisma } = await import("../src/lib/prisma.js"));
  ({ default: app } = await import("../src/index.js"));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("AUTH /auth/login", () => {
  it("404 si el usuario no existe", async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);

    const res = await (await import("supertest"))
      .default(app)
      .post("/auth/login")
      .send({ email: "no@existe.com", password: "x" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("200 y token si credenciales válidas", async () => {
    prisma.usuario.findUnique.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      password: await bcrypt.hash("123456", 10),
      rol: "admin",
    });
    jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

    const res = await (await import("supertest"))
      .default(app)
      .post("/auth/login")
      .send({ email: "test@test.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token", "fake-jwt-token");
  });
});
