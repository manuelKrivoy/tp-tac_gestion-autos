import express from "express";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/appointments", async (req, res) => {
  try {
    const { marca, modelo, anio, propietarioNombre, propietarioEmail, fechaTurno, detalle, kms } = req.body;

    // Validar si ya existe un turno en la misma fecha y hora
    const existingTurno = await prisma.turno.findFirst({
      where: { fechaTurno: new Date(fechaTurno) },
    });

    if (existingTurno) {
      return res.status(409).json({ error: "Ya existe un turno para esa fecha y hora" });
    }

    // 1. Crear vehículo
    const vehiculo = await prisma.vehiculo.create({
      data: { marca, modelo, anio, propietarioNombre, propietarioEmail, kms },
    });

    // 2. Generar código de verificación
    const verificationCode = randomBytes(4).toString("hex");

    // 3. Crear turno
    const turno = await prisma.turno.create({
      data: {
        vehiculoId: vehiculo.id,
        fechaTurno: new Date(fechaTurno),
        verificationCode,
        detalle: detalle || "",
      },
    });

    res.status(200).json({ message: "Turno creado", verificationCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/appointments/status/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const turno = await prisma.turno.findFirst({
      where: { verificationCode: code },
      include: { vehiculo: true, revision: true },
    });

    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });

    return res.json({ data: turno });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
