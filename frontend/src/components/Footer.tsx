import pattern from '../assets/pattern.jpg'

export default function Footer() {
  return (
    <footer>
      <div className="bg-white py-6 text-center text-red-900">
        <p className="font-semibold">Digital Kokbok</p>
        <p className="text-sm text-red-400 mt-1">© 2026</p>
      </div>
      <img src={pattern} alt="" className="w-full h-15 object-cover" />
    </footer>
  )
}