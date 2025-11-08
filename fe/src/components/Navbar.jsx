import { NavLink, Link } from "react-router-dom";

// Puedes ajustar la ruta de la imagen cuando la tengas
const logoSrc = "/logo.png";

const link = ({ isActive }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
    isActive ? "text-blue-700 bg-blue-100" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
  }`;

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto h-16 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSrc} alt="Car Saver" className="h-20 w-20 object-contain" />
        </Link>
        <nav className="flex gap-2">
          <NavLink to="/turno/nuevo" className={link}>
            Sacar turno
          </NavLink>
          <NavLink to="/turno/estado" className={link}>
            Ver estado
          </NavLink>
          <NavLink to="/admin/login" className={link}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
