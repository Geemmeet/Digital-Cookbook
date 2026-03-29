import Hero from '../components/Hero'
import lunchImg from '../assets/hero/lunch.jpg'
import RecipeGrid from '../components/RecipeGrid'

const frukostRecept = [{}]

export default function Lunch() {
  return (
    <>
      <Hero title="Lunch" image={lunchImg} />
      <main>
        <RecipeGrid recipes={frukostRecept} />
      </main>
    </>
  )
}