'use client'

import { useEffect, useRef, useState } from 'react'
import { preloadImages, useGameSession, useRoundScore, useTimers } from '../../_shared'
import { buildWhichRepeatsRound } from '../data/buildRound'
import {
  HIDDEN_MS,
  WHICH_REPEATS_INFINITE_MAX_FAILS,
  WHICH_REPEATS_MAX_COUNT,
  WHICH_REPEATS_START_COUNT,
} from '../data/constants'

/**
 * Flujo de ¿Cuál se repite?:
 * dos tarjetas con un estímulo en común → pulsarlo → corrección → acierto: N + 1 (hasta 8) / fallo: mismo N.
 *
 * - Modo "memory": las tarjetas se ven `visibleSeconds` y se ocultan HIDDEN_MS en bucle hasta responder;
 *   se puede pulsar también con las tarjetas ocultas. La pausa detiene el ciclo.
 * - Modo "rotating": el giro es solo visual (lo anima la tarjeta); aquí no cambia nada.
 * - Puntuación, tiempo sin pausas, fin por fallos seguidos y resumen: useRoundScore.
 *
 * @param {{ stimulus: object, mode: 'normal'|'memory'|'rotating', visibleSeconds: number }} params
 */
export function useWhichRepeatsGame({ stimulus, mode, visibleSeconds }) {
  const [phase, setPhase] = useState('idle') // idle | responding | feedback
  const [count, setCount] = useState(WHICH_REPEATS_START_COUNT)
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null) // { card, index } del estímulo pulsado
  const [isVisible, setIsVisible] = useState(true) // Modo memoria: tarjetas visibles u ocultas

  const timers = useTimers()
  const score = useRoundScore({
    startLevel: WHICH_REPEATS_START_COUNT,
    headlineLabel: 'estímulos por tarjeta',
    maxFails: WHICH_REPEATS_INFINITE_MAX_FAILS,
  })
  const endSessionRef = useRef(null) // session.handleEnd (la sesión se crea después de startRound)

  // Modo memoria: visible → oculto → visible… hasta responder
  const runMemoryCycle = () => {
    setIsVisible(true)
    timers.setTimer(() => {
      setIsVisible(false)
      timers.setTimer(runMemoryCycle, HIDDEN_MS)
    }, visibleSeconds * 1000)
  }

  const startRound = (requestedCount) => {
    timers.clearAll()
    const nextRound = buildWhichRepeatsRound({
      type: stimulus.stimulusType,
      count: requestedCount,
      settings: {
        wordLength: stimulus.wordLength,
        numberDigits: stimulus.numberDigits,
        pbqdLength: stimulus.pbqdLength,
      },
      prevCommonKey: round?.commonKey ?? null,
    })
    if (!nextRound) {
      endSessionRef.current?.() // La categoría no tiene elementos suficientes
      return
    }

    preloadImages(nextRound.cards.flat())
    setRound(nextRound)
    setCount(nextRound.count)
    setSelected(null)
    setPhase('responding')
    score.trackLevel(nextRound.count)
    score.startTimer()

    if (mode === 'memory') runMemoryCycle()
    else setIsVisible(true)
  }

  const clearRound = () => {
    timers.clearAll()
    setRound(null)
    setSelected(null)
    setIsVisible(true)
    setPhase('idle')
  }

  const session = useGameSession({
    onBeginPlay: () => {
      score.reset()
      startRound(WHICH_REPEATS_START_COUNT)
    },
    onPause: () => {
      timers.clearAll()
      score.pause()
    },
    onResume: () => {
      score.resume()
      if (mode === 'memory' && phase === 'responding') runMemoryCycle()
    },
    onReset: clearRound,
    onEnd: () => {
      clearRound()
      score.openSummary()
    },
  })

  useEffect(() => {
    endSessionRef.current = session.handleEnd
  }, [session.handleEnd])

  const select = (card, index) => {
    if (phase !== 'responding' || session.isPaused || !round) return

    timers.clearAll()
    setIsVisible(true) // Tras responder se ven las tarjetas para comprobar la corrección
    setSelected({ card, index })
    setPhase('feedback')
    score.registerAnswer(round.cards[card][index].key === round.commonKey, session)
  }

  const nextRound = () => {
    if (phase !== 'feedback' || session.isPaused) return
    const isCorrect = round.cards[selected.card][selected.index].key === round.commonKey
    startRound(isCorrect ? Math.min(count + 1, WHICH_REPEATS_MAX_COUNT) : count)
  }

  return {
    session: score.withExitSummary(session),
    phase,
    count,
    round,
    selected,
    isVisible,
    isAnswered: phase === 'feedback',
    select,
    nextRound,
    summary: score.getSummary(session), // Props listas para <SessionSummary />
  }
}
