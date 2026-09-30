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
  NUMBER_SIZE_OPTIONS,
  NUMBER_DIGITS_OPTIONS,
  ARROW_SIZE_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  FRUIT_SIZE_OPTIONS,
} from '../_shared'

const HINTS = {
  animals: 'Mantén la mirada fija en el centro y nombra al animal en voz alta cada vez que cambie.',
  fruits: 'Mantén la mirada fija en el centro y nombra la fruta en voz alta cada vez que cambie.',
  words: 'Mantén la mirada fija en el centro y lee la palabra en voz alta cada vez que cambie.',
  numbers: 'Mantén la mirada fija en el centro y di el número en voz alta cada vez que cambie.',
  arrows: 'Mantén la mirada fija en el centro e indica la dirección de la flecha en voz alta cada vez que cambie.',
  letters: 'Mantén la mirada fija en el centro y nombra la letra en voz alta cada vez que cambie.',
  colors: 'Mantén la mirada fija en el centro y di el color en voz alta cada vez que cambie.',
  classic: 'Mantén la mirada fija en el punto central sin mover los ojos ni la cabeza.',
}

// Punto fijo en el centro de la pantalla
const CENTER_POSITION = { x: 50, y: 50 }

export default function FixationGame() {
  const [changeInterval, setChangeInterval] = useState(3) // segundos entre cambios de estímulo

  const stimulus = useStimulusManager('classic')
  const stimulusRef = useRef(stimulus)
  useEffect(() => {
    stimulusRef.current = stimulus
  }, [stimulus])

  const intervalTimerRef = useRef(null)

  const clearTimer = () => {
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current)
      intervalTimerRef.current = null
    }
  }

  const session = useGameSession({
    onReset: () => {
      clearTimer()
      stimulusRef.current.resetStimulus()
    },
    onFinish: () => {
      clearTimer()
    },
  })

  // Control del intervalo de rotación del estímulo durante el ejercicio
  useEffect(() => {
    if (session.isPlaying && !session.isPaused) {
      clearTimer()
      // En modo 'classic', el punto permanece fijo sin necesidad de rotación
      if (stimulus.stimulusType !== 'classic') {
        intervalTimerRef.current = setInterval(() => {
          stimulusRef.current.nextStimulus()
        }, changeInterval * 1000)
      }
    } else {
      clearTimer()
    }
    return () => clearTimer()
  }, [session.isPlaying, session.isPaused, changeInterval, stimulus.stimulusType])

  // Controles específicos de tamaño/parámetros según el estímulo activo
  const renderExtraControls = () => {
    switch (stimulus.stimulusType) {
      case 'letters':
        return (
          <OptionPicker
            id="letter-size"
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
              id="word-size"
              label="Tamaño de palabra"
              value={stimulus.wordSize}
              options={WORD_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setWordSize}
            />
            <OptionPicker
              id="word-length"
              label="Longitud de palabra"
              value={stimulus.wordLength}
              options={WORD_LENGTH_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setWordLength}
            />
          </>
        )
      case 'numbers':
        return (
          <>
            <OptionPicker
              id="number-size"
              label="Tamaño de número"
              value={stimulus.numberSize}
              options={NUMBER_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setNumberSize}
            />
            <OptionPicker
              id="number-digits"
              label="Cifras numéricas"
              value={stimulus.numberDigits}
              options={NUMBER_DIGITS_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setNumberDigits}
            />
          </>
        )
      case 'arrows':
        return (
          <OptionPicker
            id="arrow-size"
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
            id="animal-size"
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
            id="fruit-size"
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

  // Visibilidad del estímulo en pantalla
  const showDot =
    !session.isIdle ||
    stimulus.stimulusType === 'classic' ||
    stimulus.stimulusType === 'colors' ||
    stimulus.stimulusType === 'letters' ||
    stimulus.stimulusType === 'words' ||
    stimulus.stimulusType === 'numbers' ||
    stimulus.stimulusType === 'arrows' ||
    stimulus.stimulusType === 'animals' ||
    stimulus.stimulusType === 'fruits'

  return (
    <GameShell
      title="Fijación"
      hint={HINTS[stimulus.stimulusType] || HINTS.classic}
      session={session}
      speedControl={{
        id: 'change-interval',
        label: 'Velocidad de cambio',
        value: changeInterval,
        min: 1,
        max: 10,
        step: 1,
        unit: ' s',
        disabled: !session.isIdle,
        onChange: setChangeInterval,
      }}
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          disabled={!session.isIdle}
          onChange={(val) => {
            clearTimer()
            stimulus.handleStimulusChange(val)
          }}
        />
      }
      extraControls={renderExtraControls()}
    >
      {showDot && (
        <StimulusDot
          position={CENTER_POSITION}
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
