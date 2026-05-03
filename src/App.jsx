import { useState } from 'react'
import Navbar from './components/Navbar'
import ConsultaPublica from './pages/ConsultaPublica'
import Admin from './pages/Admin'
import './index.css'

export default function App() {
  const [page, setPage] = useState('consulta')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar page={page} setPage={setPage} />
      {page === 'consulta' ? <ConsultaPublica /> : <Admin />}
    </div>
  )
}
