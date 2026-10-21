import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ParallaxOffset } from '../../types'
import { CenterpieceStructure } from './CenterpieceStructure'
import { SparseParticles3D } from './SparseParticles3D'
import { WebGLBoundary, isWebGLAvailable } from './WebGLBoundary'
import { MonumentalEclipse } from '../MonumentalEclipse'

interface CenterpieceSceneProps {
  parallax: ParallaxOffset
  isTransitioning: boolean
  reducedMotion: boolean
}

export const CenterpieceScene: React.FC<CenterpieceSceneProps> = ({
  parallax,
  isTransitioning,
  reducedMotion,
}) => {
  // Graceful fallback if WebGL is not supported on the user's browser/GPU
  if (!isWebGLAvailable()) {
    return (
      <MonumentalEclipse
        parallax={parallax}
        isTransitioning={isTransitioning}
        reducedMotion={reducedMotion}
      />
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <WebGLBoundary
        fallback={
          <MonumentalEclipse
            parallax={parallax}
            isTransitioning={isTransitioning}
            reducedMotion={reducedMotion}
          />
        }
      >
        <Canvas
          camera={{
            position: [0, 0, 6.2],
            fov: 42,
            near: 0.1,
            far: 50,
          }}
          dpr={[1, 1.75]} // Cap DPR to 1.75 for pristine rendering without GPU thermal penalty
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
          }}
        >
          {/* Cinematic Controlled Lighting Rig */}
          {/* 1. Deep Void Ambient */}
          <ambientLight color="#050814" intensity={0.28} />
          <fog attach="fog" args={['#03050A', 9.0, 22]} />

          {/* 2. Primary Blue-White Key Specular Light */}
          <directionalLight
            color="#E5EDF9"
            intensity={2.3}
            position={[4.5, 5.0, 4.0]}
          />

          {/* 3. Restrained Violet Rim/Counter Light */}
          <directionalLight
            color="#9A82DC"
            intensity={1.4}
            position={[-4.0, -3.5, -2.5]}
          />

          {/* 4. Top Horizon Cyan Grazing Light */}
          <directionalLight
            color="#86AFFF"
            intensity={0.9}
            position={[0, 6.0, 1.5]}
          />

          {/* 3D Centerpiece Geometric Structure */}
          <CenterpieceStructure
            parallax={parallax}
            isTransitioning={isTransitioning}
            reducedMotion={reducedMotion}
          />

          {/* 3D Sparse Particles for Scale and Spatial Depth */}
          <SparseParticles3D
            parallax={parallax}
            reducedMotion={reducedMotion}
            isTransitioning={isTransitioning}
          />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
