'use client'

import Link from 'next/link'
import { DURATION_OPTIONS } from '../data/constants'
import { formatTime } from '../utils/formatTime'
import { IconPause, IconPlay, IconReset } from '../utils/icons'
import { OptionPicker } from './OptionPicker'
import './gameShell.css'

/**
 * Layout común: panel izquierdo + zona de juego.
 *
 * Props opcionales para personalizar cada juego:
 * - speedControl: slider de velocidad
 * - extraControls: controles extra (React node) antes de los botones
 * - children: contenido del área de juego (derecha)
 */
export function GameShell({
  title,
  hint,
  session,
  speedControl,
  extraControls,
  children,
}) {
  const {
    durationSetting,
    setDurationSetting,
    timeLeft,
    handleStart,
    handleTogglePause,
    handleReset,
    isCountingDown,
    isPlaying,
    isPaused,
    isIdle,
    started,
    showTimer,
    timerProgress,
  } = session

  const isGameActive = started || isCountingDown

  return (
    <div className={`gameLayout ${isGameActive ? 'gameLayoutFullscreen' : ''}`}>
      <aside
        className={`configPanel ${isGameActive ? 'configPanelHidden' : ''}`}
        aria-hidden={isGameActive}
      >
        <Link href="/" className="gameBack">
          ← Inicio
        </Link>
        <h1 className="gameTitle">{title}</h1>
        {hint && <p className="gameHint">{hint}</p>}

        <div className="gameControls">
          {speedControl && (
            <div className="controlGroup">
              <label className="controlLabel" htmlFor={speedControl.id ?? 'speed'}>
                {speedControl.label ?? 'Velocidad'}
              </label>
              <div className="speedControl">
                <input
                  id={speedControl.id ?? 'speed'}
                  type="range"
                  min={speedControl.min}
                  max={speedControl.max}
                  step={speedControl.step ?? 1}
                  value={speedControl.value}
                  disabled={speedControl.disabled ?? !isIdle}
                  onChange={(e) => speedControl.onChange(Number(e.target.value))}
                />
                <span className="speedValue">{speedControl.value}</span>
              </div>
            </div>
          )}

          <OptionPicker
            id="duration"
            label="Duración"
            value={durationSetting}
            options={DURATION_OPTIONS}
            disabled={!isIdle}
            onChange={setDurationSetting}
          />

          {extraControls}

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
        {children}

        {started && (
          <div className="floatingGameBar" aria-label="Controles del juego">
            <button
              type="button"
              className={`btn btnIcon floatingBtn ${
                isPaused ? 'floatingBtnPlay' : 'floatingBtnPause'
              }`}
              disabled={isCountingDown}
              onClick={handleTogglePause}
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              title={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused ? <IconPlay /> : <IconPause />}
            </button>
            <button
              type="button"
              className="btn btnIcon floatingBtn floatingBtnReset"
              onClick={handleReset}
              aria-label="Reiniciar y volver al menú"
              title="Reiniciar y volver al menú"
            >
              <IconReset />
            </button>
            {showTimer && (
              <div className="floatingTimer">
                <span className="floatingTimerValue">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        )}

        {isCountingDown && (
          <div className="countdownOverlay" aria-live="polite">
            <span className="countdownNumber">{session.countdown}</span>
          </div>
        )}
      </main>
    </div>
  )
}
