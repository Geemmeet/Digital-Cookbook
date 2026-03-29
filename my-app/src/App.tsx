import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Frukost from './pages/Frukost'
import Lunch from './pages/Lunch'
import Middag from './pages/Middag'
import NyttRecept from './pages/NyttRecept'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Frukost />} />
        <Route path="/lunch" element={<Lunch />} />
        <Route path="/middag" element={<Middag />} />
        <Route path="/nytt-recept" element={<NyttRecept />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App