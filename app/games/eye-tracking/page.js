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
  animals: 'Sigue los animales con la mirada sin mover la cabeza y nómbralo en voz alta cada vez que cambie.',
  fruits: 'Sigue la fruta con la mirada sin mover la cabeza y nómbrala en voz alta cada vez que cambie.',
  words: 'Sigue la palabra con la vista sin mover la cabeza y léela en voz alta cada vez que cambie.',
  numbers: 'Sigue el número con la mirada sin mover la cabeza y dilo en voz alta cada vez que cambie.',
  arrows: 'Sigue la flecha con los ojos sin mover la cabeza e indica su dirección en voz alta cada vez que cambie.',
  letters: 'Sigue la letra con la mirada sin mover la cabeza y nómbrala en voz alta cada vez que cambie.',
  colors: 'Sigue el punto con los ojos sin mover la cabeza y di el color activo en voz alta cada vez que cambie.',
  classic: 'Sigue el punto con la mirada sin mover la cabeza.',
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
      } else if (type === 'numbers') {
        targetInterval = stim.refs.numberIntervalRef.current
      } else if (type === 'arrows') {
        targetInterval = stim.refs.arrowIntervalRef.current
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
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          disabled={!session.isIdle}
          onChange={(val) => {
            resetTimers()
            stimulus.handleStimulusChange(val)
          }}
        />
      }
      extraControls={
        hasStimulusExtras(stimulus.stimulusType, true)
          ? <StimulusExtraControls stimulus={stimulus} disabled={!session.isIdle} prefix="tracking" showIntervals />
          : null
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
