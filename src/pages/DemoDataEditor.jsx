import { useState, useEffect } from 'react'
import { Database, Save, RotateCcw, Upload, FileText } from 'lucide-react'
import axios from 'axios'
import Toast from '../components/Toast'
import DataUpload from '../components/DataUpload'
import { useSimulation } from '../context/SimulationContext'

const DemoDataEditor = () => {
  const { isSimulating, setIsSimulating } = useSimulation()
  const [activeTab, setActiveTab] = useState('manual')

  const [hospitalData, setHospitalData] = useState({
    totalBeds: 100,
    occupied: 65,
    available: 35,
    occupiedColor: '#ef4444',
    labelPrefix: 'Room'
  })

  const [warehouseData, setWarehouseData] = useState({
    totalShelves: 50,
    occupied: 30,
    available: 20,
    occupiedColor: '#f59e0b',
    labelPrefix: 'S'
  })

  const [metricsData, setMetricsData] = useState({
    activeOptimizations: 8,
    responseTime: 120,
    accuracy: 95,
    errors: 2,
    costSaved: 120,
    energySaved: 95,
  })

  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchCurrentData()
  }, [])

  const fetchCurrentData = async () => {
    try {
      const [hospitalRes, warehouseRes, metricsRes] = await Promise.all([
        axios.get('/api/hospital/stats'),
        axios.get('/api/warehouse/stats'),
        axios.get('/api/metrics')
      ])
      setHospitalData({
        ...hospitalRes.data,
        occupiedColor: hospitalRes.data.occupiedColor || '#ef4444',
        labelPrefix: hospitalRes.data.labelPrefix || 'Room'
      })
      setWarehouseData({
        ...warehouseRes.data,
        occupiedColor: warehouseRes.data.occupiedColor || '#f59e0b',
        labelPrefix: warehouseRes.data.labelPrefix || 'S'
      })
      setMetricsData(metricsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleSave = async () => {
    try {
      if (hospitalData.occupied > hospitalData.totalBeds) {
        setToast({ message: 'Error: Occupied beds cannot exceed total beds.', type: 'error' })
        return
      }
      if (warehouseData.occupied > warehouseData.totalShelves) {
        setToast({ message: 'Error: Occupied shelves cannot exceed total shelves.', type: 'error' })
        return
      }

      const response = await axios.post('/api/demo/update', {
        hospital: hospitalData,
        warehouse: warehouseData,
        metrics: metricsData
      })

      if (response.data.status === 'success') {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        window.dispatchEvent(new Event('demoDataUpdated'))
        setToast({ message: 'Data saved successfully!', type: 'success' })
      } else {
        setToast({ message: `Error: ${response.data.message}`, type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Failed to save data. Check backend connection.', type: 'error' })
    }
  }

  const handleReset = async () => {
    try {
      await axios.post('/api/demo/reset')
      fetchCurrentData()
      setToast({ message: 'Reset to random data mode', type: 'success' })
      window.dispatchEvent(new Event('demoDataUpdated'))
    } catch (e) {
      setToast({ message: 'Failed to reset', type: 'error' })
    }
  }

  const handleUploadSuccess = (summary) => {
    fetchCurrentData()
    setToast({ message: `Uploaded ${summary.count} rows for ${summary.type}`, type: 'success' })
    window.dispatchEvent(new Event('demoDataUpdated'))
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Control Panel</h1>
          <p className="text-gray-400">Manage demo data, simulation states, and dataset uploads.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 border ${isSimulating
              ? 'bg-green-500/20 text-green-400 border-green-500/50 animate-pulse'
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
          >
            <div className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-green-500' : 'bg-gray-500'}`} />
            {isSimulating ? 'Simulating Live Data...' : 'Start Live Simulation'}
          </button>
          <button onClick={handleReset} className="glass-strong px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={handleSave} className="glass-strong px-6 py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 flex items-center gap-2">
            <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-700 pb-2">
        <button onClick={() => setActiveTab('manual')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'manual' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'}`}>
          <FileText className="w-4 h-4" /> Manual Editor
        </button>
        <button onClick={() => setActiveTab('upload')} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${activeTab === 'upload' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400'}`}>
          <Upload className="w-4 h-4" /> Upload Dataset
        </button>
      </div>

      {activeTab === 'upload' ? <DataUpload onUploadSuccess={handleUploadSuccess} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hospital */}
          <div className="glass-strong rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Hospital</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Total Beds</label>
                <input type="number" value={hospitalData.totalBeds} onChange={e => setHospitalData({ ...hospitalData, totalBeds: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Occupied</label>
                <input type="number" value={hospitalData.occupied} onChange={e => setHospitalData({ ...hospitalData, occupied: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Occupied Color</label>
                <input type="color" value={hospitalData.occupiedColor} onChange={e => setHospitalData({ ...hospitalData, occupiedColor: e.target.value })} className="w-full h-10 rounded-lg bg-gray-800 border-gray-700" />
              </div>
            </div>
          </div>

          {/* Warehouse */}
          <div className="glass-strong rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Warehouse</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Total Shelves</label>
                <input type="number" value={warehouseData.totalShelves} onChange={e => setWarehouseData({ ...warehouseData, totalShelves: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Occupied</label>
                <input type="number" value={warehouseData.occupied} onChange={e => setWarehouseData({ ...warehouseData, occupied: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Occupied Color</label>
                <input type="color" value={warehouseData.occupiedColor} onChange={e => setWarehouseData({ ...warehouseData, occupiedColor: e.target.value })} className="w-full h-10 rounded-lg bg-gray-800 border-gray-700" />
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="glass-strong rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-pink-400" />
              <h2 className="text-xl font-semibold text-white">System Metrics</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Accuracy (%)</label>
                <input type="number" value={metricsData.accuracy} onChange={e => setMetricsData({ ...metricsData, accuracy: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Errors</label>
                <input type="number" value={metricsData.errors} onChange={e => setMetricsData({ ...metricsData, errors: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Resp Time (ms)</label>
                <input type="number" value={metricsData.responseTime} onChange={e => setMetricsData({ ...metricsData, responseTime: parseInt(e.target.value) })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default DemoDataEditor
