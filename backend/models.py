from pydantic import BaseModel
from typing import List, Optional

class IngredientModel(BaseModel):
    amount: str
    unit: str
    name: str

class RecipeModel(BaseModel):
    name: str
    description: Optional[str] = None
    cooking_time: int
    servings: int           # <--- Viktigt!
    category: str
    ingredients: List[IngredientModel]
    steps: List[str]
    image_url: Optional[str] = None