'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getScatteredPositions, preloadImages, useAdaptiveLevel, useGameSession, useTimers } from '../../_shared'
import { buildRecallRound } from './buildRound'
import { evaluateAnswer } from './evaluateAnswer'
import { FADE_MS, INFINITE_MAX_FAILS, LEVEL_UP_STREAK, START_DELAY_MS } from './constants'

/** Fases en las que se muestran estímulos (se repiten desde el principio al reanudar la pausa) */
const PRESENTATION_PHASES = ['presenting', 'gap']

/**
 * Flujo completo de los juegos de memoria y percepción:
 * ronda → presentación temporizada → respuesta en cuadrícula → corrección → nivel adaptativo → resumen.
 *
 * Cada juego aporta solo lo que le diferencia:
 * - buildSteps(round): pasos de la presentación, ej. [{ phase: 'presenting', ms: 2500 }].
 *   Un paso con `index` muestra solo ese objetivo (Memoria Secuencial).
 * - ordered: si la respuesta debe respetar el orden de aparición.
 * - scattered: cada estímulo aparece en una posición aleatoria de la pantalla (se fija al crear la ronda).
 *
 * @param {{ stimulus: object, buildSteps: (round) => Array<{ phase: string, ms: number, index?: number }>, ordered?: boolean, scattered?: boolean }} params
 */
export function useRecallGame({ stimulus, buildSteps, ordered = false, scattered = false }) {
  const [phase, setPhase] = useState('idle') // idle | presenting | gap | responding | feedback | leaving
  const [stepIndex, setStepIndex] = useState(null)
  const [round, setRound] = useState(null)
  const [selection, setSelection] = useState([])
  const [results, setResults] = useState(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const level = useAdaptiveLevel({ upAfter: LEVEL_UP_STREAK })
  const timers = useTimers()

  // Último buildSteps recibido (las páginas lo crean en cada render con su configuración)
  const buildStepsRef = useRef(buildSteps)
  useEffect(() => {
    buildStepsRef.current = buildSteps
  }, [buildSteps])

  // Ejecuta los pasos de la presentación encadenados y pasa a la fase de respuesta al terminar
  const runPresentation = useCallback(
    (currentRound) => {
      timers.clearAll()
      const steps = buildStepsRef.current(currentRound)

      const runStep = (i) => {
        if (i >= steps.length) {
          setPhase('responding')
          setStepIndex(null)
          return
        }
        const step = steps[i]
        setPhase(step.phase)
        setStepIndex(step.index ?? null)
        timers.setTimer(() => runStep(i + 1), step.ms)
      }

      runStep(0)
    },
    [timers]
  )

  /** @param {number} [startDelay] - Pantalla vacía antes de la presentación (inicio de sesión) */
  const startRound = (count, startDelay = 0) => {
    const nextRound = buildRecallRound({
      type: stimulus.stimulusType,
      count,
      settings: {
        wordLength: stimulus.wordLength,
        numberDigits: stimulus.numberDigits,
      },
    })
    nextRound.positions = scattered ? getScatteredPositions(count) : null
    preloadImages(nextRound.options)
    setRound(nextRound)
    setSelection([])
    setResults(null)
    if (startDelay > 0) {
      setPhase('gap')
      timers.setTimer(() => runPresentation(nextRound), startDelay)
    } else {
      runPresentation(nextRound)
    }
  }

  const clearRound = () => {
    timers.clearAll()
    setPhase('idle')
    setStepIndex(null)
    setRound(null)
    setSelection([])
    setResults(null)
  }

  const session = useGameSession({
    onBeginPlay: () => {
      level.reset()
      setSummaryOpen(false)
      // Pausa en blanco para que el primer estímulo no coincida con el final de la cuenta atrás
      startRound(1, START_DELAY_MS)
    },
    onPause: timers.clearAll,
    onResume: () => {
      // Al reanudar durante la presentación se repite desde el principio (sin exposición extra)
      if (round && PRESENTATION_PHASES.includes(phase)) runPresentation(round)
      else if (phase === 'leaving') startRound(level.level)
    },
    onReset: clearRound,
    onEnd: () => {
      clearRound()
      setSummaryOpen(true)
    },
  })

  const finishRound = (finalSelection) => {
    const targetKeys = round.targets.map((t) => t.key)
    const { isCorrect, results: cardResults } = evaluateAnswer(targetKeys, finalSelection, ordered)
    setResults(cardResults)
    setPhase('feedback')

    const next = level.register(isCorrect)
    const isInfinite = session.durationSetting === 0
    if (isInfinite && next.stats.consecutiveFails >= INFINITE_MAX_FAILS) {
      session.handleEnd()
    }
  }

  const select = (option) => {
    if (phase !== 'responding' || session.isPaused || !round) return
    // Sin repetición, cada tarjeta solo se puede pulsar una vez
    if (!round.allowRepeats && selection.includes(option.key)) return

    const nextSelection = [...selection, option.key]
    setSelection(nextSelection)
    if (nextSelection.length === round.targets.length) finishRound(nextSelection)
  }

  const undo = () => {
    if (phase !== 'responding' || session.isPaused) return
    setSelection((prev) => prev.slice(0, -1))
  }

  const nextRound = () => {
    if (phase !== 'feedback' || session.isPaused) return
    // La cuadrícula se desvanece antes de empezar la siguiente ronda
    setPhase('leaving')
    timers.setTimer(() => startRound(level.level), FADE_MS)
  }

  const restartFromSummary = () => {
    setSummaryOpen(false)
    session.handleStart()
  }

  // Estímulos visibles en la presentación (en pausa no se muestran para no dar exposición extra)
  const isPresentationPhase = PRESENTATION_PHASES.includes(phase)
  const stagePhase = session.isPaused && isPresentationPhase ? 'idle' : phase
  const presentedItems = round ? round.targets.map((t) => t.value) : []

  const { stats } = level
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return {
    session,
    phase,
    stagePhase,
    round,
    presentedItems,
    activeIndex: stepIndex, // Posición visible en la presentación serial (null = todos a la vez)
    positions: round?.positions ?? null, // Posiciones en pantalla en modo disperso (null = fila centrada)
    selection,
    results,
    isAnswering: ['responding', 'feedback', 'leaving'].includes(phase),
    isLeaving: phase === 'leaving',
    level: level.level,
    streak: level.streak,
    upAfter: level.upAfter,
    select,
    undo,
    nextRound,
    // Props listas para <SessionSummary />
    summary: {
      open: summaryOpen,
      headline: { value: stats.maxLevel, label: 'nivel máximo' },
      stats: [
        { label: 'Precisión', value: `${accuracy}% (${stats.correct}/${stats.total})` },
        { label: 'Racha máxima', value: stats.maxStreak },
      ],
      onRestart: restartFromSummary,
      onExit: () => setSummaryOpen(false),
    },
  }
}
