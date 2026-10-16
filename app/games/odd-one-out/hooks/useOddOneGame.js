'use client'

import { useEffect, useRef, useState } from 'react'
import { getScatteredPositions, preloadImages, useGameSession } from '../../_shared'
import { buildOddPair, buildOddRound } from '../data/buildRound'
import { ODD_ONE_INFINITE_MAX_FAILS, ODD_ONE_START_COUNT } from '../data/constants'

const INITIAL_STATS = {
  maxCount: ODD_ONE_START_COUNT,
  total: 0,
  correct: 0,
  consecutiveFails: 0,
  responseMs: 0, // Suma de tiempos de respuesta (sin pausas)
}

/** Libera la URL `blob:` de la ilustración modificada cuando ya no se muestra */
const releaseOddImage = (round) => {
  const src = round?.items[round.oddIndex]?.src
  if (src?.startsWith('blob:')) URL.revokeObjectURL(src)
}

/**
 * Flujo de Encuentra el diferente:
 * pantalla con N estímulos iguales y uno distinto → pulsar → corrección → acierto: N + 1 / fallo: mismo N.
 *
 * - Sin tope de estímulos; empieza con ODD_ONE_START_COUNT.
 * - Mientras se juega una pantalla se prepara el estímulo de la siguiente (en ilustraciones tarda).
 * - El tiempo de respuesta no cuenta las pausas.
 * - En duración "Infinito", ODD_ONE_INFINITE_MAX_FAILS fallos seguidos terminan la sesión.
 * - Al salir (Esc o reinicio) se muestra el resumen si se ha respondido alguna pantalla.
 *
 * @param {{ stimulus: object, scattered?: boolean }} params
 */
export function useOddOneGame({ stimulus, scattered = false }) {
  const [phase, setPhase] = useState('idle') // idle | loading | responding | feedback
  const [count, setCount] = useState(ODD_ONE_START_COUNT)
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(INITIAL_STATS)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const requestIdRef = useRef(0) // Invalida rondas que llegan tarde (tras reiniciar o salir)
  const nextPairRef = useRef(null) // Promise del estímulo de la siguiente pantalla
  const shownAtRef = useRef(0)
  const pausedAtRef = useRef(0)
  const roundRef = useRef(null)
  const endSessionRef = useRef(null) // session.handleEnd (la sesión se crea después de startRound)

  const settings = {
    wordLength: stimulus.wordLength,
    numberDigits: stimulus.numberDigits,
    pbqdLength: stimulus.pbqdLength,
  }

  const preparePair = (prevKey) =>
    buildOddPair({ type: stimulus.stimulusType, settings, prevKey })

  const showRound = (nextRound) => {
    releaseOddImage(roundRef.current)
    roundRef.current = nextRound
    setRound(nextRound)
  }

  const startRound = async (roundCount) => {
    const requestId = ++requestIdRef.current
    setPhase('loading')
    setSelected(null)

    const pair = await (nextPairRef.current ?? preparePair(roundRef.current?.key ?? null))
    if (requestId !== requestIdRef.current) return
    if (!pair) {
      endSessionRef.current?.() // La categoría no tiene estímulos utilizables
      return
    }

    const nextRound = buildOddRound(pair, roundCount)
    nextRound.positions = scattered ? getScatteredPositions(roundCount) : null
    preloadImages(nextRound.items.map((value) => ({ value })))
    showRound(nextRound)
    setCount(roundCount)
    setStats((prev) => ({ ...prev, maxCount: Math.max(prev.maxCount, roundCount) }))
    setPhase('responding')
    shownAtRef.current = performance.now()

    // Siguiente estímulo preparado de antemano mientras se responde
    nextPairRef.current = preparePair(pair.key)
  }

  const clearRound = () => {
    requestIdRef.current++
    nextPairRef.current = null
    showRound(null)
    setPhase('idle')
    setSelected(null)
  }

  const session = useGameSession({
    onBeginPlay: () => {
      setStats(INITIAL_STATS)
      setSummaryOpen(false)
      startRound(ODD_ONE_START_COUNT)
    },
    onPause: () => {
      pausedAtRef.current = performance.now()
    },
    onResume: () => {
      // La pausa no cuenta como tiempo de respuesta
      shownAtRef.current += performance.now() - pausedAtRef.current
    },
    onReset: clearRound,
    onEnd: () => {
      clearRound()
      setSummaryOpen(true)
    },
  })

  useEffect(() => {
    endSessionRef.current = session.handleEnd
  }, [session.handleEnd])

  // Libera la última imagen modificada al salir de la página
  useEffect(() => () => releaseOddImage(roundRef.current), [])

  const select = (index) => {
    if (phase !== 'responding' || session.isPaused || !round) return

    const isCorrect = index === round.oddIndex
    const elapsed = performance.now() - shownAtRef.current
    setSelected(index)
    setPhase('feedback')

    const consecutiveFails = isCorrect ? 0 : stats.consecutiveFails + 1
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      consecutiveFails,
      responseMs: prev.responseMs + elapsed,
    }))

    const isInfinite = session.durationSetting === 0
    if (isInfinite && consecutiveFails >= ODD_ONE_INFINITE_MAX_FAILS) session.handleEnd()
  }

  const nextRound = () => {
    if (phase !== 'feedback' || session.isPaused) return
    const isCorrect = selected === round.oddIndex
    startRound(isCorrect ? count + 1 : count)
  }

  // Salir (Esc o reinicio): resumen de lo jugado hasta ese momento
  const handleExit = () => {
    const showSummary = session.started && stats.total > 0
    session.handleReset()
    if (showSummary) setSummaryOpen(true)
  }

  const restartFromSummary = () => {
    setSummaryOpen(false)
    session.handleStart()
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  const averageSeconds = stats.total > 0 ? (stats.responseMs / stats.total / 1000).toFixed(1) : '0.0'

  return {
    session: { ...session, handleReset: handleExit },
    phase,
    count,
    round,
    selected,
    isAnswered: phase === 'feedback',
    select,
    nextRound,
    // Props listas para <SessionSummary />
    summary: {
      open: summaryOpen,
      headline: { value: stats.maxCount, label: 'estímulos como máximo' },
      stats: [
        { label: 'Precisión', value: `${accuracy}% (${stats.correct}/${stats.total})` },
        { label: 'Tiempo medio de respuesta', value: `${averageSeconds} s` },
      ],
      onRestart: restartFromSummary,
      onExit: () => setSummaryOpen(false),
    },
  }
}
