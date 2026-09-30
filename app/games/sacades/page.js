'use client'

import { useEffect, useRef, useState } from 'react'
import { GameShell } from '../_shared/GameShell'
import { OptionPicker } from '../_shared/OptionPicker'
import { StimulusDot } from '../_shared/StimulusDot'
import { StimulusGrid } from '../_shared/StimulusGrid'
import { useGameSession } from '../_shared/useGameSession'
import {
  getRandomColor,
  LETTER_SIZE_OPTIONS,
  getRandomLetter,
  WORD_SIZE_OPTIONS,
  WORD_LENGTH_OPTIONS,
  getRandomWord,
  ANIMAL_SIZE_OPTIONS,
  getRandomAnimal,
} from '../_shared/constants'

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

export default function SacadesGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [speed, setSpeed] = useState(28)
  const [stimulusType, setStimulusType] = useState('classic')
  const [currentColor, setCurrentColor] = useState({ name: 'Celeste', hex: '#38bdf8' })
  const [letterSize, setLetterSize] = useState('md')
  const [currentLetter, setCurrentLetter] = useState('A')
  const [wordSize, setWordSize] = useState('md')
  const [wordLength, setWordLength] = useState(4)
  const [currentWord, setCurrentWord] = useState('CASA')
  const [animalSize, setAnimalSize] = useState('md')
  const [currentAnimal, setCurrentAnimal] = useState(() => getRandomAnimal())

  const intervalRef = useRef(null)
  const currentColorRef = useRef(currentColor)
  const currentLetterRef = useRef(currentLetter)
  const currentWordRef = useRef(currentWord)
  const currentAnimalRef = useRef(currentAnimal)
  const stimulusTypeRef = useRef(stimulusType)
  const wordLengthRef = useRef(wordLength)

  useEffect(() => {
    stimulusTypeRef.current = stimulusType
    currentColorRef.current = currentColor
    currentLetterRef.current = currentLetter
    currentWordRef.current = currentWord
    currentAnimalRef.current = currentAnimal
    wordLengthRef.current = wordLength
  }, [stimulusType, currentColor, currentLetter, currentWord, currentAnimal, wordLength])

  const clearJumpInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const jumpToRandom = () => {
    setPosition(randomPosition())

    // En sacádicos, cada vez que cambia de posición sale un color, letra, palabra o animal aleatorio
    if (stimulusTypeRef.current === 'colors') {
      const nextColor = getRandomColor(currentColorRef.current)
      currentColorRef.current = nextColor
      setCurrentColor(nextColor)
    } else if (stimulusTypeRef.current === 'letters') {
      const nextLetter = getRandomLetter(currentLetterRef.current)
      currentLetterRef.current = nextLetter
      setCurrentLetter(nextLetter)
    } else if (stimulusTypeRef.current === 'words') {
      const nextWord = getRandomWord(wordLengthRef.current, currentWordRef.current)
      currentWordRef.current = nextWord
      setCurrentWord(nextWord)
    } else if (stimulusTypeRef.current === 'animals') {
      const nextAnimal = getRandomAnimal(currentAnimalRef.current)
      currentAnimalRef.current = nextAnimal
      setCurrentAnimal(nextAnimal)
    }
  }

  const startJumping = () => {
    clearJumpInterval()
    jumpToRandom()
    intervalRef.current = setInterval(jumpToRandom, speedToInterval(speed))
  }

  const resetBall = () => {
    clearJumpInterval()
    const initColor =
      stimulusType === 'colors'
        ? getRandomColor(currentColorRef.current)
        : { name: 'Celeste', hex: '#38bdf8' }
    currentColorRef.current = initColor
    setCurrentColor(initColor)

    const initLetter =
      stimulusType === 'letters'
        ? getRandomLetter(currentLetterRef.current)
        : currentLetterRef.current
    currentLetterRef.current = initLetter
    setCurrentLetter(initLetter)

    const initWord =
      stimulusType === 'words'
        ? getRandomWord(wordLengthRef.current, currentWordRef.current)
        : currentWordRef.current
    currentWordRef.current = initWord
    setCurrentWord(initWord)

    const initAnimal =
      stimulusType === 'animals'
        ? getRandomAnimal(currentAnimalRef.current)
        : currentAnimalRef.current
    currentAnimalRef.current = initAnimal
    setCurrentAnimal(initAnimal)

    setPosition({ x: 50, y: 50 })
  }

  const handleStimulusChange = (type) => {
    setStimulusType(type)
    if (type === 'classic') {
      setCurrentColor({ name: 'Celeste', hex: '#38bdf8' })
    } else if (type === 'colors') {
      setCurrentColor(getRandomColor())
    } else if (type === 'letters') {
      const nextLetter = getRandomLetter()
      currentLetterRef.current = nextLetter
      setCurrentLetter(nextLetter)
    } else if (type === 'words') {
      const nextWord = getRandomWord(wordLength)
      currentWordRef.current = nextWord
      setCurrentWord(nextWord)
    } else if (type === 'animals') {
      const nextAnimal = getRandomAnimal()
      currentAnimalRef.current = nextAnimal
      setCurrentAnimal(nextAnimal)
    }
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

  const showDot =
    session.started && (session.isPlaying || session.isPaused)

  return (
    <GameShell
      title="Sacádicos"
      hint={
        stimulusType === 'animals'
          ? 'Salta la mirada y nombra al animal en voz alta'
          : stimulusType === 'words'
          ? 'Salta la mirada y lee la palabra en voz alta'
          : stimulusType === 'letters'
          ? 'Salta la mirada y di la letra en voz alta'
          : stimulusType === 'colors'
          ? 'Salta la mirada y di el color en voz alta'
          : 'Salta la mirada de un punto a otro'
      }
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
      extraControls={
        <>
          <StimulusGrid
            value={stimulusType}
            disabled={!session.isIdle}
            onChange={handleStimulusChange}
          />

          {stimulusType === 'letters' && (
            <OptionPicker
              id="sacade-letter-size"
              label="Tamaño de letra"
              value={letterSize}
              options={LETTER_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={setLetterSize}
            />
          )}

          {stimulusType === 'words' && (
            <>
              <OptionPicker
                id="sacade-word-size"
                label="Tamaño de palabra"
                value={wordSize}
                options={WORD_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={setWordSize}
              />
              <OptionPicker
                id="sacade-word-length"
                label="Longitud de palabra"
                value={wordLength}
                options={WORD_LENGTH_OPTIONS}
                disabled={!session.isIdle}
                onChange={(val) => {
                  setWordLength(val)
                  setCurrentWord(getRandomWord(val))
                }}
              />
            </>
          )}

          {stimulusType === 'animals' && (
            <OptionPicker
              id="sacade-animal-size"
              label="Tamaño de animal"
              value={animalSize}
              options={ANIMAL_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={setAnimalSize}
            />
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
          wordSize={wordSize}
          animal={currentAnimal}
          animalSize={animalSize}
          isPaused={session.isPaused}
          stimulusType={stimulusType}
        />
      )}
    </GameShell>
  )
}

