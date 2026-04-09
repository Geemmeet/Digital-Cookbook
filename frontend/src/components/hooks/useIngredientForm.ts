import { useState, useRef } from "react";

/* Hanterar lokal touched-state och add-logik för ingrediensfältet.
touched-state: håller koll på om användaren försökt lägga till en ingrediens,
används för att visa röd border endast efter ett misslyckat försök.
add-logik: validerar, lägger till ingrediensen i listan och nollställer fälten.*/

export const useIngredientForm = (
    currentIngredient: { amount: string; unit: string; name: string },
    ingredients: IngredientWithId[],
    errors: { [key: string]: string },
    setIngredients: (ingredients: IngredientWithId[]) => void,
    setCurrentIngredient: (ingredient: { amount: string; unit: string; name: string }) => void,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  ) => {
  const [, forceRender] = useState(0);
  const touchedRef = useRef({ amount: false, name: false });

  const hasError =
  (touchedRef.current.amount &&
    (!currentIngredient.amount || !currentIngredient.name)) || !!errors.ingredients;

  const add = () => {
    touchedRef.current = { amount: true, name: true };
    forceRender((n) => n + 1);
    if (!currentIngredient.name || !currentIngredient.amount) return;
    setIngredients([...ingredients, { ...currentIngredient, id: Date.now() }]);
    setCurrentIngredient({ amount: "", unit: "dl", name: "" });
    touchedRef.current = { amount: false, name: false };
    setErrors((p: any) => ({ ...p, ingredients: "" }));
  };

  return { touched: touchedRef.current, hasError, add };
};