'use client'

import { StimulusLetter } from './StimulusLetter'
import { StimulusWord } from './StimulusWord'
import { StimulusNumber } from './StimulusNumber'
import { StimulusArrow } from './StimulusArrow'
import { StimulusIllustration } from './StimulusIllustration'
import { isIllustrationCategory } from '../data/constants'

const CENTER = { x: 50, y: 50 }
const DEFAULT_COLOR = { name: 'Celeste', hex: '#38bdf8' }

/**
 * Despachador único de estímulos visuales: pinta un elemento concreto de cualquier categoría.
 *
 * El valor de `item` depende del tipo:
 * - 'classic' | 'colors': { name, hex }
 * - 'letters' | 'pbqd': string ('A', 'p'...)
 * - 'words' | 'numbers': string
 * - 'arrows': { id, name, angle }
 * - Ilustraciones (animales, frutas...): { id, name, src }
 *
 * Los estímulos se posicionan en coordenadas porcentuales (por defecto el centro),
 * por lo que dentro de una tarjeta basta con un contenedor `position: relative`.
 */
export function StimulusItem({
  type = 'classic',
  item,
  position = CENTER,
  sizePx,
  sizeLevel = 'md',
  isPaused = false,
}) {
  if (type === 'letters' || type === 'pbqd') {
    return (
      <StimulusLetter
        position={position}
        letter={item ?? (type === 'pbqd' ? 'p' : 'A')}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
        uppercase={type !== 'pbqd'}
      />
    )
  }

  if (type === 'words') {
    return (
      <StimulusWord
        position={position}
        word={item ?? 'SOL'}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'numbers') {
    return (
      <StimulusNumber
        position={position}
        number={item ?? '7'}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'arrows') {
    return (
      <StimulusArrow
        position={position}
        arrow={item}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
      />
    )
  }

  // Renderizado dinámico de cualquier categoría de ilustración registrada
  if (isIllustrationCategory(type)) {
    return (
      <StimulusIllustration
        position={position}
        item={item}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
        category={type}
      />
    )
  }

  // Punto fijo (classic) o colores
  const color = item ?? DEFAULT_COLOR
  const hex = color.hex || DEFAULT_COLOR.hex
  const dotPx = sizePx ?? (sizeLevel === 'xs' ? 14 : sizeLevel === 'sm' ? 20 : sizeLevel === 'lg' ? 40 : sizeLevel === 'xl' ? 56 : 28)

  return (
    <div
      className={`gameDot ${isPaused ? 'gameDotPaused' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${dotPx}px`,
        height: `${dotPx}px`,
        backgroundColor: hex,
        boxShadow: isPaused
          ? `0 0 16px ${hex}66`
          : `0 0 24px ${hex}, 0 0 48px ${hex}55`,
      }}
      aria-label={`Estímulo ${color.name || ''}`}
    />
  )
}
