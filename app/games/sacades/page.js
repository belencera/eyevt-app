'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GameShell,
  OptionPicker,
  StimulusDot,
  StimulusGrid,
  useGameSession,
  useStimulusManager,
  LETTER_SIZE_OPTIONS,
  WORD_SIZE_OPTIONS,
  WORD_LENGTH_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  FRUIT_SIZE_OPTIONS,
  NUMBER_SIZE_OPTIONS,
  NUMBER_DIGITS_OPTIONS,
  ARROW_SIZE_OPTIONS,
  getRandomWord,
  getRandomNumber,
} from '../_shared'

const MIN = 2
const MAX = 98

function randomPosition() {
  return {
    x: Math.random() * (MAX - MIN) + MIN,
    y: Math.random() * (MAX - MIN) + MIN,
  }
}

/** Convierte velocidad del slider (12–48) en intervalo entre saltos (ms). */
function speedToInterval(speed) {
  return Math.round(1500 - speed * 25)
}

const HINTS = {
  animals: 'Mueve los ojos con precisión sin mover la cabeza cada vez que el animal cambie de posición y nómbralo en voz alta.',
  fruits: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la fruta cambie de posición y nómbrala en voz alta.',
  words: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la palabra cambie de posición y léela en voz alta.',
  numbers: 'Mueve los ojos con precisión sin mover la cabeza cada vez que el número cambie de posición y dilo en voz alta.',
  arrows: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la flecha cambie de posición e indica su dirección en voz alta.',
  letters: 'Mueve los ojos con precisión sin mover la cabeza cada vez que la letra cambie de posición y léela en voz alta.',
  colors: 'Mueve los ojos con precisión sin mover la cabeza cada vez que el color cambie de posición y di el color en voz alta.',
  classic: 'Mueve los ojos con precisión entre los diferentes puntos sin mover la cabeza.',
}

export default function SacadesGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [speed, setSpeed] = useState(28)
  const intervalRef = useRef(null)

  const stimulus = useStimulusManager('classic')

  const clearJumpInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const jumpToRandom = () => {
    setPosition(randomPosition())
    stimulus.nextStimulus()
  }

  const startJumping = () => {
    clearJumpInterval()
    jumpToRandom()
    intervalRef.current = setInterval(jumpToRandom, speedToInterval(speed))
  }

  const resetBall = () => {
    clearJumpInterval()
    stimulus.resetStimulus()
    setPosition({ x: 50, y: 50 })
  }

  const session = useGameSession({
    onBeginPlay: startJumping,
    onPause: clearJumpInterval,
    onResume: startJumping,
    onReset: resetBall,
    onEnd: clearJumpInterval,
  })

  useEffect(() => {
    return () => clearJumpInterval()
  }, [])

  const showDot = session.started && (session.isPlaying || session.isPaused)

  const renderExtraControls = () => {
    switch (stimulus.stimulusType) {
      case 'letters':
        return (
          <OptionPicker
            id="sacade-letter-size"
            label="Tamaño de letra"
            value={stimulus.letterSize}
            options={LETTER_SIZE_OPTIONS}
            disabled={!session.isIdle}
            onChange={stimulus.setLetterSize}
          />
        )
      case 'words':
        return (
          <>
            <OptionPicker
              id="sacade-word-size"
              label="Tamaño de palabra"
              value={stimulus.wordSize}
              options={WORD_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setWordSize}
            />
            <OptionPicker
              id="sacade-word-length"
              label="Longitud de palabra"
              value={stimulus.wordLength}
              options={WORD_LENGTH_OPTIONS}
              disabled={!session.isIdle}
              onChange={(val) => {
                stimulus.setWordLength(val)
                stimulus.setCurrentWord(getRandomWord(val))
              }}
            />
          </>
        )
      case 'numbers':
        return (
          <>
            <OptionPicker
              id="sacade-number-size"
              label="Tamaño de número"
              value={stimulus.numberSize}
              options={NUMBER_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setNumberSize}
            />
            <OptionPicker
              id="sacade-number-digits"
              label="Cifras"
              value={stimulus.numberDigits}
              options={NUMBER_DIGITS_OPTIONS}
              disabled={!session.isIdle}
              onChange={(val) => {
                stimulus.setNumberDigits(val)
                stimulus.setCurrentNumber(getRandomNumber(val))
              }}
            />
          </>
        )
      case 'arrows':
        return (
          <OptionPicker
            id="sacade-arrow-size"
            label="Tamaño de flecha"
            value={stimulus.arrowSize}
            options={ARROW_SIZE_OPTIONS}
            disabled={!session.isIdle}
            onChange={stimulus.setArrowSize}
          />
        )
      case 'animals':
        return (
          <OptionPicker
            id="sacade-animal-size"
            label="Tamaño de animal"
            value={stimulus.animalSize}
            options={ANIMAL_SIZE_OPTIONS}
            disabled={!session.isIdle}
            onChange={stimulus.setAnimalSize}
          />
        )
      case 'fruits':
        return (
          <OptionPicker
            id="sacade-fruit-size"
            label="Tamaño de fruta"
            value={stimulus.fruitSize}
            options={FRUIT_SIZE_OPTIONS}
            disabled={!session.isIdle}
            onChange={stimulus.setFruitSize}
          />
        )
      default:
        return null
    }
  }

  return (
    <GameShell
      title="Sacádicos"
      hint={HINTS[stimulus.stimulusType] || HINTS.classic}
      session={session}
      speedControl={{
        id: 'sacade-speed',
        label: 'Velocidad',
        value: speed,
        min: 12,
        max: 48,
        step: 2,
        onChange: setSpeed,
      }}
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          disabled={!session.isIdle}
          onChange={stimulus.handleStimulusChange}
        />
      }
      extraControls={renderExtraControls()}
    >
      {showDot && (
        <StimulusDot
          position={position}
          color={stimulus.currentColor}
          letter={stimulus.currentLetter}
          letterSize={stimulus.letterSize}
          word={stimulus.currentWord}
          wordSize={stimulus.wordSize}
          number={stimulus.currentNumber}
          numberSize={stimulus.numberSize}
          arrow={stimulus.currentArrow}
          arrowSize={stimulus.arrowSize}
          animal={stimulus.currentAnimal}
          animalSize={stimulus.animalSize}
          fruit={stimulus.currentFruit}
          fruitSize={stimulus.fruitSize}
          isPaused={session.isPaused}
          stimulusType={stimulus.stimulusType}
        />
      )}
    </GameShell>
  )
}
