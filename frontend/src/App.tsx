import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/Footer'

import CategoryPage from './pages/CategoryPage'
import RecipeDetail from './pages/RecipeDetail'
import NyttRecept from './pages/NyttRecept'

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Routes>
          {/* 1. Kategori */}
          <Route path="/:category" element={<CategoryPage />} />
          
          {/* 2. Recept */}
          <Route path="/:category/:id" element={<RecipeDetail />} />
          
          {/* 3. Nytt recept */}
          <Route path="/nytt-recept" element={<NyttRecept />} />
          
          {/* 4. Redirect från "/" */}
          <Route path="/" element={<Navigate to="/frukost" />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App