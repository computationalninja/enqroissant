import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Warehouse3D from '../components/3D/Warehouse3D'
import { Package, TrendingUp, AlertCircle } from 'lucide-react'
import axios from 'axios'

const Warehouse = () => {
  const [stats, setStats] = useState({
    totalShelves: 50,
    occupied: 0,
    available: 0,
    optimizationStatus: 'idle'
  })

  const [occupiedColor, setOccupiedColor] = useState('#f59e0b')
  const [labelPrefix, setLabelPrefix] = useState('S')

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/warehouse/stats').catch(err => {
        if (err.code === 'ECONNREFUSED') {
          console.error('Backend not running. Start Flask server on port 5000.')
        }
        throw err
      })
      setStats(response.data)
      if (response.data.occupiedColor) {
        setOccupiedColor(response.data.occupiedColor)
      }
      if (response.data.labelPrefix) {
        setLabelPrefix(response.data.labelPrefix)
      }
    } catch (error) {
      console.error('Error fetching warehouse stats:', error)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [])

  // Force refresh when demo data is updated
  useEffect(() => {
    const handleDemoDataUpdate = () => {
      fetchStats()
    }
    window.addEventListener('demoDataUpdated', handleDemoDataUpdate)
    return () => {
      window.removeEventListener('demoDataUpdated', handleDemoDataUpdate)
    }
  }, [])

  const handleOptimize = async () => {
    try {
      setStats(prev => ({ ...prev, optimizationStatus: 'optimizing' }))
      await axios.post('/api/optimize', { type: 'warehouse' })
      setTimeout(() => {
        setStats(prev => ({ ...prev, optimizationStatus: 'completed' }))
      }, 3000)
    } catch (error) {
      console.error('Error optimizing:', error)
      setStats(prev => ({ ...prev, optimizationStatus: 'error' }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Warehouse Digital Twin</h1>
          <p className="text-gray-400">3D visualization and quantum optimization of inventory routing</p>
        </div>
        <button
          onClick={handleOptimize}
          disabled={stats.optimizationStatus === 'optimizing'}
          className="glass-strong px-6 py-3 rounded-lg font-semibold text-white hover:bg-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-wait"
        >
          {stats.optimizationStatus === 'optimizing' ? 'Optimizing...' : 'Optimize Routing'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Shelves</h3>
              <p className="text-2xl font-bold text-white">{stats.totalShelves}</p>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Available</h3>
              <p className="text-2xl font-bold text-white">{stats.available}</p>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Occupied</h3>
              <p className="text-2xl font-bold text-white">{stats.occupied}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-strong rounded-xl p-6 h-[600px]">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[20, 15, 20]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Warehouse3D stats={stats} occupiedColor={occupiedColor} labelPrefix={labelPrefix} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </div>
    </div>
  )
}

export default Warehouse

