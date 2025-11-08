import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import { login } from "./controllers/authController.js";
import publicRoutes from "./routes/publicRoutes.js";

dotenv.config();
const app = express();

// CORS configurado
const allowList = [
  process.env.WEB_ORIGIN, // tu FE en Vercel, ej: https://tac-fe.vercel.app
  "http://localhost:5173", // Vite dev
].filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // permitir herramientas sin origin (Postman, curl) y origins de la lista o *.vercel.app (previews)
    const ok = !origin || allowList.includes(origin) || /\.vercel\.app$/.test(new URL(origin).hostname); // permite previews de Vercel
    cb(ok ? null : new Error("Not allowed by CORS"), ok);
  },
  credentials: false, // poné true si vas a usar cookies/sesiones
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

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

export default app;
