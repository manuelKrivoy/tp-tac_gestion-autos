import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="grid gap-5">
      <h1 className="h1 flex items-center gap-2">🚗 Gestión de estado de vehículos</h1>
      <p className="muted">Seleccioná una opción para continuar.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          to="/turno/nuevo"
          className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-blue-400 transition group"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">📝 Cargar auto / Sacar turno</h2>
          <p className="text-sm text-gray-500 mt-1 group-hover:text-blue-600 transition">
            Completá el formulario con tus datos.
          </p>
        </Link>
        <Link
          to="/turno/estado"
          className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-green-400 transition group"
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">🔍 Ver estado del turno</h2>
          <p className="text-sm text-gray-500 mt-1 group-hover:text-green-600 transition">
            Consultá con tu código de verificación.
          </p>
        </Link>
      </div>
    </section>
  );
}
