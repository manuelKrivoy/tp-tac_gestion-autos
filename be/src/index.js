import express from "express";
import { db } from "./config/db.js";

const app = express();

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    res.json({ ok: true, now: rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
