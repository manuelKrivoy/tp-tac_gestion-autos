// src/pages/EstadoTurno.jsx
import { useState } from "react";
import api from "../services/api";

export default function EstadoTurno() {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const consultar = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const res = await api.get(`/api/appointments/status/${code.trim()}`);
      setData({ ok: true, value: res.data });
    } catch (err) {
      setData({
        ok: false,
        error: err.response?.data?.error || "Código inválido o no encontrado",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-bold">Ver estado del turno</h1>

      <form onSubmit={consultar} className="flex gap-2">
        <input
          className="input"
          placeholder="Ingresá tu código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button className="btn" disabled={loading}>
          {loading ? "Buscando..." : "Consultar"}
        </button>
      </form>

      {data && data.ok && (
        <div className="p-4 rounded border bg-white">
          <p>
            <b>Estado:</b> {data.value.estado}
          </p>
          <p>
            <b>Fecha turno:</b> {new Date(data.value.fecha).toLocaleDateString()}
          </p>
          <p>
            <b>Vehículo:</b> {data.value.vehiculo.marca} {data.value.vehiculo.modelo} ({data.value.vehiculo.anio})
          </p>
        </div>
      )}

      {data && !data.ok && <div className="p-4 rounded border bg-red-50">{data.error}</div>}
    </section>
  );
}
