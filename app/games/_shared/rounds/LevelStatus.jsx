'use client'

import './rounds.css'

/**
 * Barra de estado minimalista: NIVEL X | ● ○
 * Los puntos muestran el progreso dentro del nivel (ej. aciertos seguidos para subir
 * o parejas encontradas).
 *
 * @param {number} level - Nivel actual
 * @param {number} filled - Puntos rellenos
 * @param {number} total - Puntos en total
 */
export function LevelStatus({ level, filled, total }) {
  return (
    <div
      className="levelStatus"
      aria-live="polite"
      aria-label={`Nivel ${level}, ${filled} de ${total}`}
    >
      <span className="levelStatusLabel">NIVEL {level}</span>
      <span className="levelStatusSep" aria-hidden />
      <span className="levelStatusDots" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`levelStatusDot ${i < filled ? 'levelStatusDotFilled' : ''}`}
          />
        ))}
      </span>
    </div>
  )
}
