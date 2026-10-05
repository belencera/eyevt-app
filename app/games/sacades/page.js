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
  CADENCE_STEPS,
} from '../_shared'

const MIN = 2
const MAX = 98

function randomPosition() {
  return {
    x: Math.random() * (MAX - MIN) + MIN,
    y: Math.random() * (MAX - MIN) + MIN,
  }
}

function intervalToMs(sec) {
  return Math.round(sec * 1000)
}

export default function SacadesGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [jumpInterval, setJumpInterval] = useState(0.7)
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
    intervalRef.current = setInterval(jumpToRandom, intervalToMs(jumpInterval))
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

  // Actualizar intervalo en caliente al variar el tiempo durante el juego
  useEffect(() => {
    if (session.isPlaying && !session.isPaused) {
      clearJumpInterval()
      intervalRef.current = setInterval(jumpToRandom, intervalToMs(jumpInterval))
    }
  }, [jumpInterval, session.isPlaying, session.isPaused])

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
        setJumpInterval((prev) => {
          const idx = CADENCE_STEPS.indexOf(prev)
          return idx > 0 ? CADENCE_STEPS[idx - 1] : CADENCE_STEPS[0]
        })
      } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
        e.preventDefault()
        setJumpInterval((prev) => {
          const idx = CADENCE_STEPS.indexOf(prev)
          return idx < CADENCE_STEPS.length - 1 ? CADENCE_STEPS[idx + 1] : CADENCE_STEPS[CADENCE_STEPS.length - 1]
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [session.started, session.isPaused, session.handleTogglePause, session.handleReset])

  const showDot = session.started && (session.isPlaying || session.isPaused)

  return (
    <GameShell
      title="Sacádicos"
      hint="Mover los ojos con precisión hacia el estímulo sin mover la cabeza."
      session={session}
      speedControl={{
        id: 'sacade-interval',
        label: 'Tiempo entre saltos',
        value: jumpInterval,
        steps: CADENCE_STEPS,
        unit: ' s',
        disabled: !session.isIdle,
        onChange: setJumpInterval,
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
      shortcuts={[
        { keys: ['←', '→'], label: 'Velocidad de salto' },
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
