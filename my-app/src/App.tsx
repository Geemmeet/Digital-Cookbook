import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Frukost from './pages/Frukost'
import Lunch from './pages/Lunch'
import Middag from './pages/Middag'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Frukost />} />
        <Route path="/lunch" element={<Lunch />} />
        <Route path="/middag" element={<Middag />} />
      </Routes>
    </>
  )
}

export default App