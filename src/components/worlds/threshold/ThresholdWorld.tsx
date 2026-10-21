import React, { useState } from 'react'
import { WorldId, ParallaxOffset } from '../../../types'
import { WorldContainer, PHENOMENA } from '../WorldContainer'
import { SegmentedControl } from '../SegmentedControl'
import { ThresholdScene } from './ThresholdScene'
import { ThresholdConfig } from './ImpossibleGeometry'
import { audioManager } from '../../../utils/sound'

interface ThresholdWorldProps {
  onSelectWorld: (world: WorldId) => void
  onReturnToObservatory: () => void
  parallax: ParallaxOffset
  reducedMotion: boolean
}

const CONFIGS = [
  { id: 'tesseract' as ThresholdConfig, label: 'Tesseract', ariaLabel: 'Tesseract hyperfold' },
  { id: 'penrose' as ThresholdConfig, label: 'Penrose', ariaLabel: 'Penrose singularity' },
  { id: 'expanded' as ThresholdConfig, label: 'Net', ariaLabel: 'Expanded topology net' },
]

export const ThresholdWorld: React.FC<ThresholdWorldProps> = ({
  onSelectWorld,
  onReturnToObservatory,
  parallax,
  reducedMotion,
}) => {
  const [config, setConfig] = useState<ThresholdConfig>('tesseract')

  const handleConfigChange = (newConfig: ThresholdConfig) => {
    if (newConfig === config) return
    audioManager.playShift()
    setConfig(newConfig)
  }

  return (
    <WorldContainer
      currentWorld="threshold"
      onSelectWorld={onSelectWorld}
      onReturnToObservatory={onReturnToObservatory}
      meta={PHENOMENA[2]}
      hudControls={
        <SegmentedControl
          groupLabel="Configuration"
          options={CONFIGS}
          value={config}
          onChange={handleConfigChange}
        />
      }
    >
      <ThresholdScene config={config} parallax={parallax} reducedMotion={reducedMotion} />
    </WorldContainer>
  )
}
