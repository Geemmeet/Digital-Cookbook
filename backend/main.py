import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Här importerar vi modellerna från din models.py-fil
from models import RecipeModel, RecipeUpdateModel
from supabase import create_client, Client

# Ladda in variablerna från .env-filen
load_dotenv()

# --- FASTAPI KONFIGURATION ---
app = FastAPI()

# --- SUPABASE KONFIGURATION ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Kunde inte hitta SUPABASE_URL eller SUPABASE_KEY i .env-filen!")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- CORS MIDDLEWARE ---
# Krävs eftersom frontend (5173) och backend (8000) körs på olika portar.
# Webbläsaren blockerar annars requests mellan olika origins.

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# --- ENDPOINTS ---

# API Endpoint för att skapa ett nytt recept
@app.post("/recept")
async def create_recipe(recipe: RecipeModel): # Använder RecipeModel här!
    try:
        # 1) Spara i huvudtabellen 'recipes'
        recipe_main_data = {
            "name": recipe.name,
            "description": recipe.description,
            "cooking_time": recipe.cooking_time,
            "servings": recipe.servings,        # Lade till portioner
            "category": recipe.category.lower(),
            "image_url": recipe.image_url,      # Lade till bild-URL
            "user_id": None
        }

        recipe_response = supabase.table("recipes").insert(recipe_main_data).execute()
        
        if not recipe_response.data:
            raise HTTPException(status_code=500, detail="Kunde inte skapa receptet i databasen")

        new_recipe_id = recipe_response.data[0]["id"]

        # 2) Förbered och spara ingredienser
        if recipe.ingredients:
            ingredients_data = [
                {
                    "recipe_id": new_recipe_id,
                    "amount": ing.amount,
                    "unit": ing.unit,
                    "name": ing.name
                } for ing in recipe.ingredients
            ]
            supabase.table("ingredients").insert(ingredients_data).execute()

        # 3) Förbered och spara steg (steps)
        if recipe.steps:
            steps_data = [
                {
                    "recipe_id": new_recipe_id,
                    "step_number": i + 1,
                    "description": step_desc
                } for i, step_desc in enumerate(recipe.steps)
            ]
            supabase.table("steps").insert(steps_data).execute()

        return {
            "status": "success",
            "id": new_recipe_id,
            "category": recipe.category.lower(),
        }

    except Exception as e:
        print(f"Fel vid sparande: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internt serverfel: {str(e)}")

# API Endpoint för att hämta recept baserat på kategori
@app.get("/recept/{kategori}")
async def get_recipes_by_category(kategori: str):
    try:
        response = supabase.table("recipes") \
            .select("*") \
            .eq("category", kategori.lower()) \
            .execute()
        
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# API Endpoint för att hämta ett specifikt recept
@app.get("/recept/{kategori}/{recept_id}")
async def get_specific_recipe(kategori: str, recept_id: str):
    try:
        # 1. Hämta basinfot (Namn, Tid, Bild, Portioner)
        recipe_res = supabase.table("recipes").select("*").eq("id", recept_id).single().execute()
        recipe_data = recipe_res.data

        # 2. Hämta ingredienserna som hör till detta recept_id
        ing_res = supabase.table("ingredients").select("*").eq("recipe_id", recept_id).execute()
        recipe_data["ingredients"] = ing_res.data

        # 3. Hämta stegen och sortera dem efter step_number
        steps_res = supabase.table("steps").select("*").eq("recipe_id", recept_id).order("step_number").execute()
        recipe_data["steps"] = steps_res.data

        # Nu innehåller recipe_data allt som din React-komponent behöver!
        return recipe_data

    except Exception as e:
        print(f"Backend-fel: {str(e)}")
        raise HTTPException(status_code=404, detail="Receptet kunde inte läsas in helt")

# API Endpoint för att radera ett recept (inklusive bild)   
@app.delete("/recept/{recept_id}")
async def delete_recipe(recept_id: str):
    try:
        # 1. Hämta receptet först för att få tag på image_url
        response = supabase.table("recipes").select("image_url").eq("id", recept_id).single().execute()
        
        if response.data and response.data.get("image_url"):
            full_url = response.data["image_url"]
            
            # Extrahera filnamnet från URL:en
            # Exempel: .../public/recipe-images/public/filnamn.jpg -> vi behöver "public/filnamn.jpg"
            if "recipe-images/" in full_url:
                file_path = full_url.split("recipe-images/")[-1]
                
                # 2. Radera filen från Supabase Storage
                supabase.storage.from_("recipe-images").remove([file_path])

        # 3. Radera receptet från SQL
        supabase.table("recipes").delete().eq("id", recept_id).execute()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Kunde inte radera: {str(e)}")

# API Endpoint för att uppdatera ett recept
@app.put("/recept/{recept_id}")
async def update_recipe(recept_id: str, data: RecipeUpdateModel):
    try:
        # 1. Uppdatera bas-informationen i 'recipes'-tabellen
        supabase.table("recipes").update({
            "name": data.name,
            "category": data.category.lower(),
            "cooking_time": data.cooking_time,
            "servings": data.servings,
            "description": data.description,
            "image_url": data.image_url
        }).eq("id", recept_id).execute()

        # 2. Hantera ingredienser: Ta bort gamla och lägg till nya
        supabase.table("ingredients").delete().eq("recipe_id", recept_id).execute()
        
        ingredients_to_insert = [
            {"recipe_id": recept_id, "name": ing.name, "amount": ing.amount, "unit": ing.unit}
            for ing in data.ingredients
        ]
        supabase.table("ingredients").insert(ingredients_to_insert).execute()

        # 3. Hantera instruktioner: Ta bort gamla och lägg till nya
        supabase.table("steps").delete().eq("recipe_id", recept_id).execute()
        
        steps_to_insert = [
            {"recipe_id": recept_id, "step_number": i + 1, "description": step}
            for i, step in enumerate(data.steps)
        ]
        supabase.table("steps").insert(steps_to_insert).execute()
        
        return {
                "status": "success",
                "id": recept_id,
                "category": data.category.lower()
            }

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Kunde inte uppdatera receptet")

# --- STARTA SERVERN ---
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)