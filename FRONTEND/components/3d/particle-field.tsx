'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticlesProps {
  count?: number
}

function ParticlesComponent({ count = 500 }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const particlesArray = useRef<THREE.Vector3[]>([])

  useEffect(() => {
    const particles: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50
      const y = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 50
      particles.push(new THREE.Vector3(x, y, z))
    }
    particlesArray.current = particles

    if (pointsRef.current) {
      const positions = new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))
      pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    }
  }, [count])

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0001
      pointsRef.current.rotation.y += 0.0002
    }
  })

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        size={0.15}
        color="#0084FF"
        sizeAttenuation={true}
      />
    </Points>
  )
}

export function ParticleField() {
  return (
    <Canvas className="absolute inset-0">
      <PerspectiveCamera makeDefault position={[0, 0, 30]} />
      <ParticlesComponent count={500} />
    </Canvas>
  )
}
