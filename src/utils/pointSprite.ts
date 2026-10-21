import * as THREE from 'three'

let sprite: THREE.CanvasTexture | null = null

/** Shared soft round sprite so points render as light, not hard square pixels. */
export function getPointSprite(): THREE.CanvasTexture {
  if (sprite) return sprite

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  sprite = new THREE.CanvasTexture(canvas)
  return sprite
}