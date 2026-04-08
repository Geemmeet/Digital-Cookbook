// 1. Bas-versionen (för kort i listor, sökresultat osv)
export interface RecipeSummary {
  id: number;
  name: string;
  category: string;
  cooking_time: number;
  servings: number;
  image_url?: string;
  description?: string;
}

// 2. Den fullständiga versionen (för detaljsidan)
// 'extends' betyder att Recipe får allt som finns i RecipeSummary + det vi lägger till här
export interface Recipe extends RecipeSummary {
  ingredients: Ingredient[];
  steps: string[] | { description: string }[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}