import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Frukost");

  const links = ["Frukost", "Lunch", "Middag"];

  return (
    <header className="shadow-md bg-cover bg-[url(assets/pattern.jpg)] text-black">
      {/* Dark overlay to make text readable */}
      <div className="bg-red-900/40">
        <nav className="mx-auto flex max-w-7xl items-center justify-around px-6 py-4">
          {/* Logo */}
          <a
            href="#"
            className="text-2xl font-bold tracking-tight text-white drop-shadow"
          >
            Digital kokbok
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setActive(link)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                  active === link
                    ? "bg-white text-red-800"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile burger */}
          <button
            className="lg:hidden text-white text-xl font-bold"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6 flex flex-col gap-2 border-t border-white/20 pt-4">
            {links.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => {
                  setActive(link);
                  setMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  active === link
                    ? "bg-white text-red-800"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
