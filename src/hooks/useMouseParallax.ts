import { useEffect, useRef, useState } from 'react'
import { ParallaxOffset } from '../types'

interface ParallaxOptions {
  damping?: number
  disabled?: boolean
}

/**
 * Damped pointer parallax.
 *
 * Returns ONE stable, mutable object that is updated in place every frame, so
 * the hook never triggers React re-renders. Consumers:
 *  - R3F / canvas code reads `parallax.x / parallax.y` inside their frame loops.
 *  - DOM code reads the `--px` / `--py` CSS variables written on <html>.
 */
export function useMouseParallax(options: ParallaxOptions = {}) {
  const { damping = 0.06, disabled = false } = options
  const currentRef = useRef<ParallaxOffset>({ x: 0, y: 0 })
  const targetRef = useRef<ParallaxOffset>({ x: 0, y: 0 })

  useEffect(() => {
    const root = document.documentElement
    const current = currentRef.current
    const target = targetRef.current

    if (disabled) {
      // Ease back to centre (e.g. during the warp transition)
      target.x = 0
      target.y = 0
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (disabled) return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      target.x = Math.max(-1, Math.min(1, nx))
      target.y = Math.max(-1, Math.min(1, ny))
    }

    const handleMouseLeave = () => {
      target.x = 0
      target.y = 0
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    let rafId = 0
    const tick = () => {
      const dx = target.x - current.x
      const dy = target.y - current.y

      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        current.x += dx * damping
        current.y += dy * damping
        root.style.setProperty('--px', current.x.toFixed(4))
        root.style.setProperty('--py', current.y.toFixed(4))
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafId)
    }
  }, [damping, disabled])

  return currentRef.current
}

/**
 * Samples a mutable parallax source into React state. ONLY for the rare
 * non-WebGL fallback that still needs render-time values; do not use it for
 * anything that renders in the normal path.
 */
export function useSampledParallax(source: ParallaxOffset): ParallaxOffset {
  const [sampled, setSampled] = useState<ParallaxOffset>({ x: source.x, y: source.y })

  useEffect(() => {
    let rafId = 0
    const tick = () => {
      setSampled((prev) =>
        Math.abs(prev.x - source.x) > 0.002 || Math.abs(prev.y - source.y) > 0.002
          ? { x: source.x, y: source.y }
          : prev
      )
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [source])

  return sampled
}
