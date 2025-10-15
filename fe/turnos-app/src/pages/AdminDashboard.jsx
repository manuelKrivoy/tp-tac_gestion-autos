import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// Función para obtener imagen de marca (puedes mejorarla luego)
const getMarcaImg = (marca) => `https://logo.clearbit.com/${marca.toLowerCase()}.com`;

// Función para obtener imagen de modelo (puedes mejorarla luego)
const getModeloImg = (marca, modelo) => `https://source.unsplash.com/featured/300x200/?${marca},${modelo},car`;

export default function AdminDashboard() {
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      nav("/admin/login");
      return;
    }

    setLoading(true);
    api
      .get("/admin/vehiculos")
      .then((res) => setVehiculos(res.data))
      .catch((err) => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
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
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
          </div>
        ) : (
          <>
            {vehiculos.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow hover:shadow-md transition flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getMarcaImg(v.marca)}
                    alt={v.marca}
                    className="w-12 h-12 rounded-full object-contain bg-indigo-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/48?text=Marca";
                    }}
                  />
                  <div>
                    <div className="font-semibold text-lg text-gray-800">
                      {v.marca} {v.modelo} <span className="text-gray-400">({v.anio})</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{v.propietarioNombre}</span> · {v.propietarioEmail}
                    </div>
                  </div>
                </div>
                {v.turnos && v.turnos.length > 0 ? (
                  <div className="mt-2 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                    <div className="text-indigo-700 font-semibold">Próximo turno:</div>
                    <div className="text-sm text-indigo-600">
                      Fecha: {new Date(v.turnos[0].fechaTurno).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-indigo-600">
                      Estado: <span className="font-bold">{v.turnos[0].estado}</span>
                    </div>
                    <div className="text-sm text-indigo-600">
                      Detalle: <span className="font-normal">{v.turnos[0].detalle || "N/A"}</span>
                    </div>
                    <div className="text-xs text-indigo-400">
                      Código de verificación: {v.turnos[0].verificationCode}
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-400 text-sm">Sin turnos asignados.</div>
                )}
              </div>
            ))}
            {vehiculos.length === 0 && !error && (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow text-gray-500 text-center">
                No hay vehículos cargados.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
