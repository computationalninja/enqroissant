import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div className={`fixed bottom-24 right-6 glass-strong rounded-lg p-4 flex items-center gap-3 min-w-[300px] z-50 animate-slide-up ${
      type === 'success' ? 'border border-green-500/50' : 'border border-red-500/50'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      )}
      <p className={`text-sm flex-1 ${
        type === 'success' ? 'text-green-300' : 'text-red-300'
      }`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Toast

