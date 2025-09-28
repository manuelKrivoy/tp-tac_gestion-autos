import { verificarToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  const payload = verificarToken(token);

  if (!payload) return res.status(403).json({ error: "Token inválido o expirado" });

  req.user = payload; // guardamos el usuario en el request
  next();
}
