'use client'

/**
 * Componente modular para renderizar el estímulo de números.
 *
 * @param {Object} props
 * @param {string|number} [props.number='7'] - Número a mostrar
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del número
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el ejercicio está en pausa
 */
export function StimulusNumber({
  number = '7',
  size = 'md',
  position,
  isPaused = false,
}) {
  const displayVal = String(number ?? '7')

  return (
    <div
      className={`stimulusWord stimulusWord-${size} ${
        isPaused ? 'stimulusWordPaused' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      role="img"
      aria-label={`Estímulo número ${displayVal}`}
    >
      <span className="stimulusWordText">{displayVal}</span>
    </div>
  )
}
