'use client'

import { StimulusItem } from '../../_shared'
import '../common/memory.css'
import './recall.css'

/**
 * Fase de presentación de una ronda.
 *
 * - 'presenting': los estímulos en una fila centrada, o cada uno en su posición si se pasan `positions`
 * - Cualquier otra fase (hueco en blanco, respuesta...): pantalla vacía
 *
 * Los estímulos aparecen y desaparecen con un fundido corto, salvo con `instant` (flash del Taquitoscopio).
 *
 * Con `activeIndex` solo se ve el estímulo de esa posición, pero la fila reserva el hueco
 * de todos: en Memoria Secuencial cada estímulo aparece a la derecha del anterior.
 *
 * @param {string} phase - Fase actual de la ronda
 * @param {string} type - Categoría de estímulo
 * @param {Array} items - Valores de la fila (los `value` de los objetivos)
 * @param {number|null} [activeIndex] - Posición visible; sin valor se ven todos a la vez
 * @param {Array<{ x: number, y: number }>|null} [positions] - Posiciones en pantalla (%) por estímulo
 * @param {number} sizePx - Tamaño del estímulo (↑ / ↓)
 * @param {string} [sizeLevel] - Nivel de tamaño de respaldo
 * @param {boolean} [instant=false] - Sin fundido: aparece y desaparece de golpe
 */
export function RecallPresentation({
  phase,
  type,
  items = [],
  activeIndex = null,
  positions = null,
  sizePx,
  sizeLevel,
  instant = false,
}) {
  // Se mantiene montado fuera de 'presenting' (oculto) para que los estímulos puedan desvanecerse
  const isVisible = (index) => phase === 'presenting' && (activeIndex === null || index === activeIndex)
  const stageClass = `recallStage ${instant ? 'recallStageInstant' : ''}`

  // Modo disperso: cada estímulo en su posición de pantalla (los estímulos ya se colocan en %)
  if (positions) {
    return (
      <div className={stageClass}>
        {items.map((value, index) => (
          <div
            key={index}
            className={`recallSlot ${isVisible(index) ? '' : 'recallSlotHidden'}`}
            aria-hidden={!isVisible(index)}
          >
            <StimulusItem
              type={type}
              item={value}
              position={positions[index]}
              sizePx={sizePx}
              sizeLevel={sizeLevel}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={stageClass}>
      <div className="recallStageRow">
        {items.map((value, index) => {
          const isHidden = !isVisible(index)
          return (
            <div
              key={index}
              className={`memoryFlow recallSlot ${isHidden ? 'recallSlotHidden' : ''}`}
              aria-hidden={isHidden}
            >
              <StimulusItem type={type} item={value} sizePx={sizePx} sizeLevel={sizeLevel} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
