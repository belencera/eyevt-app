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
  isIllustrationCategory,
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

export default function EyeTrackingGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [speed, setSpeed] = useState(20)

  const stimulus = useStimulusManager('classic')
  const stimulusRef = useRef(stimulus)
  useEffect(() => {
    stimulusRef.current = stimulus
  }, [stimulus])

  const positionRef = useRef({ x: 50, y: 50 })
  const velocityRef = useRef(randomVelocity(20))
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
      } else if (isIllustrationCategory(type)) {
        targetInterval = stim.refs.illustrationIntervalRef.current
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

  // ── Atajos de Teclado durante la partida ──
  useEffect(() => {
    if (!session.started) return

    const handleKeyDown = (e) => {
      // Espacio: Pausar y reanudar
      if (e.code === 'Space') {
        e.preventDefault()
        session.handleTogglePause()
        return
      }

      // Tecla R: Reiniciar
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        session.handleReset()
        return
      }

      // Flechas Arriba / Abajo: Modificar tamaño del estímulo
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        stimulus.increaseSize()
        return
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        stimulus.decreaseSize()
        return
      }

      if (session.isPaused) return

      if (e.key === 'ArrowLeft' || e.key === '-') {
        e.preventDefault()
        setSpeed((prev) => Math.max(1, prev - 1))
      } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
        e.preventDefault()
        setSpeed((prev) => Math.min(50, prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [session.started, session.isPaused, session.handleTogglePause, session.handleReset])

  const showDot = session.started && (session.isPlaying || session.isPaused)

  return (
    <GameShell
      title="Seguimientos"
      hint="Seguir el estímulo con la mirada sin mover la cabeza."
      session={session}
      speedControl={{
        id: 'speed',
        label: 'Velocidad',
        value: speed,
        min: 1,
        max: 50,
        step: 1,
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
      shortcuts={[
        { keys: ['←', '→'], label: 'Velocidad' },
        { keys: ['↑', '↓'], label: 'Tamaño del estímulo' },
        { keys: ['Espacio'], label: 'Pausar y reanudar' },
        { keys: ['R'], label: 'Reiniciar' },
      ]}
      shortcutsHint="Inicio: Vel. 28"
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
