'use client'

import { getIllustrationCategory } from '../data/illustrationsRegistry'

/**
 * Componente modular unificado para renderizar estímulos gráficos basados en ilustraciones
 * (SVG o PNG), reutilizado para animales, frutas, comida y futuras categorías registradas.
 *
 * @param {Object} props
 * @param {{ id: string, name: string, src?: string }} [props.item] - Datos de la ilustración
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño de la ilustración
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el ejercicio está en pausa
 * @param {string} [props.category='illustration'] - Categoría ('animals' | 'fruits' | 'food' | ...)
 */
export function StimulusIllustration({
  item,
  size = 'md',
  sizePx,
  position,
  isPaused = false,
  category = 'illustration',
}) {
  const current = item || {
    id: 'placeholder',
    name: 'Estímulo',
    src: '',
  }

  const categoryMeta = getIllustrationCategory(category)
  const fallbackEmoji = categoryMeta?.fallbackEmoji || '🦁'

  return (
    <div
      className={`stimulusIllustration stimulusIllustration-${size} stimulusIllustration-${category} ${
        isPaused ? 'stimulusIllustrationPaused' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        ...(sizePx ? { width: `${sizePx}px`, height: `${sizePx}px` } : {}),
      }}
      role="img"
      aria-label={`Estímulo ${current.name}`}
    >
      {current.src ? (
        <img
          src={current.src}
          alt={current.name}
          className="stimulusIllustrationImg"
          draggable={false}
          onError={(e) => {
            // Ocultar img rota y mostrar texto de fallback si el SVG no carga
            e.currentTarget.style.display = 'none'
            if (e.currentTarget.nextElementSibling) {
              e.currentTarget.nextElementSibling.style.display = 'inline-flex'
            }
          }}
        />
      ) : null}
      <span
        className="stimulusIllustrationFallback"
        style={{ display: current.src ? 'none' : 'inline-flex' }}
      >
        {fallbackEmoji} {current.name}
      </span>
    </div>
  )
}
