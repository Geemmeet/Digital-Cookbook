import Hero from '../components/Hero'
import middagImg from '../assets/hero/middag.jpg'

export default function Middag() {
  return (
    <>
      <Hero title="Middag" image={middagImg} />
      <main className="p-6">
        {/* recipes go here later */}
      </main>
    </>
  )
}