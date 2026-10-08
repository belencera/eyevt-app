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

// Parámetros del modo lectura: 15 palabras por renglón
const WORDS_PER_ROW = 15
const READING_MIN_X = 10
const READING_MAX_X = 90
const READING_MIN_Y = 16
const READING_MAX_Y = 84

/**
 * Calcula el número de renglones en función de la duración de la sesión.
 * - 30 s: 4 renglones
 * - 60 s (1 min): 6 renglones
 * - 120 s (2 min): 8 renglones
 * - 300 s (5 min): 10 renglones
 * - 0 (Infinito): 6 renglones en bucle continuo
 */
function getReadingRows(durationSetting) {
  if (durationSetting === 30) return 4
  if (durationSetting === 60) return 6
  if (durationSetting === 120) return 8
  if (durationSetting === 300) return 10
  return 6
}

function getReadingPosition(col, row, totalRows) {
  const x = READING_MIN_X + (col / (WORDS_PER_ROW - 1)) * (READING_MAX_X - READING_MIN_X)
  const y = totalRows > 1
    ? READING_MIN_Y + (row / (totalRows - 1)) * (READING_MAX_Y - READING_MIN_Y)
    : 50

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
  }
}

function randomPosition() {
  return {
    x: Math.random() * (MAX - MIN) + MIN,
    y: Math.random() * (MAX - MIN) + MIN,
  }
}

function intervalToMs(sec) {
  return Math.round(sec * 1000)
}

function IconRandom() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  )
}

function IconReading() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="15" y2="18" />
      <polyline points="15 15 18 18 15 21" />
    </svg>
  )
}

export default function SacadesGame() {
  const [movementMode, setMovementMode] = useState('random') // 'random' | 'reading'
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [jumpInterval, setJumpInterval] = useState(0.7)
  const intervalRef = useRef(null)

  // Referencias mutables para el seguimiento del paso de lectura y modo
  const movementModeRef = useRef(movementMode)
  movementModeRef.current = movementMode

  const readingPosRef = useRef({ col: 0, row: 0 })

  const stimulus = useStimulusManager('classic')

  const clearJumpInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const jumpNext = () => {
    if (movementModeRef.current === 'reading') {
      const totalRows = getReadingRows(session.durationSetting)
      const current = readingPosRef.current

      // Posicionar estímulo en la coordenada actual de lectura
      setPosition(getReadingPosition(current.col, current.row, totalRows))
      stimulus.nextStimulus()

      // Avanzar al siguiente paso (palabra o renglón siguiente)
      let nextCol = current.col + 1
      let nextRow = current.row
      if (nextCol >= WORDS_PER_ROW) {
        nextCol = 0
        nextRow = (nextRow + 1) % totalRows
      }
      readingPosRef.current = { col: nextCol, row: nextRow }
    } else {
      setPosition(randomPosition())
      stimulus.nextStimulus()
    }
  }

  const startJumping = () => {
    clearJumpInterval()
    jumpNext()
    intervalRef.current = setInterval(jumpNext, intervalToMs(jumpInterval))
  }

  const resetBall = () => {
    clearJumpInterval()
    stimulus.resetStimulus()
    readingPosRef.current = { col: 0, row: 0 }
    if (movementMode === 'reading') {
      setPosition(getReadingPosition(0, 0, getReadingRows(session.durationSetting)))
    } else {
      setPosition({ x: 50, y: 50 })
    }
  }

  const session = useGameSession({
    onBeginPlay: () => {
      // Al comenzar, si es lectura, arrancar en el primer renglón y primera palabra
      readingPosRef.current = { col: 0, row: 0 }
      startJumping()
    },
    onPause: clearJumpInterval,
    onResume: startJumping,
    onReset: resetBall,
    onEnd: clearJumpInterval,
  })

  // Actualizar intervalo en caliente al variar el tiempo durante el juego
  useEffect(() => {
    if (session.isPlaying && !session.isPaused) {
      clearJumpInterval()
      intervalRef.current = setInterval(jumpNext, intervalToMs(jumpInterval))
    }
  }, [jumpInterval, session.isPlaying, session.isPaused])

  // Ajustar posición inicial cuando cambia el modo en reposo
  const handleModeChange = (newMode) => {
    if (!session.isIdle) return
    setMovementMode(newMode)
    readingPosRef.current = { col: 0, row: 0 }
    if (newMode === 'reading') {
      setPosition(getReadingPosition(0, 0, getReadingRows(session.durationSetting)))
    } else {
      setPosition({ x: 50, y: 50 })
    }
  }

  // ── Atajos de Teclado durante la partida ──
  useEffect(() => {
    if (!session.started) return

    const handleKeyDown = (e) => {
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
  }, [session.started, session.isPaused])

  const showDot = session.started && (session.isPlaying || session.isPaused)

  return (
    <GameShell
      title="Sacádicos"
      hint="Mover los ojos con precisión hacia el estímulo sin mover la cabeza."
      session={session}
      stimulus={stimulus}
      gameControls={
        <div className="modeGridContainer">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span className="controlLabel" id="sacade-mode-label" style={{ marginBottom: 0 }}>
              Modo de movimiento
            </span>
            <span style={{ fontSize: '0.73rem', fontWeight: 500, color: '#94a3b8' }}>
              · {movementMode === 'random' ? 'Saltos aleatorios' : 'Saltos siguiendo el patrón de lectura (Izquierda -> Derecha)'}
            </span>
          </div>
          <div
            className="modeGrid"
            role="radiogroup"
            aria-labelledby="sacade-mode-label"
          >
            <button
              type="button"
              role="radio"
              aria-checked={movementMode === 'random'}
              disabled={!session.isIdle}
              className={`modeCard ${movementMode === 'random' ? 'modeCardActive' : ''}`}
              onClick={() => handleModeChange('random')}
              title="Saltos impredecibles en cualquier dirección"
            >
              <div className="modeCardIcon">
                <IconRandom />
              </div>
              <span className="modeCardLabel">Movimiento aleatorio</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={movementMode === 'reading'}
              disabled={!session.isIdle}
              className={`modeCard ${movementMode === 'reading' ? 'modeCardActive' : ''}`}
              onClick={() => handleModeChange('reading')}
              title="Simulación de lectura: 15 palabras de izquierda a derecha renglón a renglón"
            >
              <div className="modeCardIcon">
                <IconReading />
              </div>
              <span className="modeCardLabel">Movimiento lectura</span>
            </button>
          </div>
        </div>
      }
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

