import { Link } from 'react-router-dom'
import type { Recipe } from '../types'

//Komponenten tar emot hela recept-objektet
//Ett recept per kort
interface RecipeCardProps {
  recipe: Recipe 
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recept/${recipe.id}`}>
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
        <div className="w-full h-52 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{recipe.name}</h2>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{recipe.time}</span>
            <span>{recipe.servings} portioner</span>
          </div>
        </div>
      </div>
    </Link>
  )
}