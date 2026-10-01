'use client'

import { StimulusLetter } from './StimulusLetter'
import { StimulusWord } from './StimulusWord'
import { StimulusNumber } from './StimulusNumber'
import { StimulusArrow } from './StimulusArrow'
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
 * - Flechas direccionales en 4 sentidos cardinales ('arrows')
 * - Animales ilustrados con selección de tamaño ('animals')
 * - Frutas ilustradas con selección de tamaño ('fruits')
 */
export function StimulusDot({
  position,
  stimulus,
  isPaused = false,
  // Fallbacks retrocompatibles para props individuales
  color,
  letter = 'A',
  letterSize = 'md',
  word = 'SOL',
  wordSize = 'md',
  number = '7',
  numberSize = 'md',
  arrow,
  arrowSize = 'md',
  animal,
  animalSize = 'md',
  fruit,
  fruitSize = 'md',
  stimulusType = 'colors',
}) {
  const type = stimulus?.stimulusType ?? stimulusType
  const activeColor = stimulus?.currentColor ?? color
  const activeLetter = stimulus?.currentLetter ?? letter
  const activeLetterSize = stimulus?.letterSize ?? letterSize
  const activeWord = stimulus?.currentWord ?? word
  const activeWordSize = stimulus?.wordSize ?? wordSize
  const activeNumber = stimulus?.currentNumber ?? number
  const activeNumberSize = stimulus?.numberSize ?? numberSize
  const activeArrow = stimulus?.currentArrow ?? arrow
  const activeArrowSize = stimulus?.arrowSize ?? arrowSize
  const activeAnimal = stimulus?.currentAnimal ?? animal
  const activeAnimalSize = stimulus?.animalSize ?? animalSize
  const activeFruit = stimulus?.currentFruit ?? fruit
  const activeFruitSize = stimulus?.fruitSize ?? fruitSize

  if (type === 'letters') {
    return (
      <StimulusLetter
        position={position}
        letter={activeLetter}
        size={activeLetterSize}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'words') {
    return (
      <StimulusWord
        position={position}
        word={activeWord}
        size={activeWordSize}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'numbers') {
    return (
      <StimulusNumber
        position={position}
        number={activeNumber}
        size={activeNumberSize}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'arrows') {
    return (
      <StimulusArrow
        position={position}
        arrow={activeArrow}
        size={activeArrowSize}
        isPaused={isPaused}
      />
    )
  }

  if (type === 'animals') {
    return (
      <StimulusIllustration
        position={position}
        item={activeAnimal}
        size={activeAnimalSize}
        isPaused={isPaused}
        category="animals"
      />
    )
  }

  if (type === 'fruits') {
    return (
      <StimulusIllustration
        position={position}
        item={activeFruit}
        size={activeFruitSize}
        isPaused={isPaused}
        category="fruits"
      />
    )
  }

  const hex = activeColor?.hex || '#38bdf8'

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
      aria-label={`Estímulo ${activeColor?.name || ''}`}
    />
  )
}
