import React from 'react'
import { ParallaxOffset } from '../types'
import { useSampledParallax } from '../hooks/useMouseParallax'

interface MonumentalEclipseProps {
  parallax: ParallaxOffset
  isTransitioning: boolean
  reducedMotion: boolean
}

export const MonumentalEclipse: React.FC<MonumentalEclipseProps> = ({
  parallax: parallaxSource,
  isTransitioning,
  reducedMotion,
}) => {
  const parallax = useSampledParallax(parallaxSource)
  // Compute dynamic specular angle from mouse parallax
  // Parallax is between -1 and 1
  const angleDeg = Math.atan2(parallax.y, parallax.x) * (180 / Math.PI)
  const lightAngle = (angleDeg + 90 + 360) % 360

  // Parallax translations (layered for 3D depth illusion)
  const bgShiftX = reducedMotion ? 0 : parallax.x * -12
  const bgShiftY = reducedMotion ? 0 : parallax.y * -12

  const monolithShiftX = reducedMotion ? 0 : parallax.x * 24
  const monolithShiftY = reducedMotion ? 0 : parallax.y * 18

  const haloShiftX = reducedMotion ? 0 : parallax.x * 8
  const haloShiftY = reducedMotion ? 0 : parallax.y * 8

  return (
    <div
      className="monumental-container"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* 1. Distant Volumetric Corona & Cosmic Dust Wash */}
      <div
        style={{
          position: 'absolute',
          width: 'min(90vw, 850px)',
          height: 'min(90vw, 850px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(134, 175, 255, 0.12) 0%, rgba(154, 130, 220, 0.05) 35%, rgba(154, 130, 220, 0.02) 55%, transparent 75%)',
          filter: 'blur(50px)',
          transform: `translate3d(${haloShiftX}px, ${haloShiftY}px, 0) scale(${isTransitioning ? 2.5 : 1})`,
          transition: isTransitioning ? 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.8s' : 'transform 0.4s ease-out',
          opacity: isTransitioning ? 0.9 : 0.75,
        }}
      />

      {/* 2. Razor Celestial Horizon & Telemetry Datum */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(134, 175, 255, 0.03) 15%, rgba(229, 237, 249, 0.22) 50%, rgba(134, 175, 255, 0.03) 85%, transparent 100%)',
          transform: `translate3d(${bgShiftX * 0.4}px, ${bgShiftY * 0.4}px, 0)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: '6%',
            top: '-18px',
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            color: 'rgba(255, 255, 255, 0.25)',
            fontFamily: "'Space Grotesk', monospace",
          }}
        >
          HORIZON // 0.00° LAT
        </span>
        <span
          style={{
            position: 'absolute',
            right: '6%',
            top: '-18px',
            fontSize: '0.62rem',
            letterSpacing: '0.28em',
            color: 'rgba(255, 255, 255, 0.25)',
            fontFamily: "'Space Grotesk', monospace",
          }}
        >
          SINGULARITY APERTURE [10⁻³⁵m]
        </span>
      </div>

      {/* 3. The Monumental Focal Point (Eclipse / Obsidian Monolith Ring) */}
      <div
        className="monumental-structure"
        style={{
          position: 'relative',
          width: 'clamp(240px, 42vw, 540px)',
          height: 'clamp(240px, 42vw, 540px)',
          borderRadius: '50%',
          transform: `translate3d(${monolithShiftX}px, ${monolithShiftY}px, 0) scale(${isTransitioning ? 3.2 : 1})`,
          transition: isTransitioning
            ? 'transform 2.2s cubic-bezier(0.19, 1, 0.22, 1), opacity 1.8s'
            : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)',
          opacity: isTransitioning ? 0 : 1,
        }}
      >
        {/* Outer Orbital Telemetry Ring */}
        <svg
          viewBox="0 0 500 500"
          style={{
            position: 'absolute',
            inset: -40,
            width: 'calc(100% + 80px)',
            height: 'calc(100% + 80px)',
            pointerEvents: 'none',
          }}
        >
          {/* Subtle dash ring */}
          <circle
            cx="250"
            cy="250"
            r="230"
            fill="none"
            stroke="rgba(229, 237, 249, 0.12)"
            strokeWidth="1"
            strokeDasharray="4 18"
            className="rotating-ring"
          />
          {/* Cardinal markers */}
          <circle cx="250" cy="20" r="2.5" fill="rgba(134, 175, 255, 0.8)" />
          <circle cx="250" cy="480" r="2" fill="rgba(229, 237, 249, 0.4)" />
          <circle cx="20" cy="250" r="2" fill="rgba(229, 237, 249, 0.4)" />
          <circle cx="480" cy="250" r="2" fill="rgba(229, 237, 249, 0.4)" />
        </svg>

        {/* Luminous Rim Backlight (Atmospheric Blue-White & Violet Edge Glow) */}
        <div
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            background: `conic-gradient(from ${lightAngle}deg, 
              rgba(229, 237, 249, 0.95) 0deg, 
              rgba(134, 175, 255, 0.8) 45deg, 
              rgba(154, 130, 220, 0.35) 90deg, 
              rgba(15, 23, 42, 0) 180deg, 
              rgba(154, 130, 220, 0.25) 270deg, 
              rgba(134, 175, 255, 0.7) 320deg, 
              rgba(229, 237, 249, 0.95) 360deg)`,
            filter: 'blur(3px)',
            opacity: 0.85,
            transition: 'background 0.2s ease-out',
          }}
        />

        {/* Atmospheric Secondary Edge Halo */}
        <div
          style={{
            position: 'absolute',
            inset: -24,
            borderRadius: '50%',
            background: `radial-gradient(circle at ${50 + parallax.x * 20}% ${50 + parallax.y * 20}%, 
              rgba(134, 175, 255, 0.35) 0%, 
              rgba(154, 130, 220, 0.15) 45%, 
              transparent 70%)`,
            filter: 'blur(16px)',
            opacity: 0.7,
          }}
        />

        {/* Razor-thin Specular Outer Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.35),
              0 0 30px rgba(134, 175, 255, 0.4),
              0 0 80px rgba(154, 130, 220, 0.15)
            `,
          }}
        />

        {/* The Obsidian Singularity Core (Darker than the void) */}
        <div
          style={{
            position: 'absolute',
            inset: 2,
            borderRadius: '50%',
            backgroundColor: '#03050A',
            background: 'radial-gradient(circle at 45% 45%, #07090e 0%, #030407 60%, #010103 100%)',
            boxShadow: `
              inset 0 0 50px rgba(0, 0, 0, 0.95),
              inset 0 1px 2px rgba(255, 255, 255, 0.15),
              0 25px 60px rgba(0, 0, 0, 0.9)
            `,
            overflow: 'hidden',
          }}
        >
          {/* Subtle Inner Caustic Arc */}
          <div
            style={{
              position: 'absolute',
              top: '12%',
              left: '12%',
              right: '12%',
              height: '35%',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, rgba(229, 237, 249, 0.08) 0%, transparent 100%)',
              filter: 'blur(4px)',
              transform: `rotate(${parallax.x * 15}deg)`,
              transition: 'transform 0.4s ease-out',
            }}
          />

          {/* Central Quantum Eye Glyph */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '12px',
              height: '12px',
              marginLeft: '-6px',
              marginTop: '-6px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #ffffff 0%, rgba(134, 175, 255, 0.6) 50%, transparent 100%)',
              boxShadow: '0 0 16px rgba(134, 175, 255, 0.9), 0 0 32px rgba(229, 237, 249, 0.5)',
              opacity: 0.9,
            }}
          />
        </div>
      </div>
    </div>
  )
}
