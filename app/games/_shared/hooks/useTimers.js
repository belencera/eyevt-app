'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'

/**
 * Gestiona los temporizadores (setTimeout / setInterval) de un juego.
 * Sustituye el patrón repetido `timerRef + clearXxx` y limpia todo al desmontar.
 *
 * - setTimer(fn, ms): ejecuta fn una vez tras ms
 * - setRepeat(fn, ms): ejecuta fn cada ms
 * - clearAll(): cancela todos los temporizadores activos
 */
export function useTimers() {
  const timeoutsRef = useRef(new Set())
  const intervalsRef = useRef(new Set())

  const setTimer = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id)
      fn()
    }, ms)
    timeoutsRef.current.add(id)
    return id
  }, [])

  const setRepeat = useCallback((fn, ms) => {
    const id = setInterval(fn, ms)
    intervalsRef.current.add(id)
    return id
  }, [])

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current.clear()
    intervalsRef.current.forEach(clearInterval)
    intervalsRef.current.clear()
  }, [])

  useEffect(() => clearAll, [clearAll])

  return useMemo(
    () => ({ setTimer, setRepeat, clearAll }),
    [setTimer, setRepeat, clearAll]
  )
}
