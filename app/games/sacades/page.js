'use client'

import { useEffect, useRef, useState } from 'react'
import { GameShell } from '../_shared/GameShell'
import { StimulusDot } from '../_shared/StimulusDot'
import { StimulusGrid } from '../_shared/StimulusGrid'
import { useGameSession } from '../_shared/useGameSession'
import { getRandomColor } from '../_shared/constants'

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

  const intervalRef = useRef(null)
  const currentColorRef = useRef(currentColor)
  const stimulusTypeRef = useRef(stimulusType)

  useEffect(() => {
    stimulusTypeRef.current = stimulusType
    currentColorRef.current = currentColor
  }, [stimulusType, currentColor])

  const clearJumpInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const jumpToRandom = () => {
    setPosition(randomPosition())

    // En sacádicos, cada vez que cambia de posición sale un color aleatorio
    if (stimulusTypeRef.current === 'colors') {
      const nextColor = getRandomColor(currentColorRef.current)
      currentColorRef.current = nextColor
      setCurrentColor(nextColor)
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
    setPosition({ x: 50, y: 50 })
  }

  const handleStimulusChange = (type) => {
    setStimulusType(type)
    if (type === 'classic') {
      setCurrentColor({ name: 'Celeste', hex: '#38bdf8' })
    } else if (type === 'colors') {
      setCurrentColor(getRandomColor())
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
        stimulusType === 'colors'
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
        </>
      }
    >
      {showDot && (
        <StimulusDot
          position={position}
          color={currentColor}
          isPaused={session.isPaused}
          stimulusType={stimulusType}
        />
      )}
    </GameShell>
  )
}

