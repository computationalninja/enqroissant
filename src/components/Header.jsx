import { Moon, Sun } from 'lucide-react'

const Header = ({ darkMode, setDarkMode, industry, setIndustry }) => {
  return (
    <header className="glass-strong border-b border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white capitalize">
            {industry === 'hospital' ? '🏥 Hospital' : '📦 Warehouse'} Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass rounded-lg px-4 py-2">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-transparent text-white text-sm outline-none cursor-pointer"
            >
              <option value="hospital" className="bg-gray-800">Hospital</option>
              <option value="warehouse" className="bg-gray-800">Warehouse</option>
            </select>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="glass rounded-lg p-2 hover:bg-white/10 transition-all"
            title="Toggle Theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
