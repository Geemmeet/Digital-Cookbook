interface RecipeValidationData {
  name: string;
  cooking_time: number;
  servings: number;
  ingredients: any[];
  steps: any[];
}

export const validateRecipe = (data: RecipeValidationData) => {
  const errors: Record<string, string> = {};

  // Validera Namn
  if (!data.name || !data.name.trim()) {
    errors.name = "Du måste fylla i ett namn på maträtten.";
  }

  // Validera Tid
  if (isNaN(data.cooking_time) || data.cooking_time <= 0) {
    errors.cooking_time = "Ange en giltig tillagningstid i minuter.";
  }

  // Validera Portioner
  if (isNaN(data.servings) || data.servings <= 0) {
    errors.servings = "Ange ett giltigt antal portioner.";
  }

  // Validera Ingredienser (Minst en måste finnas)
  if (!data.ingredients || data.ingredients.length === 0) {
    errors.ingredients = "Du måste lägga till minst en ingrediens i listan.";
  }

  // Validera Steg
  if (!data.steps || data.steps.length === 0) {
    errors.steps = "Du måste lägga till minst ett instruktionssteg.";
  }

  return errors;
};