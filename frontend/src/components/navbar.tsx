import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// 1. Importera motion från framer-motion
import { motion, AnimatePresence } from "framer-motion"; 
import pattern from "../assets/pattern.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Frukost", path: "/frukost" },
    { name: "Lunch", path: "/lunch" },
    { name: "Middag", path: "/middag" },
    { name: "Baka", path: "/baka" }
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <img src={pattern} alt="" className="w-full h-10 object-cover" />

      <div className="bg-surface">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <Link
            to="/frukost"
            className="block text-2xl font-black tracking-tight text-primary hover:text-primary-hover transition-colors duration-200"
          >
            Digital Kokbok
          </Link>

          <div className="hidden lg:flex items-center gap-2 relative group">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  // 2. 'relative' är viktigt
                  // placera motion.div absolut
                  className={`relative px-5 py-2 text-xl font-bold transition-all duration-300 z-10 ${
                    isActive ? "text-primary" : "text-gray-500 hover:text-primary"
                  }`}
                >
                  {link.name}
                  
                  {/* Animering av understräckningen i navbaren */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        // 4. 'layoutId' är nyckeln till att animera mellan olika länkar
                        layoutId="active-underline"
                        className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full z-0"
                        
                        // 5. Konfigurera animationen
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          type: "spring", 
                          stiffness: 300, 
                          damping: 30  
                        }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          <Link
            to="/nytt-recept"
            className="hidden lg:block ml-4 px-6 py-2 rounded-full text-lg font-black bg-primary text-white hover:bg-primary-hover transition-all duration-200 shadow-lg active:scale-95"
          >
            + Lägg till recept
          </Link>

          {/* Mobile burger */}
          <button
            className="lg:hidden text-primary text-3xl font-bold ml-auto"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden px-6 pb-6 flex flex-col gap-2 border-t border-border pt-4 bg-white">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-lg font-bold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-primary text-white shadow-md"
                    : "text-text hover:bg-gray-100"
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