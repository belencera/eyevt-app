'use client'

import './rounds.css'

/**
 * Barra de estado minimalista: NIVEL X | ● ○
 * Los puntos muestran el progreso dentro del nivel (ej. aciertos seguidos para subir
 * o parejas encontradas).
 *
 * @param {number} level - Nivel actual
 * @param {number} filled - Puntos rellenos
 * @param {number} [total=0] - Puntos en total (sin puntos solo se muestra el nivel)
 */
export function LevelStatus({ level, filled = 0, total = 0 }) {
  return (
    <div
      className="levelStatus"
      aria-live="polite"
      aria-label={total > 0 ? `Nivel ${level}, ${filled} de ${total}` : `Nivel ${level}`}
    >
      <span className="levelStatusLabel">NIVEL {level}</span>
      {total > 0 && (
        <>
          <span className="levelStatusSep" aria-hidden />
          <span className="levelStatusDots" aria-hidden>
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={`levelStatusDot ${i < filled ? 'levelStatusDotFilled' : ''}`}
              />
            ))}
          </span>
        </>
      )}
    </div>
  )
}
