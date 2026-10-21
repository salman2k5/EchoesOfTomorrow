import React, { useState } from 'react'
import { WorldId, PhenomenonMeta } from '../../types'
import { audioManager } from '../../utils/sound'

interface WorldContainerProps {
  currentWorld: WorldId
  onSelectWorld: (world: WorldId) => void
  onReturnToObservatory: () => void
  meta: PhenomenonMeta
  children: React.ReactNode
  hudControls?: React.ReactNode
}

export const PHENOMENA: PhenomenonMeta[] = [
  {
    id: 'observer',
    code: 'PH-01',
    title: 'THE OBSERVER',
    subtitle: 'Consciousness as an emergent geometry',
    description: 'The act of looking changes what is seen.',
    metric: 'COHERENCE: 99.84%',
    status: 'CONSCIOUS RESONANCE',
    interactionCue: 'Move to refract light · Choose a perspective',
  },
  {
    id: 'loop',
    code: 'PH-02',
    title: 'THE LOOP',
    subtitle: 'Relativistic timeline manipulation',
    description: 'Time is not an arrow. It is an orbit you can turn.',
    metric: 'Δt: +0.000412 s/cyc',
    status: 'CHRONO FLUX ACTIVE',
    interactionCue: 'Drag the dial to scrub time · Set its direction and speed',
  },
  {
    id: 'threshold',
    code: 'PH-03',
    title: 'THE THRESHOLD',
    subtitle: 'Non-Euclidean impossible topology',
    description: 'A form that cannot exist, folding through three states of being.',
    metric: 'CURVATURE: NON-EUCLIDEAN',
    status: 'TOPOLOGY UNBOUND',
    interactionCue: 'Choose a configuration · Move to turn it',
  },
]

export const WorldContainer: React.FC<WorldContainerProps> = ({
  currentWorld,
  onSelectWorld,
  onReturnToObservatory,
  meta,
  children,
  hudControls,
}) => {
  const [isAudioActive, setIsAudioActive] = useState<boolean>(!audioManager.getMuted())
  const [isNavigating, setIsNavigating] = useState<boolean>(false)

  const handleAudioToggle = () => {
    const muted = audioManager.toggleMute()
    setIsAudioActive(!muted)
  }

  const handleReturn = () => {
    if (isNavigating) return
    setIsNavigating(true)
    audioManager.playHover()
    onReturnToObservatory()
  }

  const handleSwitchWorld = (id: WorldId) => {
    if (id === currentWorld || isNavigating) return
    setIsNavigating(true)
    audioManager.playShift()
    onSelectWorld(id)
  }

  // Keyboard accessibility: 1, 2, 3 to jump between phenomena
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '1') handleSwitchWorld('observer')
      else if (e.key === '2') handleSwitchWorld('loop')
      else if (e.key === '3') handleSwitchWorld('threshold')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentWorld, isNavigating])

  return (
    <div className="world-container world-enter">
      {/* 1. Real-time 3D canvas (resizes above the footer on narrow screens) */}
      <div className="world-canvas">{children}</div>

      {/* 2. Top bar: quiet gradient, no panel */}
      <header className="world-header">
        <button
          type="button"
          onClick={handleReturn}
          onMouseEnter={() => audioManager.playHover()}
          className="hud-btn hud-ghost"
          aria-label="Return to Observatory"
          style={{ gap: '0.5rem' }}
        >
          <span aria-hidden="true">←</span>
          <span>Observatory</span>
        </button>

        <nav className="hide-mobile world-switcher" aria-label="Phenomena">
          {PHENOMENA.map((p) => {
            const isActive = p.id === currentWorld
            return (
              <button
                key={p.id}
                type="button"
                className={`hud-btn hud-tab ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSwitchWorld(p.id)}
                onMouseEnter={() => audioManager.playHover()}
              >
                {p.title}
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={handleAudioToggle}
          onMouseEnter={() => audioManager.playHover()}
          className={`hud-btn hud-ghost ${isAudioActive ? 'is-active' : ''}`}
          aria-pressed={isAudioActive}
          aria-label={isAudioActive ? 'Mute ambient audio' : 'Enable ambient audio'}
        >
          <span aria-hidden="true">{isAudioActive ? '●' : '○'}</span>
          <span>Audio</span>
        </button>
      </header>

      {/* 3. Bottom: controls first, then a quiet title block */}
      <footer className="world-footer">
        {hudControls && <div className="world-controls">{hudControls}</div>}

        <div className="world-caption">
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.28em',
                color: '#86AFFF',
                fontFamily: "'Space Grotesk', monospace",
                marginBottom: '0.45rem',
              }}
            >
              {meta.code}
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.25rem, 2.6vw, 1.9rem)',
                fontWeight: 300,
                letterSpacing: '0.16em',
                lineHeight: 1.1,
                color: '#E5EDF9',
                margin: 0,
              }}
            >
              {meta.title}
            </h2>
            <p
              className="hide-mobile"
              style={{
                maxWidth: '38ch',
                marginTop: '0.6rem',
                fontSize: '0.84rem',
                lineHeight: 1.55,
                fontWeight: 300,
                color: 'rgba(229, 237, 249, 0.62)',
              }}
            >
              {meta.description}
            </p>
          </div>

          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.64rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', monospace",
              color: 'rgba(229, 237, 249, 0.5)',
              margin: 0,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '4px',
                height: '4px',
                flexShrink: 0,
                borderRadius: '50%',
                backgroundColor: '#9A82DC',
                boxShadow: '0 0 6px #9A82DC',
              }}
            />
            {meta.interactionCue}
          </p>
        </div>
      </footer>
    </div>
  )
}
