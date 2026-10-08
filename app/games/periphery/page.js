'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GameShell,
  OptionPicker,
  StimulusDot,
  StimulusGrid,
  StimulusExtraControls,
  useGameSession,
  useStimulusManager,
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
  const timerRef = useRef(null)
  const stimulusRef = useRef(stimulus)
  const hitsRef = useRef(hits)

  useEffect(() => {
    modeRef.current = mode
    distanceRef.current = distance
    cadenceRef.current = cadence
    stimulusRef.current = stimulus
    hitsRef.current = hits
  }, [mode, distance, cadence, stimulus, hits])

  // Despejar temporizador de cadencia
  const clearCadenceTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

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
    clearCadenceTimer()
    timerRef.current = setInterval(() => {
      stepCycle()
    }, cadenceRef.current * 1000)
  }, [clearCadenceTimer, stepCycle])

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
    clearCadenceTimer()
    setHits(0)
    hitsRef.current = 0
    setHitRipple(null)
    stimulus.resetStimulus()
    setPeripheralPos(getRandomPeripheralPosition(distanceRef.current))
  }, [clearCadenceTimer, stimulus])

  // Salir del resumen y volver al menú de opciones
  const handleDismissSummary = useCallback(() => {
    setShowSummary(false)
    resetGame()
  }, [resetGame])

  useEffect(() => {
    if (!showSummary) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        handleDismissSummary()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSummary, handleDismissSummary])

  const session = useGameSession({
    onBeginPlay: () => {
      setHits(0)
      hitsRef.current = 0
      setShowSummary(false)
      setPeripheralPos(getRandomPeripheralPosition(distanceRef.current))
      stimulus.nextStimulus()
      startCadenceTimer()
    },
    onPause: clearCadenceTimer,
    onResume: startCadenceTimer,
    onReset: resetGame,
    onEnd: () => {
      clearCadenceTimer()
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
      clearCadenceTimer()
      session.handleReset()
    } else {
      session.handleReset()
    }
  }, [clearCadenceTimer, session])

  const shellSession = {
    ...session,
    handleReset: handleStopOrReset,
  }

  useEffect(() => {
    return () => clearCadenceTimer()
  }, [clearCadenceTimer])

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
          {/* Selector de modo interactivo en cuadrícula idéntica a estímulos */}
          <div className="modeGridContainer">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span className="controlLabel" id="periphery-mode-label" style={{ marginBottom: 0 }}>
                Modo de juego
              </span>
              <span style={{ fontSize: '0.73rem', fontWeight: 500, color: '#94a3b8' }}>
                · {MODE_DESCRIPTIONS[mode]}
              </span>
            </div>
            <div
              className="modeGrid"
              role="radiogroup"
              aria-labelledby="periphery-mode-label"
            >
              {PERIPHERY_MODES.map((m) => {
                const isSelected = m.value === mode
                return (
                  <button
                    key={m.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!session.isIdle}
                    className={`modeCard ${isSelected ? 'modeCardActive' : ''}`}
                    onClick={() => {
                      if (session.isIdle) {
                        setMode(m.value)
                        resetGame()
                      }
                    }}
                    title={m.description}
                  >
                    <div className="modeCardIcon">
                      {m.icon === 'click' ? <IconClick /> : m.icon === 'target' ? <IconTarget /> : <span>{m.icon}</span>}
                    </div>
                    <span className="modeCardLabel">{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

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
      {showSummary && (
        <div
          className="peripherySummaryOverlay"
          onClick={handleDismissSummary}
          role="dialog"
          aria-modal="true"
          title="Pulsa para volver al menú de opciones"
        >
          <div
            className="peripherySummarySimple"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="peripherySummaryScoreGroup">
              <span className="peripherySummaryNumber">{finalScore}</span>
              <span className="peripherySummaryLabel">
                {finalScore === 1 ? 'acierto' : 'aciertos'}
              </span>
            </div>

            <div className="peripherySummaryMeta">
              <div className="peripherySummaryMetaItem">
                <span className="peripherySummaryMetaKey">Velocidad de cambio:</span>
                <span className="peripherySummaryMetaVal">{cadence} s</span>
              </div>
              <span className="peripherySummaryMetaDivider">•</span>
              <div className="peripherySummaryMetaItem">
                <span className="peripherySummaryMetaKey">Distancia:</span>
                <span className="peripherySummaryMetaVal">{distanceLabel}</span>
              </div>
            </div>

            <button
              type="button"
              className="peripherySummarySimpleBtn"
              onClick={handleDismissSummary}
              autoFocus
            >
              Volver al menú
            </button>
          </div>
        </div>
      )}
    </GameShell>
  )
}
