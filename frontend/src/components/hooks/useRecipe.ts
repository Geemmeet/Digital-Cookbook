import { useEffect, useState } from "react";
import type { Recipe } from "../../types";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useRecipe = (category: string | undefined, id: string | undefined) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipe = async () => {
    if (!category || !id) return;
    window.scrollTo(0, 0);
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/recept/${category}/${id}`);
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error("Fel vid hämtning:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [category, id]);

  return { recipe, loading, fetchRecipe };
};