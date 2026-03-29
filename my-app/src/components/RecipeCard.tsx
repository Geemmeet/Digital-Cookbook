import { Link } from 'react-router-dom'

interface RecipeCardProps {
  id: number
  name: string
  image: string
  time: string
  servings: number
}

export default function RecipeCard({ id, name, image, time, servings }: RecipeCardProps) {
  return (
    <Link to={`/recept/${id}`}>
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
        {/* Image */}
        <div className="w-full h-52 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">{name}</h2>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{time}</span>
            <span>{servings} portioner</span>
          </div>
        </div>
      </div>
    </Link>
  )
}