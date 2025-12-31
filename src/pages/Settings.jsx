import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react'

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('quantum-platform-settings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Error loading settings:', e)
      }
    }
    return {
      notifications: true,
      autoOptimize: false,
      quantumDepth: 3,
      refreshInterval: 2000
    }
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('quantum-platform-settings', JSON.stringify(settings))
  }, [settings])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your Quantum Digital Twin Platform</p>
      </div>

      <div className="space-y-6">
        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Enable Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-12 h-6 rounded-full bg-gray-700 appearance-none relative cursor-pointer transition-colors checked:bg-indigo-500"
                style={{
                  background: settings.notifications ? '#6366f1' : '#374151'
                }}
              />
            </label>
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <SettingsIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Optimization</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Auto-Optimize</span>
              <input
                type="checkbox"
                checked={settings.autoOptimize}
                onChange={(e) => setSettings({ ...settings, autoOptimize: e.target.checked })}
                className="w-12 h-6 rounded-full bg-gray-700 appearance-none relative cursor-pointer transition-colors checked:bg-indigo-500"
                style={{
                  background: settings.autoOptimize ? '#6366f1' : '#374151'
                }}
              />
            </label>
            <div>
              <label className="block text-gray-300 mb-2">Quantum Circuit Depth</label>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.quantumDepth}
                onChange={(e) => setSettings({ ...settings, quantumDepth: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-sm text-gray-400 mt-1">Current: {settings.quantumDepth}</p>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-semibold text-white">Data Streaming</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Refresh Interval (ms)</label>
              <input
                type="number"
                value={settings.refreshInterval}
                onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                min="500"
                step="500"
              />
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">System Status</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Quantum Backend</span>
              <span className="text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Streaming Service</span>
              <span className="text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Monitoring</span>
              <span className="text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

