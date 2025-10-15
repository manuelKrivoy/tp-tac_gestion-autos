import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// Función para obtener imagen de marca
const getMarcaImg = (marca) => `https://logo.clearbit.com/${marca.toLowerCase()}.com`;

const ESTADOS = ["pendiente", "completado", "cancelado"];

export default function AdminDashboard() {
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPropietario, setFiltroPropietario] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetchVehiculos();
    // eslint-disable-next-line
  }, [nav]);

  const fetchVehiculos = () => {
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
  };

  const salir = () => {
    localStorage.removeItem("jwtToken");
    nav("/admin/login");
  };

  const handleEstadoChange = async (turnoId, estado) => {
    setUpdating(true);
    try {
      await api.patch(`/appointments/${turnoId}`, { estado });
      fetchVehiculos();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTurno = async (turnoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este turno? Esta acción no se puede deshacer.")) return;
    setUpdating(true);
    try {
      await api.delete(`/appointments/${turnoId}`);
      fetchVehiculos();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Helper para color de fondo según fecha
  const turnoBg = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diff = (hoy - fecha) / (1000 * 60 * 60 * 24); // días
    if (diff > 21) return "bg-gradient-to-r from-red-700 to-red-400 text-white";
    if (diff > 0) return "bg-gradient-to-r from-red-100 to-red-50 border-red-300";
    return "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100";
  };

  // Filtros
  const marcasUnicas = [...new Set(vehiculos.map((v) => v.marca))];
  const estadosUnicos = [...new Set(vehiculos.flatMap((v) => v.turnos?.map((t) => t.estado) || []))];

  const vehiculosFiltrados = vehiculos.filter((v) => {
    const marcaOk = !filtroMarca || v.marca === filtroMarca;
    const propietarioOk =
      !filtroPropietario ||
      v.propietarioNombre.toLowerCase().includes(filtroPropietario.toLowerCase()) ||
      v.propietarioEmail.toLowerCase().includes(filtroPropietario.toLowerCase());
    const estadoOk = !filtroEstado || (v.turnos && v.turnos[0] && v.turnos[0].estado === filtroEstado);
    return marcaOk && propietarioOk && estadoOk;
  });

  return (
    <section className="max-w-4xl mx-auto grid gap-7 py-8">
      <div className="bg-gradient-to-r from-indigo-100 via-blue-100 to-indigo-200 border border-indigo-300 rounded-3xl p-8 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-indigo-800 drop-shadow">Panel Administrador</h1>
          <p className="text-lg text-indigo-500 mt-2">Gestioná vehículos y turnos</p>
        </div>
        <button
          className="px-5 py-2 rounded-xl border border-indigo-300 bg-white hover:bg-indigo-100 text-indigo-700 font-semibold shadow transition"
          onClick={salir}
        >
          Salir
        </button>
      </div>

      <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <select
            className="border rounded px-3 py-2 text-sm bg-indigo-50"
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
          >
            <option value="">Todas las marcas</option>
            {marcasUnicas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2 text-sm bg-indigo-50"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {estadosUnicos.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-3 py-2 text-sm bg-indigo-50"
            type="text"
            placeholder="Buscar propietario"
            value={filtroPropietario}
            onChange={(e) => setFiltroPropietario(e.target.value)}
          />
        </div>
        <button
          className="text-xs text-indigo-500 hover:underline"
          onClick={() => {
            setFiltroMarca("");
            setFiltroEstado("");
            setFiltroPropietario("");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      {error && (
        <div className="rounded-lg p-4 bg-red-100 border border-red-300 text-red-800 font-semibold shadow">{error}</div>
      )}

      <div className="grid gap-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-indigo-500 border-solid"></div>
          </div>
        ) : (
          <>
            {vehiculosFiltrados.map((v) => (
              <div
                key={v.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition flex flex-col gap-3"
                style={{
                  background: "linear-gradient(120deg, #f8fafc 80%, #e0e7ff 100%)",
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={getMarcaImg(v.marca)}
                    alt={v.marca}
                    className="w-16 h-16 rounded-full object-contain bg-indigo-100 border-2 border-indigo-300 shadow"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/64?text=Marca";
                    }}
                  />
                  <div>
                    <div className="font-bold text-xl text-gray-800 flex items-center gap-2">
                      {v.marca} <span className="font-normal">{v.modelo}</span>
                      <span className="text-gray-400">({v.anio})</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{v.propietarioNombre}</span> · {v.propietarioEmail}
                    </div>
                  </div>
                </div>
                {v.turnos && v.turnos.length > 0 ? (
                  <div className={`mt-2 rounded-xl p-4 border shadow-sm ${turnoBg(v.turnos[0].fechaTurno)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-indigo-700 font-semibold text-base">Próximo turno:</div>
                      <div className="flex gap-2">
                        <select
                          className="border rounded px-2 py-1 text-xs bg-white"
                          value={v.turnos[0].estado}
                          disabled={updating}
                          onChange={(e) => handleEstadoChange(v.turnos[0].id, e.target.value)}
                        >
                          {ESTADOS.map((e) => (
                            <option key={e} value={e}>
                              {e}
                            </option>
                          ))}
                        </select>
                        <button
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 border border-red-300 rounded transition bg-white"
                          disabled={updating}
                          onClick={() => handleDeleteTurno(v.turnos[0].id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-indigo-700">
                      <div>
                        <span className="font-semibold">Fecha:</span>{" "}
                        {new Date(v.turnos[0].fechaTurno).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-semibold">Estado:</span>{" "}
                        <span className="font-bold">{v.turnos[0].estado}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-semibold">Detalle:</span>{" "}
                        <span className="font-normal">{v.turnos[0].detalle || "N/A"}</span>
                      </div>
                      <div className="col-span-2 text-xs text-indigo-400 mt-1">
                        Código de verificación: {v.turnos[0].verificationCode}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-400 text-sm italic">Sin turnos asignados.</div>
                )}
              </div>
            ))}
            {vehiculosFiltrados.length === 0 && !error && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow text-gray-500 text-center">
                No hay vehículos que coincidan con los filtros.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
