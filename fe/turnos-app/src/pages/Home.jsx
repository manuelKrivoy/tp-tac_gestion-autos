import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-bold">Gestión de estado de vehículos</h1>
      <p>Elegí una opción:</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/turno/nuevo" className="block p-4 rounded-lg bg-white border hover:shadow">
          <h2 className="font-semibold">Cargar auto / Sacar turno</h2>
          <p className="text-sm text-gray-600">Completá el formulario con tus datos.</p>
        </Link>
        <Link to="/turno/estado" className="block p-4 rounded-lg bg-white border hover:shadow">
          <h2 className="font-semibold">Ver estado del turno</h2>
          <p className="text-sm text-gray-600">Consultá con tu código de verificación.</p>
        </Link>
      </div>
    </section>
  );
}
