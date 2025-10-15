import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      nav("/admin/login");
      return;
    }

    api
      .get("/admin/vehiculos")
      .then((res) => setVehiculos(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, [nav]);

  const salir = () => {
    localStorage.removeItem("jwtToken");
    nav("/admin/login");
  };

  return (
    <section className="max-w-3xl mx-auto grid gap-7 py-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 rounded-2xl p-6 shadow flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">Panel Administrador</h1>
          <p className="text-base text-indigo-500 mt-1">Gestioná vehículos y turnos</p>
        </div>
        <button
          className="px-4 py-2 rounded-lg border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-medium transition"
          onClick={salir}
        >
          Salir
        </button>
      </div>

      {error && (
        <div className="rounded-lg p-4 bg-red-100 border border-red-300 text-red-800 font-semibold shadow">{error}</div>
      )}

      <div className="grid gap-4">
        {vehiculos.map((v) => (
          <div
            key={v.id}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                {v.marca[0]}
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-800">
                  {v.marca} {v.modelo} <span className="text-gray-400">({v.anio})</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{v.propietarioNombre}</span> · {v.propietarioEmail}
                </div>
              </div>
            </div>
          </div>
        ))}
        {vehiculos.length === 0 && !error && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow text-gray-500 text-center">
            No hay vehículos cargados.
          </div>
        )}
      </div>
    </section>
  );
}
