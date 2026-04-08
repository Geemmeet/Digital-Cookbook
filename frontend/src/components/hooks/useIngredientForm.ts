import { useState, useRef } from "react";

/* Hanterar lokal touched-state och add-logik för ingrediensfältet.
touched-state: håller koll på om användaren försökt lägga till en ingrediens,
används för att visa röd border endast efter ett misslyckat försök.
 add-logik: validerar, lägger till ingrediensen i listan och nollställer fälten.*/

export const useIngredientForm = (state: any, setters: any) => {
  const [, forceRender] = useState(0);
  const touchedRef = useRef({ amount: false, name: false });

  const hasError =
  (touchedRef.current.amount &&
    (!state.currentIngredient.amount || !state.currentIngredient.name)) || !!state.errors.ingredients;

  const add = () => {
    touchedRef.current = { amount: true, name: true };
    forceRender((n) => n + 1);
    if (!state.currentIngredient.name || !state.currentIngredient.amount) return;
    setters.setIngredients([...state.ingredients, { ...state.currentIngredient, id: Date.now() }]);
    setters.setCurrentIngredient({ amount: "", unit: "dl", name: "" });
    touchedRef.current = { amount: false, name: false };
    setters.setErrors((p: any) => ({ ...p, ingredients: "" }));
  };

  return { touched: touchedRef.current, hasError, add };
};