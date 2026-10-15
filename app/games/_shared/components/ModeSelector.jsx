'use client'

/**
 * Selector de modo de juego en tarjetas con icono (2 columnas).
 * Unifica el bloque "Modo de juego" de Periferia, Sacádicos y Fusión.
 *
 * @param {string} id - Prefijo para los ids de accesibilidad
 * @param {string} label - Título del selector (ej: 'Modo de juego')
 * @param {string} [description] - Texto contextual del modo activo junto al título
 * @param {string} value - Modo seleccionado
 * @param {Array<{ value: string, label: string, description?: string, icon?: React.ReactNode }>} options
 * @param {boolean} [disabled=false]
 * @param {(value: string) => void} onChange
 */
export function ModeSelector({
  id,
  label,
  description,
  value,
  options = [],
  disabled = false,
  onChange,
}) {
  const labelId = `${id}-label`

  return (
    <div className="modeGridContainer">
      <div className="modeHeader">
        <span className="controlLabel" id={labelId}>
          {label}
        </span>
        {description && (
          <span key={value} className="modeSubtext">
            {description}
          </span>
        )}
      </div>
      <div className="modeGrid" role="radiogroup" aria-labelledby={labelId}>
        {options.map((opt) => {
          const isSelected = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              className={`modeCard ${isSelected ? 'modeCardActive' : ''}`}
              onClick={() => {
                if (!disabled && onChange) onChange(opt.value)
              }}
              title={opt.description}
            >
              {opt.icon && <div className="modeCardIcon">{opt.icon}</div>}
              <span className="modeCardLabel">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
