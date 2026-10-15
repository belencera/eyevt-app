'use client'

import './memory.css'

/**
 * Barra de estado minimalista: NIVEL X | ● ○
 * Los puntos muestran el progreso dentro del nivel: aciertos seguidos para subir
 * (juegos con cuadrícula) o parejas encontradas (Memoria de parejas).
 *
 * @param {number} level - Nivel actual
 * @param {number} filled - Puntos rellenos
 * @param {number} total - Puntos en total
 */
export function LevelStatus({ level, filled, total }) {
  return (
    <div
      className="memoryLevelStatus"
      aria-live="polite"
      aria-label={`Nivel ${level}, ${filled} de ${total}`}
    >
      <span className="memoryLevelLabel">NIVEL {level}</span>
      <span className="memoryLevelSep" aria-hidden />
      <span className="memoryLevelDots" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`memoryLevelDot ${i < filled ? 'memoryLevelDotFilled' : ''}`}
          />
        ))}
      </span>
    </div>
  )
}
