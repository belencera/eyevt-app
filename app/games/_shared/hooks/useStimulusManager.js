'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getRandomColor,
  getRandomLetter,
  getRandomWord,
  getRandomAnimal,
} from '../data/constants'

/**
 * Hook modular para gestionar los estados, configuraciones y generación
 * aleatoria de estímulos (colores, letras, palabras, animales).
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

  // Opciones de animales
  const [animalSize, setAnimalSize] = useState('md')
  const [animalInterval, setAnimalInterval] = useState(3)
  const [currentAnimal, setCurrentAnimal] = useState(() => getRandomAnimal())

  // Refs para acceso síncrono libre de stale-closures en bucles de animación o intervalos
  const stimulusTypeRef = useRef(stimulusType)
  const colorIntervalRef = useRef(colorInterval)
  const currentColorRef = useRef(currentColor)
  const letterIntervalRef = useRef(letterInterval)
  const currentLetterRef = useRef(currentLetter)
  const wordIntervalRef = useRef(wordInterval)
  const wordLengthRef = useRef(wordLength)
  const currentWordRef = useRef(currentWord)
  const animalIntervalRef = useRef(animalInterval)
  const currentAnimalRef = useRef(currentAnimal)

  useEffect(() => {
    stimulusTypeRef.current = stimulusType
    colorIntervalRef.current = colorInterval
    currentColorRef.current = currentColor
    letterIntervalRef.current = letterInterval
    currentLetterRef.current = currentLetter
    wordIntervalRef.current = wordInterval
    wordLengthRef.current = wordLength
    currentWordRef.current = currentWord
    animalIntervalRef.current = animalInterval
    currentAnimalRef.current = currentAnimal
  }, [
    stimulusType,
    colorInterval,
    currentColor,
    letterInterval,
    currentLetter,
    wordInterval,
    wordLength,
    currentWord,
    animalInterval,
    currentAnimal,
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

    if (type === 'animals') {
      const next = getRandomAnimal(currentAnimalRef.current)
      currentAnimalRef.current = next
      setCurrentAnimal(next)
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
    } else if (newType === 'animals') {
      const next = getRandomAnimal()
      currentAnimalRef.current = next
      setCurrentAnimal(next)
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
    } else if (type === 'animals') {
      const next = getRandomAnimal(currentAnimalRef.current)
      currentAnimalRef.current = next
      setCurrentAnimal(next)
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

    // Animales
    currentAnimal,
    setCurrentAnimal,
    animalSize,
    setAnimalSize,
    animalInterval,
    setAnimalInterval,

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
      animalIntervalRef,
      currentAnimalRef,
    },
  }
}
