import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import RecipeHero from "./RecipeHero";
import RecipeIngredients from "./RecipeIngredients";
import RecipeSteps from "./RecipeSteps";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

//Importer för redigeringsformuläret
import Modal from "../../components/Modal";
import RecipeForm from "../../components/RecipeForm/index";

//Importer hooks
import { useRecipe }  from "../../components/hooks/useRecipe";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function RecipeDetail() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();

  const { recipe, loading, fetchRecipe } = useRecipe(category, id);

  // State för att hantera öppning av redigeringsformuläret
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Funktion för att hantera radering av recept
  const handleDelete = async () => {
    if (window.confirm(`Vill du radera "${recipe?.name}"?`)) {
      await fetch(`${BASE_URL}/recept/${id}`, { method: "DELETE" });
      navigate("/");
    }
  };

  // Visar laddningsindikator medan data hämtas
  if (loading) return <div className="p-20 text-center">Laddar...</div>;

  // Visar meddelande om receptet inte hittades
  if (!recipe)
    return <div className="p-20 text-center">Receptet hittades inte.</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      <RecipeHero recipe={recipe} />

      <div className="w-full md:w-[95%] lg:w-[85%] max-w-[1400px] mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch bg-white">
          <aside className="md:col-span-5 lg:col-span-4 bg-[#F0E6DC] md:sticky md:top-0 h-fit pb-6">
            <RecipeIngredients
              ingredients={recipe.ingredients}
              baseServings={recipe.servings}
            />
          </aside>

          <main className="md:col-span-7 lg:col-span-8 bg-white pb-20 relative flex flex-col justify-between">
            <RecipeSteps steps={recipe.steps} />

            {/* ÅTGÄRDSKNAPPAR: Placerade längst ner till höger i innehållsboxen */}
            <div className="flex justify-end items-center gap-6 p-12 mt-12 border-t border-gray-50">
              {/* Redigera-knapp */}
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-all group"
              >
                <PencilIcon className="w-4 h-4 transition-transform group-hover:-rotate-12" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Redigera Recept
                </span>
              </button>

              <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Redigera recept"
              >
                <RecipeForm
                  initialData={recipe}
                  isEditing={true}
                  onSuccess={() => {
                    setIsEditOpen(false);
                    window.scrollTo(0, 0);
                    fetchRecipe();
                  }}
                />
              </Modal>

              {/* Radera-knapp */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-200 hover:text-red-600 transition-all group"
              >
                <TrashIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Radera Recept
                </span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
