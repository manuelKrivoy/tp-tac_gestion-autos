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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
