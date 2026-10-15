'use client'

import { StimulusItem } from '../../_shared'
import '../common/memory.css'
import './recall.css'

/**
 * Fase de presentación de una ronda en el centro de la pantalla.
 *
 * - 'presenting': los estímulos en una fila centrada
 * - Cualquier otra fase (hueco en blanco, respuesta...): pantalla vacía
 *
 * Con `activeIndex` solo se ve el estímulo de esa posición, pero la fila reserva el hueco
 * de todos: en Memoria Secuencial cada estímulo aparece a la derecha del anterior.
 *
 * @param {string} phase - Fase actual de la ronda
 * @param {string} type - Categoría de estímulo
 * @param {Array} items - Valores de la fila (los `value` de los objetivos)
 * @param {number|null} [activeIndex] - Posición visible; sin valor se ven todos a la vez
 * @param {number} sizePx - Tamaño del estímulo (↑ / ↓)
 * @param {string} [sizeLevel] - Nivel de tamaño de respaldo
 */
export function RecallPresentation({ phase, type, items = [], activeIndex = null, sizePx, sizeLevel }) {
  if (phase !== 'presenting') return null

  return (
    <div className="recallStage">
      <div className="recallStageRow">
        {items.map((value, index) => {
          const isHidden = activeIndex !== null && index !== activeIndex
          return (
            <div
              key={index}
              className={`memoryFlow ${isHidden ? 'recallSlotHidden' : ''}`}
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
