'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getRandomColor,
  getRandomLetter,
  getRandomWord,
  getRandomNumber,
  getRandomArrow,
  getRandomAnimal,
  getRandomFruit,
  getRandomFood,
  isIllustrationCategory,
  getRandomIllustrationByCategory,
} from '../data/constants'

/**
 * Hook modular para gestionar los estados, configuraciones y generación
 * aleatoria de estímulos (colores, letras, palabras, números, flechas e ilustraciones
 * vectoriales registradas: animales, frutas, comida y futuras colecciones).
 */
export function useStimulusManager(initialType = 'classic') {
  const [stimulusType, setStimulusType] = useState(initialType)

  // Opciones de colores
  const [colorInterval, setColorInterval] = useState(3)
  const [currentColor, setCurrentColor] = useState({ name: 'Celeste', hex: '#38bdf8' })

  // Opciones de letras
  const [letterSize, setLetterSize] = useState('md')
  const [letterInterval, setLetterInterval] = useState(3)
  const [currentLetter, setCurrentLetter] = useState('A')

  // Opciones de palabras
  const [wordSize, setWordSize] = useState('md')
  const [wordLength, setWordLength] = useState(4)
  const [wordInterval, setWordInterval] = useState(3)
  const [currentWord, setCurrentWord] = useState('CASA')

  // Opciones de números
  const [numberSize, setNumberSize] = useState('md')
  const [numberDigits, setNumberDigits] = useState(1)
  const [numberInterval, setNumberInterval] = useState(3)
  const [currentNumber, setCurrentNumber] = useState(() => getRandomNumber(1))

  // Opciones de flechas (4 direcciones cardinales)
  const [arrowSize, setArrowSize] = useState('md')
  const [arrowInterval, setArrowInterval] = useState(3)
  const [currentArrow, setCurrentArrow] = useState(() => getRandomArrow())

  // Opciones unificadas de ilustraciones (Animales, Frutas, Comida y futuras categorías)
  const [illustrationSize, setIllustrationSize] = useState('md')
  const [illustrationInterval, setIllustrationInterval] = useState(3)
  const [currentIllustration, setCurrentIllustration] = useState(() => {
    if (isIllustrationCategory(initialType)) {
      return getRandomIllustrationByCategory(initialType)
    }
    return getRandomAnimal()
  })

  // Estados legacy sincronizados para retrocompatibilidad
  const [currentAnimal, setCurrentAnimal] = useState(() => getRandomAnimal())
  const [currentFruit, setCurrentFruit] = useState(() => getRandomFruit())
  const [currentFood, setCurrentFood] = useState(() => getRandomFood())

  // Refs para acceso síncrono libre de stale-closures en bucles de animación o intervalos
  const stimulusTypeRef = useRef(stimulusType)
  const colorIntervalRef = useRef(colorInterval)
  const currentColorRef = useRef(currentColor)
  const letterIntervalRef = useRef(letterInterval)
  const currentLetterRef = useRef(currentLetter)
  const wordIntervalRef = useRef(wordInterval)
  const wordLengthRef = useRef(wordLength)
  const currentWordRef = useRef(currentWord)
  const numberIntervalRef = useRef(numberInterval)
  const numberDigitsRef = useRef(numberDigits)
  const currentNumberRef = useRef(currentNumber)
  const arrowIntervalRef = useRef(arrowInterval)
  const currentArrowRef = useRef(currentArrow)
  const illustrationIntervalRef = useRef(illustrationInterval)
  const currentIllustrationRef = useRef(currentIllustration)

  useEffect(() => {
    stimulusTypeRef.current = stimulusType
    colorIntervalRef.current = colorInterval
    currentColorRef.current = currentColor
    letterIntervalRef.current = letterInterval
    currentLetterRef.current = currentLetter
    wordIntervalRef.current = wordInterval
    wordLengthRef.current = wordLength
    currentWordRef.current = currentWord
    numberIntervalRef.current = numberInterval
    numberDigitsRef.current = numberDigits
    currentNumberRef.current = currentNumber
    arrowIntervalRef.current = arrowInterval
    currentArrowRef.current = currentArrow
    illustrationIntervalRef.current = illustrationInterval
    currentIllustrationRef.current = currentIllustration
  }, [
    stimulusType,
    colorInterval,
    currentColor,
    letterInterval,
    currentLetter,
    wordInterval,
    wordLength,
    currentWord,
    numberInterval,
    numberDigits,
    currentNumber,
    arrowInterval,
    currentArrow,
    illustrationInterval,
    currentIllustration,
  ])

  // Generar siguiente elemento según el estímulo activo evitando repeticiones
  const nextStimulus = useCallback(() => {
    const type = stimulusTypeRef.current

    if (type === 'colors') {
      const next = getRandomColor(currentColorRef.current)
      currentColorRef.current = next
      setCurrentColor(next)
      return next
    }

    if (type === 'letters') {
      const next = getRandomLetter(currentLetterRef.current)
      currentLetterRef.current = next
      setCurrentLetter(next)
      return next
    }

    if (type === 'words') {
      const next = getRandomWord(wordLengthRef.current, currentWordRef.current)
      currentWordRef.current = next
      setCurrentWord(next)
      return next
    }

    if (type === 'numbers') {
      const next = getRandomNumber(numberDigitsRef.current, currentNumberRef.current)
      currentNumberRef.current = next
      setCurrentNumber(next)
      return next
    }

    if (type === 'arrows') {
      const next = getRandomArrow(currentArrowRef.current)
      currentArrowRef.current = next
      setCurrentArrow(next)
      return next
    }

    if (isIllustrationCategory(type)) {
      const next = getRandomIllustrationByCategory(type, currentIllustrationRef.current)
      currentIllustrationRef.current = next
      setCurrentIllustration(next)
      if (type === 'animals') setCurrentAnimal(next)
      if (type === 'fruits') setCurrentFruit(next)
      if (type === 'food') setCurrentFood(next)
      return next
    }

    return null
  }, [])

  // Cambiar tipo de estímulo e inicializar con un valor coherente
  const handleStimulusChange = useCallback((newType) => {
    setStimulusType(newType)
    stimulusTypeRef.current = newType

    if (newType === 'classic') {
      const def = { name: 'Celeste', hex: '#38bdf8' }
      currentColorRef.current = def
      setCurrentColor(def)
    } else if (newType === 'colors') {
      const next = getRandomColor()
      currentColorRef.current = next
      setCurrentColor(next)
    } else if (newType === 'letters') {
      const next = getRandomLetter()
      currentLetterRef.current = next
      setCurrentLetter(next)
    } else if (newType === 'words') {
      const next = getRandomWord(wordLengthRef.current)
      currentWordRef.current = next
      setCurrentWord(next)
    } else if (newType === 'numbers') {
      const next = getRandomNumber(numberDigitsRef.current)
      currentNumberRef.current = next
      setCurrentNumber(next)
    } else if (newType === 'arrows') {
      const next = getRandomArrow()
      currentArrowRef.current = next
      setCurrentArrow(next)
    } else if (isIllustrationCategory(newType)) {
      const next = getRandomIllustrationByCategory(newType)
      currentIllustrationRef.current = next
      setCurrentIllustration(next)
      if (newType === 'animals') setCurrentAnimal(next)
      if (newType === 'fruits') setCurrentFruit(next)
      if (newType === 'food') setCurrentFood(next)
    }
  }, [])

  // Restablecer valores iniciales al reiniciar juego
  const resetStimulus = useCallback(() => {
    const type = stimulusTypeRef.current
    if (type === 'colors') {
      const next = getRandomColor(currentColorRef.current)
      currentColorRef.current = next
      setCurrentColor(next)
    } else if (type === 'classic') {
      const def = { name: 'Celeste', hex: '#38bdf8' }
      currentColorRef.current = def
      setCurrentColor(def)
    } else if (type === 'letters') {
      const next = getRandomLetter(currentLetterRef.current)
      currentLetterRef.current = next
      setCurrentLetter(next)
    } else if (type === 'words') {
      const next = getRandomWord(wordLengthRef.current, currentWordRef.current)
      currentWordRef.current = next
      setCurrentWord(next)
    } else if (type === 'numbers') {
      const next = getRandomNumber(numberDigitsRef.current, currentNumberRef.current)
      currentNumberRef.current = next
      setCurrentNumber(next)
    } else if (type === 'arrows') {
      const next = getRandomArrow(currentArrowRef.current)
      currentArrowRef.current = next
      setCurrentArrow(next)
    } else if (isIllustrationCategory(type)) {
      const next = getRandomIllustrationByCategory(type, currentIllustrationRef.current)
      currentIllustrationRef.current = next
      setCurrentIllustration(next)
      if (type === 'animals') setCurrentAnimal(next)
      if (type === 'fruits') setCurrentFruit(next)
      if (type === 'food') setCurrentFood(next)
    }
  }, [])

  return {
    stimulusType,
    setStimulusType,
    handleStimulusChange,
    nextStimulus,
    resetStimulus,

    // Colores
    currentColor,
    setCurrentColor,
    colorInterval,
    setColorInterval,

    // Letras
    currentLetter,
    setCurrentLetter,
    letterSize,
    setLetterSize,
    letterInterval,
    setLetterInterval,

    // Palabras
    currentWord,
    setCurrentWord,
    wordSize,
    setWordSize,
    wordLength,
    setWordLength,
    wordInterval,
    setWordInterval,

    // Números
    currentNumber,
    setCurrentNumber,
    numberSize,
    setNumberSize,
    numberDigits,
    setNumberDigits,
    numberInterval,
    setNumberInterval,

    // Flechas
    currentArrow,
    setCurrentArrow,
    arrowSize,
    setArrowSize,
    arrowInterval,
    setArrowInterval,

    // Ilustraciones genéricas y extensibles
    illustrationSize,
    setIllustrationSize,
    illustrationInterval,
    setIllustrationInterval,
    currentIllustration,
    setCurrentIllustration,

    // Alias retrocompatibles para Animales
    currentAnimal,
    setCurrentAnimal,
    animalSize: illustrationSize,
    setAnimalSize: setIllustrationSize,
    animalInterval: illustrationInterval,
    setAnimalInterval: setIllustrationInterval,

    // Alias retrocompatibles para Frutas
    currentFruit,
    setCurrentFruit,
    fruitSize: illustrationSize,
    setFruitSize: setIllustrationSize,
    fruitInterval: illustrationInterval,
    setFruitInterval: setIllustrationInterval,

    // Alias para Comida
    currentFood,
    setCurrentFood,
    foodSize: illustrationSize,
    setFoodSize: setIllustrationSize,
    foodInterval: illustrationInterval,
    setFoodInterval: setIllustrationInterval,

    // Refs para animaciones y timers
    refs: {
      stimulusTypeRef,
      colorIntervalRef,
      currentColorRef,
      letterIntervalRef,
      currentLetterRef,
      wordIntervalRef,
      wordLengthRef,
      currentWordRef,
      numberIntervalRef,
      numberDigitsRef,
      currentNumberRef,
      arrowIntervalRef,
      currentArrowRef,
      illustrationIntervalRef,
      currentIllustrationRef,
      // Alias retrocompatibles
      animalIntervalRef: illustrationIntervalRef,
      currentAnimalRef: currentIllustrationRef,
      fruitIntervalRef: illustrationIntervalRef,
      currentFruitRef: currentIllustrationRef,
      foodIntervalRef: illustrationIntervalRef,
      currentFoodRef: currentIllustrationRef,
    },
  }
}
