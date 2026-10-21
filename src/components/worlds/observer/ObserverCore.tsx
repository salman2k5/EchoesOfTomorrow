import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ParallaxOffset } from '../../../types'
import { getPointSprite } from '../../../utils/pointSprite'

// Resting 3/4 view so the layered form reads in perspective instead of edge-on
const REST_YAW = -0.45
const REST_TILT = 0.3

export type ObserverMode = 'unified' | 'unfold' | 'lattice'

interface ObserverCoreProps {
  mode: ObserverMode
  parallax: ParallaxOffset
  reducedMotion: boolean
}

export const ObserverCore: React.FC<ObserverCoreProps> = ({
  mode,
  parallax,
  reducedMotion,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const petalsGroupRef = useRef<THREE.Group>(null!)
  const latticePointsRef = useRef<THREE.Points>(null!)
  const dynamicLightRef = useRef<THREE.PointLight>(null!)
  const coreLightRef = useRef<THREE.PointLight>(null!)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rootGroupRef.current) {
        rootGroupRef.current.traverse((obj) => {
          if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
            obj.geometry.dispose()
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose())
            } else {
              obj.material.dispose()
            }
          }
        })
      }
    }
  }, [])

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return
    const time = state.clock.getElapsedTime()

    // 1. Pointer Parallax with Strict Clamping & Smooth Lerping
    if (!reducedMotion) {
      const targetRotY = REST_YAW + Math.max(-0.35, Math.min(0.35, parallax.x * 0.45))
      const targetRotX = REST_TILT + Math.max(-0.25, Math.min(0.25, -parallax.y * 0.35))

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

      // Dynamic Specular Light Follows Cursor
      if (dynamicLightRef.current) {
        const lx = parallax.x * 3.5
        const ly = -parallax.y * 3.0 + 2.0
        dynamicLightRef.current.position.x = THREE.MathUtils.lerp(dynamicLightRef.current.position.x, lx, delta * 3)
        dynamicLightRef.current.position.y = THREE.MathUtils.lerp(dynamicLightRef.current.position.y, ly, delta * 3)
      }
    }

    // 2. Mode Interpolation (Cinematic Layer Transition)
    // Mode 'unfold': petals bloom open radially; mode 'lattice': petals become compact wireframe
    const targetBloom = mode === 'unfold' ? 1.45 : mode === 'lattice' ? 0.4 : 0.0
    const targetScale = mode === 'unfold' ? 1.15 : mode === 'lattice' ? 0.95 : 1.0

    rootGroupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 2.5)

    if (petalsGroupRef.current) {
      petalsGroupRef.current.children.forEach((child, idx) => {
        const angle = (idx / 8) * Math.PI * 2
        const dirX = Math.cos(angle)
        const dirZ = Math.sin(angle)
        const baseRadius = 1.35
        const targetX = dirX * (baseRadius + targetBloom)
        const targetZ = dirZ * (baseRadius + targetBloom)
        const targetRotY = angle + (mode === 'unfold' ? 0.5 : 0)

        child.position.x = THREE.MathUtils.lerp(child.position.x, targetX, delta * 3.0)
        child.position.z = THREE.MathUtils.lerp(child.position.z, targetZ, delta * 3.0)
        child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, targetRotY, delta * 2.5)
      })
    }

    // 3. Subtle Autonomous Rotation & Breathing
    if (!reducedMotion) {
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.12
        coreRef.current.rotation.z += delta * 0.06
      }
      if (innerRef.current) {
        innerRef.current.rotation.y -= delta * 0.18
        innerRef.current.rotation.x += delta * 0.1
      }
      if (latticePointsRef.current) {
        latticePointsRef.current.rotation.y += delta * 0.04
      }
      if (coreLightRef.current) {
        const baseIntensity = mode === 'unfold' ? 3.2 : 1.8
        coreLightRef.current.intensity = baseIntensity + Math.sin(time * 2.0) * 0.4
      }
    }
  })

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]} rotation={[REST_TILT, REST_YAW, 0]}>
      {/* Dynamic Key Light that shifts specular gleams with pointer */}
      <pointLight
        ref={dynamicLightRef}
        color="#86AFFF"
        intensity={2.6}
        position={[2, 2.5, 3]}
        distance={10}
        decay={2}
      />

      {/* Internal Core Radiant Light */}
      <pointLight
        ref={coreLightRef}
        color="#E5EDF9"
        intensity={2.2}
        distance={6}
        decay={2}
      />

      {/* Restrained Violet Rim Accent */}
      <pointLight
        color="#9A82DC"
        intensity={1.5}
        position={[-2.5, -2, -2]}
        distance={7}
        decay={2}
      />

      {/* LAYER 1: Central Singularity Core (Nested Polyhedral Seed) */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshPhysicalMaterial
          color="#03050A"
          emissive="#101626"
          emissiveIntensity={0.4}
          metalness={0.94}
          roughness={0.12}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          reflectivity={0.95}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Luminous focal point at the heart of the form */}
      <mesh renderOrder={3}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshBasicMaterial color="#E5EDF9" transparent opacity={1} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh renderOrder={3}>
        <sphereGeometry args={[0.24, 24, 24]} />
        <meshBasicMaterial
          color="#86AFFF"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Structural Edge Traces */}
      <lineSegments>
        <edgesGeometry args={[new THREE.OctahedronGeometry(0.754, 0)]} />
        <lineBasicMaterial
          color="#86AFFF"
          transparent
          opacity={mode === 'lattice' ? 0.9 : 0.55}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Inner Glowing Energetic Lattice (Icosahedron) */}
      <mesh ref={innerRef} scale={[0.42, 0.42, 0.42]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#E5EDF9"
          emissive="#86AFFF"
          emissiveIntensity={mode === 'unfold' ? 2.4 : 1.2}
          wireframe
        />
      </mesh>

      {/* LAYER 2: 8 Modular Obsidian Petal Shrouds (Blooms open in Unfold Mode) */}
      <group ref={petalsGroupRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          const x = Math.cos(angle) * 1.35
          const z = Math.sin(angle) * 1.35
          return (
            <group key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
              <mesh>
                <boxGeometry args={[0.32, 1.4, 0.08]} />
                <meshStandardMaterial
                  color="#0B1226"
                  metalness={0.35}
                  roughness={0.2}
                  transparent
                  opacity={0.5}
                  depthWrite={false}
                  emissive="#86AFFF"
                  emissiveIntensity={0.05}
                  wireframe={mode === 'lattice'}
                />
              </mesh>
              {/* Petal laser edge contour */}
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(0.324, 1.404, 0.084)]} />
                <lineBasicMaterial
                  color="#9A82DC"
                  transparent
                  opacity={0.6}
                  blending={THREE.AdditiveBlending}
                />
              </lineSegments>
            </group>
          )
        })}
      </group>

      {/* LAYER 3: Quantum Field Lattice (Point Cloud of Conscious Vectors) */}
      <points ref={latticePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 90 * 3 }, (_, idx) => {
                  const pIdx = Math.floor(idx / 3)
                  const theta = (pIdx / 90) * Math.PI * 4
                  const r = 2.2 + (pIdx % 3) * 0.4
                  if (idx % 3 === 0) return Math.cos(theta) * r
                  if (idx % 3 === 1) return ((pIdx % 9) - 4) * 0.35
                  return Math.sin(theta) * r
                })
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          map={getPointSprite()}
          size={0.1}
          color={mode === 'lattice' ? '#86AFFF' : '#9A82DC'}
          transparent
          opacity={mode === 'lattice' ? 0.95 : 0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Polar Resonance Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 16, 120]} />
        <meshBasicMaterial
          color="#86AFFF"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
