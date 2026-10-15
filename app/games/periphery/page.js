'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GameShell,
  ModeSelector,
  OptionPicker,
  SessionSummary,
  StimulusDot,
  StimulusGrid,
  StimulusExtraControls,
  useGameSession,
  useStimulusManager,
  useTimers,
  PERIPHERY_MODES,
  DISTANCE_OPTIONS,
  CADENCE_STEPS,
  getRandomPeripheralPosition,
  IconClick,
  IconTarget,
} from '../_shared'

const PERIPHERY_HINT =
  'Mantener la mirada fija en el punto central y percibir los estímulos del campo visual periférico'

const MODE_DESCRIPTIONS = {
  'name-and-tap': 'Decir en voz alta el centro y hacer clic en los puntos de alrededor',
  'central-focus': 'Identificar el estímulo que aparece en la periferia manteniendo la mirada en el punto central',
}

const MODE_ICONS = {
  click: <IconClick />,
  target: <IconTarget />,
}

const MODE_OPTIONS = PERIPHERY_MODES.map((m) => ({ ...m, icon: MODE_ICONS[m.icon] }))

export default function PeripheryGame() {
  const [mode, setMode] = useState('name-and-tap') // 'name-and-tap' | 'central-focus'
  const [distance, setDistance] = useState('medium') // 'close' | 'medium' | 'far' | 'random'
  const [cadence, setCadence] = useState(3) // Segundos entre rotaciones del estímulo
  const [hits, setHits] = useState(0) // Contador de toques acertados
  const [showSummary, setShowSummary] = useState(false) // Pantalla final de aciertos antes de volver al menú
  const [finalScore, setFinalScore] = useState(0)
  const [peripheralPos, setPeripheralPos] = useState({ x: 30, y: 30 })
  const [hitRipple, setHitRipple] = useState(null)

  const stimulus = useStimulusManager('numbers')

  // Refs síncronas para bucles y temporizadores libres de stale-closures
  const modeRef = useRef(mode)
  const distanceRef = useRef(distance)
  const cadenceRef = useRef(cadence)
  const timers = useTimers()
  const stimulusRef = useRef(stimulus)
  const hitsRef = useRef(hits)

  useEffect(() => {
    modeRef.current = mode
    distanceRef.current = distance
    cadenceRef.current = cadence
    stimulusRef.current = stimulus
    hitsRef.current = hits
  }, [mode, distance, cadence, stimulus, hits])

  // Siguiente ciclo del juego según el modo seleccionado
  const stepCycle = useCallback(() => {
    const currentMode = modeRef.current

    if (currentMode === 'central-focus') {
      // En Foco Central: el centro queda fijo y la periferia cambia de posición y de estímulo
      const newPos = getRandomPeripheralPosition(distanceRef.current)
      setPeripheralPos(newPos)
      stimulusRef.current.nextStimulus()
    } else {
      // En Nombra y Pulsa: el punto periférico NO se mueve por temporizador (solo al pulsar).
      // El temporizador de cadencia únicamente rota el estímulo central para que el paciente siga verbalizando.
      stimulusRef.current.nextStimulus()
    }
  }, [])

  // Iniciar temporizador de cadencia
  const startCadenceTimer = useCallback(() => {
    timers.clearAll()
    timers.setRepeat(stepCycle, cadenceRef.current * 1000)
  }, [timers, stepCycle])

  // Acción al pulsar el punto periférico en el modo interactivo (Nombra y Pulsa)
  const handleTapTarget = useCallback((e) => {
    e.stopPropagation()
    setHits((prev) => {
      const next = prev + 1
      hitsRef.current = next
      return next
    })

    // Efecto visual de onda de acierto
    setHitRipple({ x: peripheralPos.x, y: peripheralPos.y, id: Date.now() })
    setTimeout(() => {
      setHitRipple(null)
    }, 450)

    // En Nombra y Pulsa: el punto SOLO se mueve cuando el paciente ha pulsado
    const newPos = getRandomPeripheralPosition(distanceRef.current)
    setPeripheralPos(newPos)
  }, [peripheralPos, distanceRef])

  // Reiniciar ejercicio
  const resetGame = useCallback(() => {
    timers.clearAll()
    setHits(0)
    hitsRef.current = 0
    setHitRipple(null)
    stimulus.resetStimulus()
    setPeripheralPos(getRandomPeripheralPosition(distanceRef.current))
  }, [timers, stimulus])

  // Salir del resumen y volver al menú de opciones
  const handleDismissSummary = useCallback(() => {
    setShowSummary(false)
    resetGame()
  }, [resetGame])

  const session = useGameSession({
    onBeginPlay: () => {
      setHits(0)
      hitsRef.current = 0
      setShowSummary(false)
      setPeripheralPos(getRandomPeripheralPosition(distanceRef.current))
      stimulus.nextStimulus()
      startCadenceTimer()
    },
    onPause: timers.clearAll,
    onResume: startCadenceTimer,
    onReset: resetGame,
    onEnd: () => {
      timers.clearAll()
      if (modeRef.current === 'name-and-tap') {
        setFinalScore(hitsRef.current)
        setShowSummary(true)
      }
    },
  })

  // Interceptar el botón de reinicio durante la partida en modo pulsar para mostrar el total antes de salir
  const handleStopOrReset = useCallback(() => {
    if (modeRef.current === 'name-and-tap' && session.started) {
      setFinalScore(hitsRef.current)
      setShowSummary(true)
      timers.clearAll()
      session.handleReset()
    } else {
      session.handleReset()
    }
  }, [timers, session])

  const shellSession = {
    ...session,
    handleReset: handleStopOrReset,
  }

  // Empezar otra sesión desde el resumen con la misma configuración
  const handleRestartFromSummary = useCallback(() => {
    setShowSummary(false)
    session.handleStart()
  }, [session])

  const isPlayingOrPaused = session.started && (session.isPlaying || session.isPaused)
  const distanceLabel =
    DISTANCE_OPTIONS.find((d) => d.value === distance)?.label ?? 'Media'

  // Controles de estímulo específicos: tamaño + intervalo de color (caso especial de Periferia)
  const buildExtraControls = () => {
    return (
      <StimulusExtraControls
        stimulus={stimulus}
        disabled={!session.isIdle}
        prefix="periphery"
      />
    )
  }

  return (
    <GameShell
      title="Periferia"
      hint={PERIPHERY_HINT}
      session={shellSession}
      stimulus={stimulus}
      speedControl={{
        id: 'periphery-cadence',
        label: 'Tiempo de cambio',
        value: cadence,
        steps: CADENCE_STEPS,
        unit: ' s',
        disabled: !session.isIdle,
        onChange: setCadence,
      }}
      stimulusGrid={
        <StimulusGrid
          value={stimulus.stimulusType}
          disabled={!session.isIdle}
          onChange={stimulus.handleStimulusChange}
        />
      }
      gameControls={
        <>
          <ModeSelector
            id="periphery-mode"
            label="Modo de juego"
            description={MODE_DESCRIPTIONS[mode]}
            value={mode}
            options={MODE_OPTIONS}
            disabled={!session.isIdle}
            onChange={(value) => {
              setMode(value)
              resetGame()
            }}
          />

          {/* Distancia al centro (Cercana, Media, Lejana, Aleatoria) */}
          <OptionPicker
            id="periphery-distance"
            label="Distancia al centro"
            value={distance}
            options={DISTANCE_OPTIONS}
            disabled={!session.isIdle}
            onChange={setDistance}
          />
        </>
      }
      extraControls={buildExtraControls()}
    >
      {/* Contador flotante de aciertos visible en la pantalla de juego durante la partida */}
      {session.started && mode === 'name-and-tap' && (
        <div className="floatingHitsHud" aria-live="polite">
          <span className="floatingHitsIcon">🎯</span>
          <span className="floatingHitsLabel">Aciertos:</span>
          <span className="floatingHitsValue">{hits}</span>
        </div>
      )}

      {isPlayingOrPaused && (
        <>
          {/* MODO 1: NOMBRA Y PULSA */}
          {mode === 'name-and-tap' && (
            <>
              {/* Estímulo central cambiante en el centro exacto (50%, 50%) para nombrar en alto */}
              <StimulusDot
                position={{ x: 50, y: 50 }}
                stimulus={stimulus}
                isPaused={session.isPaused}
              />

              {/* Punto táctil periférico interactivo: SOLO se mueve cuando el paciente lo pulsa */}
              <button
                type="button"
                className="peripheralTapTarget"
                style={{
                  left: `${peripheralPos.x}%`,
                  top: `${peripheralPos.y}%`,
                }}
                onClick={handleTapTarget}
                aria-label="Punto periférico a pulsar"
                title="Pulsa aquí"
              >
                <span className="peripheralTapCore" />
              </button>

              {/* Efecto visual de onda de acierto */}
              {hitRipple && (
                <span
                  key={hitRipple.id}
                  className="peripheralHitRipple"
                  style={{
                    left: `${hitRipple.x}%`,
                    top: `${hitRipple.y}%`,
                  }}
                />
              )}
            </>
          )}

          {/* MODO 2: FOCO CENTRAL */}
          {mode === 'central-focus' && (
            <>
              {/* Punto de fijación permanente en el centro con aura concéntrica */}
              <div className="centralFixationPoint" aria-hidden>
                <div className="centralFixationRing" />
                <div className="centralFixationDot" />
              </div>

              {/* Estímulo rotatorio en la periferia para identificar con visión periférica */}
              <StimulusDot
                position={peripheralPos}
                stimulus={stimulus}
                isPaused={session.isPaused}
              />
            </>
          )}
        </>
      )}

      {/* Pantalla de resultado final de aciertos en modo pulsar estilo cuenta atrás */}
      <SessionSummary
        open={showSummary}
        headline={{ value: finalScore, label: finalScore === 1 ? 'acierto' : 'aciertos' }}
        stats={[
          { label: 'Velocidad de cambio', value: `${cadence} s` },
          { label: 'Distancia', value: distanceLabel },
        ]}
        onRestart={handleRestartFromSummary}
        onExit={handleDismissSummary}
        exitLabel="Volver al menú"
        dismissOnBackdrop
      />
    </GameShell>
  )
}
