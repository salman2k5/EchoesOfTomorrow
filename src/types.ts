export type AppPhase =
  | 'intro'
  | 'idle'
  | 'transitioning'
  | 'observatory'
  | 'world-observer'
  | 'world-loop'
  | 'world-threshold'

export type WorldId = 'observer' | 'loop' | 'threshold'

export interface ParallaxOffset {
  x: number // -1 to 1 normalized
  y: number // -1 to 1 normalized
}

export interface TelemetryData {
  epoch: string
  temporalDelta: string
  coordinates: string
  consciousnessSync: number
  status: 'NOMINAL' | 'CALIBRATING' | 'CONVERGING'
}

export interface PhenomenonMeta {
  id: WorldId
  code: string
  title: string
  subtitle: string
  description: string
  metric: string
  status: string
  interactionCue: string
}
