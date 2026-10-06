'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GameShell,
  OptionPicker,
  useGameSession,
  DURATION_OPTIONS,
  IconPlay,
  IconPause,
  IconReset,
} from '../_shared'
import {
  STIMULI_CATEGORIES,
  STIMULI_PAIRS,
  CONVERGENCE_MODES,
} from './data/stimuliPairs'
import './convergence.css'

// ── Niveles de Velocidad Progresiva (Modo Movimiento) ──
// Comienza en velocidad muy baja (3.5 px/s) para facilitar la fusión inicial
// y progresa exponencialmente para un control gradual y amplio
const MOTION_SPEED_LEVELS = [
  { level: 1, pxPerSec: 3.5, label: 'Muy baja' },
  { level: 2, pxPerSec: 5.5, label: 'Baja' },
  { level: 3, pxPerSec: 8.5, label: 'Suave' },
  { level: 4, pxPerSec: 13, label: 'Moderada' },
  { level: 5, pxPerSec: 19, label: 'Media' },
]

function IconTriangleLeft() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <polygon
        points="16,5 7,12 16,19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconTriangleRight() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <polygon
        points="8,5 17,12 8,19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconMinus() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconModeFixed() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  )
}

function IconModeMotion() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 8l4 4-4 4" />
      <path d="M7 16l-4-4 4-4" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  )
}

function IconGauge() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
      <path d="m12 14 4-4" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
    </svg>
  )
}

export default function ConvergenceGame() {
  // ── Estados de Configuración ──
  const [selectedCategory, setSelectedCategory] = useState('percepcion-simultanea')
  const [selectedPairId, setSelectedPairId] = useState('cross')
  const [stimulusLetter, setStimulusLetter] = useState('E')
  const [stimulusWord, setStimulusWord] = useState('CASA')
  const [mode, setMode] = useState('fixed') // 'fixed' | 'motion'
  const [speed, setSpeed] = useState(1) // velocidad inicial muy baja (progresiva en partida)

  // ── Estados de Juego (Distancia y Tamaño continuos en píxeles) ──
  const [stimulusSize, setStimulusSize] = useState(76) // px (recorrido amplio de 36px a 160px)
  const [currentDistance, setCurrentDistance] = useState(140) // px
  const [motionActive, setMotionActive] = useState(false)

  // Referencias para el bucle de animación
  const currentDistanceRef = useRef(currentDistance)
  currentDistanceRef.current = currentDistance

  const speedRef = useRef(speed)
  speedRef.current = speed

  const motionActiveRef = useRef(motionActive)
  motionActiveRef.current = motionActive

  // Pareja de estímulos seleccionada
  const activePair =
    STIMULI_PAIRS.find((p) => p.id === selectedPairId) || STIMULI_PAIRS[0]

  // Parejas filtradas por categoría actual
  const categoryPairs = STIMULI_PAIRS.filter(
    (p) => p.category === selectedCategory
  )

  // Tamaño en píxeles del estímulo (recorrido continuo)
  const currentSizePx = stimulusSize

  // Reiniciar a valores iniciales estándar
  const resetToInitial = useCallback(() => {
    setCurrentDistance(140)
    setStimulusSize(76)
    setSpeed(1)
    setMotionActive(false)
  }, [])

  // ── Sesión de Juego ──
  const session = useGameSession({
    onStart: () => {
      resetToInitial()
    },
    onBeginPlay: () => {
      if (mode === 'motion') {
        setMotionActive(true)
      }
    },
    onResume: () => {
      if (mode === 'motion') {
        setMotionActive(true)
      }
    },
    onReset: () => {
      resetToInitial()
    },
    onPause: () => {
      setMotionActive(false)
    },
    onEnd: () => {
      setMotionActive(false)
    },
  })

  // Reiniciar durante la partida (en juego): mantiene o reactiva el movimiento desde 140 px a vel. 1
  const handleInGameReset = useCallback(() => {
    setCurrentDistance(140)
    setSpeed(1)
    if (session.isPlaying && !session.isPaused) {
      setMotionActive(true)
    }
  }, [session.isPlaying, session.isPaused])

  // Cambiar automáticamente al primer estímulo de la categoría si el actual no pertenece a ella
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    const firstOfCategory = STIMULI_PAIRS.find((p) => p.category === catId)
    if (firstOfCategory) {
      setSelectedPairId(firstOfCategory.id)
    }
  }

  // ── Ajuste de Distancia (Paso de 10 px) ──
  const adjustDistance = useCallback((delta) => {
    setCurrentDistance((prev) => {
      const maxDist = typeof window !== 'undefined' ? window.innerWidth - 120 : 600
      const next = prev + delta
      return Math.max(30, Math.min(next, maxDist))
    })
  }, [])

  // ── Ajuste de Tamaño Continuo (Paso suave de 4 px, rango 36 px a 680 px) ──
  const adjustSize = useCallback((delta) => {
    setStimulusSize((prev) => {
      const next = prev + delta
      return Math.max(36, Math.min(next, 680))
    })
  }, [])

  // ── Ajuste de Velocidad Progresiva (Modo Movimiento) ──
  const adjustSpeed = useCallback((delta) => {
    setSpeed((prev) => Math.max(1, Math.min(prev + delta, MOTION_SPEED_LEVELS.length)))
  }, [])

  const toggleMotionPlay = useCallback(() => {
    if (session.isPlaying && !session.isPaused) {
      setMotionActive((prev) => !prev)
    }
  }, [session.isPlaying, session.isPaused])

  // ── Bucle de Animación de Alejamiento en Modo Movimiento ──
  useEffect(() => {
    if (mode !== 'motion' || !session.isPlaying || session.isPaused || !motionActive) {
      return
    }

    let frameId
    let lastTime = performance.now()

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      const maxDist = typeof window !== 'undefined' ? window.innerWidth - 120 : 600
      const currentLevel = Math.max(1, Math.min(speedRef.current, MOTION_SPEED_LEVELS.length))
      const basePxPerSec = MOTION_SPEED_LEVELS[currentLevel - 1].pxPerSec

      // Aceleración progresiva suave con la distancia recorrida desde el punto inicial (140 px)
      const distTraveled = Math.max(0, currentDistanceRef.current - 140)
      const progressiveMultiplier = 1 + Math.min(distTraveled / 400, 1) * 0.5
      const effectiveSpeed = basePxPerSec * progressiveMultiplier

      const nextDist = currentDistanceRef.current + effectiveSpeed * dt

      if (nextDist >= maxDist) {
        setCurrentDistance(maxDist)
        setMotionActive(false)
      } else {
        setCurrentDistance(nextDist)
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [mode, session.isPlaying, session.isPaused, motionActive])

  // ── Atajos de Teclado en la Zona de Juego ──
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
        if (mode === 'fixed') {
          resetToInitial()
        } else {
          handleInGameReset()
        }
        return
      }

      // Si está en pausa, no modificar tamaño ni distancia
      if (session.isPaused) return

      // Ajuste de tamaño continuo común para ambos modos con flechas vertical
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        adjustSize(4)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        adjustSize(-4)
        return
      }

      if (mode === 'fixed') {
        if (e.key === 'ArrowLeft' || e.key === '-') {
          e.preventDefault()
          adjustDistance(-4)
        } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
          e.preventDefault()
          adjustDistance(4)
        }
      } else if (mode === 'motion') {
        if (e.key === 'ArrowLeft' || e.key === '-') {
          e.preventDefault()
          adjustSpeed(-1)
        } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
          e.preventDefault()
          adjustSpeed(1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [session.started, session.isPaused, session.handleTogglePause, mode, adjustDistance, adjustSpeed, adjustSize, resetToInitial, handleInGameReset])

  // ── Selector de Estímulos (Columna 1 · Izquierda) ──
  const stimulusSelector = (
    <div>
      {/* Píldoras de Categoría */}
      <div className="convCategoryPills" role="tablist">
        {STIMULI_CATEGORIES.map((cat) => {
          const isActive = cat.id === selectedCategory
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`convCategoryPill ${isActive ? 'convCategoryPillActive' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
              disabled={!session.isIdle}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Cuadrícula de Parejas Disponibles */}
      <div className="convPairsGrid">
        {categoryPairs.length > 0 ? (
          categoryPairs.map((pair) => {
            const isSelected = pair.id === selectedPairId
            return (
              <div
                key={pair.id}
                role="button"
                tabIndex={0}
                className={`convPairCard ${isSelected ? 'convPairCardActive' : ''}`}
                onClick={() => {
                  if (session.isIdle) {
                    setSelectedPairId(pair.id)
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && session.isIdle) {
                    setSelectedPairId(pair.id)
                  }
                }}
              >
                <div className="convPairPreview">
                  {pair.renderPreview ? pair.renderPreview(38, pair.isDynamicWord ? stimulusWord : stimulusLetter) : null}
                </div>
                <span className="convPairName">{pair.name}</span>
              </div>
            )
          })
        ) : (
          <div className="dashNoExtras" style={{ gridColumn: '1 / -1' }}>
            <p className="dashNoExtrasText">
              Próximamente
            </p>
          </div>
        )}
      </div>
    </div>
  )

  // ── Configuración (Columna 2 · Derecha) ──
  const gameControls = (
    <div>
      <div className="modeGridContainer">
        <div className="convModeHeader">
          <span className="controlLabel" id="conv-mode-label">
            Modo de ejercicio
          </span>
          <span className="convModeSubtext">
            {mode === 'fixed'
              ? 'Distancia constante entre estímulos'
              : 'Los estímulos se separan lentamente'}
          </span>
        </div>
        <div
          className="modeGrid"
          role="radiogroup"
          aria-labelledby="conv-mode-label"
        >
          {CONVERGENCE_MODES.map((m) => {
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
                  }
                }}
                title={m.description}
              >
                <div className="modeCardIcon">
                  {m.value === 'fixed' ? <IconModeFixed /> : <IconModeMotion />}
                </div>
                <span className="modeCardLabel">{m.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  // ── Ajustes Adicionales (Debajo de Duración de la sesión) ──
  const PRESET_LETTERS = ['E', 'A', 'O', 'X']
  const PRESET_WORDS = ['CASA', 'LUNA', 'LUZ']

  const extraControls = activePair.isDynamicLetter ? (
    <div className="dashDurationBlock">
      <span className="controlLabel" id="conv-letter-label">
        Letra del estímulo
      </span>
      <div
        className="durationRow"
        role="radiogroup"
        aria-labelledby="conv-letter-label"
      >
        {PRESET_LETTERS.map((char) => {
          const isSelected = stimulusLetter === char
          return (
            <button
              key={char}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={!session.isIdle}
              className={`dashPillBtn ${isSelected ? 'dashPillBtnActive' : ''}`}
              onClick={() => setStimulusLetter(char)}
              title={`Elegir letra ${char}`}
            >
              {char}
            </button>
          )
        })}

        <div
          className={`dashPillBtn convLetterInputPill ${
            !PRESET_LETTERS.includes(stimulusLetter) ? 'dashPillBtnActive' : ''
          }`}
          onClick={() => {
            const el = document.getElementById('custom-letter-input')
            if (el) el.focus()
          }}
        >
          <label htmlFor="custom-letter-input" className="convLetterInputPillLabel">
            Escribir:
          </label>
          <input
            id="custom-letter-input"
            type="text"
            maxLength={2}
            value={stimulusLetter}
            onChange={(e) => {
              const char = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1)
              if (char) {
                setStimulusLetter(char)
              }
            }}
            onFocus={(e) => e.target.select()}
            className="convLetterInlineInput"
            placeholder="E"
            title="Haz clic para escribir cualquier letra o número"
            disabled={!session.isIdle}
          />
        </div>
      </div>
    </div>
  ) : activePair.isDynamicWord ? (
    <div className="dashDurationBlock">
      <span className="controlLabel" id="conv-word-label">
        Palabra del estímulo
      </span>
      <div
        className="durationRow"
        role="radiogroup"
        aria-labelledby="conv-word-label"
      >
        {PRESET_WORDS.map((w) => {
          const isSelected = stimulusWord === w
          return (
            <button
              key={w}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={!session.isIdle}
              className={`dashPillBtn ${isSelected ? 'dashPillBtnActive' : ''}`}
              onClick={() => setStimulusWord(w)}
              title={`Elegir palabra ${w}`}
            >
              {w}
            </button>
          )
        })}

        <div
          className={`dashPillBtn convWordInputPill ${
            !PRESET_WORDS.includes(stimulusWord) ? 'dashPillBtnActive' : ''
          }`}
          onClick={() => {
            const el = document.getElementById('custom-word-input')
            if (el) el.focus()
          }}
        >
          <label htmlFor="custom-word-input" className="convLetterInputPillLabel">
            Escribir:
          </label>
          <input
            id="custom-word-input"
            type="text"
            maxLength={8}
            value={stimulusWord}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '').toUpperCase()
              if (val) {
                setStimulusWord(val)
              }
            }}
            onFocus={(e) => e.target.select()}
            className="convWordInlineInput"
            placeholder="CASA"
            title="Haz clic para escribir cualquier palabra"
            disabled={!session.isIdle}
          />
        </div>
      </div>
    </div>
  ) : null

  // ── Atajos de Teclado (Fila Inferior · Ancho completo) ──
  const shortcuts = [
    { keys: ['↑', '↓'], label: 'Tamaño' },
    { keys: ['←', '→'], label: mode === 'fixed' ? 'Separación' : 'Velocidad' },
    { keys: ['Espacio'], label: 'Pausar y reanudar' },
    { keys: ['R'], label: 'Reiniciar' },
  ]

  return (
    <GameShell
      title="Convergencia"
      hint="Converge hasta fusionar los dos estímulos en una única imagen central nítida."
      session={session}
      split="wide"
      stimulusGrid={stimulusSelector}
      gameControls={gameControls}
      extraControls={extraControls}
      shortcuts={shortcuts}
      shortcutsHint={
        mode === 'fixed'
          ? 'Inicio: 140 px · 76 px'
          : 'Inicio: 140 px · 76 px · Vel. baja progresiva'
      }
      startDisabled={categoryPairs.length === 0}
    >
      {/* ── Zona de Juego Inmersiva ── */}
      <div className="convergenceArena">
        <div className="convergenceTrack">
          {/* Estímulo Ojo Izquierdo */}
          <div
            className={`stimulusWrapper ${mode === 'fixed' || !motionActive ? 'stimulusWrapperSmooth' : ''}`}
            style={{
              transform: `translateX(-${currentDistance / 2}px) translate(-50%, -50%)`,
            }}
          >
            {activePair.renderLeft
              ? activePair.renderLeft(currentSizePx, activePair.isDynamicWord ? stimulusWord : stimulusLetter)
              : null}
          </div>

          {/* Estímulo Ojo Derecho */}
          <div
            className={`stimulusWrapper ${mode === 'fixed' || !motionActive ? 'stimulusWrapperSmooth' : ''}`}
            style={{
              transform: `translateX(${currentDistance / 2}px) translate(-50%, -50%)`,
            }}
          >
            {activePair.renderRight
              ? activePair.renderRight(currentSizePx, activePair.isDynamicWord ? stimulusWord : stimulusLetter)
              : null}
          </div>
        </div>

        {/* ── Barra de Controles en Juego (Inferior Flotante Limpia) ── */}
        {session.started && (
          <div className="convInGameBar">
            <div className="convControlPill">
              {mode === 'fixed' ? (
                <>
                  {/* Flecha Triangular Izquierda: Acercar estímulos */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustDistance(-4)}
                    title="Acercar estímulos (Flecha Izquierda o -)"
                    aria-label="Acercar estímulos"
                  >
                    <IconTriangleLeft />
                  </button>

                  <span className="convDistanceBadge">
                    {Math.round(currentDistance)} px
                  </span>

                  {/* Flecha Triangular Derecha: Alejar estímulos */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustDistance(4)}
                    title="Alejar estímulos (Flecha Derecha o +)"
                    aria-label="Alejar estímulos"
                  >
                    <IconTriangleRight />
                  </button>

                  <div className="convBarDivider" aria-hidden="true" />

                  {/* Reducir tamaño */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustSize(-4)}
                    disabled={stimulusSize <= 36}
                    title="Reducir tamaño (Flecha Abajo)"
                    aria-label="Reducir tamaño"
                  >
                    <IconMinus />
                  </button>

                  <span className="convDistanceBadge" style={{ minWidth: '60px' }}>
                    {stimulusSize} px
                  </span>

                  {/* Aumentar tamaño */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustSize(4)}
                    disabled={stimulusSize >= 680}
                    title="Aumentar tamaño (Flecha Arriba)"
                    aria-label="Aumentar tamaño"
                  >
                    <IconPlus />
                  </button>
                </>
              ) : (
                <>
                  {/* Play / Pausa */}
                  <button
                    type="button"
                    className={`convCircleBtn ${motionActive ? 'convCircleBtnPrimary' : ''}`}
                    onClick={toggleMotionPlay}
                    title={motionActive ? 'Pausar alejamiento (Espacio)' : 'Iniciar alejamiento (Espacio)'}
                    aria-label={motionActive ? 'Pausar alejamiento' : 'Iniciar alejamiento'}
                  >
                    {motionActive ? <IconPause /> : <IconPlay />}
                  </button>

                  {/* Distancia actual */}
                  <span className="convDistanceBadge">
                    {Math.round(currentDistance)} px
                  </span>

                  {/* Reiniciar distancia inicial */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={handleInGameReset}
                    title="Reiniciar a distancia y velocidad iniciales (R)"
                    aria-label="Reiniciar a distancia y velocidad iniciales"
                  >
                    <IconReset />
                  </button>

                  <div className="convBarDivider" aria-hidden="true" />

                  {/* Reducir velocidad (-) */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustSpeed(-1)}
                    disabled={speed <= 1}
                    title="Reducir velocidad"
                    aria-label="Reducir velocidad"
                  >
                    <IconMinus />
                  </button>

                  {/* Símbolo e indicador numérico de velocidad */}
                  <span
                    className="convSpeedBadge"
                    title={`Velocidad progresiva: Nivel ${speed} (${MOTION_SPEED_LEVELS[speed - 1]?.label || ''})`}
                  >
                    <IconGauge />
                    <span className="convSpeedNum">
                      {speed}
                    </span>
                  </span>

                  {/* Aumentar velocidad (+) */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustSpeed(1)}
                    disabled={speed >= MOTION_SPEED_LEVELS.length}
                    title="Aumentar velocidad"
                    aria-label="Aumentar velocidad"
                  >
                    <IconPlus />
                  </button>

                  <div className="convBarDivider" aria-hidden="true" />

                  {/* Reducir tamaño */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustSize(-4)}
                    disabled={stimulusSize <= 36}
                    title="Reducir tamaño (Flecha Abajo)"
                    aria-label="Reducir tamaño"
                  >
                    <IconMinus />
                  </button>

                  <span className="convDistanceBadge" style={{ minWidth: '60px' }}>
                    {stimulusSize} px
                  </span>

                  {/* Aumentar tamaño */}
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustSize(4)}
                    disabled={stimulusSize >= 680}
                    title="Aumentar tamaño (Flecha Arriba)"
                    aria-label="Aumentar tamaño"
                  >
                    <IconPlus />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  )
}
