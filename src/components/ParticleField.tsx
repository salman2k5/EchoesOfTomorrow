import React, { useEffect, useRef } from 'react'
import { ParallaxOffset } from '../types'

interface ParticleFieldProps {
  parallax: ParallaxOffset
  reducedMotion: boolean
  intensity?: number
}

interface Particle {
  x: number
  y: number
  z: number // Depth: 0.1 (far) to 1.0 (near)
  size: number
  vx: number
  vy: number
  alpha: number
  baseAlpha: number
  hue: number // 210 (blue-white) to 270 (violet)
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  parallax,
  reducedMotion,
  intensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(performance.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const handleResize = () => {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Generate balanced star/mote particles
    const count = Math.floor((width * height) / 12000) * intensity
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const z = Math.random() * 0.9 + 0.1
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: (Math.random() * 1.5 + 0.5) * z,
        vx: (Math.random() - 0.5) * 0.15 * z,
        vy: (-Math.random() * 0.25 - 0.05) * z, // Gentle upward drift
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        // Blue-white dominant (210-225), occasional soft violet accent (260-275)
        hue: Math.random() > 0.85 ? 265 : 215,
      })
    }
    particlesRef.current = particles

    const render = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = time

      ctx.clearRect(0, 0, width, height)

      const pxFactor = reducedMotion ? 0 : parallax.x * 25
      const pyFactor = reducedMotion ? 0 : parallax.y * 25

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (!reducedMotion) {
          p.x += (p.vx + (parallax.x * 0.3 * p.z)) * (dt * 60)
          p.y += (p.vy + (parallax.y * 0.3 * p.z)) * (dt * 60)

          // Subtle twinkle
          p.alpha = p.baseAlpha + Math.sin(time * 0.002 * p.z + i) * 0.2
        }

        // Wrap around bounds
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const drawX = p.x + pxFactor * p.z
        const drawY = p.y + pyFactor * p.z

        ctx.beginPath()
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2)

        if (p.hue > 250) {
          // Violet accent mote
          ctx.fillStyle = `rgba(154, 130, 220, ${Math.max(0.05, p.alpha * 0.75)})`
        } else {
          // Luminous blue-white
          ctx.fillStyle = `rgba(229, 237, 249, ${Math.max(0.05, p.alpha * 0.85)})`
        }
        ctx.fill()

        // Subtle glow halo for larger near particles
        if (p.size > 1.2 && !reducedMotion) {
          ctx.beginPath()
          ctx.arc(drawX, drawY, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(134, 175, 255, ${p.alpha * 0.15})`
          ctx.fill()
        }
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    animFrameRef.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [parallax, reducedMotion, intensity])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
