'use client'

import { StimulusItem } from '../../_shared'
import '../../_shared/rounds/rounds.css'
import './recall.css'

/** Tamaño del estímulo dentro de cada tarjeta según la categoría (los textos largos necesitan menos) */
const CARD_STIMULUS_PX = {
  words: 24,
  numbers: 26,
  default: 46,
}

const STATUS_CLASS = {
  correct: 'recallCardCorrect',
  wrong: 'recallCardWrong',
  missed: 'recallCardMissed',
}

/**
 * Texto del badge de una tarjeta:
 * - Orden importante: posiciones en las que se pulsó (ej: '1', '2·4')
 * - Orden libre: número de veces que se pulsó si es más de una (ej: '×2')
 */
function getBadge(selection, key, ordered) {
  const positions = []
  selection.forEach((selectedKey, index) => {
    if (selectedKey === key) positions.push(index + 1)
  })
  if (positions.length === 0) return null
  if (ordered) return positions.join('·')
  return positions.length > 1 ? `×${positions.length}` : null
}

/**
 * Cuadrícula de respuesta (2 filas simétricas, o 1 fila en categorías pequeñas).
 *
 * @param {string} type - Categoría de estímulo
 * @param {Array<{ key: string, value: any }>} options - Tarjetas de la ronda
 * @param {number} columns - Columnas de la cuadrícula
 * @param {string[]} selection - Claves pulsadas en orden
 * @param {Object<string, 'correct'|'wrong'|'missed'>} [results] - Estado de cada tarjeta tras corregir
 * @param {boolean} [ordered=false] - Muestra el orden de pulsación en cada tarjeta
 * @param {boolean} [disabled=false] - Bloquea las respuestas (fuera de la fase de respuesta)
 * @param {boolean} [isPaused=false] - Atenúa la cuadrícula durante la pausa
 * @param {boolean} [leaving=false] - Desvanece la cuadrícula antes de la siguiente ronda
 * @param {(option) => void} onSelect
 * @param {() => void} [onUndo] - Si se pasa, muestra el botón Deshacer mientras se responde
 * @param {() => void} [onNext] - Si se pasa, muestra el botón Siguiente ronda (tras corregir)
 */
export function ResponseGrid({
  type,
  options,
  columns,
  selection,
  results,
  ordered = false,
  disabled = false,
  isPaused = false,
  leaving = false,
  onSelect,
  onUndo,
  onNext,
}) {
  const stimulusPx = CARD_STIMULUS_PX[type] ?? CARD_STIMULUS_PX.default
  const showUndo = Boolean(onUndo) && !results

  return (
    <div
      className={`recallBoard ${isPaused ? 'recallBoardPaused' : ''} ${leaving ? 'recallBoardLeaving' : ''}`}
    >
      <div
        className="recallGrid"
        style={{ '--recall-cols': columns }}
        role="group"
        aria-label="Opciones de respuesta"
      >
        {options.map((option) => {
          const isSelected = selection.includes(option.key)
          const status = results?.[option.key]
          const badge = getBadge(selection, option.key, ordered)
          const stateClass = status
            ? STATUS_CLASS[status]
            : isSelected
            ? 'recallCardSelected'
            : ''

          return (
            <button
              key={option.key}
              type="button"
              className={`recallCard ${stateClass}`}
              disabled={disabled}
              // Evita que la tarjeta se quede con el foco y Espacio la vuelva a pulsar en lugar de pausar
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect?.(option)}
              aria-pressed={isSelected}
            >
              <div className="stimulusFlow">
                <StimulusItem type={type} item={option.value} sizePx={stimulusPx} />
              </div>
              {badge && <span className="recallCardBadge">{badge}</span>}
            </button>
          )
        })}
      </div>

      <div className="roundActions">
        {showUndo && (
          <button
            type="button"
            className="roundBtn"
            disabled={disabled || selection.length === 0}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onUndo}
          >
            ↶ Deshacer
          </button>
        )}
        {onNext && results && (
          <button
            type="button"
            className="roundBtn roundBtnPrimary"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onNext}
          >
            Siguiente ronda →
          </button>
        )}
      </div>
    </div>
  )
}
