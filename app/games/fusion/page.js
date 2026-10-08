'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GameShell,
  useGameSession,
} from '../_shared'
import {
  STIMULI_CATEGORIES,
  STIMULI_PAIRS,
  FUSION_MODES,
  MOTION_TYPES,
} from './data/stimuliPairs'
import { IconModeFixed, IconModeMotion } from './components/FusionIcons'
import { FusionInGameBar } from './components/FusionInGameBar'
import { FusionExtraControls } from './components/FusionExtraControls'
import './fusion.css'

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

export default function FusionGame() {
  // ── Estados de Configuración ──
  const [selectedCategory, setSelectedCategory] = useState('percepcion-simultanea')
  const [selectedPairId, setSelectedPairId] = useState('cross')
  const [stimulusLetter, setStimulusLetter] = useState('E')
  const [stimulusWord, setStimulusWord] = useState('CASA')
  const [stimulusPhrase, setStimulusPhrase] = useState('ENTRENA TU VISIÓN')
  const [mode, setMode] = useState('fixed') // 'fixed' | 'motion'
  const [motionType, setMotionType] = useState('continuous') // 'continuous' | 'alternating'
  const [speed, setSpeed] = useState(1) // velocidad inicial muy baja (progresiva en partida)
  const [letterSuppression, setLetterSuppression] = useState(false)
  const [suppressionSeed, setSuppressionSeed] = useState(1)

  // ── Estados de Juego (Distancia y Tamaño continuos en píxeles) ──
  const [stimulusSize, setStimulusSize] = useState(76) // px (recorrido amplio de 36px a 160px)
  const [currentDistance, setCurrentDistance] = useState(140) // px
  const [motionActive, setMotionActive] = useState(false)

  // Referencias para el bucle de animación sin mutación directa durante el render
  const currentDistanceRef = useRef(currentDistance)
  const speedRef = useRef(speed)
  const motionActiveRef = useRef(motionActive)
  const motionDirectionRef = useRef(1)

  useEffect(() => {
    currentDistanceRef.current = currentDistance
  }, [currentDistance])

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    motionActiveRef.current = motionActive
  }, [motionActive])

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
    motionDirectionRef.current = 1
    setSuppressionSeed((s) => s + 1)
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
    motionDirectionRef.current = 1
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

  // ── Ajuste de Distancia (Paso de 4 px) ──
  const adjustDistance = useCallback((delta) => {
    setCurrentDistance((prev) => {
      const maxDist = typeof window !== 'undefined' ? window.innerWidth - 120 : 600
      const next = prev + delta
      return Math.max(30, Math.min(next, maxDist))
    })
  }, [])

  // ── Ajuste de Tamaño Continuo (Paso de 4 px, rango 36 px a 680 px) ──
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

      if (motionType === 'alternating') {
        const minBounceDist = 60
        const maxBounceDist = Math.min(360, maxDist)
        let nextDist = currentDistanceRef.current + motionDirectionRef.current * effectiveSpeed * dt

        if (nextDist >= maxBounceDist) {
          nextDist = maxBounceDist
          motionDirectionRef.current = -1
        } else if (nextDist <= minBounceDist) {
          nextDist = minBounceDist
          motionDirectionRef.current = 1
        }

        setCurrentDistance(nextDist)
        frameId = requestAnimationFrame(animate)
      } else {
        const nextDist = currentDistanceRef.current + effectiveSpeed * dt

        if (nextDist >= maxDist) {
          setCurrentDistance(maxDist)
          setMotionActive(false)
        } else {
          setCurrentDistance(nextDist)
          frameId = requestAnimationFrame(animate)
        }
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [mode, motionType, session.isPlaying, session.isPaused, motionActive])

  // ── Atajos de Teclado en la Zona de Juego ──
  useEffect(() => {
    if (!session.started) return

    const handleKeyDown = (e) => {
      // Si está en pausa, no modificar tamaño ni distancia
      if (session.isPaused) return

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
  }, [session.started, session.isPaused, mode, adjustDistance, adjustSpeed])

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
                  {pair.renderPreview ? pair.renderPreview(38, pair.isDynamicPhrase ? stimulusPhrase : pair.isDynamicWord ? stimulusWord : stimulusLetter) : null}
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
              : motionType === 'continuous'
              ? 'Separación constante hacia afuera'
              : 'Ciclos continuos de apertura y cierre'}
          </span>
        </div>
        <div
          className="modeGrid"
          role="radiogroup"
          aria-labelledby="conv-mode-label"
        >
          {FUSION_MODES.map((m) => {
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

      {mode === 'motion' && (
        <div className="dashDurationBlock" style={{ marginTop: '16px' }}>
          <div className="convModeHeader">
            <span className="controlLabel" id="fusion-motion-type-label">
              Tipo de movimiento
            </span>
            <span className="convModeSubtext">
              {motionType === 'continuous'
                ? 'Separación constante'
                : 'Ciclos continuos de apertura y cierre'}
            </span>
          </div>
          <div
            className="durationRow"
            role="radiogroup"
            aria-labelledby="fusion-motion-type-label"
          >
            {MOTION_TYPES.map((mt) => {
              const isSelected = mt.value === motionType
              return (
                <button
                  key={mt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={!session.isIdle}
                  className={`dashPillBtn ${isSelected ? 'dashPillBtnActive' : ''}`}
                  onClick={() => setMotionType(mt.value)}
                  title={mt.description}
                >
                  {mt.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  // ── Ajustes Adicionales (Debajo de Duración de la sesión) ──
  const extraControls = (
    <FusionExtraControls
      activePair={activePair}
      disabled={!session.isIdle}
      stimulusLetter={stimulusLetter}
      setStimulusLetter={setStimulusLetter}
      stimulusWord={stimulusWord}
      setStimulusWord={setStimulusWord}
      stimulusPhrase={stimulusPhrase}
      setStimulusPhrase={setStimulusPhrase}
      letterSuppression={letterSuppression}
      setLetterSuppression={setLetterSuppression}
      setSuppressionSeed={setSuppressionSeed}
    />
  )

  // ── Atajos de Teclado (Fila Inferior · Ancho completo) ──
  const shortcuts = [
    { keys: ['←', '→'], label: mode === 'fixed' ? 'Separación' : 'Velocidad' },
  ]

  return (
    <GameShell
      title="Fusión"
      hint="Fusionar los dos estímulos hasta ver una única imagen central nítida."
      session={session}
      split="wide"
      onIncreaseSize={() => adjustSize(4)}
      onDecreaseSize={() => adjustSize(-4)}
      stimulusGrid={stimulusSelector}
      gameControls={gameControls}
      extraControls={extraControls}
      shortcuts={shortcuts}
      shortcutsHint={
        mode === 'fixed'
          ? 'Inicio: 140 px · 76 px'
          : motionType === 'continuous'
          ? 'Inicio: 140 px · Continuo'
          : 'Inicio: 140 px · Alternante (60–360 px)'
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
              ? activePair.renderLeft(
                  currentSizePx,
                  activePair.isDynamicPhrase ? stimulusPhrase : activePair.isDynamicWord ? stimulusWord : stimulusLetter,
                  { letterSuppression, seed: suppressionSeed }
                )
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
              ? activePair.renderRight(
                  currentSizePx,
                  activePair.isDynamicPhrase ? stimulusPhrase : activePair.isDynamicWord ? stimulusWord : stimulusLetter,
                  { letterSuppression, seed: suppressionSeed }
                )
              : null}
          </div>
        </div>

        {/* ── Barra de Controles en Juego (Inferior Flotante Limpia) ── */}
        {session.started && (
          <FusionInGameBar
            mode={mode}
            currentDistance={currentDistance}
            adjustDistance={adjustDistance}
            stimulusSize={stimulusSize}
            adjustSize={adjustSize}
            motionActive={motionActive}
            toggleMotionPlay={toggleMotionPlay}
            handleInGameReset={handleInGameReset}
            speed={speed}
            adjustSpeed={adjustSpeed}
            motionSpeedLevels={MOTION_SPEED_LEVELS}
          />
        )}
      </div>
    </GameShell>
  )
}
