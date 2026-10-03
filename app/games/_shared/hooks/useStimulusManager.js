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
  STIMULUS_SIZE_PRESETS,
} from '../data/constants'

export const SIZE_SCALE = ['xs', 'sm', 'md', 'lg', 'xl']

/**
 * Hook modular para gestionar los estados, configuraciones y generación
 * aleatoria de estímulos.
 *
 * Cuenta con un sistema de TAMAÑO UNIFICADO para todos los estímulos:
 * - Menú inicial: Selector discreto de 5 niveles ('xs', 'sm', 'md', 'lg', 'xl')
 * - En juego / Teclado: Rango continuo en píxeles (16 px a 180 px con paso de 4 px, tipo convergencia)
 */
export function useStimulusManager(initialType = 'classic') {
  const [stimulusType, setStimulusType] = useState(initialType)

  // ── Tamaño unificado para TODOS los estímulos (punto, colores, letras, palabras, números, flechas, ilustraciones) ──
  const [sizeLevel, setSizeLevelState] = useState('md')
  const [sizePx, setSizePx] = useState(STIMULUS_SIZE_PRESETS.md || 48)

  // Opciones de colores
  const [colorInterval, setColorInterval] = useState(3)
  const [currentColor, setCurrentColor] = useState({ name: 'Celeste', hex: '#38bdf8' })

  // Opciones de letras
  const [letterInterval, setLetterInterval] = useState(3)
  const [currentLetter, setCurrentLetter] = useState('A')

  // Opciones de palabras
  const [wordLength, setWordLength] = useState(4)
  const [wordInterval, setWordInterval] = useState(3)
  const [currentWord, setCurrentWord] = useState('CASA')

  // Opciones de números
  const [numberDigits, setNumberDigits] = useState(1)
  const [numberInterval, setNumberInterval] = useState(3)
  const [currentNumber, setCurrentNumber] = useState(() => getRandomNumber(1))

  // Opciones de flechas (4 direcciones cardinales)
  const [arrowInterval, setArrowInterval] = useState(3)
  const [currentArrow, setCurrentArrow] = useState(() => getRandomArrow())

  // Opciones de ilustraciones (Animales, Frutas, Comida y futuras categorías)
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

  // Refs para acceso síncrono libre de stale-closures en bucles de animación, atajos o intervalos
  const stimulusTypeRef = useRef(stimulusType)
  const sizeLevelRef = useRef(sizeLevel)
  const sizePxRef = useRef(sizePx)
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
    sizeLevelRef.current = sizeLevel
    sizePxRef.current = sizePx
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
    sizeLevel,
    sizePx,
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

  // Establecer tamaño desde el menú de opciones (presets discretos 'xs' a 'xl')
  const setSizeLevel = useCallback((level) => {
    setSizeLevelState(level)
    sizeLevelRef.current = level
    const targetPx = STIMULUS_SIZE_PRESETS[level] ?? 48
    setSizePx(targetPx)
    sizePxRef.current = targetPx
  }, [])

  // Ajuste continuo de tamaño en píxeles (rango como en convergencia: Flechas ↑ y ↓)
  const adjustSize = useCallback((delta) => {
    setSizePx((prev) => {
      const next = Math.max(4, Math.min(prev + delta, 680))
      sizePxRef.current = next

      // Sincronizar el nivel del menú inicial con el preset más cercano
      let closest = 'md'
      let minDiff = Infinity
      for (const [lvl, px] of Object.entries(STIMULUS_SIZE_PRESETS)) {
        const diff = Math.abs(px - next)
        if (diff < minDiff) {
          minDiff = diff
          closest = lvl
        }
      }
      if (minDiff <= 6) {
        setSizeLevelState(closest)
        sizeLevelRef.current = closest
      }

      return next
    })
  }, [])

  // Aumentar en paso continuo de 4 px (Flecha Arriba)
  const increaseSize = useCallback(() => {
    adjustSize(4)
  }, [adjustSize])

  // Disminuir en paso continuo de 4 px (Flecha Abajo)
  const decreaseSize = useCallback(() => {
    adjustSize(-4)
  }, [adjustSize])

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

    // ── Tamaño unificado y rango continuo ──
    sizeLevel,
    setSizeLevel,
    sizePx,
    setSizePx,
    adjustSize,
    increaseSize,
    decreaseSize,

    // Alias retrocompatibles que apuntan al mismo tamaño unificado
    dotSize: sizeLevel,
    setDotSize: setSizeLevel,
    letterSize: sizeLevel,
    setLetterSize: setSizeLevel,
    wordSize: sizeLevel,
    setWordSize: setSizeLevel,
    numberSize: sizeLevel,
    setNumberSize: setSizeLevel,
    arrowSize: sizeLevel,
    setArrowSize: setSizeLevel,
    illustrationSize: sizeLevel,
    setIllustrationSize: setSizeLevel,
    animalSize: sizeLevel,
    setAnimalSize: setSizeLevel,
    fruitSize: sizeLevel,
    setFruitSize: setSizeLevel,
    foodSize: sizeLevel,
    setFoodSize: setSizeLevel,

    // Colores
    currentColor,
    setCurrentColor,
    colorInterval,
    setColorInterval,

    // Letras
    currentLetter,
    setCurrentLetter,
    letterInterval,
    setLetterInterval,

    // Palabras
    currentWord,
    setCurrentWord,
    wordLength,
    setWordLength,
    wordInterval,
    setWordInterval,

    // Números
    currentNumber,
    setCurrentNumber,
    numberDigits,
    setNumberDigits,
    numberInterval,
    setNumberInterval,

    // Flechas
    currentArrow,
    setCurrentArrow,
    arrowInterval,
    setArrowInterval,

    // Ilustraciones genéricas y extensibles
    illustrationInterval,
    setIllustrationInterval,
    currentIllustration,
    setCurrentIllustration,

    // Alias retrocompatibles de intervalo y datos
    currentAnimal,
    setCurrentAnimal,
    animalInterval: illustrationInterval,
    setAnimalInterval: setIllustrationInterval,
    currentFruit,
    setCurrentFruit,
    fruitInterval: illustrationInterval,
    setFruitInterval: setIllustrationInterval,
    currentFood,
    setCurrentFood,
    foodInterval: illustrationInterval,
    setFoodInterval: setIllustrationInterval,

    // Refs para bucles de animación y temporizadores
    refs: {
      stimulusTypeRef,
      sizeLevelRef,
      sizePxRef,
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
