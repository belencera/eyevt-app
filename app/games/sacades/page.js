'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GameShell,
  StimulusDot,
  StimulusGrid,
  StimulusExtraControls,
  hasStimulusExtras,
  useGameSession,
  useStimulusManager,
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
      extraControls={
        hasStimulusExtras(stimulus.stimulusType)
          ? <StimulusExtraControls stimulus={stimulus} disabled={!session.isIdle} prefix="sacade" />
          : null
      }
    >
      {showDot && (
        <StimulusDot
          position={position}
          stimulus={stimulus}
          isPaused={session.isPaused}
        />
      )}
    </GameShell>
  )
}
