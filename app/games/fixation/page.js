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

  return (
    <GameShell
      title="Fijación"
      hint="Mantener la mirada fija en el estímulo central sin mover los ojos ni la cabeza."
      session={session}
      stimulus={stimulus}
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
    >
      <StimulusDot
        position={CENTER_POSITION}
        stimulus={stimulus}
        isPaused={session.isPaused}
      />
    </GameShell>
  )
}
