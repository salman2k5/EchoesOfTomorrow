import React, { useState, useEffect, useCallback } from 'react'
import { ParallaxOffset } from '../types'
import { audioManager } from '../utils/sound'

interface HeroOpeningProps {
  parallax: ParallaxOffset
  onEnterExperience: () => void
  isTransitioning: boolean
  reducedMotion: boolean
  /** True when the visitor has already seen the intro (e.g. returning from the observatory) */
  introSeen?: boolean
}

export const HeroOpening: React.FC<HeroOpeningProps> = ({
  onEnterExperience,
  isTransitioning,
  reducedMotion,
  introSeen = false,
}) => {
  const [introStep, setIntroStep] = useState<number>(reducedMotion || introSeen ? 3 : 0)
  const [isAudioActive, setIsAudioActive] = useState<boolean>(!audioManager.getMuted())

  // Entrance timeline orchestration
  useEffect(() => {
    if (reducedMotion || introSeen) {
      setIntroStep(3)
      return
    }

    const t1 = setTimeout(() => setIntroStep(1), 300) // Rim glow & focal horizon
    const t2 = setTimeout(() => setIntroStep(2), 1100) // Typography reveal
    const t3 = setTimeout(() => setIntroStep(3), 2000) // HUD & Enter CTA settle

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [reducedMotion, introSeen])

  const skipIntro = useCallback(() => {
    setIntroStep(3)
  }, [])

  // Keyboard accessibility (ESC or SPACE to skip intro)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest?.('button') && e.key !== 'Escape') return
      if ((e.key === 'Escape' || e.code === 'Space') && introStep < 3) {
        skipIntro()
      } else if (e.key === 'Enter' && introStep >= 3 && !isTransitioning) {
        audioManager.playEnter()
        onEnterExperience()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [introStep, isTransitioning, onEnterExperience, skipIntro])

  const handleAudioToggle = () => {
    const muted = audioManager.toggleMute()
    setIsAudioActive(!muted)
  }

  const handleEnterClick = () => {
    if (isTransitioning) return
    audioManager.playEnter()
    onEnterExperience()
  }

  // Parallax is driven by --px / --py CSS variables (no per-frame React renders)
  const hudTransform = reducedMotion
    ? 'none'
    : 'translate3d(calc(var(--px, 0) * -6px), calc(var(--py, 0) * -6px), 0)'
  const textTransform = reducedMotion
    ? 'none'
    : 'translate3d(calc(var(--px, 0) * -16px), calc(var(--py, 0) * -14px), 0)'

  return (
    <div
      className={`hero-viewport ${isTransitioning ? 'transition-active' : ''} ${introSeen ? 'hero-return' : ''}`}
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        color: '#ffffff',
        pointerEvents: isTransitioning ? 'none' : 'auto',
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'scale(1.08)' : 'scale(1)',
        transition: 'opacity 1.35s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Minimal Navigation Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: hudTransform,
          transition: 'opacity 1.2s ease',
          opacity: introStep >= 2 ? 1 : 0,
        }}
      >
        {/* Brand Monogram */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid rgba(229, 237, 249, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              letterSpacing: '0.05em',
              color: '#E5EDF9',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            E//T
          </div>
          <span
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.55)',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            ECHOES OF TOMORROW
          </span>
        </div>

        {/* Center Transmission Status */}
        <div
          className="hide-mobile"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              backgroundColor: '#86AFFF',
              boxShadow: '0 0 8px #86AFFF',
              animation: 'pulseGlow 2.5s infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              color: 'rgba(229, 237, 249, 0.8)',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            TRANSMISSION // ACTIVE
          </span>
        </div>

        {/* Right Controls: Audio + Skip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {introStep < 3 && !reducedMotion && (
            <button
              onClick={skipIntro}
              aria-label="Skip introductory sequence"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                cursor: 'pointer',
                fontFamily: "'Space Grotesk', monospace",
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={() => audioManager.playHover()}
            >
              SKIP [ESC]
            </button>
          )}

          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => audioManager.playHover()}
            aria-label={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
            style={{
              background: isAudioActive ? 'rgba(134, 175, 255, 0.12)' : 'transparent',
              border: isAudioActive ? '1px solid rgba(134, 175, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              padding: '0.35rem 0.9rem',
              color: isAudioActive ? '#E5EDF9' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: "'Space Grotesk', monospace",
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '0.75rem' }}>{isAudioActive ? '●' : '○'}</span>
            AUDIO: {isAudioActive ? 'ON' : 'MUTED'}
          </button>
        </div>
      </header>

      {/* Hero Core: Oversized Typography & Enter CTA */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          margin: 'auto 0',
          transform: textTransform,
        }}
      >
        {/* Pre-title Tag */}
        <div
          style={{
            overflow: 'hidden',
            marginBottom: '1rem',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(0.7rem, 1.2vw, 0.85rem)',
              letterSpacing: '0.42em',
              textTransform: 'uppercase',
              color: 'rgba(229, 237, 249, 0.55)',
              margin: 0,
              transform: introStep >= 1 ? 'translateY(0)' : 'translateY(100%)',
              opacity: introStep >= 1 ? 1 : 0,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            A Cinematic Passage Into Consciousness & Time
          </p>
        </div>

        {/* Sophisticated Oversized Typography with Intentional Line Breaks */}
        <h1
          style={{
            fontSize: 'clamp(2.75rem, 8.5vw, 6.75rem)',
            fontWeight: 200,
            lineHeight: 0.94,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: '0 0 1.5rem 0',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.65) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: introStep >= 2 ? 'translateY(0)' : 'translateY(40px)',
              opacity: introStep >= 2 ? 1 : 0,
              transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease',
            }}
          >
            ECHOES
          </span>
          <span
            style={{
              display: 'block',
              fontWeight: 300,
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(190, 212, 246, 0.5) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: introStep >= 2 ? 'translateY(0)' : 'translateY(40px)',
              opacity: introStep >= 2 ? 1 : 0,
              transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 1.4s ease 0.1s',
            }}
          >
            OF TOMORROW
          </span>
        </h1>

        {/* Existential Philosophical Subtitle */}
        <p
          style={{
            maxWidth: '540px',
            fontSize: 'clamp(0.88rem, 1.3vw, 1.05rem)',
            fontWeight: 300,
            lineHeight: 1.6,
            color: 'rgba(229, 237, 249, 0.72)',
            letterSpacing: '0.04em',
            margin: '0 auto 2.75rem auto',
            transform: introStep >= 2 ? 'translateY(0)' : 'translateY(20px)',
            opacity: introStep >= 2 ? 1 : 0,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, opacity 1.2s ease 0.2s',
          }}
        >
          Where memory folds, time becomes geography, and the observer becomes the observed.
        </p>

        {/* Clear Tactile ENTER EXPERIENCE Action */}
        <div
          style={{
            transform: introStep >= 3 ? 'translateY(0)' : 'translateY(25px)',
            opacity: introStep >= 3 ? 1 : 0,
            transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 1.2s ease 0.3s',
          }}
        >
          <button
            onClick={handleEnterClick}
            disabled={isTransitioning}
            aria-busy={isTransitioning}
            onMouseEnter={() => audioManager.playHover()}
            className="enter-button"
            aria-label="Enter Experience: Transition to the observatory"
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(229, 237, 249, 0.25)',
              borderRadius: '999px',
              padding: '0.95rem 2.75rem',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 400,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(134, 175, 255, 0.15)',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Luminous Inner Shimmer */}
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#86AFFF',
                boxShadow: '0 0 10px #86AFFF, 0 0 18px #E5EDF9',
                animation: 'pulseGlow 2s infinite ease-in-out',
              }}
            />
            <span>Enter Experience</span>
            <span
              style={{
                fontSize: '0.95rem',
                color: 'rgba(229, 237, 249, 0.65)',
                transform: 'translateX(0)',
                transition: 'transform 0.25s ease',
              }}
              className="enter-arrow"
            >
              →
            </span>
          </button>
        </div>
      </main>

      {/* Restrained Discovery Indicator Near Screen Bottom */}
      <footer
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          transform: hudTransform,
          transition: 'opacity 1.2s ease',
          opacity: introStep >= 3 ? 1 : 0,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Left Telemetry: Coordinates & Chapter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.24em',
              color: 'rgba(134, 175, 255, 0.85)',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            CHAPTER 00 // THE THRESHOLD
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            COORD: 37°14'06"N 115°48'40"W • EPOCH 2026.10
          </span>
        </div>

        {/* Center: Delicate Discovery Glyph / Vertical Pulse */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.45rem',
            margin: '0 auto',
          }}
        >
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.35)',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            DISCOVER
          </span>
          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'linear-gradient(180deg, rgba(134, 175, 255, 0.8) 0%, transparent 100%)',
              animation: 'scrollPulse 2.4s infinite ease-in-out',
            }}
          />
        </div>

        {/* Right Telemetry: Scale & Reality Field */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              color: 'rgba(255, 255, 255, 0.4)',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            REALITY FIELD // COHERENT
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              color: 'rgba(229, 237, 249, 0.7)',
              fontFamily: "'Space Grotesk', monospace",
            }}
          >
            CHRONO: SYNCHRONIZED
          </span>
        </div>
      </footer>
    </div>
  )
}
