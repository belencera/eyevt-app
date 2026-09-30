'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GameShell,
  OptionPicker,
  StimulusDot,
  StimulusGrid,
  TherapistBadge,
  useGameSession,
  useStimulusManager,
  PERIPHERY_MODES,
  DISTANCE_OPTIONS,
  PERIPHERY_CADENCE_OPTIONS,
  getRandomPeripheralPosition,
  IconClick,
  COLOR_INTERVAL_OPTIONS,
  LETTER_SIZE_OPTIONS,
  WORD_SIZE_OPTIONS,
  WORD_LENGTH_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  FRUIT_SIZE_OPTIONS,
  NUMBER_SIZE_OPTIONS,
  NUMBER_DIGITS_OPTIONS,
  ARROW_SIZE_OPTIONS,
  getRandomWord,
  getRandomNumber,
} from '../_shared'

const HINTS = {
  'name-and-tap': 'Nombra el estímulo central en voz alta y pulsa los puntos que aparezcan alrededor',
  'central-focus': 'Mantén la mirada fija en el punto central e identifica lo que aparece en tu periferia',
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

  return (
    <GameShell
      title="Periferia"
      hint={HINTS[mode]}
      session={shellSession}
      speedControl={null}
      isFullscreen={session.started || session.isCountingDown || showSummary}
      extraControls={
        <>
          {/* Selector de modo interactivo en cuadrícula idéntica a estímulos */}
          <div className="modeGridContainer">
            <span className="controlLabel" id="periphery-mode-label">
              Modo de juego
            </span>
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
                      {m.icon === 'click' ? <IconClick /> : <span>{m.icon}</span>}
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

          {/* Cadencia de cambio de estímulo */}
          <OptionPicker
            id="periphery-cadence"
            label="Cadencia de cambio"
            value={cadence}
            options={PERIPHERY_CADENCE_OPTIONS}
            disabled={!session.isIdle}
            onChange={setCadence}
          />

          {/* Cuadrícula de selección de estímulo */}
          <StimulusGrid
            value={stimulus.stimulusType}
            disabled={!session.isIdle}
            onChange={stimulus.handleStimulusChange}
          />

          {stimulus.stimulusType === 'colors' && (
            <OptionPicker
              id="periphery-color-interval"
              label="Cambio de color"
              value={stimulus.colorInterval}
              options={COLOR_INTERVAL_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setColorInterval}
            />
          )}

          {stimulus.stimulusType === 'letters' && (
            <OptionPicker
              id="periphery-letter-size"
              label="Tamaño de letra"
              value={stimulus.letterSize}
              options={LETTER_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setLetterSize}
            />
          )}

          {stimulus.stimulusType === 'words' && (
            <>
              <OptionPicker
                id="periphery-word-size"
                label="Tamaño de palabra"
                value={stimulus.wordSize}
                options={WORD_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setWordSize}
              />
              <OptionPicker
                id="periphery-word-length"
                label="Longitud de palabra"
                value={stimulus.wordLength}
                options={WORD_LENGTH_OPTIONS}
                disabled={!session.isIdle}
                onChange={(val) => {
                  stimulus.setWordLength(val)
                  stimulus.setCurrentWord(getRandomWord(val))
                }}
              />
            </>
          )}

          {stimulus.stimulusType === 'numbers' && (
            <>
              <OptionPicker
                id="periphery-number-size"
                label="Tamaño de número"
                value={stimulus.numberSize}
                options={NUMBER_SIZE_OPTIONS}
                disabled={!session.isIdle}
                onChange={stimulus.setNumberSize}
              />
              <OptionPicker
                id="periphery-number-digits"
                label="Cifras"
                value={stimulus.numberDigits}
                options={NUMBER_DIGITS_OPTIONS}
                disabled={!session.isIdle}
                onChange={(val) => {
                  stimulus.setNumberDigits(val)
                  stimulus.setCurrentNumber(getRandomNumber(val))
                }}
              />
            </>
          )}

          {stimulus.stimulusType === 'arrows' && (
            <OptionPicker
              id="periphery-arrow-size"
              label="Tamaño de flecha"
              value={stimulus.arrowSize}
              options={ARROW_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setArrowSize}
            />
          )}

          {stimulus.stimulusType === 'animals' && (
            <OptionPicker
              id="periphery-animal-size"
              label="Tamaño de animal"
              value={stimulus.animalSize}
              options={ANIMAL_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setAnimalSize}
            />
          )}

          {stimulus.stimulusType === 'fruits' && (
            <OptionPicker
              id="periphery-fruit-size"
              label="Tamaño de fruta"
              value={stimulus.fruitSize}
              options={FRUIT_SIZE_OPTIONS}
              disabled={!session.isIdle}
              onChange={stimulus.setFruitSize}
            />
          )}

          {session.started && (
            <>
              {mode === 'name-and-tap' && (
                <div className="therapistHitsBadge" title="Puntos periféricos tocados con éxito">
                  <span className="therapistHitsLabel">Puntos pulsados</span>
                  <span className="therapistHitsValue">{hits}</span>
                </div>
              )}

              <TherapistBadge
                stimulusType={stimulus.stimulusType}
                color={stimulus.currentColor}
                letter={stimulus.currentLetter}
                word={stimulus.currentWord}
                number={stimulus.currentNumber}
                arrow={stimulus.currentArrow}
                animal={stimulus.currentAnimal}
                fruit={stimulus.currentFruit}
              />
            </>
          )}
        </>
      }
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
