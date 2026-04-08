import RecipeCard from './RecipeCard'
import type { RecipeSummary } from '../types'

// Uppdatera interfacet så det förväntar sig den lätta versionen
interface RecipeGridProps {
  recipes: RecipeSummary[] 
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-8 max-w-7xl mx-auto">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
        />
      ))}
    </div>
  )
}