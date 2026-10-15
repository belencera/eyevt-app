'use client'

import '../recall.css'

/**
 * Barra de estado minimalista: NIVEL X | ● ○
 * Los puntos muestran los aciertos seguidos que faltan para subir de nivel.
 *
 * @param {number} level - Nivel actual
 * @param {number} streak - Aciertos seguidos acumulados en este nivel
 * @param {number} upAfter - Aciertos necesarios para subir
 */
export function LevelStatus({ level, streak, upAfter }) {
  return (
    <div
      className="recallLevelStatus"
      aria-live="polite"
      aria-label={`Nivel ${level}, ${streak} de ${upAfter} aciertos para subir`}
    >
      <span className="recallLevelLabel">NIVEL {level}</span>
      <span className="recallLevelSep" aria-hidden />
      <span className="recallLevelDots" aria-hidden>
        {Array.from({ length: upAfter }, (_, i) => (
          <span
            key={i}
            className={`recallLevelDot ${i < streak ? 'recallLevelDotFilled' : ''}`}
          />
        ))}
      </span>
    </div>
  )
}
