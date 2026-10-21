import React from 'react'

interface WorldFallbackProps {
  title: string
}

/** Shown in place of a 3D scene when WebGL is unavailable or the renderer fails. */
export const WorldFallback: React.FC<WorldFallbackProps> = ({ title }) => (
  <div
    role="status"
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      padding: '0 2rem',
      textAlign: 'center',
      background:
        'radial-gradient(circle at 50% 45%, rgba(134, 175, 255, 0.08) 0%, rgba(154, 130, 220, 0.04) 30%, transparent 62%)',
    }}
  >
    <div
      aria-hidden="true"
      style={{
        width: 'clamp(120px, 28vmin, 220px)',
        height: 'clamp(120px, 28vmin, 220px)',
        borderRadius: '50%',
        border: '1px solid rgba(134, 175, 255, 0.35)',
        boxShadow: '0 0 60px rgba(134, 175, 255, 0.12), inset 0 0 40px rgba(3, 5, 10, 0.9)',
      }}
    />
    <p
      style={{
        maxWidth: '34ch',
        fontSize: '0.8rem',
        lineHeight: 1.6,
        letterSpacing: '0.04em',
        color: 'rgba(229, 237, 249, 0.6)',
        fontWeight: 300,
      }}
    >
      {title} needs real-time 3D, which isn’t available on this device. The controls below remain active.
    </p>
  </div>
)
