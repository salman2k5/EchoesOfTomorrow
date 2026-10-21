import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AppPhase, WorldId } from './types'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useMouseParallax } from './hooks/useMouseParallax'
import { ParticleField } from './components/ParticleField'
import { CenterpieceScene } from './components/canvas/CenterpieceScene'
import { HeroOpening } from './components/HeroOpening'
import { ObservatoryView } from './components/ObservatoryView'
import { ObserverWorld } from './components/worlds/observer/ObserverWorld'
import { LoopWorld } from './components/worlds/loop/LoopWorld'
import { ThresholdWorld } from './components/worlds/threshold/ThresholdWorld'

const WARP_DURATION_MS = 1400

export const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('idle')
  const reducedMotion = useReducedMotion()
  // Stable mutable object (no re-renders); see useMouseParallax
  const parallax = useMouseParallax({ disabled: phase === 'transitioning' || reducedMotion })

  // The full intro plays once per session; returning from the observatory skips it
  const introSeenRef = useRef(false)
  const warpTimerRef = useRef<number | null>(null)

  const clearWarpTimer = useCallback(() => {
    if (warpTimerRef.current !== null) {
      window.clearTimeout(warpTimerRef.current)
      warpTimerRef.current = null
    }
  }, [])

  useEffect(() => clearWarpTimer, [clearWarpTimer])

  // Entrance warp from Hero to Observatory
  const handleEnterExperience = useCallback(() => {
    if (warpTimerRef.current !== null) return // already warping
    introSeenRef.current = true

    if (reducedMotion) {
      setPhase('observatory')
      return
    }

    setPhase('transitioning')
    warpTimerRef.current = window.setTimeout(() => {
      warpTimerRef.current = null
      setPhase('observatory')
    }, WARP_DURATION_MS)
  }, [reducedMotion])

  const handleReturnToThreshold = useCallback(() => {
    clearWarpTimer()
    setPhase('idle')
  }, [clearWarpTimer])

  const handleSelectWorld = useCallback((worldId: WorldId) => {
    setPhase(`world-${worldId}` as AppPhase)
  }, [])

  const handleReturnToObservatory = useCallback(() => {
    setPhase('observatory')
  }, [])

  // Keyboard shortcut: ESC to go back one tier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (phase.startsWith('world-')) {
        handleReturnToObservatory()
      } else if (phase === 'observatory') {
        handleReturnToThreshold()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, handleReturnToObservatory, handleReturnToThreshold])

  const isHero = phase === 'idle' || phase === 'transitioning' || phase === 'intro'
  const isTransitioning = phase === 'transitioning'
  const isObservatory = phase === 'observatory'

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#03050A',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Ambient Background Particle Wash (Hero and Observatory only) */}
      {(isHero || isObservatory) && (
        <ParticleField
          parallax={parallax}
          reducedMotion={reducedMotion}
          intensity={isObservatory ? 0.5 : 0.75}
        />
      )}

      {/* 2. Signature Real-Time 3D Centerpiece (Hero Opening) */}
      {isHero && (
        <CenterpieceScene
          parallax={parallax}
          isTransitioning={isTransitioning}
          reducedMotion={reducedMotion}
        />
      )}

      {/* 3. Hero Opening View */}
      {isHero && (
        <HeroOpening
          parallax={parallax}
          onEnterExperience={handleEnterExperience}
          isTransitioning={isTransitioning}
          reducedMotion={reducedMotion}
          introSeen={introSeenRef.current}
        />
      )}

      {/* 4. Observatory Gateway View */}
      {isObservatory && (
        <ObservatoryView
          onReturn={handleReturnToThreshold}
          onEnterWorld={handleSelectWorld}
          parallax={parallax}
          reducedMotion={reducedMotion}
        />
      )}

      {/* 5. Interactive Worlds */}
      {phase === 'world-observer' && (
        <ObserverWorld
          onSelectWorld={handleSelectWorld}
          onReturnToObservatory={handleReturnToObservatory}
          parallax={parallax}
          reducedMotion={reducedMotion}
        />
      )}

      {phase === 'world-loop' && (
        <LoopWorld
          onSelectWorld={handleSelectWorld}
          onReturnToObservatory={handleReturnToObservatory}
          parallax={parallax}
          reducedMotion={reducedMotion}
        />
      )}

      {phase === 'world-threshold' && (
        <ThresholdWorld
          onSelectWorld={handleSelectWorld}
          onReturnToObservatory={handleReturnToObservatory}
          parallax={parallax}
          reducedMotion={reducedMotion}
        />
      )}
    </div>
  )
}

export default App
