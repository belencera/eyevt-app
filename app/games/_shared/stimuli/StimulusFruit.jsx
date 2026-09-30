'use client'

import { StimulusIllustration } from './StimulusIllustration'

/**
 * Componente modular para renderizar el estímulo de fruta ilustrada.
 * Reutiliza la lógica unificada de StimulusIllustration.
 */
export function StimulusFruit({
  fruit,
  size = 'md',
  position,
  isPaused = false,
}) {
  return (
    <StimulusIllustration
      item={fruit}
      size={size}
      position={position}
      isPaused={isPaused}
      category="fruits"
    />
  )
}
