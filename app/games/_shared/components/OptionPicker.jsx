'use client'

function getActiveBadge(label, option) {
  if (!option) return null
  const lbl = option.label
  const intervalMatch = lbl.match(/^(\d+)\s*s$/)
  if (intervalMatch) {
    return `Cada ${intervalMatch[1]} segundos`
  }
  return `${lbl} activo`
}

/**
 * Selector con botones en una única fila / cuadrícula compacta para opciones de configuración de ejercicios.
 * Sin menús desplegables: todo directo y visible.
 */
export function OptionPicker({
  id,
  label,
  value,
  options = [],
  disabled = false,
  onChange,
}) {
  const selected = options.find((opt) => opt.value === value)

  return (
    <div className="controlGroup" id={`${id}-group`}>
      <div className="dashCardHead" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="controlLabel" id={`${id}-label`}>
          {label}
        </span>
        {selected && (
          <span className="dashCardSub" style={{ marginLeft: 'auto' }}>
            {getActiveBadge(label, selected)}
          </span>
        )}
      </div>
      <div
        className="optionButtonGroup"
        role="radiogroup"
        aria-labelledby={`${id}-label`}
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
              className={`optionGridBtn ${isSelected ? 'optionGridBtnActive' : ''}`}
              onClick={() => {
                if (!isDisabled && onChange) {
                  onChange(opt.value)
                }
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
