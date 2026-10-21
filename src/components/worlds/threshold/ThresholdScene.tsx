import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ParallaxOffset } from '../../../types'
import { ImpossibleGeometry, ThresholdConfig } from './ImpossibleGeometry'
import { SparseParticles3D } from '../../canvas/SparseParticles3D'
import { WebGLBoundary, isWebGLAvailable } from '../../canvas/WebGLBoundary'
import { WorldFallback } from '../../canvas/WorldFallback'

interface ThresholdSceneProps {
  config: ThresholdConfig
  parallax: ParallaxOffset
  reducedMotion: boolean
}

export const ThresholdScene: React.FC<ThresholdSceneProps> = ({
  config,
  parallax,
  reducedMotion,
}) => {
  if (!isWebGLAvailable()) {
    return <WorldFallback title="The Threshold" />
  }

  return (
    <WebGLBoundary
      fallback={<WorldFallback title="The Threshold" />}
    >
      <Canvas
        camera={{
          position: [0, 0, 7.6],
          fov: 42,
          near: 0.1,
          far: 40,
        }}
        dpr={[1, 1.75]}
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
        <ambientLight color="#03050A" intensity={0.25} />
        <fog attach="fog" args={['#03050A', 10.5, 24]} />

        <ImpossibleGeometry
          config={config}
          parallax={parallax}
          reducedMotion={reducedMotion}
        />

        <SparseParticles3D
          parallax={parallax}
          reducedMotion={reducedMotion}
          isTransitioning={false}
        />
      </Canvas>
    </WebGLBoundary>
  )
}
