'use client'

/**
 * Componente modular para renderizar el estímulo de flecha direccional SVG en 4 direcciones.
 * Comparte la misma paleta cromática limpia y sin bordes de las palabras (#f8fafc).
 *
 * @param {Object} props
 * @param {{ id: string, name: string, angle: number }} [props.arrow] - Datos de la dirección
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el ejercicio está en pausa
 */
export function StimulusArrow({
  arrow,
  size = 'md',
  position,
  isPaused = false,
}) {
  const current = arrow || { id: 'up', name: 'Arriba', angle: 0 }

  return (
    <div
      className={`stimulusArrow stimulusArrow-${size} ${
        isPaused ? 'stimulusArrowPaused' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      role="img"
      aria-label={`Estímulo flecha ${current.name}`}
    >
      <svg
        viewBox="0 0 32 32"
        className="stimulusArrowSvg"
        style={{ transform: `rotate(${current.angle}deg)` }}
        aria-hidden
      >
        {/* Flecha cardinal simétrica y nítida orientada a 0deg (hacia arriba) */}
        <path
          fill="currentColor"
          d="M16 2.5L4.5 14h7v15.5h9V14h7L16 2.5z"
        />
      </svg>
    </div>
  )
}
