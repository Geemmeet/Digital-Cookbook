import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";

export default function NyttRecept() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-accent mb-8">Lägg till recept</h1>
      <RecipeForm
        onSuccess={(id, category) => navigate(`/recept/${category}/${id}`)}
      />
    </div>
  );
}
