'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { IconPause, IconPlay, IconReset } from './icons'
import './eyeTracking.css'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}`
  return String(s)
}

const MIN = 2
const MAX = 98
const COUNTDOWN_START = 3

const DURATION_OPTIONS = [
  { value: 0, label: 'Ꝏ' },
  { value: 30, label: '30 segundos' },
  { value: 60, label: '1 minuto' },
  { value: 120, label: '2 minutos' },
  { value: 300, label: '5 minutos' },
]

function velocityFromAngle(angle, speed) {
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed,
  }
}

function randomVelocity(speed) {
  return velocityFromAngle(Math.random() * Math.PI * 2, speed)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function setVelocityMagnitude(vel, speed) {
  const mag = Math.hypot(vel.x, vel.y) || 1
  vel.x = (vel.x / mag) * speed
  vel.y = (vel.y / mag) * speed
}

export default function EyeTrackingGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [started, setStarted] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)

  const [speed, setSpeed] = useState(28)
  const [durationSetting, setDurationSetting] = useState(0)

  const positionRef = useRef({ x: 50, y: 50 })
  const velocityRef = useRef(randomVelocity(28))
  const countdownIntervalRef = useRef(null)
  const durationIntervalRef = useRef(null)

  const clearCountdownTimer = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }

  const clearDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
  }

  const clearTimers = () => {
    clearCountdownTimer()
    clearDurationTimer()
  }

  const endSession = () => {
    clearDurationTimer()
    setRunning(false)
    setPaused(false)
    setStarted(false)
    setTimeLeft(null)
  }

  const startDurationTimer = (seconds) => {
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
  }

  const resetSession = () => {
    clearTimers()
    setRunning(false)
    setPaused(false)
    setStarted(false)
    setCountdown(null)
    setTimeLeft(null)
    positionRef.current = { x: 50, y: 50 }
    velocityRef.current = randomVelocity(speed)
    setPosition({ x: 50, y: 50 })
  }

  const beginPlaying = () => {
    setCountdown(null)
    setStarted(true)
    setRunning(true)
    setPaused(false)
    positionRef.current = { x: 50, y: 50 }
    velocityRef.current = randomVelocity(speed)
    setPosition({ x: 50, y: 50 })

    if (durationSetting > 0) {
      startDurationTimer(durationSetting)
    } else {
      setTimeLeft(null)
    }
  }

  const handleStart = () => {
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
  }

  const handlePause = () => {
    if (!running || paused) return
    setRunning(false)
    setPaused(true)
    clearDurationTimer()
  }

  const handleResume = () => {
    if (!paused) return
    setPaused(false)
    setRunning(true)
    if (timeLeft !== null && timeLeft > 0) {
      startDurationTimer(timeLeft)
    }
  }

  const handleReset = () => {
    resetSession()
  }

  const handleTogglePause = () => {
    if (paused) handleResume()
    else handlePause()
  }

  const handleSpeedChange = (value) => {
    const next = Number(value)
    setSpeed(next)
    setVelocityMagnitude(velocityRef.current, next)
  }

  useEffect(() => {
    return () => clearTimers()
  }, [])

  useEffect(() => {
    if (!running) return

    let frameId
    let lastTime = performance.now()

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const pos = positionRef.current
      const vel = velocityRef.current

      pos.x += vel.x * dt
      pos.y += vel.y * dt

      if (pos.x <= MIN || pos.x >= MAX) {
        vel.x *= -1
        pos.x = clamp(pos.x, MIN, MAX)
      }
      if (pos.y <= MIN || pos.y >= MAX) {
        vel.y *= -1
        pos.y = clamp(pos.y, MIN, MAX)
      }

      setPosition({ x: pos.x, y: pos.y })
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [running])

  const isCountingDown = countdown !== null
  const isPlaying = running && !paused
  const isPaused = paused && started
  const isIdle = !isCountingDown && !running && !paused && !started
  const showDot = started && (isPlaying || isPaused)
  const showTimer =
    durationSetting > 0 && timeLeft !== null && (isPlaying || isPaused)
  const timerProgress =
    showTimer && durationSetting > 0
      ? Math.round((timeLeft / durationSetting) * 100)
      : 0

  return (
    <div className="gameLayout">
      <aside className="configPanel">
        <Link href="/" className="gameBack">
          ← Inicio
        </Link>
        <h1 className="gameTitle">Seguimientos</h1>
        <p className="gameHint">Sigue el punto con la mirada</p>

        <div className="gameControls">
          <div className="controlGroup">
            <label className="controlLabel" htmlFor="speed">
              Velocidad
            </label>
            <div className="speedControl">
              <input
                id="speed"
                type="range"
                min={12}
                max={48}
                step={2}
                value={speed}
                disabled={!isIdle}
                onChange={(e) => handleSpeedChange(e.target.value)}
              />
              <span className="speedValue">{speed}</span>
            </div>
          </div>

          <div className="controlGroup">
            <label className="controlLabel" htmlFor="duration">
              Duración
            </label>
            <select
              id="duration"
              className="controlSelect"
              value={durationSetting}
              disabled={!isIdle}
              onChange={(e) => setDurationSetting(Number(e.target.value))}
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {showTimer && (
            <div
              className={`timerWidget ${isPaused ? 'timerWidgetPaused' : ''}`}
              role="timer"
              aria-live="polite"
              aria-label={`Tiempo restante ${formatTime(timeLeft)}`}
            >
              <div
                className="timerRing"
                style={{ '--progress': `${timerProgress}%` }}
              >
                <div className="timerRingInner">
                  <span className="timerValue">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="timerBar">
                <div
                  className="timerBarFill"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="gameActions">
            <button
              type="button"
              className="btn btnIcon btnPrimary"
              disabled={!isIdle}
              onClick={handleStart}
              aria-label="Empezar"
              title="Empezar"
            >
              <IconPlay />
            </button>
            <button
              type="button"
              className="btn btnIcon btnSecondary"
              disabled={(!isPlaying && !isPaused) || isCountingDown}
              onClick={handleTogglePause}
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              title={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused ? <IconPlay /> : <IconPause />}
            </button>
            <button
              type="button"
              className="btn btnIcon btnGhost"
              disabled={isIdle}
              onClick={handleReset}
              aria-label="Reiniciar"
              title="Reiniciar"
            >
              <IconReset />
            </button>
          </div>
        </div>
      </aside>

      <main className="playArea">
        {showDot && (
          <div
            className={`dot ${isPaused ? 'dotPaused' : ''}`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
          />
        )}

        {isCountingDown && (
          <div className="countdownOverlay" aria-live="polite">
            <span className="countdownNumber">{countdown}</span>
          </div>
        )}
      </main>
    </div>
  )
}
