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
  isIllustrationCategory,
  getIllustrationHint,
} from '../_shared'

const HINTS = {
  animals: 'Mantén la mirada fija en el centro y nombra al animal en voz alta cada vez que cambie.',
  fruits: 'Mantén la mirada fija en el centro y nombra la fruta en voz alta cada vez que cambie.',
  food: 'Mantén la mirada fija en el centro y nombra la comida en voz alta cada vez que cambie.',
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
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        stimulus.decreaseSize()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [session.started, session.handleTogglePause, session.handleReset])

  // Visibilidad del estímulo en pantalla
  const showDot =
    !session.isIdle ||
    stimulus.stimulusType === 'classic' ||
    stimulus.stimulusType === 'colors' ||
    stimulus.stimulusType === 'letters' ||
    stimulus.stimulusType === 'words' ||
    stimulus.stimulusType === 'numbers' ||
    stimulus.stimulusType === 'arrows' ||
    isIllustrationCategory(stimulus.stimulusType)

  return (
    <GameShell
      title="Fijación"
      hint={getIllustrationHint('fixation', stimulus.stimulusType) || HINTS[stimulus.stimulusType] || HINTS.classic}
      session={session}
      speedControl={{
        id: 'change-interval',
        label: 'Tiempo de cambio',
        value: changeInterval,
        steps: CADENCE_STEPS,
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
      extraControls={
        hasStimulusExtras(stimulus.stimulusType)
          ? <StimulusExtraControls stimulus={stimulus} disabled={!session.isIdle} prefix="fixation" />
          : null
      }
      shortcuts={[
        { keys: ['Espacio'], label: 'Pausar y reanudar' },
        { keys: ['R'], label: 'Reiniciar' },
        { keys: ['↑', '↓'], label: 'Tamaño del estímulo' },
      ]}
    >
      {showDot && (
        <StimulusDot
          position={CENTER_POSITION}
          stimulus={stimulus}
          isPaused={session.isPaused}
        />
      )}
    </GameShell>
  )
}
