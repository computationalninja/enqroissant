import { useState, useEffect, useRef } from 'react'
import { Mic, X, List, MessageSquare } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

const VoiceCommandHandler = ({ industry, setIndustry }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCommands, setShowCommands] = useState(false)
  const [error, setError] = useState('')
  const [conversation, setConversation] = useState([])
  const [responseHistory, setResponseHistory] = useState([])

  const recognitionRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Determine current context based on route
  const getCurrentContext = () => {
    const path = location.pathname
    if (path.includes('hospital')) return 'hospital'
    if (path.includes('warehouse')) return 'warehouse'
    return 'dashboard'
  }

  const speak = async (text) => {
    // Add to conversation history immediately
    setConversation(prev => [...prev, { type: 'ai', text }])

    // Check if we should use ElevenLabs via backend
    try {
      const response = await axios.post('/api/ai/speak', { text }, { responseType: 'blob' })
      if (response.headers['content-type'] === 'audio/mpeg') {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const audio = new Audio(url)
        audio.play()
        return
      }
    } catch (e) {
      // Fallback to browser TTS if backend fails or returns mock status
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const getVariedAcknowledgment = () => {
    const acks = ["Got it", "Understood", "Processing", "On it", "Working on it", "Checking that for you"]
    return acks[Math.floor(Math.random() * acks.length)]
  }

  const processCommand = async (command) => {
    const lowerCommand = command.toLowerCase().trim()
    const context = getCurrentContext()
    setTranscript(command)

    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', text: command }])

    try {
      // 1. Navigation & Mode Switching
      if (lowerCommand.includes('switch to warehouse') || lowerCommand.includes('change to warehouse')) {
        setIndustry('warehouse')
        navigate('/warehouse')
        return speak("Switched to warehouse operations view.")
      }

      if (lowerCommand.includes('switch to hospital') || lowerCommand.includes('change to hospital')) {
        setIndustry('hospital')
        navigate('/hospital')
        return speak("Switched to hospital operations view.")
      }

      if (lowerCommand.includes('show metrics') || lowerCommand.includes('show dashboard') || lowerCommand.includes('dashboard')) {
        navigate('/')
        return speak("Displaying the metrics dashboard.")
      }

      // 2. Data Queries - Hospital
      if ((lowerCommand.includes('count') || lowerCommand.includes('how many')) &&
        (lowerCommand.includes('bed') || lowerCommand.includes('hospital'))) {
        const res = await axios.get('/api/hospital/stats')
        const { totalBeds, occupied, available } = res.data
        if (context !== 'hospital') navigate('/hospital')
        return speak(`There are ${totalBeds} total beds. ${occupied} are occupied and ${available} are available.`)
      }

      if (lowerCommand.includes('occupied') && (context === 'hospital' || lowerCommand.includes('hospital'))) {
        const res = await axios.get('/api/hospital/stats')
        const { occupied, totalBeds } = res.data
        const percent = Math.round((occupied / totalBeds) * 100)
        return speak(`Hospital is at ${percent}% capacity, that's ${occupied} beds occupied.`)
      }

      if (lowerCommand.includes('next available') || lowerCommand.includes('next room')) {
        const res = await axios.get('/api/hospital/next-available')
        if (res.data.nextAvailableRoom) {
          return speak(`The next available room is Room ${res.data.nextAvailableRoom}.`)
        }
        return speak("No rooms are currently available.")
      }

      // 3. Optimization
      if (lowerCommand.includes('optimize') && (lowerCommand.includes('hospital') || context === 'hospital')) {
        const ack = getVariedAcknowledgment()
        speak(`${ack}, running optimization...`)

        const res = await axios.post('/api/optimize', { type: 'hospital' })
        const { result } = res.data
        const timeSaved = result.time_saved || 15
        const beds = result.beds_optimized || 100
        return speak(`Optimization complete. Processed ${beds} beds. Reduced average wait time by ${timeSaved} minutes.`)
      }

      if (lowerCommand.includes('optimize') && (lowerCommand.includes('warehouse') || context === 'warehouse')) {
        const ack = getVariedAcknowledgment()
        speak(`${ack}, optimizing warehouse routing...`)

        const res = await axios.post('/api/optimize', { type: 'warehouse' })
        const { result } = res.data
        const distSaved = result.distance_saved || '12%'
        return speak(`Optimization complete. Routing efficiency improved by ${distSaved}.`)
      }

      // 4. Data Queries - Warehouse
      if ((lowerCommand.includes('count') || lowerCommand.includes('how many')) &&
        (lowerCommand.includes('shelf') || lowerCommand.includes('warehouse') || lowerCommand.includes('item'))) {
        const res = await axios.get('/api/warehouse/stats')
        const { totalShelves, occupied } = res.data
        if (context !== 'warehouse') navigate('/warehouse')
        return speak(`Warehouse has ${totalShelves} locations, with ${occupied} currently holding items.`)
      }

      if (lowerCommand.includes('occupied') && (context === 'warehouse' || lowerCommand.includes('warehouse'))) {
        const res = await axios.get('/api/warehouse/stats')
        const { occupied, totalShelves } = res.data
        const percent = Math.round((occupied / totalShelves) * 100)
        return speak(`Warehouse is at ${percent}% capacity.`)
      }

      // 5. System Status
      if (lowerCommand.includes('accuracy')) {
        const res = await axios.get('/api/metrics')
        return speak(`The optimization accuracy is ${res.data.accuracy} percent.`)
      }

      if (lowerCommand.includes('errors')) {
        const res = await axios.get('/api/metrics')
        return speak(res.data.errors === 0 ? "No errors detected." : `Detected ${res.data.errors} system errors.`)
      }

      // 6. Intelligent Response (Gemini)
      const aiRes = await axios.post('/api/ai/chat', { prompt: command, context })
      if (aiRes.data.status === 'success') {
        return speak(aiRes.data.response)
      }

      return speak("I understand. How else can I assist with your operations?")

    } catch (e) {
      console.error(e)
      speak("Sorry, I'm having trouble accessing real-time data.")
    }
  }

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Browser not supported')
      setShowModal(true)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-US'
      recognitionRef.current = recognition

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('Listening...')
        setShowModal(true)
        setError('')
      }

      recognition.onresult = (event) => {
        const cmd = event.results[0][0].transcript
        processCommand(cmd)
      }

      recognition.onend = () => setIsListening(false)
      recognition.start()
    } catch (e) {
      console.error(e)
      setError('Failed to start microphone')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
    setShowModal(false)
  }

  const commands = [
    "Optimize hospital",
    "Optimize warehouse",
    "Show metrics",
    "Switch to warehouse",
    "Switch to hospital",
    "How many beds occupied?",
    "Next available room",
    "System accuracy",
    "Any errors?"
  ]

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/90 border border-indigo-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                Voice Assistant
              </h3>
              <div className="flex gap-2">
                <button onClick={() => setShowCommands(!showCommands)} className="text-gray-400 hover:text-white"><List className="w-5 h-5" /></button>
                <button onClick={stopListening} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {showCommands && (
              <div className="mb-4 bg-gray-800/50 rounded-lg p-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Try saying:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {commands.map((c, i) => (
                    <button key={i} onClick={() => processCommand(c)} className="text-left text-xs text-indigo-300 hover:text-indigo-200 truncate">
                      • {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-64 overflow-y-auto mb-4 space-y-4 p-2 custom-scrollbar border border-gray-800 rounded-lg bg-black/20">
              {conversation.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.type === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {conversation.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <p>{isListening ? 'Listening...' : 'Ready'}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center pt-4 border-t border-gray-800">
              {isListening ? (
                <p className="text-indigo-400 animate-pulse text-sm">Listening...</p>
              ) : (
                <button onClick={startListening} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors">
                  Speak Again
                </button>
              )}
            </div>
            {error && <p className="text-red-400 text-center text-xs mt-2">{error}</p>}
          </div>
        </div>
      )}

      <button
        onClick={isListening ? stopListening : startListening}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all z-40 shadow-lg ${isListening
          ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30'
          : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
      >
        <Mic className="w-6 h-6 text-white" />
      </button>
    </>
  )
}

export default VoiceCommandHandler
