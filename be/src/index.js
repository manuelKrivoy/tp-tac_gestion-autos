import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/adminRoutes.js";
import { login } from "./controllers/authController.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// login público
app.post("/auth/login", login);

// rutas protegidas
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
