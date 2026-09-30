'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GameShell,
  OptionPicker,
  StimulusDot,
  StimulusGrid,
  TherapistBadge,
  useGameSession,
  useStimulusManager,
  COLOR_INTERVAL_OPTIONS,
  LETTER_SIZE_OPTIONS,
  LETTER_INTERVAL_OPTIONS,
  WORD_SIZE_OPTIONS,
  WORD_LENGTH_OPTIONS,
  WORD_INTERVAL_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_INTERVAL_OPTIONS,
  FRUIT_SIZE_OPTIONS,
  FRUIT_INTERVAL_OPTIONS,
  getRandomWord,
} from '../_shared'

const MIN = 2
const MAX = 98

function velocityFromAngle(angle, speed) {
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  }
}

function randomVelocity(speed) {
  return velocityFromAngle(Math.random() * Math.PI * 2, speed)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function setVelocityMagnitude(vel, speed) {
  const mag = Math.hypot(vel.x, vel.y) || 1
  vel.x = (vel.x / mag) * speed
  vel.y = (vel.y / mag) * speed
}

const HINTS = {
  animals: 'Sigue al animal y nómbralo en voz alta',
  fruits: 'Sigue la fruta y nómbrala en voz alta',
  words: 'Sigue la palabra y léela en voz alta',
  letters: 'Sigue la letra y dila en voz alta',
  colors: 'Sigue el punto y di el color en voz alta',
  classic: 'Sigue el punto con la mirada sin mover la cabeza',
}

export default function EyeTrackingGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [speed, setSpeed] = useState(28)

  const stimulus = useStimulusManager('classic')
  const stimulusRef = useRef(stimulus)
  useEffect(() => {
    stimulusRef.current = stimulus
  }, [stimulus])

  const positionRef = useRef({ x: 50, y: 50 })
  const velocityRef = useRef(randomVelocity(28))
  const timerRef = useRef(0)

  useEffect(() => {
    setVelocityMagnitude(velocityRef.current, speed)
  }, [speed])

  const resetTimers = () => {
    timerRef.current = 0
  }

  const resetBall = () => {
    positionRef.current = { x: 50, y: 50 }
    velocityRef.current = randomVelocity(speed)
    resetTimers()
    stimulus.resetStimulus()
    setPosition({ x: 50, y: 50 })
  }

  const session = useGameSession({
    onBeginPlay: () => {
      positionRef.current = { x: 50, y: 50 }
      velocityRef.current = randomVelocity(speed)
      resetTimers()
      setPosition({ x: 50, y: 50 })
    },
    onReset: resetBall,
  })

  useEffect(() => {
    if (!session.running) return

    let frameId
    let lastTime = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const pos = positionRef.current
      const vel = velocityRef.current

      pos.x += vel.x * dt
      pos.y += vel.y * dt

      if (pos.x <= MIN || pos.x >= MAX) {
        vel.x *= -1
        pos.x = clamp(pos.x, MIN, MAX)
      }
      if (pos.y <= MIN || pos.y >= MAX) {
        vel.y *= -1
        pos.y = clamp(pos.y, MIN, MAX)
      }

      // Comprobación de cambio periódico del estímulo activo a través de ref para no re-montar el bucle
      const stim = stimulusRef.current
      const type = stim.refs.stimulusTypeRef.current
      let targetInterval = null

      if (type === 'colors') {
        targetInterval = stim.refs.colorIntervalRef.current
      } else if (type === 'letters') {
        targetInterval = stim.refs.letterIntervalRef.current
      } else if (type === 'words') {
        targetInterval = stim.refs.wordIntervalRef.current
      } else if (type === 'animals') {
        targetInterval = stim.refs.animalIntervalRef.current
      } else if (type === 'fruits') {
        targetInterval = stim.refs.fruitIntervalRef.current
      }

      if (targetInterval) {
        timerRef.current += dt
        if (timerRef.current >= targetInterval) {
          timerRef.current = 0
          stim.nextStimulus()
        }
      }

      setPosition({ x: pos.x, y: pos.y })
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [session.running])

  const showDot = session.started && (session.isPlaying || session.isPaused)

  return (
    <GameShell
      title="Seguimientos"
      hint={HINTS[stimulus.stimulusType] || HINTS.classic}
      session={session}
      speedControl={{
        id: 'speed',
        label: 'Velocidad',
        value: speed,
        min: 8,
        max: 60,
        onChange: setSpeed,
      }}
      extraControls={
        <>
          <StimulusGrid
            value={stimulus.stimulusType}
            disabled={!session.isIdle}
            onChange={(val) => {
              resetTimers()
              stimulus.handleStimulusChange(val)
            }}
          />

          {stimulus.stimulusType === 'colors' && (
            <OptionPicker
              id="color-interval"
              label="Cambio de color"
              value={stimulus.colorInterval}
              options={COLOR_INTERVAL_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setColorInterval}
            />
          )}

          {stimulus.stimulusType === 'letters' && (
            <>
              <OptionPicker
                id="letter-size"
                label="Tamaño de letra"
                value={stimulus.letterSize}
                options={LETTER_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setLetterSize}
              />
              <OptionPicker
                id="letter-interval"
                label="Cambio de letra"
                value={stimulus.letterInterval}
                options={LETTER_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setLetterInterval}
              />
            </>
          )}

          {stimulus.stimulusType === 'words' && (
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
                onChange={(val) => {
                  stimulus.setWordLength(val)
                  stimulus.setCurrentWord(getRandomWord(val))
                }}
              />
              <OptionPicker
                id="word-interval"
                label="Cambio de palabra"
                value={stimulus.wordInterval}
                options={WORD_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setWordInterval}
              />
            </>
          )}

          {stimulus.stimulusType === 'animals' && (
            <>
              <OptionPicker
                id="animal-size"
                label="Tamaño de animal"
                value={stimulus.animalSize}
                options={ANIMAL_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setAnimalSize}
              />
              <OptionPicker
                id="animal-interval"
                label="Cambio de animal"
                value={stimulus.animalInterval}
                options={ANIMAL_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setAnimalInterval}
              />
            </>
          )}

          {stimulus.stimulusType === 'fruits' && (
            <>
              <OptionPicker
                id="fruit-size"
                label="Tamaño de fruta"
                value={stimulus.fruitSize}
                options={FRUIT_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setFruitSize}
              />
              <OptionPicker
                id="fruit-interval"
                label="Cambio de fruta"
                value={stimulus.fruitInterval}
                options={FRUIT_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setFruitInterval}
              />
            </>
          )}

          {session.started && (
            <TherapistBadge
              stimulusType={stimulus.stimulusType}
              color={stimulus.currentColor}
              letter={stimulus.currentLetter}
              word={stimulus.currentWord}
              animal={stimulus.currentAnimal}
              fruit={stimulus.currentFruit}
            />
          )}
        </>
      }
    >
      {showDot && (
        <StimulusDot
          position={position}
          color={stimulus.currentColor}
          letter={stimulus.currentLetter}
          letterSize={stimulus.letterSize}
          word={stimulus.currentWord}
          wordSize={stimulus.wordSize}
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
