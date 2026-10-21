import React, { useState } from 'react'
import { WorldId, ParallaxOffset } from '../../../types'
import { WorldContainer, PHENOMENA } from '../WorldContainer'
import { SegmentedControl } from '../SegmentedControl'
import { ObserverScene } from './ObserverScene'
import { ObserverMode } from './ObserverCore'
import { audioManager } from '../../../utils/sound'

interface ObserverWorldProps {
  onSelectWorld: (world: WorldId) => void
  onReturnToObservatory: () => void
  parallax: ParallaxOffset
  reducedMotion: boolean
}

const MODES = [
  { id: 'unified' as ObserverMode, label: 'Monolith', ariaLabel: 'Unified monolith' },
  { id: 'unfold' as ObserverMode, label: 'Reveal', ariaLabel: 'Reveal core' },
  { id: 'lattice' as ObserverMode, label: 'Lattice', ariaLabel: 'Quantum lattice' },
]

export const ObserverWorld: React.FC<ObserverWorldProps> = ({
  onSelectWorld,
  onReturnToObservatory,
  parallax,
  reducedMotion,
}) => {
  const [mode, setMode] = useState<ObserverMode>('unified')

  const handleModeChange = (newMode: ObserverMode) => {
    if (newMode === mode) return
    audioManager.playShift()
    setMode(newMode)
  }

  return (
    <WorldContainer
      currentWorld="observer"
      onSelectWorld={onSelectWorld}
      onReturnToObservatory={onReturnToObservatory}
      meta={PHENOMENA[0]}
      hudControls={
        <SegmentedControl
          groupLabel="Perspective"
          options={MODES}
          value={mode}
          onChange={handleModeChange}
        />
      }
    >
      <ObserverScene mode={mode} parallax={parallax} reducedMotion={reducedMotion} />
    </WorldContainer>
  )
}
