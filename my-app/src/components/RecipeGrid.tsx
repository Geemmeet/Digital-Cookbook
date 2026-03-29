import RecipeCard from './RecipeCard'

interface Recipe {
  id: number
  name: string
  image: string
  time: string
  servings: number
}

interface RecipeGridProps {
  recipes: Recipe[]
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 py-8 max-w-7xl mx-auto">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          name={recipe.name}
          image={recipe.image}
          time={recipe.time}
          servings={recipe.servings}
        />
      ))}
    </div>
  )
}