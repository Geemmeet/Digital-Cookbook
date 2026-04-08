import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";

import CategoryPage from "./pages/CategoryPage";
// Eftersom filen heter index.tsx inuti mappen RecipeDetails räcker det att peka på mappen
import RecipeDetail from "./pages/RecipeDetails";
import NyttRecept from "./pages/AddRecipe";

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          {/* 1. Statiska vägar först */}
          <Route path="/" element={<Navigate to="/frukost" replace />} />
          <Route path="/nytt-recept" element={<NyttRecept />} />
          
          {/* 2. Detaljsidan för ett recept */}
          <Route path="/recept/:category/:id" element={<RecipeDetail />} />

          {/* 3. Den generella kategorisidan */}
          <Route path="/:category" element={<CategoryPage />} />

          {/* 4. Catch-all */}
          <Route path="*" element={<Navigate to="/frukost" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
