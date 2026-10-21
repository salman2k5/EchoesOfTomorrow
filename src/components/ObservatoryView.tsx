import React, { useState, useEffect } from 'react'
import { audioManager } from '../utils/sound'
import { ParallaxOffset, WorldId } from '../types'

interface ObservatoryViewProps {
  onReturn: () => void
  onEnterWorld: (worldId: WorldId) => void
  parallax: ParallaxOffset
  reducedMotion: boolean
}

interface ObservationNode {
  id: string
  worldId: WorldId
  code: string
  title: string
  subtitle: string
  description: string
  metric: string
  status: string
}

const NODES: ObservationNode[] = [
  {
    id: 'node-1',
    worldId: 'observer',
    code: 'PH-01',
    title: 'THE OBSERVER',
    subtitle: 'Consciousness as an emergent geometry',
    description: 'The geometry of perception folds upon itself. The act of observation alters the reality matrix. Interact with layered crystalline geometry and quantum lattices.',
    metric: 'COHERENCE: 99.84%',
    status: 'ACTIVE APERTURE',
  },
  {
    id: 'node-2',
    worldId: 'loop',
    code: 'PH-02',
    title: 'THE LOOP',
    subtitle: 'Relativistic timeline manipulation',
    description: 'Time is not a forward arrow but an orbital geometry. Scrub the chronometer to traverse temporal flow, reverse entropy, and accelerate orbital epicycles.',
    metric: 'Δt: +0.000412 s/cyc',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'node-3',
    worldId: 'threshold',
    code: 'PH-03',
    title: 'THE THRESHOLD',
    subtitle: 'Non-Euclidean impossible topology',
    description: 'A 4-dimensional spatial singularity. Morph between contradictory geometric states, tesseract hyperfolds, and impossible Penrose loops.',
    metric: 'CURVATURE: NON-EUCLIDEAN',
    status: 'CALIBRATING',
  },
]

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({
  onReturn,
  onEnterWorld,
  reducedMotion,
}) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('node-1')
  const [isEntering, setIsEntering] = useState<boolean>(false)
  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0]

  const handleSelectNode = (id: string) => {
    if (id === activeNodeId) {
      handleEnterActiveWorld()
      return
    }
    audioManager.playHover()
    setActiveNodeId(id)
  }

  const handleReturn = () => {
    audioManager.playHover()
    onReturn()
  }

  const handleEnterActiveWorld = () => {
    if (isEntering) return
    setIsEntering(true)
    audioManager.playEnter()
    onEnterWorld(activeNode.worldId)
  }

  // Keyboard accessibility: 1, 2, 3 to pick phenomenon, Enter to initiate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest('button') && e.key !== 'Escape') {
        return
      }
      if (e.key === '1') {
        audioManager.playHover()
        setActiveNodeId('node-1')
      } else if (e.key === '2') {
        audioManager.playHover()
        setActiveNodeId('node-2')
      } else if (e.key === '3') {
        audioManager.playHover()
        setActiveNodeId('node-3')
      } else if (e.key === 'Enter') {
        handleEnterActiveWorld()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeNodeId, isEntering])

  return (
    <div
      className="observatory-view"
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        color: '#ffffff',
        animation: reducedMotion ? 'none' : 'observatoryFadeIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      {/* Top Telemetry Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(229, 237, 249, 0.08)',
          paddingBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={handleReturn}
            onMouseEnter={() => audioManager.playHover()}
            className="return-button"
            aria-label="Return to Threshold"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '999px',
              padding: '0.45rem 1.1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease',
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>←</span> Return to Threshold
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                color: 'rgba(134, 175, 255, 0.9)',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              PRIMARY OBSERVATORY // APERTURE 00
            </span>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 300,
                letterSpacing: '0.08em',
                color: '#ffffff',
              }}
            >
              Echoes of Tomorrow Observatory
            </span>
          </div>
        </div>

      </header>

      {/* Main Viewport Chamber */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
          margin: '2rem 0',
          position: 'relative',
        }}
      >
        {/* Left Column: Viewport Narrative, Telemetry, and ENTER PHENOMENON Action */}
        <section style={{ maxWidth: '580px' }}>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 300,
              letterSpacing: '0.08em',
              lineHeight: 1.15,
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            {activeNode.title}
          </h2>

          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.12em',
              color: '#9A82DC',
              fontFamily: "'Space Grotesk', monospace",
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
            }}
          >
            {activeNode.subtitle}
          </p>

          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'rgba(229, 237, 249, 0.75)',
              letterSpacing: '0.02em',
              fontWeight: 300,
              marginBottom: '2rem',
            }}
          >
            {activeNode.description}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={handleEnterActiveWorld}
              disabled={isEntering}
              aria-busy={isEntering}
              onMouseEnter={() => audioManager.playHover()}
              className="enter-button"
              aria-label={`Enter interactive world: ${activeNode.title}`}
              style={{
                position: 'relative',
                background: 'rgba(134, 175, 255, 0.12)',
                border: '1px solid rgba(134, 175, 255, 0.45)',
                borderRadius: '999px',
                padding: '0.85rem 2.25rem',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(134, 175, 255, 0.25)',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#86AFFF',
                  boxShadow: '0 0 10px #86AFFF',
                }}
              />
              <span>Enter World</span>
              <span className="enter-arrow" style={{ fontSize: '0.9rem', color: '#86AFFF' }}>
                →
              </span>
            </button>

          </div>
        </section>

        {/* Right Column: Observation Nodes Navigation */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transform: reducedMotion
              ? 'none'
              : 'translate3d(calc(var(--px, 0) * 12px), calc(var(--py, 0) * 10px), 0)',
          }}
        >
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.35)',
              marginBottom: '0.25rem',
            }}
          >
            SELECT PHENOMENON TO OBSERVE
          </div>

          {NODES.map((node) => {
            const isSelected = node.id === activeNodeId
            return (
              <button
                key={node.id}
                onClick={() => handleSelectNode(node.id)}
                onMouseEnter={() => audioManager.playHover()}
                className={`observatory-node-card ${isSelected ? 'active' : ''}`}
                style={{
                  textAlign: 'left',
                  background: isSelected ? 'rgba(134, 175, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected
                    ? '1px solid rgba(134, 175, 255, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontFamily: "'Space Grotesk', monospace",
                      color: isSelected ? '#86AFFF' : 'rgba(255, 255, 255, 0.4)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {node.code}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: isSelected ? '#86AFFF' : 'rgba(255, 255, 255, 0.2)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {isSelected ? 'SELECTED' : 'EXPLORE'}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: isSelected ? 500 : 400,
                    letterSpacing: '0.06em',
                    marginTop: '0.45rem',
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {node.title}
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    color: isSelected ? '#9A82DC' : 'rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.04em',
                    marginTop: '0.2rem',
                  }}
                >
                  {node.subtitle}
                </div>
              </button>
            )
          })}
        </section>
      </main>

      {/* Bottom Footer Telemetry */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(229, 237, 249, 0.08)',
          paddingTop: '1.25rem',
          fontSize: '0.68rem',
          color: 'rgba(255, 255, 255, 0.35)',
          letterSpacing: '0.12em',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ fontFamily: "'Space Grotesk', monospace" }}>
          PRESS [ESC] TO RETURN TO THRESHOLD
        </div>
      </footer>
    </div>
  )
}
