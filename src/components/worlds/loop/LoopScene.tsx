import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ParallaxOffset } from '../../../types'
import { LoopGeometry } from './LoopGeometry'
import { SparseParticles3D } from '../../canvas/SparseParticles3D'
import { WebGLBoundary, isWebGLAvailable } from '../../canvas/WebGLBoundary'
import { WorldFallback } from '../../canvas/WorldFallback'

interface LoopSceneProps {
  timeSpeed: number
  scrubOffset: number
  isScrubbing: boolean
  parallax: ParallaxOffset
  reducedMotion: boolean
}

export const LoopScene: React.FC<LoopSceneProps> = ({
  timeSpeed,
  scrubOffset,
  isScrubbing,
  parallax,
  reducedMotion,
}) => {
  if (!isWebGLAvailable()) {
    return <WorldFallback title="The Loop" />
  }

  return (
    <WebGLBoundary
      fallback={<WorldFallback title="The Loop" />}
    >
      <Canvas
        camera={{
          position: [0, 0, 7.4],
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
        <directionalLight color="#86AFFF" intensity={2.0} position={[3, 4, 3]} />
        <directionalLight color="#9A82DC" intensity={1.4} position={[-3, -4, -3]} />

        <LoopGeometry
          timeSpeed={timeSpeed}
          scrubOffset={scrubOffset}
          isScrubbing={isScrubbing}
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
