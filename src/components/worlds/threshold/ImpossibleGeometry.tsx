import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ParallaxOffset } from '../../../types'

export type ThresholdConfig = 'tesseract' | 'penrose' | 'expanded'

interface ImpossibleGeometryProps {
  config: ThresholdConfig
  parallax: ParallaxOffset
  reducedMotion: boolean
}

export const ImpossibleGeometry: React.FC<ImpossibleGeometryProps> = ({
  config,
  parallax,
  reducedMotion,
}) => {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const innerCubeRef = useRef<THREE.Mesh>(null!)
  const outerCubeRef = useRef<THREE.Mesh>(null!)
  const strutsGroupRef = useRef<THREE.Group>(null!)
  const penroseGroupRef = useRef<THREE.Group>(null!)
  const expandedGroupRef = useRef<THREE.Group>(null!)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rootGroupRef.current) {
        rootGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
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

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return
    const time = state.clock.getElapsedTime()

    // 1. Pointer Parallax with clamped damping
    if (!reducedMotion) {
      const targetRotY = Math.max(-0.4, Math.min(0.4, parallax.x * 0.4))
      const targetRotX = Math.max(-0.3, Math.min(0.3, -parallax.y * 0.35))

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

    // 2. Cinematic Morphing Dynamics based on Config
    const isTesseract = config === 'tesseract'
    const isPenrose = config === 'penrose'
    const isExpanded = config === 'expanded'

    // Outer & Inner cube target scales and rotations
    if (outerCubeRef.current && innerCubeRef.current) {
      const targetOuterScale = isTesseract ? 1.0 : isPenrose ? 0.001 : 0.45
      const targetInnerScale = isTesseract ? 0.52 : isPenrose ? 0.001 : 0.25

      outerCubeRef.current.scale.lerp(
        new THREE.Vector3(targetOuterScale, targetOuterScale, targetOuterScale),
        delta * 3.0
      )
      innerCubeRef.current.scale.lerp(
        new THREE.Vector3(targetInnerScale, targetInnerScale, targetInnerScale),
        delta * 3.0
      )

      if (!reducedMotion) {
        // Continuous 4D hypercube inversion oscillation
        const t4 = Math.sin(time * 0.8) * 0.35
        innerCubeRef.current.rotation.x = time * 0.4 + t4
        innerCubeRef.current.rotation.y = time * 0.3
        outerCubeRef.current.rotation.x = -time * 0.2
        outerCubeRef.current.rotation.z = time * 0.25
      }
    }

    // Hyper-Struts visibility / scale
    if (strutsGroupRef.current) {
      const strutScale = isTesseract ? 1.0 : 0.001
      strutsGroupRef.current.scale.lerp(
        new THREE.Vector3(strutScale, strutScale, strutScale),
        delta * 3.5
      )
    }

    // Penrose Impossible Ribbon visibility & rotation
    if (penroseGroupRef.current) {
      const targetPenroseScale = isPenrose ? 1.0 : 0.001
      penroseGroupRef.current.scale.lerp(
        new THREE.Vector3(targetPenroseScale, targetPenroseScale, targetPenroseScale),
        delta * 3.0
      )
      if (isPenrose && !reducedMotion) {
        penroseGroupRef.current.rotation.y = time * 0.35
        penroseGroupRef.current.rotation.z = Math.sin(time * 0.4) * 0.15
      }
    }

    // Expanded Topology Net visibility & explosion
    if (expandedGroupRef.current) {
      const targetExpScale = isExpanded ? 1.0 : 0.001
      expandedGroupRef.current.scale.lerp(
        new THREE.Vector3(targetExpScale, targetExpScale, targetExpScale),
        delta * 3.0
      )
      if (isExpanded && !reducedMotion) {
        expandedGroupRef.current.rotation.y = time * 0.2
      }
    }
  })

  // 8 hyper-strut corner pairs for Tesseract
  const corners = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
    [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1],
  ]

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Dynamic Dramatic Lighting for Spatial Ambiguity */}
      <directionalLight color="#86AFFF" intensity={1.2} position={[4, 5, 2]} />
      <directionalLight color="#9A82DC" intensity={1.0} position={[-4, -5, -2]} />
      <pointLight color="#E5EDF9" intensity={1.8} position={[0, 0, 0]} distance={6} decay={2} />

      {/* --- CONFIG 1: TESSERACT HYPERCUBE --- */}
      {/* Outer Hypercube Wireframe & Facets */}
      <mesh ref={outerCubeRef}>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
        <meshPhysicalMaterial
          color="#03050A"
          emissive="#101626"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.15}
          transparent
          opacity={0.35}
          clearcoat={1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2.404, 2.404, 2.404)]} />
        <lineBasicMaterial color="#86AFFF" transparent opacity={0.7} />
      </lineSegments>

      {/* Inner Inverted Hypercube */}
      <mesh ref={innerCubeRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshPhysicalMaterial
          color="#070C16"
          emissive="#86AFFF"
          emissiveIntensity={0.14}
          metalness={0.94}
          roughness={0.1}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1.204, 1.204, 1.204)]} />
        <lineBasicMaterial color="#9A82DC" transparent opacity={0.8} />
      </lineSegments>

      {/* 8 Interconnecting 4D Hyper-Struts */}
      <group ref={strutsGroupRef}>
        {corners.map((c, i) => (
          <lineSegments key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    c[0] * 1.2, c[1] * 1.2, c[2] * 1.2,
                    c[0] * 0.6, c[1] * 0.6, c[2] * 0.6,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#86AFFF" transparent opacity={0.5} />
          </lineSegments>
        ))}
      </group>

      {/* --- CONFIG 2: PENROSE IMPOSSIBLE PRISM LOOP --- */}
      <group ref={penroseGroupRef} scale={[0.001, 0.001, 0.001]}>
        {[0, 1, 2].map((idx) => {
          const rotZ = (idx * Math.PI * 2) / 3
          return (
            <group key={idx} rotation={[0, 0, rotZ]}>
              <mesh position={[0.9, 0.5, 0]}>
                <boxGeometry args={[1.8, 0.28, 0.28]} />
                <meshStandardMaterial
                  color="#101626"
                  metalness={0.92}
                  roughness={0.15}
                  emissive="#86AFFF"
                  emissiveIntensity={0.08}
                />
              </mesh>
              <lineSegments position={[0.9, 0.5, 0]}>
                <edgesGeometry args={[new THREE.BoxGeometry(1.804, 0.284, 0.284)]} />
                <lineBasicMaterial color="#9A82DC" />
              </lineSegments>
            </group>
          )
        })}
      </group>

      {/* --- CONFIG 3: EXPANDED TOPOLOGY NET --- */}
      <group ref={expandedGroupRef} scale={[0.001, 0.001, 0.001]}>
        {[
          [0, 0, 0],
          [1.5, 0, 0],
          [-1.5, 0, 0],
          [0, 1.5, 0],
          [0, -1.5, 0],
          [0, 0, 1.5],
        ].map((pos, idx) => (
          <group key={idx} position={new THREE.Vector3(...pos)}>
            <mesh>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <meshStandardMaterial
                color="#03050A"
                emissive="#9A82DC"
                emissiveIntensity={0.3}
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.554, 0.554, 0.554)]} />
              <lineBasicMaterial color="#86AFFF" transparent opacity={0.7} />
            </lineSegments>
          </group>
        ))}
      </group>
    </group>
  )
}
