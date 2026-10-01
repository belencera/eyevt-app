'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GameShell,
  OptionPicker,
  useGameSession,
  IconPlay,
  IconPause,
  IconReset,
} from '../_shared'
import {
  STIMULI_CATEGORIES,
  STIMULI_PAIRS,
  CONVERGENCE_MODES,
  INITIAL_DISTANCE_OPTIONS,
  SPEED_OPTIONS,
  STIMULUS_SIZE_OPTIONS,
  STIMULUS_SIZE_PX,
} from './data/stimuliPairs'
import './convergence.css'

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

export default function ConvergenceGame() {
  // ── Estados de Configuración ──
  const [selectedCategory, setSelectedCategory] = useState('fusion-plana')
  const [selectedPairId, setSelectedPairId] = useState('cross')
  const [mode, setMode] = useState('fixed') // 'fixed' | 'motion'
  const [initialDistance, setInitialDistance] = useState(140) // px
  const [speed, setSpeed] = useState(4) // velocidad de alejamiento
  const [stimulusSize, setStimulusSize] = useState('md')

  // ── Estados de Juego ──
  const [currentDistance, setCurrentDistance] = useState(140)
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

  // Tamaño en píxeles del estímulo
  const currentSizePx = STIMULUS_SIZE_PX[stimulusSize] || 76

  // ── Sesión de Juego ──
  const session = useGameSession({
    onStart: () => {
      setCurrentDistance(initialDistance)
      setMotionActive(false)
    },
    onReset: () => {
      setCurrentDistance(initialDistance)
      setMotionActive(false)
    },
    onPause: () => {
      setMotionActive(false)
    },
  })

  // Sincronizar distancia inicial cuando cambia en el menú
  useEffect(() => {
    if (session.isIdle) {
      setCurrentDistance(initialDistance)
    }
  }, [initialDistance, session.isIdle])

  // Cambiar automáticamente al primer estímulo de la categoría si el actual no pertenece a ella
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    const firstOfCategory = STIMULI_PAIRS.find((p) => p.category === catId)
    if (firstOfCategory) {
      setSelectedPairId(firstOfCategory.id)
    }
  }

  // ── Controles de Distancia (Modo Fijo) ──
  const adjustDistance = useCallback((delta) => {
    setCurrentDistance((prev) => {
      const maxDist = typeof window !== 'undefined' ? window.innerWidth - 120 : 600
      const next = prev + delta
      return Math.max(30, Math.min(next, maxDist))
    })
  }, [])

  // ── Controles de Velocidad (Modo Movimiento) ──
  const adjustSpeed = useCallback((delta) => {
    setSpeed((prev) => Math.max(1, Math.min(prev + delta, 40)))
  }, [])

  const toggleMotionPlay = useCallback(() => {
    if (session.isPlaying && !session.isPaused) {
      setMotionActive((prev) => !prev)
    }
  }, [session.isPlaying, session.isPaused])

  const resetToInitial = useCallback(() => {
    setCurrentDistance(initialDistance)
    setMotionActive(false)
  }, [initialDistance])

  // ── Bucle de Animación de Alejamiento en Modo Movimiento ──
  useEffect(() => {
    if (mode !== 'motion' || !session.isPlaying || session.isPaused || !motionActive) {
      return
    }

    let lastTime = performance.now()
    let frameId

    const animate = (now) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      const maxDist = window.innerWidth - 120
      const nextDist = currentDistanceRef.current + speedRef.current * dt

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
    if (!session.isPlaying || session.isPaused) return

    const handleKeyDown = (e) => {
      if (mode === 'fixed') {
        if (e.key === 'ArrowLeft' || e.key === '-') {
          e.preventDefault()
          adjustDistance(-10)
        } else if (e.key === 'ArrowRight' || e.key === '+' || e.key === '=') {
          e.preventDefault()
          adjustDistance(10)
        }
      } else if (mode === 'motion') {
        if (e.code === 'Space') {
          e.preventDefault()
          toggleMotionPlay()
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          adjustSpeed(2)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          adjustSpeed(-2)
        } else if (e.key === 'r' || e.key === 'R') {
          e.preventDefault()
          resetToInitial()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [session.isPlaying, session.isPaused, mode, adjustDistance, adjustSpeed, toggleMotionPlay, resetToInitial])

  // ── Selector de Estímulos para el Dashboard (Tarjeta 1 · Arriba Izquierda) ──
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

      {/* Cuadrícula de Parejas Disponibles (sin descripciones debajo de los títulos) */}
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
                  {pair.renderPreview ? pair.renderPreview(38) : null}
                </div>
                <span className="convPairName">{pair.name}</span>
              </div>
            )
          })
        ) : (
          <p style={{ color: '#64748b', fontSize: '13px', gridColumn: '1 / -1', padding: '12px 0' }}>
            Pronto podrás añadir más parejas en esta categoría.
          </p>
        )}
      </div>
    </div>
  )

  // ── Controles del Ejercicio para el Dashboard (Tarjeta 2 · Arriba Derecha · Estilo Periferia) ──
  const gameControls = (
    <>
      {/* Selector de modo en cuadrícula de tarjetas estilo Periferia */}
      <div className="modeGridContainer">
        <span className="controlLabel" id="conv-mode-label">
          Modo de ejercicio
        </span>
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

      <OptionPicker
        id="conv-distance"
        label="Distancia inicial"
        value={initialDistance}
        options={INITIAL_DISTANCE_OPTIONS}
        disabled={!session.isIdle}
        onChange={setInitialDistance}
      />

      <OptionPicker
        id="conv-size"
        label="Tamaño del estímulo"
        value={stimulusSize}
        options={STIMULUS_SIZE_OPTIONS}
        disabled={!session.isIdle}
        onChange={setStimulusSize}
      />
    </>
  )

  // ── Tarjeta 4 (Abajo Derecha: Velocidad de separación con subtítulo explicativo en Fijo) ──
  const speedContent =
    mode === 'motion' ? (
      <OptionPicker
        id="conv-speed"
        label="Velocidad de separación"
        value={speed}
        options={SPEED_OPTIONS}
        disabled={!session.isIdle}
        onChange={setSpeed}
      />
    ) : (
      <div className="dashFixedSpeedPlaceholder" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="dashCardHead" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="controlLabel" id="conv-speed-label">
            Velocidad de separación
          </span>
          <span className="dashCardSub" style={{ marginLeft: 'auto' }}>
            Inactivo en modo fijo
          </span>
        </div>
        <div className="dashNoExtras">
          <p className="dashNoExtrasText">
            En modo fijo los estímulos no se desplazan automáticamente.
          </p>
        </div>
      </div>
    )

  return (
    <GameShell
      title="Convergencia"
      hint="Converge hasta fusionar los dos estímulos en una única imagen central nítida."
      session={session}
      stimulusGrid={stimulusSelector}
      gameControls={gameControls}
      speedContent={speedContent}
    >
      {/* ── Zona de Juego Inmersiva ── */}
      <div className="convergenceArena">
        <div className="convergenceTrack">
          {/* Estímulo Ojo Izquierdo */}
          <div
            className="stimulusWrapper"
            style={{
              transform: `translateX(-${currentDistance / 2}px)`,
            }}
          >
            {activePair.renderLeft ? activePair.renderLeft(currentSizePx) : null}
          </div>

          {/* Estímulo Ojo Derecho */}
          <div
            className="stimulusWrapper"
            style={{
              transform: `translateX(${currentDistance / 2}px)`,
            }}
          >
            {activePair.renderRight ? activePair.renderRight(currentSizePx) : null}
          </div>
        </div>

        {/* ── Barra de Controles en Juego (Inferior Flotante Limpia) ── */}
        {session.started && (
          <div className="convInGameBar">
            <div className="convControlPill">
              {mode === 'fixed' ? (
                <>
                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustDistance(-10)}
                    title="Reducir distancia (Flecha Izquierda o -)"
                    aria-label="Reducir distancia"
                  >
                    <IconMinus />
                  </button>

                  <span className="convDistanceBadge">
                    {Math.round(currentDistance)} px
                  </span>

                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={() => adjustDistance(10)}
                    title="Aumentar distancia (Flecha Derecha o +)"
                    aria-label="Aumentar distancia"
                  >
                    <IconPlus />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`convCircleBtn ${motionActive ? 'convCircleBtnPrimary' : ''}`}
                    onClick={toggleMotionPlay}
                    title={motionActive ? 'Pausar alejamiento (Espacio)' : 'Iniciar alejamiento (Espacio)'}
                    aria-label={motionActive ? 'Pausar alejamiento' : 'Iniciar alejamiento'}
                  >
                    {motionActive ? <IconPause /> : <IconPlay />}
                  </button>

                  <span className="convDistanceBadge">
                    {Math.round(currentDistance)} px
                  </span>

                  <button
                    type="button"
                    className="convCircleBtn"
                    onClick={resetToInitial}
                    title="Reiniciar a distancia inicial (R)"
                    aria-label="Reiniciar a distancia inicial"
                  >
                    <IconReset />
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
