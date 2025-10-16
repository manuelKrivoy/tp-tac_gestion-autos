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
    <section className="max-w-xl mx-auto grid gap-7 py-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">Ver estado del turno</h1>

      <form
        onSubmit={consultar}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md flex gap-4 items-center"
      >
        <input
          className="flex-1 border border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 px-4 py-2 text-lg transition"
          placeholder="Código de verificación"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          className={`px-5 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Buscando...
            </span>
          ) : (
            "Consultar"
          )}
        </button>
      </form>

      {data && data.ok && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
              {data.value.data.estado}
            </span>
            <span className="text-sm text-gray-500">
              Código: <span className="font-mono">{code}</span>
            </span>
          </div>

          <p className="text-gray-700">
            <b className="text-indigo-600">Fecha:</b>{" "}
            {data.value.data.fechaTurno
              ? `${data.value.data.fechaTurno.split("T")[0]?.slice(0, 10)} a las ${data.value.data.fechaTurno
                  .split("T")[1]
                  ?.slice(0, 5)}`
              : "No disponible"}
          </p>
          <p className="text-gray-700">
            <b className="text-indigo-600">Vehículo:</b> {data.value.data.vehiculo.marca || "Marca desconocida"}{" "}
            {data.value.data.vehiculo.modelo || "Modelo desconocido"} (
            {data.value.data.vehiculo.anio || "Año desconocido"})
          </p>
        </div>
      )}

      {data && !data.ok && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-5 text-center font-medium shadow">
          {data.error}
        </div>
      )}
    </section>
  );
}
