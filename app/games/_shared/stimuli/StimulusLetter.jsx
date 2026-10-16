'use client'

/**
 * Componente modular para renderizar el estímulo de letras sueltas.
 *
 * @param {Object} props
 * @param {string} [props.letter='A'] - Letra a renderizar
 * @param {boolean} [props.uppercase=true] - Mayúscula (abecedario) o minúscula (pbqd, siempre en minúscula)
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño de la letra
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el juego está en pausa
 */
export function StimulusLetter({
  letter = 'A',
  size = 'md',
  sizePx,
  position,
  isPaused = false,
  uppercase = true,
}) {
  const displayLetter = uppercase
    ? String(letter || 'A').toUpperCase()
    : String(letter || 'a').toLowerCase()

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
      <span
        className="stimulusLetterChar"
        style={sizePx ? { fontSize: `${sizePx}px` } : undefined}
      >
        {displayLetter}
      </span>
    </div>
  )
}
