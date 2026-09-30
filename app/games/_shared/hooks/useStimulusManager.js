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
} from '../data/constants'

/**
 * Hook modular para gestionar los estados, configuraciones y generación
 * aleatoria de estímulos (colores, letras, palabras, números, flechas, animales, frutas).
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

  // Opciones de animales
  const [animalSize, setAnimalSize] = useState('md')
  const [animalInterval, setAnimalInterval] = useState(3)
  const [currentAnimal, setCurrentAnimal] = useState(() => getRandomAnimal())

  // Opciones de frutas
  const [fruitSize, setFruitSize] = useState('md')
  const [fruitInterval, setFruitInterval] = useState(3)
  const [currentFruit, setCurrentFruit] = useState(() => getRandomFruit())

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
  const animalIntervalRef = useRef(animalInterval)
  const currentAnimalRef = useRef(currentAnimal)
  const fruitIntervalRef = useRef(fruitInterval)
  const currentFruitRef = useRef(currentFruit)

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
    animalIntervalRef.current = animalInterval
    currentAnimalRef.current = currentAnimal
    fruitIntervalRef.current = fruitInterval
    currentFruitRef.current = currentFruit
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
    animalInterval,
    currentAnimal,
    fruitInterval,
    currentFruit,
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

    if (type === 'animals') {
      const next = getRandomAnimal(currentAnimalRef.current)
      currentAnimalRef.current = next
      setCurrentAnimal(next)
      return next
    }

    if (type === 'fruits') {
      const next = getRandomFruit(currentFruitRef.current)
      currentFruitRef.current = next
      setCurrentFruit(next)
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
    } else if (newType === 'animals') {
      const next = getRandomAnimal()
      currentAnimalRef.current = next
      setCurrentAnimal(next)
    } else if (newType === 'fruits') {
      const next = getRandomFruit()
      currentFruitRef.current = next
      setCurrentFruit(next)
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
    } else if (type === 'animals') {
      const next = getRandomAnimal(currentAnimalRef.current)
      currentAnimalRef.current = next
      setCurrentAnimal(next)
    } else if (type === 'fruits') {
      const next = getRandomFruit(currentFruitRef.current)
      currentFruitRef.current = next
      setCurrentFruit(next)
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

    // Animales
    currentAnimal,
    setCurrentAnimal,
    animalSize,
    setAnimalSize,
    animalInterval,
    setAnimalInterval,

    // Frutas
    currentFruit,
    setCurrentFruit,
    fruitSize,
    setFruitSize,
    fruitInterval,
    setFruitInterval,

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
      animalIntervalRef,
      currentAnimalRef,
      fruitIntervalRef,
      currentFruitRef,
    },
  }
}
