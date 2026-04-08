import { useRecipeForm } from "../hooks/useRecipeForm";
import { inputs, buttons, errorMessage } from "../../styles/theme";
import { IngredientSection } from "./IngredientSection";
import { StepSection } from "./StepSection";
import { ImageSection } from "./ImageSection";
import type { Recipe } from "../../types";
import { inputClass } from "../../utils/formHelpers";
import { Required } from "./Required";

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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 text-left pb-10"
    >
      {/* Basinfo */}
      <div className="flex flex-col gap-4">
        {/* Namn */}
        <div className="relative">
          <label className={inputs.label}>
            Namn
            <Required />
          </label>
          <input
            placeholder="Köttbullar med potatismos..."
            value={state.name}
            onChange={(e) => {
              setters.setName(e.target.value);
              setters.setErrors({ ...state.errors, name: "" });
            }}
            className={`${inputClass("name", state.errors)} w-full`}
          />
          {state.errors.name && (
            <p className={errorMessage.warning}>{state.errors.name}</p>
          )}
        </div>

        {/* Beskrivning */}
        <div>
          <label className={inputs.label}>Beskrivning</label>
          <textarea
            placeholder="Köttbullar är en av mina favoriträtter..."
            value={state.description}
            onChange={(e) => setters.setDescription(e.target.value)}
            className={`${inputs.base} resize-none w-full`}
            rows={3}
          />
        </div>
      </div>

      {/* Grid för tid/portion/kategori */}
      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <label className={inputs.label}>
            Minuter
            <Required />
          </label>
          <input
            type="number"
            value={state.cooking_time}
            onChange={(e) => {
              setters.setCookingTime(e.target.value);
              setters.setErrors({ ...state.errors, cooking_time: "" });
            }}
            className={`${inputClass("cooking_time", state.errors)} w-full`}
            placeholder="Minuter"
          />
          {state.errors.cooking_time && (
            <p className={errorMessage.warning}>{state.errors.cooking_time}</p>
          )}
        </div>
        <div className="relative">
          <label className={inputs.label}>
            Portioner
            <Required />
          </label>
          <input
            type="number"
            value={state.servings}
            onChange={(e) => {
              setters.setServings(e.target.value);
              setters.setErrors({ ...state.errors, servings: "" });
            }}
            className={`${inputClass("servings", state.errors)} w-full`}
            placeholder="Portioner"
          />
          {state.errors.servings && (
            <p className={errorMessage.warning}>{state.errors.servings}</p>
          )}
        </div>
        <div>
          <label className={inputs.label}>
            Kategori
            <Required />
          </label>
          <select
            value={state.category}
            onChange={(e) => setters.setCategory(e.target.value)}
            className={`${inputs.base} w-full`}
          >
            <option value="frukost">Frukost</option>
            <option value="lunch">Lunch</option>
            <option value="middag">Middag</option>
          </select>
        </div>
      </div>

      <ImageSection state={state} setters={setters} />
      <IngredientSection state={state} setters={setters} />
      <StepSection state={state} setters={setters} />

      {/* Spara-knapp */}
      <button
        type="submit"
        disabled={state.isLoading}
        className={`${buttons.accent} py-4 text-lg ${state.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {state.isLoading
          ? "Sparar..."
          : isEditing
            ? "Uppdatera recept"
            : "Spara recept"}
      </button>
    </form>
  );
}
