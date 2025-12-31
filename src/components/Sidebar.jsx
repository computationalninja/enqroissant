import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Building2, 
  Warehouse, 
  Settings,
  Zap,
  Database
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/hospital', icon: Building2, label: 'Hospital' },
    { path: '/warehouse', icon: Warehouse, label: 'Warehouse' },
    { path: '/demo-data', icon: Database, label: 'Demo Data' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="w-64 glass-strong h-screen flex flex-col border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">QuantumAI</h1>
            <p className="text-xs text-gray-400">Digital Twin</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="glass rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Quantum Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-gray-300">System Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

