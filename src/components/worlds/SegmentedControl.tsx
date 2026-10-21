import { audioManager } from '../../utils/sound'

export interface SegmentOption<T extends string | number> {
  id: T
  label: string
  /** Full accessible name when the visible label is abbreviated */
  ariaLabel?: string
}

interface SegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[]
  value: T
  onChange: (id: T) => void
  groupLabel: string
}

/** Quiet, tactile pill group shared by all three worlds. */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  groupLabel,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={groupLabel}
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2px',
        padding: '3px',
        maxWidth: '100%',
        borderRadius: '999px',
        backgroundColor: 'rgba(16, 22, 38, 0.55)',
        border: '1px solid rgba(134, 175, 255, 0.14)',
      }}
    >
      {options.map((opt) => {
        const isActive = opt.id === value
        return (
          <button
            key={String(opt.id)}
            type="button"
            className={`hud-btn ${isActive ? 'is-active' : ''}`}
            aria-pressed={isActive}
            aria-label={opt.ariaLabel}
            onClick={() => onChange(opt.id)}
            onMouseEnter={() => audioManager.playHover()}
            style={{
              background: isActive ? 'rgba(134, 175, 255, 0.16)' : 'transparent',
              border: `1px solid ${isActive ? 'rgba(134, 175, 255, 0.4)' : 'transparent'}`,
              borderRadius: '999px',
              padding: '0.5rem 1.05rem',
              color: isActive ? '#E5EDF9' : 'rgba(229, 237, 249, 0.5)',
              fontSize: '0.68rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', monospace",
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
