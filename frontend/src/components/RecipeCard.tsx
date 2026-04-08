import { useState } from "react";
import { Link } from "react-router-dom";
import type { RecipeSummary } from "../types";
import fallbackImage from "../assets/empty-plate.jpg";

interface RecipeCardProps {
  recipe: RecipeSummary;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // 1. Hantera bildfel: Om receptet inte har en bild eller om bilden inte kan laddas, visa en fallback-bild
  const originalImage = recipe.image_url;

  const [imgError, setImgError] = useState(!originalImage);
  const imageSrc = imgError ? fallbackImage : originalImage;

  return (
    // 2. Länken är nu dynamisk baserat på receptets kategori och ID
    <Link to={`/recept/${recipe.category}/${recipe.id}`}>
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
        <div className="w-full aspect-square overflow-hidden bg-gray-50 relative">
          <img
            src={imageSrc}
            alt={recipe.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imgError
                ? "grayscale saturate-0 opacity-70"
                : "grayscale-0 saturate-100"
            }`}
            onError={() => setImgError(true)}
          />

          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 bg-white/70 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Bild saknas
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-1">
            {recipe.name}
          </h2>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{recipe.cooking_time} min</span>
            <span>{recipe.servings} portioner</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
