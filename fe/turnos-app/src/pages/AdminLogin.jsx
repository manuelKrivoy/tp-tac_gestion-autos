import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const nav = useNavigate();

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
    <section className="grid gap-4 max-w-md">
      <h1 className="text-xl font-bold">Login administrador</h1>
      <form onSubmit={onSubmit} className="grid gap-3 bg-white p-4 rounded border">
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn">Ingresar</button>
      </form>
      {msg && <div className={`p-3 rounded border ${msg.ok ? "bg-green-50" : "bg-red-50"}`}>{msg.text}</div>}
    </section>
  );
}
