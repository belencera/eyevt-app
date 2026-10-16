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

/** Nivel visible: el número mientras sube de estímulos; al llegar al tope, "8 - 1", "8 - 2"… */
const formatLevel = (level, count) => (level <= count ? String(level) : `${count} - ${level - count}`)

/** Resumen: estímulos por tarjeta y, si se ha pasado del tope, cuántas veces se ha superado con ese número */
const getSummaryHeadline = (level, count) => {
  const extra = level - count
  return { value: count, detail: extra > 0 ? `superado ${extra} ${extra === 1 ? 'vez' : 'veces'}` : null }
}

/**
 * Flujo de ¿Cuál se repite?:
 * dos tarjetas con un estímulo en común → pulsarlo → corrección → acierto: nivel + 1 / fallo: mismo nivel.
 *
 * - Estímulos por tarjeta = nivel, hasta 8 (o lo que permita la categoría). Después el nivel sigue
 *   subiendo con los mismos estímulos y se muestra como "8 - 1", "8 - 2"… (o "7 - 1" en Emojis).
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
  const [level, setLevel] = useState(WHICH_REPEATS_START_COUNT) // Sin tope; los estímulos sí lo tienen
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

  const startRound = (roundLevel) => {
    timers.clearAll()
    const nextRound = buildWhichRepeatsRound({
      type: stimulus.stimulusType,
      count: Math.min(roundLevel, WHICH_REPEATS_MAX_COUNT),
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
    setLevel(roundLevel)
    setSelected(null)
    setPhase('responding')
    score.trackLevel(roundLevel, getSummaryHeadline(roundLevel, nextRound.count))
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
    startRound(isCorrect ? level + 1 : level)
  }

  return {
    session: score.withExitSummary(session),
    phase,
    levelLabel: round ? formatLevel(level, round.count) : String(level),
    round,
    selected,
    isVisible,
    isAnswered: phase === 'feedback',
    select,
    nextRound,
    summary: score.getSummary(session), // Props listas para <SessionSummary />
  }
}
