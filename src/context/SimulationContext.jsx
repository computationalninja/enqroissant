import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const SimulationContext = createContext()

export const useSimulation = () => useContext(SimulationContext)

export const SimulationProvider = ({ children }) => {
    const [isSimulating, setIsSimulating] = useState(false)
    const [simulationStatus, setSimulationStatus] = useState(null)

    useEffect(() => {
        let interval
        if (isSimulating) {
            // Run immediately
            const runSim = async () => {
                try {
                    const res = await axios.post('/api/demo/simulate')
                    if (res.data.changes && res.data.changes.length > 0) {
                        setSimulationStatus(`Updated ${res.data.changes.length} items`)
                        // Trigger global event for components to refresh
                        window.dispatchEvent(new Event('demoDataUpdated'))

                        // Clear status after a bit
                        setTimeout(() => setSimulationStatus(null), 1500)
                    }
                } catch (e) {
                    console.error("Simulation error", e)
                    setIsSimulating(false) // Stop on error?
                }
            }

            runSim()
            interval = setInterval(runSim, 3000) // Every 3 seconds
        }

        return () => clearInterval(interval)
    }, [isSimulating])

    return (
        <SimulationContext.Provider value={{ isSimulating, setIsSimulating, simulationStatus }}>
            {children}
        </SimulationContext.Provider>
    )
}
