import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import axios from 'axios'

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking') // 'connected', 'disconnected', 'checking'
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await axios.get('/api/health', { timeout: 3000 })
        if (response.data.status === 'healthy') {
          setStatus('connected')
        } else {
          setStatus('disconnected')
        }
      } catch (error) {
        setStatus('disconnected')
      }
    }

    // Check immediately
    checkConnection()

    // Check every 5 seconds
    const interval = setInterval(checkConnection, 5000)

    return () => clearInterval(interval)
  }, [])

  if (status === 'checking') {
    return (
      <div className="fixed top-4 right-4 glass-strong rounded-lg px-3 py-2 flex items-center gap-2 z-30">
        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
        <span className="text-xs text-gray-300">Checking connection...</span>
      </div>
    )
  }

  if (status === 'disconnected') {
    return (
      <div 
        className="fixed top-4 right-4 glass-strong rounded-lg px-3 py-2 flex items-center gap-2 z-30 cursor-pointer hover:bg-red-500/20 transition-colors border border-red-500/50"
        onClick={() => setShowDetails(!showDetails)}
        title="Click for details"
      >
        <WifiOff className="w-4 h-4 text-red-400" />
        <span className="text-xs text-red-300">Backend disconnected</span>
        {showDetails && (
          <div className="absolute top-full right-0 mt-2 glass-strong rounded-lg p-3 min-w-[250px] border border-red-500/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-300">
                <p className="font-semibold text-red-300 mb-1">Backend Server Offline</p>
                <p className="mb-2">The Flask backend is not running. To start it:</p>
                <ol className="list-decimal list-inside space-y-1 mb-2">
                  <li>Open a new terminal</li>
                  <li>Navigate to backend: <code className="text-indigo-400">cd backend</code></li>
                  <li>Start server: <code className="text-indigo-400">python app.py</code></li>
                </ol>
                <code className="block bg-gray-900 p-2 rounded text-xs mb-2">
                  cd backend<br />
                  python app.py
                </code>
                <p className="text-yellow-300">⚠️ Backend must be running on <code className="text-indigo-400">http://localhost:5000</code></p>
                <p className="mt-2 text-xs">See <code className="text-indigo-400">START_BACKEND.md</code> for detailed instructions.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 glass-strong rounded-lg px-3 py-2 flex items-center gap-2 z-30">
      <Wifi className="w-4 h-4 text-green-400" />
      <span className="text-xs text-green-300">Backend connected</span>
    </div>
  )
}

export default ConnectionStatus

