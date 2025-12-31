import { useMemo } from 'react'
import { Box, Text } from '@react-three/drei'

const Warehouse3D = ({ stats, occupiedColor = '#f59e0b', labelPrefix = 'S' }) => {
  const shelfRows = 5
  const shelfCols = 10
  const shelvesPerUnit = 3

  const shelves = useMemo(() => {
    const shelfArray = []

    // Check if we have uploaded/custom data
    if (stats.shelfData && stats.shelfData.length > 0) {
      const count = stats.shelfData.length
      const dynamicCols = Math.ceil(Math.sqrt(count * 2))

      stats.shelfData.forEach((shelf, index) => {
        const row = Math.floor(index / dynamicCols)
        const col = index % dynamicCols

        const current = parseInt(shelf.item_count) || 0
        const capacity = parseInt(shelf.capacity) || 100
        const fillParam = capacity > 0 ? current / capacity : 0

        let color = '#ef4444' // red/empty (0-30%)
        let status = 'empty'

        if (fillParam > 0.7) {
          color = '#10b981' // green/full
          status = 'full'
        } else if (fillParam > 0.3) {
          color = '#f59e0b' // orange/active
          status = 'active'
        }

        shelfArray.push({
          x: (col - dynamicCols / 2) * 2.5,
          z: (row - (count / dynamicCols) / 2) * 2,
          occupied: current > 0,
          color: color,
          status: status,
          fillPercent: Math.round(fillParam * 100),
          shelfNumber: shelf.shelf_id || (index + 1),
          zone: shelf.zone
        })
      })
      return shelfArray
    }

    // Default procedural generation
    const totalShelves = stats.totalShelves || 50
    const occupied = stats.occupied || 0

    for (let i = 0; i < shelfRows; i++) {
      for (let j = 0; j < shelfCols; j++) {
        const index = i * shelfCols + j
        if (index < totalShelves) {
          const isOccupied = index < occupied
          shelfArray.push({
            x: (i - shelfRows / 2) * 3,
            z: (j - shelfCols / 2) * 2,
            occupied: isOccupied,
            color: isOccupied ? occupiedColor : '#10b981',
            status: isOccupied ? 'active' : 'empty',
            shelfNumber: index + 1
          })
        }
      }
    }
    return shelfArray
  }, [stats.totalShelves, stats.occupied, stats.shelfData, occupiedColor])

  return (
    <group>
      {/* Floor */}
      <Box
        args={[shelfRows * 3, 0.1, shelfCols * 2]}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Box>

      {/* Shelving Units */}
      {shelves.map((shelf, index) => (
        <group key={index} position={[shelf.x, 1.5, shelf.z]}>
          <Box args={[2, 3, 1.5]} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={shelf.color}
              emissive={shelf.color}
              emissiveIntensity={0.2}
            />
          </Box>

          {Array.from({ length: shelvesPerUnit }).map((_, level) => (
            <Box
              key={level}
              args={[1.8, 0.1, 1.3]}
              position={[0, (level - 1) * 1, 0]}
            >
              <meshStandardMaterial
                color={shelf.color}
                emissive={shelf.color}
                emissiveIntensity={0.3}
              />
            </Box>
          ))}

          {shelf.occupied && (
            <Box args={[0.3, 0.3, 0.3]} position={[0, 0.5, 0]}>
              <meshStandardMaterial
                color={occupiedColor}
                emissive={occupiedColor}
                emissiveIntensity={0.5}
              />
            </Box>
          )}

          <Text
            position={[0, 2.2, 0]}
            fontSize={0.12}
            color={shelf.color}
            anchorX="center"
            anchorY="middle"
          >
            {shelf.zone ? `${shelf.zone}-${shelf.shelfNumber}` : `${labelPrefix}-${shelf.shelfNumber}`}
          </Text>
        </group>
      ))}
    </group>
  )
}

export default Warehouse3D
