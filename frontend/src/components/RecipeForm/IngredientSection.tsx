import { inputs, buttons, layout, errorMessage } from "../../styles/theme";
import { Required } from "./Required";
import { useIngredientForm } from "../hooks/useIngredientForm";
import { inputClass } from "../../utils/formHelpers";

export const IngredientSection = ({ state, setters }: any) => {
  const unitGroups = [
    { label: "Hushållsmått", units: ["dl", "msk", "tsk", "krm"] },
    { label: "Volym", units: ["l", "dl", "ml", "cl"] },
    { label: "Vikt", units: ["kg", "g", "mg"] },
    { label: "Övrigt", units: ["st", "portioner", "nypa"] },
  ];

  const { touched, hasError, add } = useIngredientForm(state, setters);

  return (
    <section className="relative">
      <label className={inputs.label}>
        Ingredienser
        <Required />
      </label>
      <div className="flex flex-col gap-2 mb-3">
        {state.ingredients.map((ing: any) => (
          <div key={ing.id} className={layout.ingredientRow}>
            <span>
              {ing.amount} {ing.unit} {ing.name}
            </span>
            <button
              type="button"
              onClick={() =>
                setters.setIngredients(
                  state.ingredients.filter((i: any) => i.id !== ing.id),
                )
              }
              className={buttons.icon}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {/* Mobil: mängd + mått på egen rad. Desktop: alla på en rad */}
        <div className="flex gap-2">
          {/* Mängd */}
          <input
            type="number"
            step="any"
            placeholder="Mängd"
            min="0"
            max="999"
            value={state.currentIngredient.amount}
            onChange={(e) =>
              setters.setCurrentIngredient({
                ...state.currentIngredient,
                amount: e.target.value,
              })
            }
            className={`${inputClass("ingredients", state.errors)} w-20 px-2 ${touched.amount && !state.currentIngredient.amount ? "!border-primary" : ""}`}
          />
          {/* Mått */}
          <select
            value={state.currentIngredient.unit}
            onChange={(e) =>
              setters.setCurrentIngredient({
                ...state.currentIngredient,
                unit: e.target.value,
              })
            }
            className={`${inputs.base} w-28`}
          >
            {unitGroups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {/* Ingrediensnamn – dold på mobil */}
          <input
            type="text"
            placeholder="Ingrediens"
            value={state.currentIngredient.name}
            onChange={(e) =>
              setters.setCurrentIngredient({
                ...state.currentIngredient,
                name: e.target.value,
              })
            }
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            className={`${inputClass("ingredients", state.errors)} flex-1 hidden sm:block ${touched.name && !state.currentIngredient.name ? "!border-primary" : ""}`}
          />
          <button
            type="button"
            onClick={add}
            className={`${buttons.plus} hidden sm:block`}
          >
            +
          </button>
        </div>

        {/* Mobil: ingrediens + knapp på egen rad */}
        <div className="flex gap-2 sm:hidden">
          <input
            type="text"
            placeholder="Ingrediens"
            value={state.currentIngredient.name}
            onChange={(e) =>
              setters.setCurrentIngredient({
                ...state.currentIngredient,
                name: e.target.value,
              })
            }
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
            className={`${inputClass("ingredients", state.errors)} flex-1 ${touched.name && !state.currentIngredient.name ? "!border-primary" : ""}`}
          />
          <button type="button" onClick={add} className={buttons.plus}>
            +
          </button>
        </div>
      </div>

      {(state.errors.ingredients || hasError) && (
        <p className={`${errorMessage.warning} mt-2 w-full`}>
          {hasError
            ? "Fyll i både mängd och ingrediens."
            : state.errors.ingredients}
        </p>
      )}
    </section>
  );
};
