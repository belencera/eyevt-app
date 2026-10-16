'use client'

import { useEffect, useRef, useState } from 'react'
import { getScatteredPositions, preloadImages, useGameSession, useRoundScore } from '../../_shared'
import { buildOddPair, buildOddRound } from '../data/buildRound'
import { ODD_ONE_INFINITE_MAX_FAILS, ODD_ONE_START_COUNT } from '../data/constants'

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
 * - Puntuación, tiempo de respuesta sin pausas, fin por fallos seguidos en "Infinito" y resumen
 *   al acabar o al salir: useRoundScore.
 *
 * @param {{ stimulus: object, scattered?: boolean }} params
 */
export function useOddOneGame({ stimulus, scattered = false }) {
  const [phase, setPhase] = useState('idle') // idle | loading | responding | feedback
  const [count, setCount] = useState(ODD_ONE_START_COUNT)
  const [round, setRound] = useState(null)
  const [selected, setSelected] = useState(null)

  const score = useRoundScore({
    startLevel: ODD_ONE_START_COUNT,
    headlineLabel: 'estímulos como máximo',
    maxFails: ODD_ONE_INFINITE_MAX_FAILS,
  })

  const requestIdRef = useRef(0) // Invalida rondas que llegan tarde (tras reiniciar o salir)
  const nextPairRef = useRef(null) // Promise del estímulo de la siguiente pantalla
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
    score.trackLevel(roundCount)
    setPhase('responding')
    score.startTimer()

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
      score.reset()
      startRound(ODD_ONE_START_COUNT)
    },
    onPause: score.pause,
    onResume: score.resume,
    onReset: clearRound,
    onEnd: () => {
      clearRound()
      score.openSummary()
    },
  })

  useEffect(() => {
    endSessionRef.current = session.handleEnd
  }, [session.handleEnd])

  // Libera la última imagen modificada al salir de la página
  useEffect(() => () => releaseOddImage(roundRef.current), [])

  const select = (index) => {
    if (phase !== 'responding' || session.isPaused || !round) return

    setSelected(index)
    setPhase('feedback')
    score.registerAnswer(index === round.oddIndex, session)
  }

  const nextRound = () => {
    if (phase !== 'feedback' || session.isPaused) return
    const isCorrect = selected === round.oddIndex
    startRound(isCorrect ? count + 1 : count)
  }

  return {
    session: score.withExitSummary(session),
    phase,
    count,
    round,
    selected,
    isAnswered: phase === 'feedback',
    select,
    nextRound,
    summary: score.getSummary(session), // Props listas para <SessionSummary />
  }
}
