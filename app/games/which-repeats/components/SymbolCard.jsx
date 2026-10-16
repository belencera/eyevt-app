'use client'

import { StimulusItem } from '../../_shared'

const TEXT_TYPES = ['words', 'numbers', 'pbqd']
const TEXT_CHAR_RATIO = 0.6 // Ancho de cada carácter respecto al tamaño de letra
const FILL_RATIO = 0.8 // Parte de su hueco que ocupa el estímulo (deja aire al girarlo)

/** Tamaño para StimulusItem que cabe en un hueco de `boxPx` (los textos largos, más pequeños) */
function getStimulusPx(type, value, boxPx) {
  if (!TEXT_TYPES.includes(type)) return boxPx * FILL_RATIO
  const chars = String(value).length
  return Math.min(boxPx * FILL_RATIO, (boxPx * FILL_RATIO) / (chars * TEXT_CHAR_RATIO))
}

/**
 * Tarjeta redonda de ¿Cuál se repite? con sus estímulos (posición, tamaño y giro de buildRound).
 *
 * @param {string} type - Categoría de estímulo
 * @param {Array<{ key, value, x, y, size, rotation }>} items - Estímulos de la tarjeta
 * @param {number} cardPx - Diámetro de la tarjeta
 * @param {string} commonKey - Estímulo común (se marca en verde al responder)
 * @param {number|null} selectedIndex - Estímulo pulsado en esta tarjeta
 * @param {boolean} isAnswered - Ya se ha respondido: se muestra la corrección
 * @param {boolean} [isVisible=true] - Modo memoria: estímulos visibles u ocultos (se pueden pulsar igual)
 * @param {number|null} [rotationSeconds] - Modo girando: segundos por vuelta (null = quieta)
 * @param {boolean} [reverse=false] - Gira en sentido antihorario
 * @param {boolean} [isPaused=false] - Detiene el giro
 * @param {boolean} [disabled=false]
 * @param {(index: number) => void} onSelect
 */
export function SymbolCard({
  type,
  items,
  cardPx,
  commonKey,
  selectedIndex,
  isAnswered,
  isVisible = true,
  rotationSeconds = null,
  reverse = false,
  isPaused = false,
  disabled = false,
  onSelect,
}) {
  const isRotating = Boolean(rotationSeconds)

  return (
    <div
      className={`repeatsCard ${isRotating ? 'repeatsCardRotating' : ''} ${
        reverse ? 'repeatsCardReverse' : ''
      } ${isPaused || isAnswered ? 'repeatsCardStill' : ''} ${isVisible ? '' : 'repeatsCardHidden'}`}
      style={{
        width: cardPx,
        height: cardPx,
        ...(isRotating ? { animationDuration: `${rotationSeconds}s` } : {}),
      }}
    >
      {items.map((item, index) => {
        const boxPx = (item.size / 100) * cardPx
        const isCommon = item.key === commonKey
        const stateClass = isAnswered
          ? isCommon
            ? 'repeatsItemCorrect'
            : index === selectedIndex
              ? 'repeatsItemWrong'
              : ''
          : ''

        return (
          <button
            key={item.key}
            type="button"
            className={`repeatsItem ${stateClass}`}
            style={{ left: `${item.x}%`, top: `${item.y}%`, width: boxPx, height: boxPx }}
            disabled={disabled}
            // Evita que el botón se quede con el foco y Espacio lo vuelva a pulsar en lugar de pausar
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(index)}
            aria-label={`Estímulo ${index + 1}`}
          >
            <span className="stimulusFlow" style={{ transform: `rotate(${item.rotation}deg)` }}>
              <StimulusItem type={type} item={item.value} sizePx={getStimulusPx(type, item.value, boxPx)} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
