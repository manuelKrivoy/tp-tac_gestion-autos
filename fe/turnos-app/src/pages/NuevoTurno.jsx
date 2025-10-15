import { useState } from "react";
import api from "../services/api";

export default function NuevoTurno() {
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    anio: "",
    propietarioNombre: "",
    propietarioEmail: "",
    fechaTurno: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post("/api/appointments", {
        ...form,
        anio: Number(form.anio),
      });
      setResult({ ok: true, code: data.verificationCode });
    } catch (err) {
      setResult({ ok: false, error: err.response?.data?.error || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-bold">Sacar turno</h1>
      <form onSubmit={onSubmit} className="grid gap-3 bg-white p-4 rounded border">
        <div className="grid sm:grid-cols-2 gap-3">
          <input name="marca" placeholder="Marca" className="input" onChange={onChange} required />
          <input name="modelo" placeholder="Modelo" className="input" onChange={onChange} required />
          <input name="anio" placeholder="Año" type="number" className="input" onChange={onChange} required />
          <input name="fechaTurno" type="date" className="input" onChange={onChange} required />
          <input name="propietarioNombre" placeholder="Nombre" className="input" onChange={onChange} required />
          <input
            name="propietarioEmail"
            placeholder="Email"
            type="email"
            className="input"
            onChange={onChange}
            required
          />
        </div>
        <button disabled={loading} className="btn">
          {loading ? "Enviando..." : "Confirmar turno"}
        </button>
      </form>

      {result && result.ok && (
        <div className="p-4 rounded border bg-green-50">
          <p className="font-semibold">¡Turno creado!</p>
          <p>
            Tu código de verificación: <span className="font-mono">{result.code}</span>
          </p>
        </div>
      )}
      {result && !result.ok && (
        <div className="p-4 rounded border bg-red-50">
          <p className="font-semibold">Error</p>
          <p>{result.error}</p>
        </div>
      )}
    </section>
  );
}
