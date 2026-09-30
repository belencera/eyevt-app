'use client'

import { StimulusLetter } from './StimulusLetter'
import { StimulusWord } from './StimulusWord'
import { StimulusNumber } from './StimulusNumber'
import { StimulusIllustration } from './StimulusIllustration'

/**
 * Componente despachador de estímulo visual.
 * 
 * Soporta:
 * - Punto fijo celeste ('classic')
 * - Punto dinámico de colores ('colors')
 * - Letras sueltas en mayúscula con selección de tamaño ('letters')
 * - Palabras de 3 a 6 letras en mayúscula con selección de tamaño ('words')
 * - Números aleatorios de 1 a 5 cifras con selección de tamaño ('numbers')
 * - Animales ilustrados con selección de tamaño ('animals')
 * - Frutas ilustradas con selección de tamaño ('fruits')
 */
export function StimulusDot({
  position,
  color,
  letter = 'A',
  letterSize = 'md',
  word = 'SOL',
  wordSize = 'md',
  number = '7',
  numberSize = 'md',
  animal,
  animalSize = 'md',
  fruit,
  fruitSize = 'md',
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
        size={wordSize}
        isPaused={isPaused}
      />
    )
  }

  if (stimulusType === 'numbers') {
    return (
      <StimulusNumber
        position={position}
        number={number}
        size={numberSize}
        isPaused={isPaused}
      />
    )
  }

  if (stimulusType === 'animals') {
    return (
      <StimulusIllustration
        position={position}
        item={animal}
        size={animalSize}
        isPaused={isPaused}
        category="animals"
      />
    )
  }

  if (stimulusType === 'fruits') {
    return (
      <StimulusIllustration
        position={position}
        item={fruit}
        size={fruitSize}
        isPaused={isPaused}
        category="fruits"
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
