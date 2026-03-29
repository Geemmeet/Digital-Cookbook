import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import pattern from "../assets/pattern.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Frukost", path: "/" },
    { name: "Lunch", path: "/lunch" },
    { name: "Middag", path: "/middag" },
  ];

  return (
    <header className="shadow-md">
      {/* Pattern stripe */}
      <img src={pattern} alt="" className="w-full h-10 object-cover" />

      {/* Main navbar */}
      <div className="bg-surface">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="hidden md:block text-2xl font-bold tracking-tight text-primary hover:text-primary-hover transition-colors duration-200"
          >
            Digital Kokbok
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 text-base font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-border hover:text-primary-hover"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Lägg till recept-knapp */}
          <Link
            to="/nytt-recept"
            className="hidden lg:block ml-4 px-5 py-2 rounded-full text-base font-semibold bg-primary text-white hover:bg-primary-hover transition-all duration-200 shadow-md"
          >
            + Lägg till recept
          </Link>

          {/* Mobile burger */}
          <button
            className="lg:hidden text-primary text-2xl font-bold ml-auto hover:text-primary-hover transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6 flex flex-col gap-2 border-t border-border pt-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-primary text-white shadow-md"
                    : "text-text hover:bg-surface-dark"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/nytt-recept"
              onClick={() => setMenuOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl text-base font-semibold bg-primary text-white hover:bg-primary-hover transition-all duration-200 text-center"
            >
              + Lägg till recept
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}