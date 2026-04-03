# Kokbok - portfolioprojekt fullstack

> Ett recept- och matplaneringsverktyg byggt med React + FastAPI + Supabase

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## Kom igång

Du behöver **Node.js** och **Python** installerat på din dator.

### 1. Backend (FastAPI)
```bash
cd Kokbok/my-app/backend

# Skapa och aktivera virtuell miljö
python -m venv venv

# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Installera beroenden och starta servern
pip install -r requirements.txt
uvicorn main:app --reload
```

Servern körs på **http://localhost:8000**

### 2. Frontend (React + Vite)

Öppna ett nytt terminalfönster:
```bash
cd frontend
npm install
npm run dev
```

Appen körs på **http://localhost:5173**

---

## Miljövariabler

Skapa följande `.env`-filer innan du startar projektet:

**`/backend/.env`**
```env
SUPABASE_URL=din_supabase_url
SUPABASE_SERVICE_KEY=din_hemliga_service_role_key
```

**`/frontend/.env.local`**
```env
VITE_SUPABASE_URL=din_supabase_url
VITE_SUPABASE_ANON_KEY=din_publika_anon_key
VITE_API_URL=http://localhost:8000
```

---

## Projektstruktur
Kokbok/
├── my-app/
│   ├── frontend/    # React-app med Tailwind CSS och Lucide-ikoner
│   └── backend/     # Python-API med Supabase Admin SDK

---

## Teknikstack

| Del | Teknik |
|-----|--------|
| Frontend | React, Vite, Tailwind CSS, Lucide |
| Backend | Python, FastAPI, Uvicorn |
| Databas | Supabase (PostgreSQL) |