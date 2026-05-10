import { inputs, buttons, layout, errorMessage } from "../../styles/theme";
import { Required } from "./Required";
import { useIngredientForm } from "../hooks/useIngredientForm";
import { inputClass } from "../../utils/formHelpers";
import type { IngredientWithId } from "../../types";

interface Props {
  ingredients: IngredientWithId[];
  currentIngredient: { amount: string; unit: string; name: string };
  errors: { [key: string]: string };
  setIngredients: (ingredients: IngredientWithId[]) => void;
  setCurrentIngredient: (ingredient: { amount: string; unit: string; name: string }) => void;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export const IngredientSection = ({
  ingredients,
  currentIngredient,
  errors,
  setIngredients,
  setCurrentIngredient,
  setErrors,
}: Props) => {
  const unitGroups = [
    { label: "Hushållsmått", units: ["dl", "msk", "tsk", "krm"] },
    { label: "Volym", units: ["l", "dl", "ml", "cl"] },
    { label: "Vikt", units: ["kg", "g", "mg"] },
    { label: "Övrigt", units: ["st", "portioner", "nypa"] },
  ];

  const { touched, hasError, add } = useIngredientForm(
    currentIngredient,
    ingredients,
    errors,
    setIngredients,
    setCurrentIngredient,
    setErrors,
  );

  return (
    <section className="relative">
      <label className={inputs.label}>
        Ingredienser
        <Required />
      </label>
      <div className="flex flex-col gap-2 mb-3">
        {ingredients.map((ing) => (
          <div key={ing.id} className={layout.ingredientRow}>
            <span>
              {ing.amount} {ing.unit} {ing.name}
            </span>
            <button
              type="button"
              onClick={() => setIngredients(ingredients.filter((i) => i.id !== ing.id))}
              className={buttons.icon}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            placeholder="Mängd"
            min="0"
            max="999"
            value={currentIngredient.amount}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, amount: e.target.value })}
            className={`${inputClass("ingredients", errors)} w-20 px-2 ${touched.amount && !currentIngredient.amount ? "!border-primary" : ""}`}
          />
          <select
            value={currentIngredient.unit}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
            className={`${inputs.base} w-28`}
          >
            {unitGroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <input
            type="text"
            placeholder="Ingrediens"
            value={currentIngredient.name}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            className={`${inputClass("ingredients", errors)} flex-1 hidden sm:block ${touched.name && !currentIngredient.name ? "!border-primary" : ""}`}
          />
          <button type="button" onClick={add} className={`${buttons.plus} hidden sm:block`}>+</button>
        </div>

        <div className="flex gap-2 sm:hidden">
          <input
            type="text"
            placeholder="Ingrediens"
            value={currentIngredient.name}
            onChange={(e) => setCurrentIngredient({ ...currentIngredient, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            className={`${inputClass("ingredients", errors)} flex-1 ${touched.name && !currentIngredient.name ? "!border-primary" : ""}`}
          />
          <button type="button" onClick={add} className={buttons.plus}>+</button>
        </div>
      </div>

      {(errors.ingredients || hasError) && (
        <p className={`${errorMessage.warning} mt-2 w-full`}>
          {hasError ? "Fyll i både mängd och ingrediens." : errors.ingredients}
        </p>
      )}
    </section>
  );
};