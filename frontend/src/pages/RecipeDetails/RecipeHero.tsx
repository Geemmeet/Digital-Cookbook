import type { Recipe } from "../../types";
import fallbackImage from "../../assets/empty-plate.jpg";

interface Props {
  recipe: Recipe;
}

export default function RecipeHero({ recipe }: Props) {
  return (
    /* Sänkt höjd: h-[20vh] till max h-[40vh] för att visa innehållet under direkt */
    <div className="relative h-[20vh] md:h-[30vh] lg:h-[40vh] min-h-[250px] w-full flex items-center justify-center bg-zinc-900 overflow-hidden">
      <img
        src={recipe.image_url || fallbackImage}
        className="absolute inset-0 w-full h-full object-cover opacity-50 object-center"
        alt={recipe.name}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      <div className="relative z-10 text-center px-6 w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl uppercase italic leading-none max-w-4xl">
          {recipe.name}
        </h1>

        {recipe.description && (
          <p className="text-gray-200 text-xs md:text-sm lg:text-base font-medium leading-relaxed max-w-xl mx-auto opacity-90 line-clamp-3">
            {recipe.description}
          </p>
        )}
      </div>
    </div>
  );
}
