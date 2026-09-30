'use client'

/**
 * Componente modular para renderizar el estímulo de palabra en mayúsculas.
 *
 * @param {Object} props
 * @param {string} [props.word='SOL'] - Palabra a renderizar (forzada a mayúscula)
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el ejercicio está en pausa
 */
export function StimulusWord({
  word = 'SOL',
  position,
  isPaused = false,
}) {
  const displayWord = String(word || 'SOL').toUpperCase()

  return (
    <div
      className={`stimulusWord ${isPaused ? 'stimulusWordPaused' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      role="img"
      aria-label={`Estímulo palabra ${displayWord}`}
    >
      <span className="stimulusWordText">{displayWord}</span>
    </div>
  )
}
