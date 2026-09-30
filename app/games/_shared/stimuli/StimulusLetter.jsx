'use client'

/**
 * Componente modular para renderizar el estímulo de letras sueltas en mayúscula.
 *
 * @param {Object} props
 * @param {string} [props.letter='A'] - Letra a renderizar (se normaliza en mayúscula)
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño de la letra
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el juego está en pausa
 */
export function StimulusLetter({
  letter = 'A',
  size = 'md',
  position,
  isPaused = false,
}) {
  const displayLetter = String(letter || 'A').toUpperCase()

  return (
    <div
      className={`stimulusLetter stimulusLetter-${size} ${
        isPaused ? 'stimulusLetterPaused' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      role="img"
      aria-label={`Estímulo letra ${displayLetter}`}
    >
      <span className="stimulusLetterChar">{displayLetter}</span>
    </div>
  )
}
