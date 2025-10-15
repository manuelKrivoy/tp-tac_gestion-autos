import express from "express";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/appointments", async (req, res) => {
  try {
    const { marca, modelo, anio, propietarioNombre, propietarioEmail, fechaTurno, detalle } = req.body;

    // 1. Crear vehículo
    const vehiculo = await prisma.vehiculo.create({
      data: { marca, modelo, anio, propietarioNombre, propietarioEmail },
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

    res.status(201).json({ message: "Turno creado", verificationCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/appointments/status/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const turno = await prisma.turno.findUnique({
      where: { verificationCode: code },
      include: { vehiculo: true, revision: true },
    });

    if (!turno) return res.status(404).json({ error: "Turno no encontrado" });

    res.json({
      vehiculo: turno.vehiculo,
      estado: turno.estado,
      fecha: turno.fechaTurno,
      revision: turno.revision || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
