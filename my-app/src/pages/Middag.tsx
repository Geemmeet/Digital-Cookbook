import Hero from '../components/Hero'
import middagImg from '../assets/hero/middag.jpg'
import RecipeGrid from '../components/RecipeGrid'

const frukostRecept = [{}]

export default function Middag() {
  return (
    <>
      <Hero title="Middag" image={middagImg} />
      <main>
        <RecipeGrid recipes={frukostRecept} />
      </main>
    </>
  )
}