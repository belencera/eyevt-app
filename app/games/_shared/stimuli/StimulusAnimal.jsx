'use client'

import { StimulusIllustration } from './StimulusIllustration'

/**
 * Componente modular para renderizar el estímulo de animal ilustrado.
 * Reutiliza la lógica unificada de StimulusIllustration.
 */
export function StimulusAnimal({
  animal,
  size = 'md',
  position,
  isPaused = false,
}) {
  return (
    <StimulusIllustration
      item={animal}
      size={size}
      position={position}
      isPaused={isPaused}
      category="animals"
    />
  )
}
