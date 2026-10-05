'use client'

import { StimulusLetter } from './StimulusLetter'
import { StimulusWord } from './StimulusWord'
import { StimulusNumber } from './StimulusNumber'
import { StimulusArrow } from './StimulusArrow'
import { StimulusIllustration } from './StimulusIllustration'
import { isIllustrationCategory } from '../data/constants'

/**
 * Componente despachador de estímulo visual.
 *
 * Soporta:
 * - Punto fijo celeste ('classic')
 * - Punto dinámico de colores ('colors')
 * - Letras sueltas en mayúscula ('letters')
 * - Palabras de 3 a 6 letras en mayúscula ('words')
 * - Números aleatorios de 1 a 5 cifras ('numbers')
 * - Flechas direccionales en 4 sentidos cardinales ('arrows')
 * - Ilustraciones vectoriales modulares (animales, frutas, comida y futuras categorías)
 */
export function StimulusDot({
  position,
  stimulus,
  isPaused = false,
}) {
  const type = stimulus?.stimulusType ?? 'classic'
  const sizePx = stimulus?.sizePx
  const sizeLevel = stimulus?.sizeLevel ?? 'md'

  if (type === 'letters') {
    return (
      <StimulusLetter
        position={position}
        letter={stimulus?.currentLetter ?? 'A'}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'words') {
    return (
      <StimulusWord
        position={position}
        word={stimulus?.currentWord ?? 'SOL'}
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
        number={stimulus?.currentNumber ?? '7'}
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
        arrow={stimulus?.currentArrow}
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
        item={stimulus?.currentIllustration}
        size={sizeLevel}
        sizePx={sizePx}
        isPaused={isPaused}
        category={type}
      />
    )
  }

  // Punto fijo (classic) o colores
  const activeColor = stimulus?.currentColor
  const hex = activeColor?.hex || '#38bdf8'
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
      aria-label={`Estímulo ${activeColor?.name || ''}`}
    />
  )
}
