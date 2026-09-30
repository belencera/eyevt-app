'use client'

import { useEffect, useRef, useState } from 'react'
import { GameShell } from '../_shared/GameShell'
import { OptionPicker } from '../_shared/OptionPicker'
import { StimulusDot } from '../_shared/StimulusDot'
import { StimulusGrid } from '../_shared/StimulusGrid'
import { useGameSession } from '../_shared/useGameSession'
import {
  COLOR_INTERVAL_OPTIONS,
  getRandomColor,
  LETTER_SIZE_OPTIONS,
  LETTER_INTERVAL_OPTIONS,
  getRandomLetter,
  WORD_LENGTH_OPTIONS,
  WORD_INTERVAL_OPTIONS,
  getRandomWord,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_INTERVAL_OPTIONS,
  getRandomAnimal,
} from '../_shared/constants'

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

export default function EyeTrackingGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [speed, setSpeed] = useState(28)
  const [stimulusType, setStimulusType] = useState('classic')
  const [colorInterval, setColorInterval] = useState(3)
  const [currentColor, setCurrentColor] = useState({ name: 'Celeste', hex: '#38bdf8' })
  const [letterSize, setLetterSize] = useState('md')
  const [letterInterval, setLetterInterval] = useState(3)
  const [currentLetter, setCurrentLetter] = useState('A')
  const [wordLength, setWordLength] = useState(4)
  const [wordInterval, setWordInterval] = useState(3)
  const [currentWord, setCurrentWord] = useState('CASA')
  const [animalSize, setAnimalSize] = useState('md')
  const [animalInterval, setAnimalInterval] = useState(3)
  const [currentAnimal, setCurrentAnimal] = useState(() => getRandomAnimal())

  const positionRef = useRef({ x: 50, y: 50 })
  const velocityRef = useRef(randomVelocity(28))
  const colorTimerRef = useRef(0)
  const letterTimerRef = useRef(0)
  const wordTimerRef = useRef(0)
  const animalTimerRef = useRef(0)
  const currentColorRef = useRef(currentColor)
  const currentLetterRef = useRef(currentLetter)
  const currentWordRef = useRef(currentWord)
  const currentAnimalRef = useRef(currentAnimal)
  const stimulusTypeRef = useRef(stimulusType)
  const colorIntervalRef = useRef(colorInterval)
  const letterIntervalRef = useRef(letterInterval)
  const wordIntervalRef = useRef(wordInterval)
  const wordLengthRef = useRef(wordLength)
  const animalIntervalRef = useRef(animalInterval)

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

  const resetBall = () => {
    positionRef.current = { x: 50, y: 50 }
    velocityRef.current = randomVelocity(speed)
    colorTimerRef.current = 0
    letterTimerRef.current = 0
    wordTimerRef.current = 0
    animalTimerRef.current = 0

    const nextColor =
      stimulusType === 'colors'
        ? getRandomColor(currentColorRef.current)
        : { name: 'Celeste', hex: '#38bdf8' }

    const nextLetter =
      stimulusType === 'letters'
        ? getRandomLetter(currentLetterRef.current)
        : currentLetterRef.current

    const nextWord =
      stimulusType === 'words'
        ? getRandomWord(wordLengthRef.current, currentWordRef.current)
        : currentWordRef.current

    const nextAnimal =
      stimulusType === 'animals'
        ? getRandomAnimal(currentAnimalRef.current)
        : currentAnimalRef.current

    setCurrentColor(nextColor)
    setCurrentLetter(nextLetter)
    setCurrentWord(nextWord)
    setCurrentAnimal(nextAnimal)
    setPosition({ x: 50, y: 50 })
  }

  const session = useGameSession({
    onBeginPlay: resetBall,
    onReset: resetBall,
  })

  const handleSpeedChange = (value) => {
    setSpeed(value)
    setVelocityMagnitude(velocityRef.current, value)
  }

  const handleStimulusChange = (type) => {
    setStimulusType(type)
    if (type === 'classic') {
      setCurrentColor({ name: 'Celeste', hex: '#38bdf8' })
    } else if (type === 'colors') {
      setCurrentColor(getRandomColor())
    } else if (type === 'letters') {
      setCurrentLetter(getRandomLetter())
    } else if (type === 'words') {
      setCurrentWord(getRandomWord(wordLength))
    } else if (type === 'animals') {
      setCurrentAnimal(getRandomAnimal())
    }
  }

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

      // En modo colores, cambiar el color periódicamente para el feedback verbal del paciente
      if (stimulusTypeRef.current === 'colors') {
        colorTimerRef.current += dt
        if (colorTimerRef.current >= colorIntervalRef.current) {
          colorTimerRef.current = 0
          const nextColor = getRandomColor(currentColorRef.current)
          setCurrentColor(nextColor)
        }
      }

      // En modo letras, cambiar la letra periódicamente para lectura verbal del paciente
      if (stimulusTypeRef.current === 'letters') {
        letterTimerRef.current += dt
        if (letterTimerRef.current >= letterIntervalRef.current) {
          letterTimerRef.current = 0
          const nextLetter = getRandomLetter(currentLetterRef.current)
          setCurrentLetter(nextLetter)
        }
      }

      // En modo palabras, cambiar la palabra periódicamente para lectura verbal del paciente
      if (stimulusTypeRef.current === 'words') {
        wordTimerRef.current += dt
        if (wordTimerRef.current >= wordIntervalRef.current) {
          wordTimerRef.current = 0
          const nextWord = getRandomWord(wordLengthRef.current, currentWordRef.current)
          setCurrentWord(nextWord)
        }
      }

      // En modo animales, cambiar el animal periódicamente
      if (stimulusTypeRef.current === 'animals') {
        animalTimerRef.current += dt
        if (animalTimerRef.current >= animalIntervalRef.current) {
          animalTimerRef.current = 0
          const nextAnimal = getRandomAnimal(currentAnimalRef.current)
          setCurrentAnimal(nextAnimal)
        }
      }

      setPosition({ x: pos.x, y: pos.y })
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [session.running])

  const showDot =
    session.started && (session.isPlaying || session.isPaused)

  return (
    <GameShell
      title="Seguimientos"
      hint={
        stimulusType === 'animals'
          ? 'Sigue al animal y nómbralo en voz alta'
          : stimulusType === 'words'
          ? 'Sigue la palabra y léela en voz alta'
          : stimulusType === 'letters'
          ? 'Sigue la letra y dila en voz alta'
          : stimulusType === 'colors'
          ? 'Sigue el punto y di el color en voz alta'
          : 'Sigue el punto con la mirada'
      }
      session={session}
      speedControl={{
        id: 'speed',
        label: 'Velocidad',
        value: speed,
        min: 12,
        max: 48,
        step: 2,
        onChange: handleSpeedChange,
      }}
      extraControls={
        <>
          <StimulusGrid
            value={stimulusType}
            disabled={!session.isIdle}
            onChange={handleStimulusChange}
          />

          {stimulusType === 'colors' && (
            <OptionPicker
              id="color-interval"
              label="Cambio de color"
              value={colorInterval}
              options={COLOR_INTERVAL_OPTIONS}
              disabled={!session.isIdle}
              onChange={setColorInterval}
            />
          )}

          {stimulusType === 'letters' && (
            <>
              <OptionPicker
                id="letter-size"
                label="Tamaño de letra"
                value={letterSize}
                options={LETTER_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={setLetterSize}
              />
              <OptionPicker
                id="letter-interval"
                label="Cambio de letra"
                value={letterInterval}
                options={LETTER_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={setLetterInterval}
              />
            </>
          )}

          {stimulusType === 'words' && (
            <>
              <OptionPicker
                id="word-length"
                label="Longitud de palabra"
                value={wordLength}
                options={WORD_LENGTH_OPTIONS}
                disabled={!session.isIdle}
                onChange={(val) => {
                  setWordLength(val)
                  setCurrentWord(getRandomWord(val))
                }}
              />
              <OptionPicker
                id="word-interval"
                label="Cambio de palabra"
                value={wordInterval}
                options={WORD_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={setWordInterval}
              />
            </>
          )}

          {stimulusType === 'animals' && (
            <>
              <OptionPicker
                id="animal-size"
                label="Tamaño de animal"
                value={animalSize}
                options={ANIMAL_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={setAnimalSize}
              />
              <OptionPicker
                id="animal-interval"
                label="Cambio de animal"
                value={animalInterval}
                options={ANIMAL_INTERVAL_OPTIONS}
                disabled={!session.isIdle}
                onChange={setAnimalInterval}
              />
            </>
          )}

          {session.started && stimulusType === 'colors' && (
            <div className="therapistFeedback">
              <span className="therapistFeedbackLabel">Color actual</span>
              <div className="therapistColorBadge">
                <span
                  className="therapistColorDot"
                  style={{
                    backgroundColor: currentColor.hex,
                    boxShadow: `0 0 10px ${currentColor.hex}`,
                  }}
                />
                <span className="therapistColorName">{currentColor.name}</span>
              </div>
            </div>
          )}

          {session.started && stimulusType === 'letters' && (
            <div className="therapistFeedback">
              <span className="therapistFeedbackLabel">Letra actual</span>
              <div className="therapistLetterBadge">
                <span className="therapistLetterChar">{currentLetter}</span>
              </div>
            </div>
          )}

          {session.started && stimulusType === 'words' && (
            <div className="therapistFeedback">
              <span className="therapistFeedbackLabel">Palabra actual</span>
              <div className="therapistWordBadge">
                <span className="therapistWordText">{currentWord}</span>
              </div>
            </div>
          )}

          {session.started && stimulusType === 'animals' && (
            <div className="therapistFeedback">
              <span className="therapistFeedbackLabel">Animal actual</span>
              <div className="therapistAnimalBadge">
                {currentAnimal && (
                  <img
                    src={currentAnimal.src}
                    alt={currentAnimal.name}
                    className="therapistAnimalThumb"
                  />
                )}
                <span className="therapistAnimalName">{currentAnimal?.name}</span>
              </div>
            </div>
          )}
        </>
      }
    >
      {showDot && (
        <StimulusDot
          position={position}
          color={currentColor}
          letter={currentLetter}
          letterSize={letterSize}
          word={currentWord}
          animal={currentAnimal}
          animalSize={animalSize}
          isPaused={session.isPaused}
          stimulusType={stimulusType}
        />
      )}
    </GameShell>
  )
}

