import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ParallaxOffset } from '../../types'
import { getPointSprite } from '../../utils/pointSprite'

interface SparseParticles3DProps {
  parallax: ParallaxOffset
  reducedMotion: boolean
  isTransitioning: boolean
}

export const SparseParticles3D: React.FC<SparseParticles3DProps> = ({
  parallax,
  reducedMotion,
  isTransitioning,
}) => {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 180 // Modest, sparse count for cinematic scale

  // Generate deterministic 3D distribution
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const colorBlue = new THREE.Color('#E5EDF9')
    const colorCyan = new THREE.Color('#86AFFF')
    const colorViolet = new THREE.Color('#9A82DC')

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical volume around center (r: 2 to 9, y: -4 to 4, z: -6 to 6)
      const radius = 2.5 + Math.random() * 6.5
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 8.0
      const z = (Math.random() - 0.5) * 8.0

      pos[i * 3] = Math.cos(theta) * radius
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      // 80% Blue-white, 15% Cyan, 5% soft Violet
      const pick = Math.random()
      const c = pick > 0.85 ? colorViolet : pick > 0.35 ? colorCyan : colorBlue
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }

    return [pos, col]
  }, [count])

  // Cleanup WebGL resources on unmount
  useEffect(() => {
    return () => {
      if (pointsRef.current) {
        pointsRef.current.geometry.dispose()
        if (Array.isArray(pointsRef.current.material)) {
          pointsRef.current.material.forEach((m) => m.dispose())
        } else {
          pointsRef.current.material.dispose()
        }
      }
    }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return

    // Restrained drift
    const speed = isTransitioning ? 2.8 : 0.08
    pointsRef.current.rotation.y += delta * speed * 0.3

    // Gentle parallax response
    const targetX = parallax.x * 0.4
    const targetY = -parallax.y * 0.3
    pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, targetX, delta * 2.5)
    pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, targetY, delta * 2.5)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        map={getPointSprite()}
        size={0.08}
        sizeAttenuation
        vertexColors
        transparent
        opacity={isTransitioning ? 0.9 : 0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
