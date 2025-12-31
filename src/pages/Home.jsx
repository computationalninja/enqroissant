import { useState, useEffect } from 'react'
import { Activity, Zap, TrendingUp, Clock } from 'lucide-react'
import MetricsCard from '../components/MetricsCard'
import MonitoringChart from '../components/MonitoringChart'
import axios from 'axios'

// Add error handling wrapper for API calls
const apiCall = async (url, options = {}) => {
  try {
    return await axios({ url, ...options, timeout: 5000 })
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      throw new Error('Backend server is not running. Please start the Flask backend on port 5000.')
    }
    throw error
  }
}

const Home = ({ industry }) => {
  const [metrics, setMetrics] = useState({
    activeOptimizations: 0,
    responseTime: 0,
    accuracy: 0,
    errors: 0,
    costSaved: 0,
    energySaved: 0
  })

  const [chartData, setChartData] = useState({
    responseTimes: [],
    accuracy: [],
    errors: [],
    costSaved: [],
    energySaved: []
  })

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiCall('/api/metrics')
        setMetrics(response.data)
      } catch (error) {
        console.error('Error fetching metrics:', error)
      }
    }

    // Get refresh interval from settings
    const saved = localStorage.getItem('quantum-platform-settings')
    const refreshInterval = saved ? JSON.parse(saved).refreshInterval || 2000 : 2000

    fetchMetrics()
    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await apiCall('/api/monitoring')
        setChartData(response.data)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }

    // Get refresh interval from settings
    const saved = localStorage.getItem('quantum-platform-settings')
    const refreshInterval = saved ? JSON.parse(saved).refreshInterval || 2000 : 2000

    fetchChartData()
    const interval = setInterval(fetchChartData, refreshInterval)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">
          Real-time monitoring and optimization for {industry === 'hospital' ? 'Hospital' : 'Warehouse'} operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Active Optimizations"
          value={metrics.activeOptimizations}
          icon={Zap}
          color="indigo"
          trend="+12%"
        />
        <MetricsCard
          title="Response Time"
          value={`${metrics.responseTime}ms`}
          icon={Clock}
          color="purple"
          trend="-5%"
        />
        <MetricsCard
          title="Accuracy"
          value={`${metrics.accuracy}%`}
          icon={TrendingUp}
          color="pink"
          trend="+3%"
        />
        <MetricsCard
          title="Errors"
          value={metrics.errors}
          icon={Activity}
          color="red"
          trend="-8%"
        />
        <MetricsCard
          title="Cost Saved"
          value={metrics.costSaved}
          icon={Activity}
          color="green"
          trend="+8%"
        />
        <MetricsCard
          title="Energy Saved"
          value={metrics.energySaved}
          icon={Activity}
          color="green"
          trend="+8%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonitoringChart
          title="Response Times"
          data={chartData.responseTimes}
          color="#6366f1"
          yAxisLabel="ms"
        />
        <MonitoringChart
          title="Accuracy Trend"
          data={chartData.accuracy}
          color="#8b5cf6"
          yAxisLabel="%"
        />
        <MonitoringChart
          title="Error Rate"
          data={chartData.errors}
          color="#ef4444"
          yAxisLabel="count"
        />
        <MonitoringChart
          title="Cost over time"
          data={chartData.costSaved}
          color="#ef4444"
          yAxisLabel="count"
        />
        <MonitoringChart
          title="Energy over time"
          data={chartData.energySaved}
          color="#ef4444"
          yAxisLabel="count"
        />
      </div>
    </div>
  )
}

export default Home

