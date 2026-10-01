'use client'

import Link from 'next/link'
import { DURATION_OPTIONS } from '../data/constants'
import { formatTime } from '../utils/formatTime'
import { IconPause, IconPlay, IconReset } from '../utils/icons'
import './gameShell.css'

/**
 * Layout tipo dashboard con tarjetas modulares.
 *
 * Props:
 * - stimulusGrid: JSX del selector de estímulos (tarjeta propia)
 * - speedControl: { id, label, value, min, max, step, onChange } (tarjeta velocidad con slider)
 * - speedContent: JSX alternativo para la tarjeta velocidad (ej: cadencia en periferia)
 * - extraControls: JSX con opciones específicas del estímulo (tarjeta derecha)
 * - gameControls: JSX con controles propios del juego (modo, distancia…)
 * - children: contenido del área de juego
 */
export function GameShell({
  title,
  hint,
  session,
  stimulusGrid,
  speedControl,
  speedContent,
  extraControls,
  gameControls,
  fullWidthDuration = true,
  isFullscreen,
  startDisabled = false,
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

  const isGameActive =
    isFullscreen !== undefined ? isFullscreen : started || isCountingDown

  const hasExtras = Boolean(extraControls) || Boolean(gameControls)
  const hasSpeedCard = Boolean(speedControl) || Boolean(speedContent)

  return (
    <div className="gameLayout">
      {/* ── Dashboard de configuración ── */}
      <div
        className={`dashboard ${isGameActive ? 'dashboardHidden' : ''}`}
        aria-hidden={isGameActive}
      >
        {/* Cabecera */}
        <div className="dashHeader">
          <Link href="/" className="dashBackBtn">← Inicio</Link>
          <div className="dashTitleBlock">
            <h1 className="dashTitle">{title}</h1>
            {hint && (
              <p className="dashHint">
                <strong>Instrucciones:</strong> {hint}
              </p>
            )}
          </div>
        </div>

        {/* Cuadrícula de tarjetas */}
        <div className="dashGrid">
          {/* Tarjeta: Estímulo */}
          <div className="dashCard dashCardStimulus">
            <div className="dashCardHead">
              <span className="dashCardLabel">Estímulo</span>
              <span className="dashCardSub">· Selecciona tipo de objetivo</span>
            </div>
            {stimulusGrid}
          </div>

          {/* Tarjeta: Ajustes específicos */}
          <div className="dashCard dashCardExtras">
            {hasExtras ? (
              <>
                {gameControls}
                {extraControls}
              </>
            ) : (
              <>
                <div className="dashCardHead">
                  <span className="dashCardLabel">Ajustes específicos</span>
                  <span className="dashCardSub">· Personalización</span>
                </div>
                <div className="dashNoExtras">
                  <p className="dashNoExtrasText">
                    El estímulo seleccionado no requiere ajustes adicionales.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Tarjeta: Duración */}
          <div
            className={`dashCard dashCardDuration ${!hasSpeedCard && fullWidthDuration ? 'dashCardFull' : ''}`}
          >
            <div className="dashCardHead">
              <span className="dashCardLabel">Duración</span>
              <span className="dashCardSub">Tiempo total</span>
            </div>
            <div className="durationRow">
              {DURATION_OPTIONS.map((opt) => {
                const isSelected = opt.value === durationSetting
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    className={`dashPillBtn ${isSelected ? 'dashPillBtnActive' : ''}`}
                    disabled={!isIdle}
                    onClick={() => setDurationSetting(opt.value)}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tarjeta: Velocidad / Cadencia */}
          {hasSpeedCard && (
            <div className="dashCard dashCardSpeed">
              {speedControl ? (
                <>
                  <div className="dashCardHead">
                    <span className="dashCardLabel">
                      {speedControl.label ?? 'Velocidad'}
                    </span>
                  </div>
                  <div className="speedSliderRow">
                    <input
                      id={speedControl.id ?? 'speed'}
                      type="range"
                      min={speedControl.min}
                      max={speedControl.max}
                      step={speedControl.step ?? 1}
                      value={speedControl.value}
                      disabled={speedControl.disabled ?? !isIdle}
                      onChange={(e) =>
                        speedControl.onChange(Number(e.target.value))
                      }
                      className="dashSlider"
                    />
                    <span className="speedSliderValue">
                      {speedControl.value}{speedControl.unit ?? ''}
                    </span>
                  </div>
                </>
              ) : (
                speedContent
              )}
            </div>
          )}
        </div>

        {/* Barra de acciones inferior */}
        <div className="dashActions">
          {showTimer && (
            <div
              className="dashTimerBadge"
              role="timer"
              aria-live="polite"
              aria-label={`Tiempo restante ${formatTime(timeLeft)}`}
            >
              <div className="dashTimerBar">
                <div
                  className="dashTimerFill"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
              <span className="dashTimerValue">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}

          <div className="dashActionGroup">
            <button
              type="button"
              className="dashCircleBtn"
              disabled={isIdle}
              onClick={handleReset}
              aria-label="Reiniciar"
              title="Reiniciar"
            >
              <IconReset />
            </button>
            <button
              type="button"
              className="dashCircleBtn"
              disabled={(!isPlaying && !isPaused) || isCountingDown}
              onClick={handleTogglePause}
              aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              title={isPaused ? 'Reanudar' : 'Pausar'}
            >
              {isPaused ? <IconPlay /> : <IconPause />}
            </button>
            <button
              type="button"
              className="dashStartBtn"
              disabled={!isIdle || startDisabled}
              onClick={handleStart}
              aria-label="Empezar ejercicio"
              title={startDisabled ? 'Selecciona una categoría con estímulos' : 'Empezar'}
            >
              <IconPlay />
              <span>Empezar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Área de juego ── */}
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
                <span className="floatingTimerValue">
                  {formatTime(timeLeft)}
                </span>
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
