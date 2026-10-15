'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GameShell,
  StimulusDot,
  StimulusGrid,
  StimulusExtraControls,
  useGameSession,
  useStimulusManager,
  useTimers,
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

  const timers = useTimers()

  const session = useGameSession({
    onReset: () => {
      timers.clearAll()
      stimulusRef.current.resetStimulus()
    },
    onEnd: timers.clearAll,
  })

  // Control del intervalo de rotación del estímulo durante el ejercicio
  useEffect(() => {
    timers.clearAll()
    // En modo 'classic', el punto permanece fijo sin necesidad de rotación
    if (session.isPlaying && !session.isPaused && stimulus.stimulusType !== 'classic') {
      timers.setRepeat(() => {
        stimulusRef.current.nextStimulus()
      }, changeInterval * 1000)
    }
    return () => timers.clearAll()
  }, [session.isPlaying, session.isPaused, changeInterval, stimulus.stimulusType, timers])

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
            timers.clearAll()
            stimulus.handleStimulusChange(val)
          }}
        />
      }
      extraControls={
        <StimulusExtraControls stimulus={stimulus} disabled={!session.isIdle} prefix="fixation" />
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
