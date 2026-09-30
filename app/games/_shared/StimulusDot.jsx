'use client'

import { StimulusLetter } from './StimulusLetter'
import { StimulusWord } from './StimulusWord'
import { StimulusAnimal } from './StimulusAnimal'

/**
 * Componente de estímulo visual.
 * 
 * Soporta:
 * - Punto fijo celeste
 * - Punto dinámico de colores
 * - Letras sueltas en mayúscula con selección de tamaño
 * - Palabras de 3 a 6 letras en mayúscula
 * - Animales ilustrados con selección de tamaño
 */
export function StimulusDot({
  position,
  color,
  letter = 'A',
  letterSize = 'md',
  word = 'SOL',
  animal,
  animalSize = 'md',
  isPaused = false,
  stimulusType = 'colors',
}) {
  if (stimulusType === 'letters') {
    return (
      <StimulusLetter
        position={position}
        letter={letter}
        size={letterSize}
        isPaused={isPaused}
      />
    )
  }

  if (stimulusType === 'words') {
    return (
      <StimulusWord
        position={position}
        word={word}
        isPaused={isPaused}
      />
    )
  }

  if (stimulusType === 'animals') {
    return (
      <StimulusAnimal
        position={position}
        animal={animal}
        size={animalSize}
        isPaused={isPaused}
      />
    )
  }

  const hex = color?.hex || '#38bdf8'

  return (
    <div
      className={`gameDot ${isPaused ? 'gameDotPaused' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundColor: hex,
        boxShadow: isPaused
          ? `0 0 16px ${hex}66`
          : `0 0 24px ${hex}, 0 0 48px ${hex}55`,
      }}
      aria-label={`Estímulo ${color?.name || ''}`}
    />
  )
}
