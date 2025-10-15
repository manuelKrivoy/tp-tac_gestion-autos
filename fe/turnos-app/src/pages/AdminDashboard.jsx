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
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Panel administrador</h1>
        <button className="btn" onClick={salir}>
          Salir
        </button>
      </div>

      {error && <div className="p-3 rounded border bg-red-50">{error}</div>}

      <div className="grid gap-2">
        {vehiculos.map((v) => (
          <div key={v.id} className="p-3 bg-white rounded border">
            <div className="font-semibold">
              {v.marca} {v.modelo} ({v.anio})
            </div>
            <div className="text-sm text-gray-600">
              {v.propietarioNombre} · {v.propietarioEmail}
            </div>
          </div>
        ))}
        {vehiculos.length === 0 && !error && <p>No hay vehículos cargados.</p>}
      </div>
    </section>
  );
}
