'use client'

import { useViewportSize } from '../../_shared'
import { SymbolCard } from './SymbolCard'
import '../../_shared/rounds/rounds.css'
import '../whichRepeats.css'

const RESERVED_HEIGHT_PX = 72 + 24 + 80 // Barra de nivel arriba, margen inferior y botón "Siguiente ronda"
const RESERVED_WIDTH_PX = 32
const MIN_CARD_PX = 160

/**
 * Tarjetas en fila o en columna (lo que deje tarjetas más grandes) y su diámetro:
 * el deseado (↑ / ↓) limitado a lo que cabe en pantalla.
 */
function getLayout(desiredPx, gapPx, viewport) {
  const availW = viewport.width - RESERVED_WIDTH_PX
  const availH = viewport.height - RESERVED_HEIGHT_PX
  const rowFit = Math.min((availW - gapPx) / 2, availH)
  const columnFit = Math.min(availW, (availH - gapPx) / 2)
  const isColumn = columnFit > rowFit
  const cardPx = Math.max(MIN_CARD_PX, Math.floor(Math.min(desiredPx, isColumn ? columnFit : rowFit)))
  return { isColumn, cardPx }
}

/**
 * Tablero de ¿Cuál se repite?: las dos tarjetas y el botón Siguiente ronda.
 * En el modo girando, la primera gira en sentido horario y la segunda en antihorario.
 *
 * @param {string} type - Categoría de estímulo
 * @param {{ commonKey: string, cards: Array<Array<object>> }} round
 * @param {number} cardPx - Diámetro deseado de las tarjetas
 * @param {number} gapPx - Separación entre las tarjetas (← / →)
 * @param {{ card: number, index: number }|null} selected - Estímulo pulsado
 * @param {boolean} isAnswered
 * @param {boolean} isVisible - Modo memoria
 * @param {number|null} rotationSeconds - Modo girando (null = quietas)
 * @param {boolean} [isPaused=false]
 * @param {(card: number, index: number) => void} onSelect
 * @param {() => void} [onNext] - Si se pasa, muestra el botón Siguiente ronda
 */
export function RepeatsBoard({
  type,
  round,
  cardPx,
  gapPx,
  selected,
  isAnswered,
  isVisible,
  rotationSeconds,
  isPaused = false,
  onSelect,
  onNext,
}) {
  const viewport = useViewportSize()
  const layout = getLayout(cardPx, gapPx, viewport)

  return (
    <div className={`repeatsBoard ${isPaused ? 'repeatsBoardPaused' : ''}`}>
      <div className={`repeatsCards ${layout.isColumn ? 'repeatsCardsColumn' : ''}`} style={{ gap: gapPx }}>
        {round.cards.map((items, card) => (
          <SymbolCard
            key={card}
            type={type}
            items={items}
            cardPx={layout.cardPx}
            commonKey={round.commonKey}
            selectedIndex={selected?.card === card ? selected.index : null}
            isAnswered={isAnswered}
            isVisible={isVisible}
            rotationSeconds={rotationSeconds}
            reverse={card === 1}
            isPaused={isPaused}
            disabled={isAnswered || isPaused}
            onSelect={(index) => onSelect(card, index)}
          />
        ))}
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
