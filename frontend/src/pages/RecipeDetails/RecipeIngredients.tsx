import { useEffect, useState } from "react";
import type { Ingredient } from "../../types";

interface Props {
  ingredients: Ingredient[];
  baseServings: number;
}

export default function RecipeIngredients({
  ingredients,
  baseServings,
}: Props) {
  const [currentServings, setCurrentServings] = useState(baseServings);

  useEffect(() => {
    if (baseServings) {
      setCurrentServings(baseServings);
    }
  }, [baseServings]);
  const getScaledAmount = (amount: string) => {
    const num = parseFloat(amount.replace(",", "."));
    if (isNaN(num)) return amount;

    const ratio = currentServings / baseServings;
    const scaled = num * ratio;

    return scaled.toLocaleString("sv-SE", { maximumFractionDigits: 2 });
  };

  return (
    <div className="p-[10%] pt-12 lg:pt-16">
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight text-center md:text-left">
          Ingredienser
        </h2>
      </div>

      {/* Edit amount of servings */}
      <div className="flex flex-row flex-nowrap items-center w-fit mx-auto md:mx-0 border border-gray-400/20 rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm shrink-0 h-10">
        <button
          onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
          className="px-4 h-full hover:bg-white/60 transition-colors border-r border-gray-400/20 active:bg-gray-200 flex items-center justify-center"
        >
          −
        </button>

        <div className="px-4 h-full flex items-center justify-center font-black text-gray-700 min-w-[100px] text-center text-[10px] tracking-widest whitespace-nowrap">
          {currentServings || baseServings || 0} PORT
        </div>

        <button
          onClick={() => setCurrentServings(currentServings + 1)}
          className="px-4 h-full hover:bg-white/60 transition-colors border-l border-gray-400/20 active:bg-gray-200 flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Ingredients list */}
      <ul className="space-y-4 mt-8">
        {ingredients?.map((ing, idx) => (
          <li
            key={idx}
            className="flex justify-between items-baseline py-1 border-b border-gray-400/10"
          >
            <span className="text-gray-700 capitalize">{ing.name}</span>
            <span className="font-bold text-gray-900 ml-4 whitespace-nowrap">
              {getScaledAmount(ing.amount)} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
