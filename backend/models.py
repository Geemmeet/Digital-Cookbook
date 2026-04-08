from pydantic import BaseModel
from typing import List, Optional

class IngredientModel(BaseModel):
    name: str
    amount: str
    unit: str

class RecipeModel(BaseModel):
    name: str
    description: Optional[str] = None
    cooking_time: int
    servings: int
    category: str
    image_url: Optional[str] = None
    ingredients: List[IngredientModel]
    steps: List[str]

class RecipeUpdateModel(RecipeModel):
    pass