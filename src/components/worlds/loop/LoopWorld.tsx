import React, { useState } from 'react'
import { WorldId, ParallaxOffset } from '../../../types'
import { WorldContainer, PHENOMENA } from '../WorldContainer'
import { SegmentedControl } from '../SegmentedControl'
import { LoopScene } from './LoopScene'
import { audioManager } from '../../../utils/sound'

interface LoopWorldProps {
  onSelectWorld: (world: WorldId) => void
  onReturnToObservatory: () => void
  parallax: ParallaxOffset
  reducedMotion: boolean
}

const SPEEDS = [
  { id: -2, label: '−2×', ariaLabel: 'Rewind at double speed' },
  { id: -1, label: '−1×', ariaLabel: 'Reverse' },
  { id: 0, label: 'Hold', ariaLabel: 'Freeze time' },
  { id: 1, label: '+1×', ariaLabel: 'Forward' },
  { id: 3, label: '+3×', ariaLabel: 'Accelerate' },
]

export const LoopWorld: React.FC<LoopWorldProps> = ({
  onSelectWorld,
  onReturnToObservatory,
  parallax,
  reducedMotion,
}) => {
  const [timeSpeed, setTimeSpeed] = useState<number>(1)
  const [scrubOffset, setScrubOffset] = useState<number>(0)
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false)

  const handleSpeed = (speed: number) => {
    if (speed === timeSpeed) return
    audioManager.playShift()
    setTimeSpeed(speed)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrubOffset(parseFloat(e.target.value))
    audioManager.playTick()
  }

  const handleResetScrub = () => {
    if (scrubOffset === 0) return
    setScrubOffset(0)
    audioManager.playShift()
  }

  const hudControls = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        maxWidth: '560px',
      }}
    >
      <div className="chrono-row">
        <label
          htmlFor="chrono-dial"
          style={{
            fontSize: '0.62rem',
            fontFamily: "'Space Grotesk', monospace",
            color: '#86AFFF',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Time
        </label>

        <input
          id="chrono-dial"
          className="chrono-dial"
          type="range"
          min="-5"
          max="5"
          step="0.05"
          value={scrubOffset}
          onChange={handleSliderChange}
          onPointerDown={() => setIsScrubbing(true)}
          onPointerUp={() => setIsScrubbing(false)}
          onPointerCancel={() => setIsScrubbing(false)}
          onKeyDown={() => setIsScrubbing(true)}
          onKeyUp={() => setIsScrubbing(false)}
          onBlur={() => setIsScrubbing(false)}
          aria-label="Scrub time"
          aria-valuetext={`${scrubOffset >= 0 ? '+' : ''}${scrubOffset.toFixed(2)} seconds`}
        />

        <output
          htmlFor="chrono-dial"
          onClick={handleResetScrub}
          title={scrubOffset !== 0 ? 'Click to reset timeline to 0s' : undefined}
          style={{
            fontSize: '0.68rem',
            fontFamily: "'Space Grotesk', monospace",
            color: '#E5EDF9',
            minWidth: '56px',
            textAlign: 'right',
            cursor: scrubOffset !== 0 ? 'pointer' : 'default',
            textDecoration: scrubOffset !== 0 ? 'underline dotted rgba(134, 175, 255, 0.45)' : 'none',
            userSelect: 'none',
          }}
        >
          {scrubOffset >= 0 ? '+' : '−'}
          {Math.abs(scrubOffset).toFixed(2)}s
        </output>
      </div>

      <SegmentedControl
        groupLabel="Time direction and speed"
        options={SPEEDS}
        value={timeSpeed}
        onChange={handleSpeed}
      />
    </div>
  )

  return (
    <WorldContainer
      currentWorld="loop"
      onSelectWorld={onSelectWorld}
      onReturnToObservatory={onReturnToObservatory}
      meta={PHENOMENA[1]}
      hudControls={hudControls}
    >
      <LoopScene
        timeSpeed={timeSpeed}
        scrubOffset={scrubOffset}
        isScrubbing={isScrubbing}
        parallax={parallax}
        reducedMotion={reducedMotion}
      />
    </WorldContainer>
  )
}
