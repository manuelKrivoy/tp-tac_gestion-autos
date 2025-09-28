import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generarToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export async function login(req, res) {
  const { email, password } = req.body;

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  const esValido = await bcrypt.compare(password, usuario.password);
  if (!esValido) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = generarToken({ id: usuario.id, email: usuario.email, rol: usuario.rol });
  res.json({ token });
}
