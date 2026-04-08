import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from "../components/Hero";
import RecipeGrid from "../components/RecipeGrid";

// Importera bilder för Hero-sektionen
import frukostImg from "../assets/hero/frukost.jpg";
import lunchImg from "../assets/hero/lunch.jpg";
import middagImg from "../assets/hero/middag.jpg";
import bakaImg from "../assets/hero/baka.jpg";

// Databas supabase och typ för recepten
import { supabase } from "../supabaseClient";
import type { RecipeSummary } from "../types";

/**
 * En karta som mappar URL-parametern till rätt rubrik och bild.
 * Detta ersätter propsen vi tidigare skickade från App.tsx.
 */
const categoryAssets: Record<string, { title: string; img: string }> = {
  frukost: { title: "Frukost", img: frukostImg },
  lunch: { title: "Lunch", img: lunchImg },
  middag: { title: "Middag", img: middagImg },
  baka: { title: "Baka", img: bakaImg },
};

export default function CategoryPage() {
  // Hämtar :category från URL:en (t.ex. "frukost")
  const { category } = useParams<{ category: string }>();

  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hämta titel/bild baserat på den aktuella kategorin
  const currentAssets = category
    ? categoryAssets[category.toLowerCase()]
    : null;

  // useEffect för att hämta recept när komponenten laddas eller när category ändras
  useEffect(() => {
    async function fetchRecipes() {
      if (!category) return;

      try {
        // laddningssymbolen visas medan vi hämtar data
        setLoading(true);

        // Hämtar recept från Supabase (databasen) baserat på kategori
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("category", category.toLowerCase())
          .order("created_at", { ascending: false });

        //Om fel uppstår, logga det och visa i konsolen
        if (error) throw error;
        setRecipes(data || []);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, [category]);

  // Formatering av datan från Supabase till det gränssnitt RecipeGrid förväntar sig
  const formattedRecipes: RecipeSummary[] = recipes.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    image_url: r.image_url,
    cooking_time: r.cooking_time,
    servings: r.servings || 4,
    description: r.description,
  }));

  // Om användaren går till en kategori som inte finns i categoryAssets
  if (!currentAssets) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500">Kategorin hittades inte.</p>
      </div>
    );
  }

  return (
    <>
      <Hero title={currentAssets.title} image={currentAssets.img} />
      <main className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {formattedRecipes.length > 0 ? (
              <RecipeGrid recipes={formattedRecipes} />
            ) : (
              <p className="text-center text-gray-500 py-20">
                Inga recept hittades i kategorin {currentAssets.title}.
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}
