import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// GET /admin/vehiculos
router.get("/vehiculos", authMiddleware, async (req, res) => {
  try {
    const vehiculos = await prisma.vehiculo.findMany();
    res.json(vehiculos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
