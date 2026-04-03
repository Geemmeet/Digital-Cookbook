from pydantic import BaseModel
from enum import Enum

class Kategori(str, Enum):
    """Tillåtna kategorier för ett recept."""
    frukost = "frukost"
    lunch = "lunch"
    middag = "middag"
    baka = "baka"

class Recept(BaseModel):
    """Datastruktur för ett recept. Valideras av Pydantic innan det sparas i databasen."""
    rubrik: str
    beskrivning: str
    tidsatgang: str
    ingredienser: list[str]
    steg: list[str]
    kategori: Kategori
    foto_url: str | None = None