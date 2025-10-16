import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import { login } from "./controllers/authController.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// login público
app.post("/auth/login", login);

// rutas protegidas
app.use("/admin", adminRoutes);

// rutas públicas
app.use("/api", publicRoutes);

// 👇 Solo levantá el server si NO estás en tests
const PORT = process.env.PORT || 3000;
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

// 👇 Exportá app para poder importarlo desde los tests
export default app;
