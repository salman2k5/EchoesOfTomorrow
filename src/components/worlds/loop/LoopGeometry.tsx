import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ParallaxOffset } from '../../../types'
import { getPointSprite } from '../../../utils/pointSprite'

interface LoopGeometryProps {
  timeSpeed: number
  scrubOffset: number
  isScrubbing: boolean
  parallax: ParallaxOffset
  reducedMotion: boolean
}

export const LoopGeometry: React.FC<LoopGeometryProps> = ({
  timeSpeed,
  scrubOffset,
  isScrubbing,
  parallax,
  reducedMotion,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const innerRingRef = useRef<THREE.Mesh>(null!)
  const outerRingRef = useRef<THREE.Mesh>(null!)
  const lemniscateGroupRef = useRef<THREE.Group>(null!)
  const nodesRef = useRef<THREE.Group>(null!)
  const chrononParticlesRef = useRef<THREE.Points>(null!)

  // Internal continuous time accumulator (respects speed & direction)
  const accumulatedTimeRef = useRef<number>(0)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rootGroupRef.current) {
        rootGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
            child.geometry.dispose()
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose())
            } else {
              child.material.dispose()
            }
          }
        })
      }
    }
  }, [])

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    // 1. Calculate active temporal phase
    if (!reducedMotion) {
      if (!isScrubbing) {
        accumulatedTimeRef.current += delta * timeSpeed
      }
    }

    // Effective time = continuous timeline + visitor scrub delta
    const effectiveTime = accumulatedTimeRef.current + scrubOffset * 5.0

    // 2. Parallax rotation
    if (!reducedMotion) {
      const targetRotY = Math.max(-0.3, Math.min(0.3, parallax.x * 0.35))
      const targetRotX = Math.max(-0.25, Math.min(0.25, -parallax.y * 0.3))

      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.y,
        targetRotY,
        delta * 2.8
      )
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rootGroupRef.current.rotation.x,
        targetRotX,
        delta * 2.8
      )
    }

    // 3. Chronometric Ring Rotations directly driven by effective time
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z = effectiveTime * 0.4
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -effectiveTime * 0.25
      outerRingRef.current.rotation.x = Math.sin(effectiveTime * 0.15) * 0.2 + Math.PI / 3
    }
    if (lemniscateGroupRef.current) {
      lemniscateGroupRef.current.rotation.y = effectiveTime * 0.18
    }

    // 4. Orbital Chrono-Nodes positioned on 3D Figure-8 / Elliptic Orbit
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        const offsetPhase = effectiveTime * 0.6 + (i * (Math.PI * 2 / 3))
        // 3D Lissajous / Trefoil curve
        const x = Math.sin(offsetPhase) * 2.4
        const y = Math.sin(offsetPhase * 2.0) * 0.7
        const z = Math.cos(offsetPhase) * 2.0

        child.position.set(x, y, z)
      })
    }

    // 5. Chronon Particles flow along timeline
    if (chrononParticlesRef.current) {
      chrononParticlesRef.current.rotation.z = effectiveTime * 0.3
    }
  })

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Lighting for The Loop */}
      <pointLight color="#86AFFF" intensity={2.4} position={[0, 0, 3]} distance={8} decay={2} />
      <pointLight color="#9A82DC" intensity={1.8} position={[0, 3, -2]} distance={8} decay={2} />

      {/* Central Chrono Core / Event Horizon Disc */}
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshPhysicalMaterial
          color="#03050A"
          emissive="#101626"
          emissiveIntensity={0.5}
          metalness={0.95}
          roughness={0.12}
          clearcoat={1}
        />
      </mesh>

      {/* Pulsing Quantum Horizon Aperture */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.76, 80]} />
        <meshBasicMaterial
          color="#86AFFF"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring 1: Primary Equatorial Chrono Ring */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.016, 16, 120]} />
        <meshStandardMaterial
          color="#101626"
          metalness={0.9}
          roughness={0.15}
          emissive="#86AFFF"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Ring 2: Oblique Precession Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.55, 0.014, 16, 140]} />
        <meshStandardMaterial
          color="#03050A"
          metalness={0.95}
          roughness={0.18}
          emissive="#9A82DC"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Lemniscate / Figure-8 Orbital Guide Curve */}
      <group ref={lemniscateGroupRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.2, 0.008, 12, 100]} />
          <meshBasicMaterial
            color="#86AFFF"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* 3 Interactive Chrono-Nodes (Past, Present, Future) */}
      <group ref={nodesRef}>
        {['#9A82DC', '#86AFFF', '#E5EDF9'].map((col, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color={col}
              emissive={col}
              emissiveIntensity={1.2}
            />
          </mesh>
        ))}
      </group>

      {/* Chronon Particle Orbit Streams */}
      <points ref={chrononParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 140 * 3 }, (_, idx) => {
                  const pIdx = Math.floor(idx / 3)
                  const u = (pIdx / 140) * Math.PI * 2
                  const r = 2.0 + Math.sin(u * 3) * 0.4
                  if (idx % 3 === 0) return Math.cos(u) * r
                  if (idx % 3 === 1) return Math.sin(u) * r * 0.5
                  return Math.sin(u * 2) * 0.8
                })
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={getPointSprite()}
          size={0.075}
          color="#86AFFF"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
