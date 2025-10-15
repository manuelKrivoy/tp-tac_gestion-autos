import { useState } from "react";
import api from "../services/api";

const MARCAS_MODELOS = {
  Toyota: ["Corolla", "Etios", "Hilux", "Yaris", "Camry", "RAV4", "Corolla Cross"],
  Peugeot: ["206", "207", "208", "3008", "2008", "408", "Partner"],
  Ford: ["Fiesta", "Focus", "EcoSport", "Ranger", "Ka", "Mondeo"],
  Chevrolet: ["Corsa", "Onix", "Cruze", "Tracker", "S10", "Spin"],
  Volkswagen: ["Gol", "Polo", "Virtus", "T-Cross", "Amarok", "Vento"],
  Renault: ["Clio", "Sandero", "Kangoo", "Duster", "Fluence", "Logan"],
  Fiat: ["Uno", "Palio", "Cronos", "Toro", "500", "Strada"],
  Honda: ["Civic", "Fit", "HR-V", "CR-V", "City"],
  Nissan: ["March", "Versa", "Sentra", "Frontier", "Kicks"],
  Hyundai: ["HB20", "Creta", "Tucson", "Santa Fe"],
  Citroen: ["C3", "C4", "Berlingo", "C5 Aircross"],
  Mercedes: ["Clase A", "Clase C", "Clase E", "GLA", "GLC"],
  BMW: ["Serie 1", "Serie 3", "Serie 5", "X1", "X3"],
  Audi: ["A1", "A3", "A4", "Q2", "Q5"],
  Jeep: ["Renegade", "Compass", "Grand Cherokee", "Commander"],
  Kia: ["K3", "Cerato", "Sportage", "Sorento"],
};

export default function NuevoTurno() {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    anio: "",
    propietarioNombre: "",
    propietarioEmail: "",
    fechaTurno: "",
    detalle: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onMarcaChange = (e) => {
    setForm((f) => ({
      ...f,
      marca: e.target.value,
      modelo: "",
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/api/appointments", {
        ...form,
        anio: Number(form.anio),
        detalle: form.detalle,
      });
      setResult({ ok: true, code: data.verificationCode });
    } catch (err) {
      setResult({ ok: false, error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  const modelos = form.marca ? MARCAS_MODELOS[form.marca] || [] : [];

  return (
    <section className="max-w-xl mx-auto grid gap-7 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-2">Sacar turno</h1>

      <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-2xl p-7 shadow-lg space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-semibold">Marca</label>
            <select
              name="marca"
              className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
              onChange={onMarcaChange}
              required
              value={form.marca}
            >
              <option value="">Selecciona una marca</option>
              {Object.keys(MARCAS_MODELOS).map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-semibold">Modelo</label>
            <select
              name="modelo"
              className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition disabled:opacity-50"
              onChange={onChange}
              required
              value={form.modelo}
              disabled={!form.marca}
            >
              <option value="">Selecciona un modelo</option>
              {modelos.map((modelo) => (
                <option key={modelo} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-semibold">Año</label>
            <input
              name="anio"
              type="number"
              className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
              onChange={onChange}
              required
              value={form.anio}
              min={1900}
              max={new Date().getFullYear()}
              placeholder="Ej: 2020"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-semibold">Fecha</label>
            <input
              name="fechaTurno"
              type="date"
              className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
              onChange={onChange}
              required
              value={form.fechaTurno}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-semibold">Nombre</label>
            <input
              name="propietarioNombre"
              className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
              onChange={onChange}
              required
              value={form.propietarioNombre}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-2 block font-semibold">Email</label>
            <input
              name="propietarioEmail"
              type="email"
              className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
              onChange={onChange}
              required
              value={form.propietarioEmail}
              placeholder="ejemplo@email.com"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-2 block font-semibold">
            Detalle <span className="text-gray-400">(explica qué requiere el auto)</span>
          </label>
          <textarea
            name="detalle"
            className="w-full border-gray-300 rounded-lg shadow focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
            onChange={onChange}
            required
            value={form.detalle}
            rows={3}
            placeholder="Ej: cambio de aceite, etc."
          />
        </div>
        <button
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:from-indigo-500 cursor-pointer hover:to-indigo-400 disabled:opacity-50 transition"
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
              Enviando...
            </span>
          ) : (
            "Confirmar turno"
          )}
        </button>
      </form>

      {result && result.ok && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 shadow flex flex-col items-center">
          <p className="font-bold text-lg">¡Turno creado!</p>
          <p className="text-sm mt-2">
            Código: <span className="font-mono bg-green-100 px-2 py-1 rounded">{result.code}</span>
          </p>
        </div>
      )}
      {result && !result.ok && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-5 shadow flex flex-col items-center">
          <p className="font-bold text-lg">Error</p>
          <p className="text-sm mt-2">{result.error}</p>
        </div>
      )}
    </section>
  );
}
