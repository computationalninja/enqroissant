import { useMemo } from 'react'
import { Box, Text } from '@react-three/drei'

const Hospital3D = ({ stats, occupiedColor = '#ef4444', labelPrefix = 'Room' }) => {
  const gridSize = 10
  const bedsPerRow = 10
  const bedsPerCol = 10

  const beds = useMemo(() => {
    const bedArray = []

    // Check if we have uploaded/custom data
    if (stats.bedData && stats.bedData.length > 0) {
      stats.bedData.forEach((bed, index) => {
        const row = Math.floor(index / bedsPerRow)
        const col = index % bedsPerRow

        let color = '#10b981' // available/green
        let status = bed.status ? bed.status.toLowerCase() : 'available'

        if (status === 'occupied') color = '#ef4444' // red
        else if (status === 'cleaning') color = '#eab308' // yellow
        else if (status === 'critical') color = '#7f1d1d' // dark red

        bedArray.push({
          x: (col - bedsPerRow / 2) * 1.5,
          z: (row - bedsPerCol / 2) * 1.5,
          occupied: status === 'occupied' || status === 'critical',
          status: status,
          color: color,
          roomNumber: bed.bed_id || (index + 1),
          patientId: bed.patient_id
        })
      })
      return bedArray
    }

    // Default procedural generation
    const totalBeds = stats.totalBeds || 100
    const occupied = stats.occupied || 0

    for (let i = 0; i < bedsPerRow; i++) {
      for (let j = 0; j < bedsPerCol; j++) {
        const index = i * bedsPerCol + j
        if (index < totalBeds) {
          const isOccupied = index < occupied
          bedArray.push({
            x: (i - bedsPerRow / 2) * 1.5,
            z: (j - bedsPerCol / 2) * 1.5,
            occupied: isOccupied,
            status: isOccupied ? 'occupied' : 'available',
            color: isOccupied ? occupiedColor : '#10b981',
            roomNumber: index + 1
          })
        }
      }
    }
    return bedArray
  }, [stats.totalBeds, stats.occupied, stats.bedData, occupiedColor])

  return (
    <group>
      {/* Floor */}
      <Box
        args={[gridSize * 1.5, 0.1, gridSize * 1.5]}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Box>

      {/* Beds */}
      {beds.map((bed, index) => (
        <group key={index} position={[bed.x, 0.2, bed.z]}>
          <Box args={[1, 0.4, 0.8]}>
            <meshStandardMaterial
              color={bed.color}
              emissive={bed.status === 'critical' ? '#ff0000' : bed.color}
              emissiveIntensity={bed.status === 'critical' ? 0.8 : 0.3}
            />
          </Box>
          <Box args={[1.1, 0.1, 0.9]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#374151" />
          </Box>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.15}
            color={bed.color}
            anchorX="center"
            anchorY="middle"
          >
            {labelPrefix} {bed.roomNumber}
          </Text>
        </group>
      ))}
    </group>
  )
}

export default Hospital3D
