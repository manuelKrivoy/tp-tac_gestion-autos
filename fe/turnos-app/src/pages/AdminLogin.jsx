import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    iflogin();
    // eslint-disable-next-line
  }, [nav]);

  const iflogin = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      nav("/admin/dashboard");
      return;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("jwtToken", data.token);
      setMsg({ ok: true, text: "Login ok. Redirigiendo..." });
      setTimeout(() => nav("/admin/dashboard"), 500);
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error || "Credenciales inválidas" });
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-lg space-y-6 mx-auto mt-10">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-2">Login Administrador</h1>
      <p className="text-gray-500 text-center mb-4">Accede al panel de administración</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 mb-1 block font-medium">Email</label>
          <input
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ejemplo@correo.com"
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block font-medium">Contraseña</label>
          <input
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 transition"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 cursor-pointer transition shadow">
          Ingresar
        </button>
      </form>
      {msg && (
        <div
          className={`rounded-md p-3 border text-center text-sm font-medium ${
            msg.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}
