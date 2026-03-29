import Hero from '../components/Hero'
import lunchImg from '../assets/hero/lunch.jpg'

export default function Lunch() {
  return (
    <>
      <Hero title="Lunch" image={lunchImg} />
      <main className="p-6">
        {/* recipes go here later */}
      </main>
    </>
  )
}