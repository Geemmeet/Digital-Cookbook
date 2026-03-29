import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('Frukost')

  const links = ['Frukost', 'Lunch', 'Middag']

  return (
    <header className="bg-stone-950 text-white">bg-[url(assets(/pattern.))]
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <a href="#" className="text-2xl font-bold tracking-tight text-amber-400">
          Kokbok
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setActive(link)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                active === link
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        <a
          href="#"
          className="hidden lg:block bg-amber-400 text-stone-950 text-sm font-semibold px-4 py-2 rounded-full hover:bg-amber-300 transition-colors duration-200"
        >
          Mina recept
        </a>

        <button
          className="lg:hidden text-stone-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="lg:hidden px-6 pb-6 flex flex-col gap-2 border-t border-stone-800 pt-4">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => { setActive(link); setMenuOpen(false) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                active === link
                  ? 'bg-amber-400 text-stone-950'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            className="mt-2 bg-amber-400 text-stone-950 text-sm font-semibold px-4 py-2 rounded-full text-center hover:bg-amber-300 transition-colors duration-200"
          >
            Mina recept
          </a>
        </div>
      )}
    </header>
  )
}