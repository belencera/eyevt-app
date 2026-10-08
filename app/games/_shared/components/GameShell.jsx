'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { DURATION_OPTIONS } from '../data/constants'
import { formatTime } from '../utils/formatTime'
import { IconPause, IconPlay, IconReset } from '../utils/icons'
import { KeyboardShortcutsBar } from './KeyboardShortcutsBar'
import './gameShell.css'

const GRID_SPLITS = {
  compact: '42%', // Estímulo compacto (42%) y Ajustes amplios (58%)
  wide: '58%',    // Estímulo amplio para catálogos (58%) y Ajustes (42%)
}

/**
 * Layout tipo dashboard unificado con 2 columnas y barra inferior de atajos de teclado.
 *
 * Props:
 * - stimulusGrid: JSX del selector de estímulos (Columna 1, izquierda)
 * - stimulusTitle: Título para la tarjeta de estímulos (def: 'Estímulo')
 * - stimulusSub: Subtítulo para la tarjeta de estímulos (def: '· Selecciona tipo de objetivo')
 * - speedControl: { id, label, value, min, max, step, unit, disabled, onChange } (slider en Columna 2)
 * - speedContent: JSX alternativo para velocidad/cadencia en Columna 2
 * - extraControls: JSX con opciones específicas del estímulo en Columna 2
 * - gameControls: JSX con controles propios del juego (modo, distancia…) en Columna 2
 * - shortcuts: Array<{ keys: string[], label: string }> para la barra inferior de atajos
 * - shortcutsHint: Texto informativo contextual a la derecha de los atajos
 * - bottomContent: JSX alternativo para la fila inferior
 * - hideDuration: Oculta el selector de duración si el juego lo gestiona internamente
 * - split: Proporción de la Columna 1 ('compact' (42%), 'wide' (58%) o porcentaje personalizado ej: '50%')
 * - children: contenido del área de juego
 */
export function GameShell({
  title,
  hint,
  session,
  stimulusGrid,
  stimulusTitle = 'Estímulo',
  stimulusSub = '· Selecciona tipo de objetivo',
  speedControl,
  speedContent,
  extraControls,
  gameControls,
  shortcuts,
  shortcutsHint,
  bottomContent,
  stimulus,
  onIncreaseSize,
  onDecreaseSize,
  hideDuration = false,
  split = 'compact',
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

  // ── Controles Globales de Teclado (ESC: Salir, Espacio: Pausar/Reanudar, R: Reiniciar, Flechas: Tamaño) ──
  useEffect(() => {
    if (!started && !isCountingDown) return

    const handleKeyDown = (e) => {
      // ESC: Salir de la partida y volver al menú
      if (e.key === 'Escape') {
        e.preventDefault()
        handleReset?.()
        return
      }

      // Espacio: Pausar y reanudar (no durante cuenta atrás)
      if (e.code === 'Space') {
        if (isCountingDown) return
        e.preventDefault()
        handleTogglePause?.()
        return
      }

      // Tecla R: Reiniciar con cuenta atrás 3-2-1 a configuración inicial
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        handleStart?.()
        return
      }

      // Flechas Arriba / Abajo: Modificar tamaño del estímulo
      if (e.key === 'ArrowUp') {
        if (onIncreaseSize) {
          e.preventDefault()
          onIncreaseSize()
          return
        }
        if (stimulus?.increaseSize) {
          e.preventDefault()
          stimulus.increaseSize()
          return
        }
      }

      if (e.key === 'ArrowDown') {
        if (onDecreaseSize) {
          e.preventDefault()
          onDecreaseSize()
          return
        }
        if (stimulus?.decreaseSize) {
          e.preventDefault()
          stimulus.decreaseSize()
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    started,
    isCountingDown,
    handleReset,
    handleTogglePause,
    handleStart,
    stimulus,
    onIncreaseSize,
    onDecreaseSize,
  ])

  // Asegurar que 'Espacio', 'R', 'Tamaño' y 'Esc' siempre formen parte de la tarjeta de atajos
  const resolvedShortcuts = useMemo(() => {
    if (!shortcuts && !bottomContent && !stimulus && !onIncreaseSize) return null
    if (bottomContent && !shortcuts) return null

    const list = shortcuts ? [...shortcuts] : []

    // 1. Espacio: Pausar (al principio si no está)
    const hasSpace = list.some((item) =>
      item.keys.some((k) => k.toLowerCase() === 'espacio' || k.toLowerCase() === 'space')
    )
    if (!hasSpace) {
      list.unshift({ keys: ['Espacio'], label: 'Pausar' })
    }

    // 2. R: Reiniciar (tras Espacio si no está)
    const hasR = list.some((item) =>
      item.keys.some((k) => k.toLowerCase() === 'r')
    )
    if (!hasR) {
      const spaceIdx = list.findIndex((item) =>
        item.keys.some((k) => k.toLowerCase() === 'espacio' || k.toLowerCase() === 'space')
      )
      const insertIdx = spaceIdx !== -1 ? spaceIdx + 1 : 1
      list.splice(insertIdx, 0, { keys: ['R'], label: 'Reiniciar' })
    }

    // 3. Tamaño: Flechas Arriba / Abajo (si el juego lo soporta y no está ya definido)
    const hasSize = list.some((item) =>
      item.keys.some((k) => k === '↑' || k === '↓')
    )
    const supportsSize = Boolean(onIncreaseSize || stimulus?.increaseSize)
    if (!hasSize && supportsSize) {
      const rIdx = list.findIndex((item) =>
        item.keys.some((k) => k.toLowerCase() === 'r')
      )
      const insertIdx = rIdx !== -1 ? rIdx + 1 : list.length
      list.splice(insertIdx, 0, { keys: ['↑', '↓'], label: 'Tamaño' })
    }

    // 4. Esc: Salir (al final si no está)
    const hasEsc = list.some((item) =>
      item.keys.some((k) => k.toLowerCase() === 'esc' || k.toLowerCase() === 'escape')
    )
    if (!hasEsc) {
      list.push({ keys: ['Esc'], label: 'Salir' })
    }

    return list
  }, [shortcuts, bottomContent, stimulus, onIncreaseSize])

  const isGameActive =
    isFullscreen !== undefined ? isFullscreen : started || isCountingDown

  const resolvedSplit = GRID_SPLITS[split] || split

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

        {/* Cuadrícula de tarjetas unificada: 2 columnas + fila inferior */}
        <div className="dashGrid" style={{ '--dash-col-1': resolvedSplit }}>
          {/* ── COLUMNA 1: Selector de Estímulo ── */}
          <div className="dashCard dashCardStimulus">
            <div className="dashCardHead">
              <span className="dashCardLabel">{stimulusTitle}</span>
              <span className="dashCardSub">{stimulusSub}</span>
            </div>
            {stimulusGrid}
          </div>

          {/* ── COLUMNA 2: Configuración (Modo, Velocidad, Extras y Duración) ── */}
          <div className="dashCard dashCardSettings">
            <div className="dashCardHead">
              <span className="dashCardLabel">Configuración</span>
              <span className="dashCardSub">· Ajustes del ejercicio</span>
            </div>

            <div className="dashSettingsContent">
              {gameControls}

              {/* Control de velocidad con slider */}
              {speedControl && (() => {
                const hasSteps = Array.isArray(speedControl.steps) && speedControl.steps.length > 0
                const currentIdx = hasSteps
                  ? Math.max(0, speedControl.steps.indexOf(speedControl.value))
                  : 0

                return (
                  <div className="speedControlBlock">
                    <span className="controlLabel" id={`label-${speedControl.id ?? 'speed'}`}>
                      {speedControl.label ?? 'Velocidad'}
                    </span>
                    <div className="speedSliderRow">
                      <input
                        id={speedControl.id ?? 'speed'}
                        type="range"
                        min={hasSteps ? 0 : speedControl.min}
                        max={hasSteps ? speedControl.steps.length - 1 : speedControl.max}
                        step={hasSteps ? 1 : (speedControl.step ?? 1)}
                        value={hasSteps ? currentIdx : speedControl.value}
                        disabled={speedControl.disabled ?? !isIdle}
                        onChange={(e) => {
                          const num = Number(e.target.value)
                          if (hasSteps) {
                            speedControl.onChange(speedControl.steps[num])
                          } else {
                            speedControl.onChange(num)
                          }
                        }}
                        className="dashSlider"
                        aria-labelledby={`label-${speedControl.id ?? 'speed'}`}
                      />
                      <span className="speedSliderValue">
                        {speedControl.value}{speedControl.unit ?? ''}
                      </span>
                    </div>
                  </div>
                )
              })()}

              {/* Contenido alternativo de velocidad / cadencia */}
              {speedContent}

              {/* Duración de la sesión (control fijo permanente) */}
              {!hideDuration && (
                <div className="dashDurationBlock">
                  <span className="controlLabel" id="dash-duration-label">
                    Duración de la sesión
                  </span>
                  <div className="durationRow" role="radiogroup" aria-labelledby="dash-duration-label">
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
              )}

              {/* Ajustes específicos del estímulo (se suman abajo dinámicamente) */}
              {extraControls}
            </div>
          </div>

          {/* ── FILA INFERIOR: Atajos de teclado a ancho completo ── */}
          {(resolvedShortcuts || bottomContent) && (
            <div className="dashCard dashShortcutsCard">
              {resolvedShortcuts ? (
                <KeyboardShortcutsBar shortcuts={resolvedShortcuts} hint={shortcutsHint} />
              ) : (
                bottomContent
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
