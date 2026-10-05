'use client'

import { STIMULUS_OPTIONS, getIllustrationCategory } from '../data/constants'

function StimulusIcon({ type }) {
  const illCat = getIllustrationCategory(type)
  if (illCat) {
    return (
      <span className={`stimulusIconIllustration stimulusIcon-${type}`} aria-hidden>
        <img
          src={illCat.iconSrc}
          alt=""
          width={36}
          height={36}
          className="stimulusIconImg"
          draggable={false}
        />
      </span>
    )
  }

  switch (type) {
    case 'classic':
      return <span className="stimulusIconDot" aria-hidden />
    case 'colors':
      return <span className="stimulusIconColors" aria-hidden />
    case 'letters':
      return <span className="stimulusIconLetters" aria-hidden>A</span>
    case 'words':
      return <span className="stimulusIconWords" aria-hidden>ABC</span>
    case 'numbers':
      return <span className="stimulusIconNumbers" aria-hidden>123</span>
    case 'arrows':
      return <span className="stimulusIconArrows" aria-hidden>➜</span>
    default:
      return null
  }
}

/**
 * Grid visual de selección de estímulo para los ejercicios.
 */
export function StimulusGrid({
  value,
  onChange,
  disabled = false,
  options = STIMULUS_OPTIONS,
  showLabel = false,
}) {
  return (
    <div className="stimulusGridContainer">
      {showLabel && (
        <span className="controlLabel" id="stimulus-grid-label">
          Estímulo
        </span>
      )}
      <div
        className="stimulusGrid"
        role="radiogroup"
        aria-label="Selecciona tipo de estímulo"
      >
        {options.map((opt) => {
          const isSelected = opt.value === value
          const isDisabled = disabled || opt.disabled

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              className={`stimulusCard ${isSelected ? 'stimulusCardActive' : ''
                }`}
              onClick={() => {
                if (!isDisabled && onChange) {
                  onChange(opt.value)
                }
              }}
              title={opt.description || opt.label}
            >
              {opt.badge && (
                <span className="stimulusBadgePronto">{opt.badge}</span>
              )}
              <div className="stimulusCardIcon">
                <StimulusIcon type={opt.iconType} />
              </div>
              <span className="stimulusCardLabel">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
