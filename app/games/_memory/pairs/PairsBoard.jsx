'use client'

import { StimulusItem, useViewportSize } from '../../_shared'
import '../../_shared/rounds/rounds.css'
import './pairs.css'

const GAP_PX = 12
const RESERVED_HEIGHT_PX = 72 + 24 + 80 // Barra de nivel arriba, margen inferior y botón "Siguiente ronda"
const RESERVED_WIDTH_PX = 32
const MIN_CARD_PX = 48

/** Proporción del estímulo respecto a la carta (los textos largos necesitan menos) */
const STIMULUS_RATIO = {
  words: 0.24,
  numbers: 0.28,
  default: 0.55,
}

/** pbqd de 1 a 4 letras: más pequeño cuantas más letras */
const PBQD_RATIO = { 1: 0.55, 2: 0.4, 3: 0.3, 4: 0.24 }

const getStimulusRatio = (type, value) =>
  type === 'pbqd'
    ? PBQD_RATIO[String(value).length] ?? PBQD_RATIO[4]
    : STIMULUS_RATIO[type] ?? STIMULUS_RATIO.default

/**
 * Tamaño de carta: el deseado (↑ / ↓) limitado a lo que cabe en pantalla.
 */
function getCardSize(desiredPx, cardCount, columns, viewportW, viewportH) {
  const rows = Math.ceil(cardCount / columns)
  const fitW = (viewportW - RESERVED_WIDTH_PX - (columns - 1) * GAP_PX) / columns
  const fitH = (viewportH - RESERVED_HEIGHT_PX - (rows - 1) * GAP_PX) / rows
  return Math.max(MIN_CARD_PX, Math.floor(Math.min(desiredPx, fitW, fitH)))
}

/**
 * Tablero de Memoria de parejas con cartas que se voltean.
 *
 * @param {string} type - Categoría de estímulo
 * @param {Array<{ id: string, key: string, value: any }>} deck - Cartas de la ronda
 * @param {number} columns - Cartas por fila
 * @param {number} cardPx - Tamaño de carta deseado (se reduce si no cabe)
 * @param {string[]} faceUp - Ids de cartas boca arriba
 * @param {string[]} matched - Ids de cartas emparejadas (verde)
 * @param {string[]} mismatch - Ids de la pareja fallida que se va a esconder (rojo)
 * @param {boolean} [disabled=false] - Bloquea las cartas (vista previa, comprobación, ronda completa)
 * @param {boolean} [isPaused=false] - Atenúa el tablero durante la pausa
 * @param {(card) => void} onFlip
 * @param {() => void} [onNext] - Si se pasa, muestra el botón Siguiente ronda
 */
export function PairsBoard({
  type,
  deck,
  columns,
  cardPx,
  faceUp,
  matched,
  mismatch,
  disabled = false,
  isPaused = false,
  onFlip,
  onNext,
}) {
  const viewport = useViewportSize()

  const cardSize = getCardSize(cardPx, deck.length, columns, viewport.width, viewport.height)
  // Todas las cartas de una ronda tienen la misma longitud: basta con la primera
  const stimulusPx = Math.round(cardSize * getStimulusRatio(type, deck[0]?.value))

  return (
    <div className={`pairsBoard ${isPaused ? 'pairsBoardPaused' : ''}`}>
      <div
        className="pairsGrid"
        style={{
          '--pairs-cols': columns,
          '--pairs-card': `${cardSize}px`,
          '--pairs-gap': `${GAP_PX}px`,
        }}
        role="group"
        aria-label="Cartas"
      >
        {deck.map((card, index) => {
          const isMatched = matched.includes(card.id)
          const isUp = isMatched || faceUp.includes(card.id)
          const isMismatch = mismatch.includes(card.id)

          return (
            <button
              key={card.id}
              type="button"
              className={`pairsCard ${isUp ? 'pairsCardUp' : ''} ${isMatched ? 'pairsCardMatched' : ''} ${
                isMismatch ? 'pairsCardMismatch' : ''
              }`}
              style={{ '--pairs-index': index }}
              disabled={disabled || isUp}
              // Evita que la carta se quede con el foco y Espacio la vuelva a pulsar en lugar de pausar
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onFlip?.(card)}
              aria-label={isUp ? 'Carta descubierta' : 'Carta boca abajo'}
            >
              <span className="pairsCardInner">
                <span className="pairsCardFace pairsCardBack" aria-hidden />
                <span className="pairsCardFace pairsCardFront" aria-hidden={!isUp}>
                  <span className="stimulusFlow">
                    <StimulusItem type={type} item={card.value} sizePx={stimulusPx} />
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="roundActions">
        {onNext && (
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
