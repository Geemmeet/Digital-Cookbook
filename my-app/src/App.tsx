import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/Footer'

import CategoryPage from './pages/CategoryPage'
import frukostImg from './assets/hero/frukost.jpg'
import lunchImg from './assets/hero/lunch.jpg'
import middagImg from './assets/hero/middag.jpg'
import bakaImg from './assets/hero/baka.jpg'
import NyttRecept from './pages/NyttRecept'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route 
          path="/frukost" 
          element={<CategoryPage category="frukost" title="Frukost" heroImage={frukostImg} />} 
        />
        <Route 
          path="/lunch" 
          element={<CategoryPage category="lunch" title="Lunch" heroImage={lunchImg} />} 
        />
        <Route 
          path="/middag" 
          element={<CategoryPage category="middag" title="Middag" heroImage={middagImg} />} 
        />
        <Route 
          path="/baka" 
          element={<CategoryPage category="baka" title="Baka" heroImage={bakaImg} />} 
        />
        <Route
          path="/nytt-recept"
          element={<NyttRecept />}
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App