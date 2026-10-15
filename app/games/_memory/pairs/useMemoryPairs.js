'use client'

import { useState } from 'react'
import { useGameSession, useTimers } from '../../_shared'
import { preloadImages } from '../common/preloadImages'
import { buildDeck, getDeckColumns } from './buildDeck'
import { MISMATCH_MS, getPairsCount } from './constants'

const INITIAL_STATS = {
  maxLevel: 1,
  roundsCompleted: 0,
  pairsFound: 0, // Parejas encontradas en toda la sesión
  attempts: 0, // Parejas de cartas levantadas
  errors: 0, // Intentos que no eran pareja
}

/**
 * Flujo de Memoria de parejas:
 * vista previa (cartas boca arriba) → buscar parejas → ronda completa → siguiente nivel (+1 pareja).
 *
 * - Nunca baja de nivel: completar todas las parejas pasa al siguiente.
 * - Dos cartas distintas se muestran en rojo MISMATCH_MS y se esconden; mientras tanto no se puede pulsar.
 * - Pausa: en la vista previa la repite desde el principio al reanudar; jugando, bloquea las cartas.
 * - En duración "Infinito" el resumen se muestra al salir (Esc o reinicio) si se ha jugado algo.
 *
 * @param {{ stimulus: object, previewSeconds: number }} params
 */
export function useMemoryPairs({ stimulus, previewSeconds }) {
  const [phase, setPhase] = useState('idle') // idle | preview | playing | checking | complete
  const [level, setLevel] = useState(1)
  const [roundId, setRoundId] = useState(0) // Cambia en cada ronda para montar cartas nuevas (sin animación de volteo)
  const [deck, setDeck] = useState([])
  const [faceUp, setFaceUp] = useState([]) // Cartas levantadas que aún no son pareja
  const [matched, setMatched] = useState([])
  const [mismatch, setMismatch] = useState([])
  const [stats, setStats] = useState(INITIAL_STATS)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const timers = useTimers()

  const runPreview = () => {
    timers.clearAll()
    if (previewSeconds > 0) {
      setPhase('preview')
      timers.setTimer(() => setPhase('playing'), previewSeconds * 1000)
    } else {
      setPhase('playing')
    }
  }

  const startRound = (roundLevel) => {
    const nextDeck = buildDeck({
      type: stimulus.stimulusType,
      pairs: getPairsCount(roundLevel),
      settings: {
        wordLength: stimulus.wordLength,
        numberDigits: stimulus.numberDigits,
      },
    })
    preloadImages(nextDeck)
    setLevel(roundLevel)
    setRoundId((prev) => prev + 1)
    setDeck(nextDeck)
    setFaceUp([])
    setMatched([])
    setMismatch([])
    setStats((prev) => ({ ...prev, maxLevel: Math.max(prev.maxLevel, roundLevel) }))
    runPreview()
  }

  // Esconde la pareja fallida y vuelve a permitir jugar
  const hideMismatch = () => {
    setFaceUp([])
    setMismatch([])
    setPhase('playing')
  }

  const clearRound = () => {
    timers.clearAll()
    setPhase('idle')
    setDeck([])
    setFaceUp([])
    setMatched([])
    setMismatch([])
  }

  const session = useGameSession({
    onBeginPlay: () => {
      setStats(INITIAL_STATS)
      setSummaryOpen(false)
      startRound(1)
    },
    onPause: timers.clearAll,
    onResume: () => {
      if (phase === 'preview') runPreview()
      else if (phase === 'checking') hideMismatch()
    },
    onReset: clearRound,
    onEnd: () => {
      clearRound()
      setSummaryOpen(true)
    },
  })

  const flip = (card) => {
    if (phase !== 'playing' || session.isPaused) return
    if (faceUp.includes(card.id) || matched.includes(card.id)) return

    if (faceUp.length === 0) {
      setFaceUp([card.id])
      return
    }

    const first = deck.find((c) => c.id === faceUp[0])
    const pair = [first.id, card.id]

    if (first.key === card.key) {
      const nextMatched = [...matched, ...pair]
      setMatched(nextMatched)
      setFaceUp([])

      const isComplete = nextMatched.length === deck.length
      setStats((prev) => ({
        ...prev,
        attempts: prev.attempts + 1,
        pairsFound: prev.pairsFound + 1,
        roundsCompleted: prev.roundsCompleted + (isComplete ? 1 : 0),
      }))
      if (isComplete) setPhase('complete')
      return
    }

    setFaceUp(pair)
    setMismatch(pair)
    setPhase('checking')
    setStats((prev) => ({ ...prev, attempts: prev.attempts + 1, errors: prev.errors + 1 }))
    timers.setTimer(hideMismatch, MISMATCH_MS)
  }

  const nextRound = () => {
    if (phase !== 'complete' || session.isPaused) return
    startRound(level + 1)
  }

  const restartFromSummary = () => {
    setSummaryOpen(false)
    session.handleStart()
  }

  // Salir (Esc o reinicio): en "Infinito" la sesión no termina sola, así que el resumen se muestra al salir
  const handleExit = () => {
    const showSummary = session.durationSetting === 0 && session.started && stats.attempts > 0
    session.handleReset()
    if (showSummary) setSummaryOpen(true)
  }

  const accuracy = stats.attempts > 0 ? Math.round((stats.pairsFound / stats.attempts) * 100) : 0

  return {
    session: { ...session, handleReset: handleExit },
    phase,
    level,
    roundId,
    deck,
    columns: getDeckColumns(deck.length),
    // En la vista previa se ven todas las cartas
    faceUp: phase === 'preview' ? deck.map((c) => c.id) : faceUp,
    matched,
    mismatch,
    pairsInRound: matched.length / 2,
    totalPairs: deck.length / 2,
    isBoardLocked: phase !== 'playing',
    isComplete: phase === 'complete',
    flip,
    nextRound,
    // Props listas para <SessionSummary />
    summary: {
      open: summaryOpen,
      headline: { value: stats.maxLevel, label: 'nivel máximo' },
      stats: [
        { label: 'Parejas encontradas', value: stats.pairsFound },
        { label: 'Intentos fallidos', value: stats.errors },
        { label: 'Precisión', value: `${accuracy}% (${stats.pairsFound}/${stats.attempts})` },
      ],
      onRestart: restartFromSummary,
      onExit: () => setSummaryOpen(false),
    },
  }
}
