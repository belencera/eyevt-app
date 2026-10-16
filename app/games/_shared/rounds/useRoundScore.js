'use client'

import { useRef, useState } from 'react'

const createStats = (level) => ({
  maxLevel: level,
  total: 0,
  correct: 0,
  consecutiveFails: 0,
  responseMs: 0, // Suma de tiempos de respuesta (sin pausas)
})

/**
 * Puntuación de los juegos por rondas con una respuesta por pantalla
 * (Encuentra el diferente, ¿Cuál se repite?):
 * aciertos, nivel máximo, tiempo de respuesta sin pausas, fin por fallos seguidos en "Infinito"
 * y resumen al acabar o al salir.
 *
 * La sesión la crea el juego (sus callbacks usan este hook), así que las funciones que la necesitan
 * la reciben como parámetro.
 *
 * @param {{ startLevel: number, headlineLabel: string, maxFails: number }} params
 *   headlineLabel: texto bajo el nivel máximo en el resumen; maxFails: fallos seguidos que terminan "Infinito"
 */
export function useRoundScore({ startLevel, headlineLabel, maxFails }) {
  const [stats, setStats] = useState(() => createStats(startLevel))
  const [summaryOpen, setSummaryOpen] = useState(false)
  const shownAtRef = useRef(0)
  const pausedAtRef = useRef(0)

  /** Nueva sesión */
  const reset = () => {
    setStats(createStats(startLevel))
    setSummaryOpen(false)
  }

  const trackLevel = (level) =>
    setStats((prev) => ({ ...prev, maxLevel: Math.max(prev.maxLevel, level) }))

  /** La pantalla ya se ve: empieza a contar el tiempo de respuesta */
  const startTimer = () => {
    shownAtRef.current = performance.now()
  }

  // La pausa no cuenta como tiempo de respuesta
  const pause = () => {
    pausedAtRef.current = performance.now()
  }
  const resume = () => {
    shownAtRef.current += performance.now() - pausedAtRef.current
  }

  const registerAnswer = (isCorrect, session) => {
    const elapsed = performance.now() - shownAtRef.current
    const consecutiveFails = isCorrect ? 0 : stats.consecutiveFails + 1
    setStats((prev) => ({
      ...prev,
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      consecutiveFails,
      responseMs: prev.responseMs + elapsed,
    }))

    const isInfinite = session.durationSetting === 0
    if (isInfinite && consecutiveFails >= maxFails) session.handleEnd()
  }

  const openSummary = () => setSummaryOpen(true)

  /** Sesión cuya salida (Esc o reinicio) muestra el resumen si se ha respondido algo */
  const withExitSummary = (session) => ({
    ...session,
    handleReset: () => {
      const showSummary = session.started && stats.total > 0
      session.handleReset()
      if (showSummary) setSummaryOpen(true)
    },
  })

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  const averageSeconds = stats.total > 0 ? (stats.responseMs / stats.total / 1000).toFixed(1) : '0.0'

  /** Props listas para <SessionSummary /> */
  const getSummary = (session) => ({
    open: summaryOpen,
    headline: { value: stats.maxLevel, label: headlineLabel },
    stats: [
      { label: 'Precisión', value: `${accuracy}% (${stats.correct}/${stats.total})` },
      { label: 'Tiempo medio de respuesta', value: `${averageSeconds} s` },
    ],
    onRestart: () => {
      setSummaryOpen(false)
      session.handleStart()
    },
    onExit: () => setSummaryOpen(false),
  })

  return {
    stats,
    reset,
    trackLevel,
    startTimer,
    pause,
    resume,
    registerAnswer,
    openSummary,
    withExitSummary,
    getSummary,
  }
}
