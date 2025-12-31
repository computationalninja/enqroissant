import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import Hospital from './pages/Hospital'
import Warehouse from './pages/Warehouse'
import Settings from './pages/Settings'
import DemoDataEditor from './pages/DemoDataEditor'
import VoiceCommandHandler from './components/VoiceCommandHandler'
import ConnectionStatus from './components/ConnectionStatus'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [industry, setIndustry] = useState('hospital')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <div className="flex h-screen bg-gray-900 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            industry={industry}
            setIndustry={setIndustry}
          />
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Home industry={industry} />} />
              <Route path="/hospital" element={<Hospital />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/demo-data" element={<DemoDataEditor />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <VoiceCommandHandler industry={industry} setIndustry={setIndustry} />
        <ConnectionStatus />
      </div>
    </Router>
  )
}

export default App

