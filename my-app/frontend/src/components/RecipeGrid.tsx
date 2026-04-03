import RecipeCard from './RecipeCard'
import type { Recipe } from '../types'

// lista av recept som kommer in som props
interface RecipeGridProps {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-8 max-w-7xl mx-auto">
    {/* Loopar igenom recepten och renderar ett RecipeCard för varje recept*/}
      {recipes.map((recipe) => (
        // Skickar hela recept-objektet som props till RecipeCard-komponenten
        <RecipeCard
        key={recipe.id}
        recipe={recipe}
        />
      ))}
    </div>
  )
}