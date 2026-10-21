import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ParallaxOffset } from '../../types'

// Resting inclination so the equatorial ring reads as an ellipse, not an edge-on bar
const REST_TILT = 0.22

interface CenterpieceStructureProps {
  parallax: ParallaxOffset
  isTransitioning: boolean
  reducedMotion: boolean
}

export const CenterpieceStructure: React.FC<CenterpieceStructureProps> = ({
  parallax,
  isTransitioning,
  reducedMotion,
}) => {
  // Main root group
  const groupRef = useRef<THREE.Group>(null!)

  // Central core refs
  const coreRef = useRef<THREE.Mesh>(null!)
  const innerCoreRef = useRef<THREE.Mesh>(null!)
  const innerLightRef = useRef<THREE.PointLight>(null!)

  // Ring mesh refs (spin around local Z axis)
  const ring1Ref = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)
  const ring3Ref = useRef<THREE.Mesh>(null!)
  const ringApertureRef = useRef<THREE.Mesh>(null!)

  // Gimbal group refs (hold and modulate orientation angle)
  const ring2GimbalRef = useRef<THREE.Group>(null!)
  const ring3GimbalRef = useRef<THREE.Group>(null!)

  // WebGL GPU buffer cleanup on unmount
  useEffect(() => {
    return () => {
      if (groupRef.current) {
        groupRef.current.traverse((child) => {
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
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()

    // Fit the structure inside the viewport (outer ring diameter ~5.5 units at z=0)
    const aspect = state.size.width / state.size.height
    const fit = Math.min(0.82, (0.92 * 4.76 * Math.min(1, aspect)) / 5.5)

    // 1. Smooth Pointer Parallax (Clamped & Damped)
    if (!reducedMotion) {
      // Clamped target angles: max ~14 deg horizontal, ~11 deg vertical
      const targetRotY = Math.max(-0.25, Math.min(0.25, parallax.x * 0.25))
      const targetRotX = REST_TILT + Math.max(-0.2, Math.min(0.2, -parallax.y * 0.2))

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        delta * 2.8
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        delta * 2.8
      )
    } else {
      groupRef.current.rotation.set(REST_TILT, 0, 0)
    }

    // 2. Transition Warp Dynamics & Return Reset
    if (isTransitioning) {
      const warpSpeed = delta * 4.5
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, fit * 3.2, delta * 2.2))
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 2.5, delta * 2.0)

      if (ring1Ref.current) ring1Ref.current.rotation.z += warpSpeed * 0.8
      if (ring2Ref.current) ring2Ref.current.rotation.z += warpSpeed * 0.9
      if (ring3Ref.current) ring3Ref.current.rotation.z += warpSpeed * 1.1
      if (coreRef.current) coreRef.current.rotation.y += warpSpeed * 1.2
      return
    } else {
      // Gracefully restore scale and position if returning from warp
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, fit, delta * 3.0))
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, delta * 3.0)
    }

    // 3. Regular Restrained Harmonic Rotations
    if (!reducedMotion) {
      // Core: slow, meditative rotation
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 0.08
        coreRef.current.rotation.x += delta * 0.04
      }

      if (innerCoreRef.current) {
        innerCoreRef.current.rotation.y -= delta * 0.12
        innerCoreRef.current.rotation.z += delta * 0.06
      }

      // Ring 1 (Equatorial): clockwise slow spin
      if (ring1Ref.current) {
        ring1Ref.current.rotation.z += delta * 0.07
      }

      // Ring 2 (Oblique): spin + gentle harmonic precession
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z += delta * 0.09
      }
      if (ring2GimbalRef.current) {
        ring2GimbalRef.current.rotation.x = Math.PI / 4 + Math.sin(time * 0.2) * 0.08
      }

      // Ring 3 (Meridian): counter-spin + subtle inclination drift
      if (ring3Ref.current) {
        ring3Ref.current.rotation.z -= delta * 0.06
      }
      if (ring3GimbalRef.current) {
        ring3GimbalRef.current.rotation.x = -Math.PI / 3 + Math.cos(time * 0.15) * 0.06
      }

      // Aperture disc subtle pulse
      if (ringApertureRef.current) {
        ringApertureRef.current.rotation.z -= delta * 0.04
      }

      // Internal light subtle breathing pulse
      if (innerLightRef.current) {
        innerLightRef.current.intensity = 1.8 + Math.sin(time * 1.6) * 0.45
      }
    } else {
      // Static composed orientation for reduced motion
      if (ring2GimbalRef.current) ring2GimbalRef.current.rotation.set(Math.PI / 4, 0.2, 0)
      if (ring3GimbalRef.current) ring3GimbalRef.current.rotation.set(-Math.PI / 3, 0, 0.4)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Internal Point Light (Blue-white core radiance) */}
      <pointLight
        ref={innerLightRef}
        color="#E5EDF9"
        intensity={2.0}
        distance={7}
        decay={2}
      />

      {/* Subtle Violet Back-Accent Light */}
      <pointLight
        color="#9A82DC"
        intensity={1.2}
        position={[0, 0, -1.2]}
        distance={5}
        decay={2}
      />

      {/* 1. Central Geometric Core (Nested Polyhedra) */}
      {/* Outer Faceted Obsidian Shell */}
      <mesh ref={coreRef} castShadow receiveShadow>
        <octahedronGeometry args={[0.95, 0]} />
        <meshPhysicalMaterial
          color="#060912"
          emissive="#0c192c"
          emissiveIntensity={0.25}
          metalness={0.92}
          roughness={0.16}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Outer Wireframe Edge Creases for Precision Architectural Feel */}
      <lineSegments>
        <edgesGeometry args={[new THREE.OctahedronGeometry(0.954, 0)]} />
        <lineBasicMaterial
          color="#86AFFF"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Inner Glowing Singularity Seed (Icosahedron) */}
      <mesh ref={innerCoreRef} scale={[0.48, 0.48, 0.48]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#E5EDF9"
          emissive="#86AFFF"
          emissiveIntensity={1.4}
          wireframe
        />
      </mesh>

      {/* 2. Concentric & Intersecting Chronometric Rings */}
      {/* Ring 1: Equatorial Master Ring (Tilted 90° via stable parent group) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.35, 0.026, 24, 180]} />
          <meshStandardMaterial
            color="#0a101d"
            metalness={0.92}
            roughness={0.24}
            emissive="#86AFFF"
            emissiveIntensity={0.34}
          />
        </mesh>
      </group>

      {/* Ring 2: Oblique Chrono-Ring (Tilted at 45° via gimbal group) */}
      <group ref={ring2GimbalRef} rotation={[Math.PI / 4, 0, 0]}>
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.75, 0.024, 24, 180]} />
          <meshStandardMaterial
            color="#0c1220"
            metalness={0.93}
            roughness={0.24}
            emissive="#9A82DC"
            emissiveIntensity={0.36}
          />
        </mesh>
      </group>

      {/* Ring 3: Inner Meridian Ring (Tilted at -60° via gimbal group) */}
      <group ref={ring3GimbalRef} rotation={[-Math.PI / 3, 0, 0]}>
        <mesh ref={ring3Ref}>
          <torusGeometry args={[1.82, 0.028, 24, 160]} />
          <meshStandardMaterial
            color="#070c16"
            metalness={0.92}
            roughness={0.25}
            emissive="#E5EDF9"
            emissiveIntensity={0.36}
          />
        </mesh>
      </group>

      {/* Ring 4: Semi-Transparent Celestial Aperture Datum Disc (depthWrite=false prevents z-culling) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh ref={ringApertureRef}>
          <ringGeometry args={[2.08, 2.12, 120]} />
          <meshBasicMaterial
            color="#86AFFF"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Delicate Micro-Tick Cardinal Markers (seated on Ring 1 at radius 2.35) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh
          key={idx}
          position={[
            Math.cos(angle) * 2.35,
            0,
            Math.sin(angle) * 2.35,
          ]}
        >
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#E5EDF9" />
        </mesh>
      ))}
    </group>
  )
}
