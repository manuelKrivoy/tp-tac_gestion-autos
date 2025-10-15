import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const link = "px-3 py-2 rounded hover:bg-gray-200";
  const active = ({ isActive }) => (isActive ? `${link} font-semibold` : link);

  return (
    <header className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          Taller
        </Link>
        <nav className="flex gap-2">
          <NavLink to="/turno/nuevo" className={active}>
            Sacar turno
          </NavLink>
          <NavLink to="/turno/estado" className={active}>
            Ver estado
          </NavLink>
          <NavLink to="/admin/login" className={active}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
