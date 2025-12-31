import { TrendingUp } from 'lucide-react'

const MetricsCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    red: 'from-red-500 to-red-600',
  }

  return (
    <div className="glass-strong rounded-xl p-6 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend.startsWith('-') ? 'rotate-180' : ''}`} />
          {trend}
        </div>
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

export default MetricsCard

