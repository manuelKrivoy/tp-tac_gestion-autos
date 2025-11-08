import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// Todos los endpoints aquí usan JWT
router.use(authMiddleware);

// --- Vehículos ---

// Listar vehículos
router.get("/vehiculos", async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany({ include: { turnos: true } });
    res.json(vehiculos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear vehículo (opcional, ya que se crean al pedir turnos)
router.post("/vehiculos", async (req, res) => {
  try {
    const { marca, modelo, anio, propietarioNombre, propietarioEmail } = req.body;
    const vehiculo = await prisma.vehiculo.create({
      data: { marca, modelo, anio, propietarioNombre, propietarioEmail },
    });
    res.status(200).json(vehiculo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Turnos ---

// Listar todos los turnos
router.get("/appointments", async (req, res) => {
  try {
    const tz = req.query.tz || "America/Argentina/Cordoba";

    const turnos = await prisma.turno.findMany({
      include: { vehiculo: true, revision: true },
      orderBy: { fechaTurno: "desc" },
    });

    const data = turnos.map((t) => ({
      ...t,
      tz,
    }));
    return res.json({ data, count: data.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Actualizar estado de un turno
router.patch("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const turno = await prisma.turno.update({
      where: { id: Number(id) },
      data: { estado },
    });

    res.json(turno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un turno
router.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.turno.delete({ where: { id: Number(id) } });
    res.json({ message: "Turno eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -- REVISIÓN--

router.post("/revision", async (req, res) => {
  try {
    const { turnoId, notas } = req.body;
    const revision = await prisma.revision.create({
      data: { turnoId, notas, costo },
    });
    res.status(200).json(revision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/revision/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const revision = await prisma.revision.findUnique({
      where: { id: Number(id) },
      include: { turno: true },
    });
    if (!revision) return res.status(404).json({ error: "Revisión no encontrada" });
    res.json(revision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/revision/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notas, costo } = req.body;
    const revision = await prisma.revision.update({
      where: { id: Number(id) },
      data: { notas, costo },
    });
    res.json(revision);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
