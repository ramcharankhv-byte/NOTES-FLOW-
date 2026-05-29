'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Box } from '@react-three/drei'
import * as THREE from 'three'

function RotatingBox() {
  const boxRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.005
      boxRef.current.rotation.y += 0.007
      boxRef.current.rotation.z += 0.003
    }
  })

  return (
    <Box ref={boxRef} args={[2, 2, 2]} scale={1.5}>
      <meshStandardMaterial
        color="#0084FF"
        emissive="#0084FF"
        emissiveIntensity={0.3}
        wireframe={true}
      />
    </Box>
  )
}

export function RotatingCube() {
  return (
    <Canvas className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <RotatingBox />
    </Canvas>
  )
}
