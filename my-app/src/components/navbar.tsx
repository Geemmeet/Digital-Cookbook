import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import pattern from '../assets/pattern.jpg'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Frukost", path: "/" },
    { name: "Lunch", path: "/lunch" },
    { name: "Middag", path: "/middag" },
  ];

  return (
    <header className="shadow-lg">
      {/* Pattern stripe */}
      <img
        src= {pattern}
        alt=""
        className="w-full h-10 object-cover"
      />

      {/* Main */}
      <div className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="hidden md:block text-2xl font-bold tracking-tight text-red-800 hover:text-red-600 transition-colors duration-200"
          >
            Digital Kokbok
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-2">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-base font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-red-700 text-white shadow-md scale-105"
                    : "text-red-900 hover:bg-red-100 hover:text-red-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden text-red-800 text-2xl font-bold ml-auto hover:text-red-600 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6 flex flex-col gap-2 border-t border-red-200 pt-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-red-700 text-white shadow-md"
                    : "text-red-900 hover:bg-red-100 hover:text-red-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
