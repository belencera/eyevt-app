'use client'

import { SCATTER_AREA, StimulusItem, useViewportSize } from '../../_shared'
import '../../_shared/rounds/rounds.css'
import '../oddOne.css'

const GAP_PX = 16
const ITEM_PADDING_PX = 18 // Relleno de cada estímulo pulsable alrededor del dibujo o el texto
const RESERVED_HEIGHT_PX = 72 + 24 + 80 // Barra de nivel arriba, margen inferior y botón "Siguiente ronda"
const RESERVED_WIDTH_PX = 32
const TEXT_CHAR_RATIO = 0.55 // Ancho de cada carácter respecto al tamaño del estímulo (palabras y números)

/** Caja de un estímulo a tamaño completo (los textos largos son más anchos que altos) */
function getItemBox(type, value, stimulusPx) {
  const isText = type === 'words' || type === 'numbers' || type === 'pbqd'
  const contentW = isText ? String(value).length * stimulusPx * TEXT_CHAR_RATIO : stimulusPx
  return { w: contentW + ITEM_PADDING_PX * 2, h: stimulusPx + ITEM_PADDING_PX * 2 }
}

/** Centro: columnas y escala (≤ 1) con las que caben todos los estímulos lo más grandes posible */
function getCenterLayout(count, box, viewport) {
  const availW = viewport.width - RESERVED_WIDTH_PX
  const availH = viewport.height - RESERVED_HEIGHT_PX
  let best = { columns: count, scale: 0 }

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns)
    const scale = Math.min(
      1,
      availW / (columns * box.w + (columns - 1) * GAP_PX),
      availH / (rows * box.h + (rows - 1) * GAP_PX)
    )
    // Si caben igual de grandes, mejor más columnas: filas más anchas que altas
    if (scale >= best.scale) best = { columns, scale }
  }
  return best
}

/**
 * Posiciones aleatorias: escala (≤ 1) para que ningún par de estímulos se solape.
 * Dos estímulos no se pisan si están separados al menos una caja en horizontal o en vertical.
 */
function getScatteredScale(positions, box, viewport) {
  const areaW = viewport.width * ((SCATTER_AREA.maxX - SCATTER_AREA.minX) / 100)
  const areaH = viewport.height * ((SCATTER_AREA.maxY - SCATTER_AREA.minY) / 100)
  let scale = Math.min(1, (areaW / 2) / box.w, (areaH / 2) / box.h)

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = (Math.abs(positions[i].x - positions[j].x) / 100) * viewport.width
      const dy = (Math.abs(positions[i].y - positions[j].y) / 100) * viewport.height
      scale = Math.min(scale, Math.max(dx / box.w, dy / box.h))
    }
  }
  return scale * 0.95
}

/**
 * Tablero de Encuentra el diferente: estímulos pulsables en filas centradas o en posiciones aleatorias.
 *
 * @param {string} type - Categoría de estímulo
 * @param {Array<any>} items - Valores para StimulusItem (todos iguales salvo el diferente)
 * @param {number} oddIndex - Posición del diferente
 * @param {Array<{ x: number, y: number }>|null} positions - Posiciones (%) en modo aleatorio; null = centro
 * @param {number} stimulusPx - Tamaño deseado del estímulo (↑ / ↓); se reduce si no cabe
 * @param {number|null} selected - Estímulo pulsado (tras responder)
 * @param {boolean} [disabled=false] - Bloquea las pulsaciones (ya respondido)
 * @param {boolean} [isPaused=false] - Atenúa el tablero durante la pausa
 * @param {(index: number) => void} onSelect
 * @param {() => void} [onNext] - Si se pasa, muestra el botón Siguiente ronda
 */
export function OddOneBoard({
  type,
  items,
  oddIndex,
  positions,
  stimulusPx,
  selected,
  disabled = false,
  isPaused = false,
  onSelect,
  onNext,
}) {
  const viewport = useViewportSize()
  const box = getItemBox(type, items[0], stimulusPx)
  const isScattered = Boolean(positions)

  const layout = isScattered
    ? { columns: null, scale: getScatteredScale(positions, box, viewport) }
    : getCenterLayout(items.length, box, viewport)

  const itemW = Math.floor(box.w * layout.scale)
  const itemH = Math.floor(box.h * layout.scale)
  const itemStimulusPx = Math.floor(stimulusPx * layout.scale)
  const isAnswered = selected !== null

  const renderItem = (value, index) => {
    const isOdd = index === oddIndex
    const stateClass = isAnswered
      ? isOdd
        ? 'oddOneItemCorrect'
        : index === selected
          ? 'oddOneItemWrong'
          : ''
      : ''
    const position = positions?.[index]

    return (
      <button
        key={index}
        type="button"
        className={`oddOneItem ${stateClass}`}
        style={{
          width: itemW,
          height: itemH,
          ...(position ? { left: `${position.x}%`, top: `${position.y}%` } : {}),
        }}
        disabled={disabled || isPaused}
        // Evita que el botón se quede con el foco y Espacio lo vuelva a pulsar en lugar de pausar
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(index)}
        aria-label={`Estímulo ${index + 1}`}
      >
        <span className="stimulusFlow">
          <StimulusItem type={type} item={value} sizePx={itemStimulusPx} />
        </span>
      </button>
    )
  }

  return (
    <div
      className={`oddOneBoard ${isScattered ? 'oddOneBoardScattered' : ''} ${
        isPaused ? 'oddOneBoardPaused' : ''
      }`}
    >
      {isScattered ? (
        <div className="oddOneScatter">{items.map(renderItem)}</div>
      ) : (
        <div
          className="oddOneGrid"
          style={{ width: layout.columns * itemW + (layout.columns - 1) * GAP_PX, gap: GAP_PX }}
        >
          {items.map(renderItem)}
        </div>
      )}

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
