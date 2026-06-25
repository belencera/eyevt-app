'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { COUNTDOWN_START } from './constants'

/**
 * Gestiona cuenta atrás, play/pausa/reinicio y temporizador de duración.
 * Cada juego registra callbacks para su lógica concreta.
 */
export function useGameSession(callbacks = {}) {
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [durationSetting, setDurationSetting] = useState(0)

  const countdownIntervalRef = useRef(null)
  const durationIntervalRef = useRef(null)

  const clearCountdownTimer = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [])

  const clearDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
  }, [])

  const clearTimers = useCallback(() => {
    clearCountdownTimer()
    clearDurationTimer()
  }, [clearCountdownTimer, clearDurationTimer])

  const endSession = useCallback(() => {
    clearDurationTimer()
    setRunning(false)
    setPaused(false)
    setStarted(false)
    setTimeLeft(null)
    callbacksRef.current.onEnd?.()
  }, [clearDurationTimer])

  const startDurationTimer = useCallback(
    (seconds) => {
      clearDurationTimer()
      setTimeLeft(seconds)

      durationIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            endSession()
            return null
          }
          return prev - 1
        })
      }, 1000)
    },
    [clearDurationTimer, endSession]
  )

  const beginPlaying = useCallback(() => {
    setCountdown(null)
    setStarted(true)
    setRunning(true)
    setPaused(false)
    callbacksRef.current.onBeginPlay?.()

    if (durationSetting > 0) {
      startDurationTimer(durationSetting)
    } else {
      setTimeLeft(null)
    }
  }, [durationSetting, startDurationTimer])

  const handleStart = useCallback(() => {
    clearTimers()
    setRunning(false)
    setPaused(false)
    setStarted(false)
    setTimeLeft(null)

    setCountdown(COUNTDOWN_START)
    let remaining = COUNTDOWN_START

    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1
      if (remaining > 0) {
        setCountdown(remaining)
      } else {
        clearCountdownTimer()
        beginPlaying()
      }
    }, 1000)
  }, [beginPlaying, clearCountdownTimer, clearTimers])

  const handlePause = useCallback(() => {
    if (!running || paused) return
    setRunning(false)
    setPaused(true)
    clearDurationTimer()
    callbacksRef.current.onPause?.()
  }, [running, paused, clearDurationTimer])

  const handleResume = useCallback(() => {
    if (!paused) return
    setPaused(false)
    setRunning(true)
    callbacksRef.current.onResume?.()
    if (timeLeft !== null && timeLeft > 0) {
      startDurationTimer(timeLeft)
    }
  }, [paused, timeLeft, startDurationTimer])

  const handleReset = useCallback(() => {
    clearTimers()
    setRunning(false)
    setPaused(false)
    setStarted(false)
    setCountdown(null)
    setTimeLeft(null)
    callbacksRef.current.onReset?.()
  }, [clearTimers])

  const handleTogglePause = useCallback(() => {
    if (paused) handleResume()
    else handlePause()
  }, [paused, handlePause, handleResume])

  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  const isCountingDown = countdown !== null
  const isPlaying = running && !paused
  const isPaused = paused && started
  const isIdle = !isCountingDown && !running && !paused && !started
  const showTimer =
    durationSetting > 0 && timeLeft !== null && (isPlaying || isPaused)
  const timerProgress =
    showTimer && durationSetting > 0
      ? Math.round((timeLeft / durationSetting) * 100)
      : 0

  return {
    running,
    paused,
    started,
    countdown,
    timeLeft,
    durationSetting,
    setDurationSetting,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
    handleTogglePause,
    isCountingDown,
    isPlaying,
    isPaused,
    isIdle,
    showTimer,
    timerProgress,
  }
}
