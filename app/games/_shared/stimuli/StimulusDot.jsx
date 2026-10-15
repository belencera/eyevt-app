'use client'

import { StimulusItem } from './StimulusItem'
import { isIllustrationCategory } from '../data/constants'

/**
 * Devuelve el elemento actual del gestor de estímulos según el tipo activo.
 */
function getCurrentItem(stimulus, type) {
  if (type === 'letters' || type === 'pbqd') return stimulus?.currentLetter
  if (type === 'words') return stimulus?.currentWord
  if (type === 'numbers') return stimulus?.currentNumber
  if (type === 'arrows') return stimulus?.currentArrow
  if (isIllustrationCategory(type)) return stimulus?.currentIllustration
  return stimulus?.currentColor
}

/**
 * Pinta el estímulo activo de un `useStimulusManager` en la posición indicada.
 * El dibujo de cada tipo lo resuelve `StimulusItem`.
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

  return (
    <StimulusItem
      type={type}
      item={getCurrentItem(stimulus, type)}
      position={position}
      sizePx={stimulus?.sizePx}
      sizeLevel={stimulus?.sizeLevel ?? 'md'}
      isPaused={isPaused}
    />
  )
}
