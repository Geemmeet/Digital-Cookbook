import Hero from '../components/Hero'
import RecipeGrid from '../components/RecipeGrid'

const frukostRecept = [
  { id: 1, name: 'Pannkakor', image: '/images/pannkakor.jpg', time: '20 min', servings: 4 },
  { id: 2, name: 'Äggröra', image: '/images/aggröra.jpg', time: '10 min', servings: 2 },
  { id: 3, name: 'Smoothiebowl', image: '/images/smoothiebowl.jpg', time: '5 min', servings: 1 },
  { id: 4, name: 'Havregrynsgröt', image: '/images/gröt.jpg', time: '15 min', servings: 2 },
]

export default function Frukost() {
  return (
    <>
      <Hero title="Frukost" image="/images/frukost-hero.jpg" />
      <main>
        <RecipeGrid recipes={frukostRecept} />
      </main>
    </>
  )
}