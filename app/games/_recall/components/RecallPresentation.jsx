'use client'

import { StimulusItem } from '../../_shared'
import '../recall.css'

/**
 * Fase de presentación de una ronda en el centro de la pantalla.
 *
 * - 'fixation': cruz central para anclar la mirada
 * - 'presenting': los estímulos recibidos en una fila centrada (uno solo en Secuencial)
 * - Cualquier otra fase (hueco entre estímulos, respuesta...): pantalla vacía
 *
 * @param {string} phase - Fase actual de la ronda
 * @param {string} type - Categoría de estímulo
 * @param {Array} items - Valores a mostrar (los `value` de la ronda)
 * @param {number} sizePx - Tamaño del estímulo (↑ / ↓)
 * @param {string} [sizeLevel] - Nivel de tamaño de respaldo
 */
export function RecallPresentation({ phase, type, items = [], sizePx, sizeLevel }) {
  if (phase === 'fixation') {
    return (
      <div className="recallStage" aria-hidden>
        <div className="recallFixationCross" />
      </div>
    )
  }

  if (phase !== 'presenting') return null

  return (
    <div className="recallStage">
      <div className="recallFlow recallStageRow">
        {items.map((value, index) => (
          <StimulusItem
            key={index}
            type={type}
            item={value}
            sizePx={sizePx}
            sizeLevel={sizeLevel}
          />
        ))}
      </div>
    </div>
  )
}
