import { useRecipeForm } from "../hooks/useRecipeForm";
import { inputs, buttons, errorMessage } from "../../styles/theme";
import { IngredientSection } from "./IngredientSection";
import { StepSection } from "./StepSection";
import { ImageSection } from "./ImageSection";
import type { Recipe } from "../../types";

interface Props {
  initialData?: Recipe | null;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function RecipeForm({
  initialData,
  isEditing,
  onSuccess,
}: Props) {
  const { state, setters, handleSubmit } = useRecipeForm(
    initialData,
    isEditing,
    onSuccess,
  );

  // Hjälpfunktion för felmeddelanden
  const fieldClass = (errorKey: keyof typeof state.errors) =>
    `${inputs.base} ${state.errors[errorKey] ? "border-red-500" : ""}`;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-left pb-10"
    >
      {/* Basinfo */}
      <div className="space-y-4">
        <div>
          <label className={inputs.label}>Namn</label>
          <input
            value={state.name}
            onChange={(e) => {
              setters.setName(e.target.value);
              setters.setErrors({ ...state.errors, name: "" });
            }}
            className={`${inputs.base} ${state.errors.name ? "border-red-500" : ""}`}
          />
          {state.errors.name && (
            <p className={errorMessage.warning}>{state.errors.name}</p>
          )}
        </div>
        <textarea
          placeholder="Beskrivning..."
          value={state.description}
          onChange={(e) => setters.setDescription(e.target.value)}
          className={inputs.base + " resize-none"}
          rows={3}
        />
      </div>

      {/* Grid för tid/portion/kategori */}
      <div className="grid grid-cols-3 gap-4">
        <input
          type="number"
          value={state.time}
          onChange={(e) => setters.setTime(e.target.value)}
          className={inputs.base}
          placeholder="Minuter"
        />
        <input
          type="number"
          value={state.servings}
          onChange={(e) => setters.setServings(e.target.value)}
          className={inputs.base}
          placeholder="Portioner"
        />
        <select
          value={state.category}
          onChange={(e) => setters.setCategory(e.target.value)}
          className={inputs.base}
        >
          <option value="frukost">Frukost</option>
          <option value="lunch">Lunch</option>
          <option value="middag">Middag</option>
        </select>
      </div>

      <ImageSection state={state} setters={setters} />
      <IngredientSection state={state} setters={setters} />
      <StepSection state={state} setters={setters} />

      {/* Spara-knapp */}
      <button type="submit" className={buttons.accent + " py-4 text-lg"}>
        {isEditing ? "Uppdatera recept" : "Spara recept"}
      </button>
    </form>
  );
}
