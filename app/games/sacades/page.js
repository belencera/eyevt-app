'use client'

import { useEffect, useState } from 'react'
import './sacades.css'

export default function SacadesGame() {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [started, setStarted] = useState(false)

  const startGame = () => {
    setScore(0)
    setCountdown(3)
    setStarted(false)

    let timer = 3

    const interval = setInterval(() => {
      timer -= 1
      setCountdown(timer)

      if (timer === 0) {
        clearInterval(interval)
        setStarted(true)
        setRunning(true)
      }
    }, 1000)
  }

  useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
      setPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      })
    }, 900)

    return () => clearInterval(interval)
  }, [running])

  const handleClick = () => {
    if (!running) return
    setScore(prev => prev + 1)
  }

  return (
    <div className="gameContainer">

      <div className="panel">
        <h1>Sacades</h1>

        <p>Score: {score}</p>

        {!started && (
          <button onClick={startGame} className="button">
            Start
          </button>
        )}

        {countdown > 0 && !started && (
          <p className="countdown">{countdown}</p>
        )}
      </div>

      {started && (
        <div
          className="dot"
          onClick={handleClick}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`
          }}
        />
      )}
    </div>
  )
}