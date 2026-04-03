//Image är valfritt, har en fallback bild
export interface Recipe {
  id: number;
  name: string;
  image_url?: string; 
  time: string;
  servings: number;
  description?: string;
}