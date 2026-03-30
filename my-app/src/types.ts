export interface Recipe {
  id: string;
  name: string;
  description?: string;
  image: string;
  time: string;
  servings: number;
  category?: string;
}