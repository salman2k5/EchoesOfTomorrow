import React from 'react'
import { Canvas } from '@react-three/fiber'
import { ParallaxOffset } from '../../../types'
import { ObserverCore, ObserverMode } from './ObserverCore'
import { SparseParticles3D } from '../../canvas/SparseParticles3D'
import { WebGLBoundary, isWebGLAvailable } from '../../canvas/WebGLBoundary'
import { WorldFallback } from '../../canvas/WorldFallback'

interface ObserverSceneProps {
  mode: ObserverMode
  parallax: ParallaxOffset
  reducedMotion: boolean
}

export const ObserverScene: React.FC<ObserverSceneProps> = ({
  mode,
  parallax,
  reducedMotion,
}) => {
  if (!isWebGLAvailable()) {
    return <WorldFallback title="The Observer" />
  }

  return (
    <WebGLBoundary
      fallback={<WorldFallback title="The Observer" />}
    >
      <Canvas
        camera={{
          position: [0, 0, 6.4],
          fov: 40,
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
        <ambientLight color="#03050A" intensity={0.3} />
        <fog attach="fog" args={['#03050A', 9.5, 22]} />
        <directionalLight color="#86AFFF" intensity={1.2} position={[4, 5, 4]} />
        <directionalLight color="#9A82DC" intensity={0.9} position={[-4, -3, -3]} />

        <ObserverCore
          mode={mode}
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
