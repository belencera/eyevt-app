'use client'

import React from 'react'
import { IconPlay, IconPause, IconReset } from '../../_shared'
import {
  IconTriangleLeft,
  IconTriangleRight,
  IconMinus,
  IconPlus,
  IconGauge,
} from './FusionIcons'

export function FusionInGameBar({
  mode,
  currentDistance,
  adjustDistance,
  stimulusSize,
  adjustSize,
  motionActive,
  toggleMotionPlay,
  handleInGameReset,
  speed,
  adjustSpeed,
  motionSpeedLevels,
}) {
  return (
    <div className="convInGameBar">
      <div className="convControlPill">
        {mode === 'fixed' ? (
          <>
            {/* Acercar estímulos */}
            <button
              type="button"
              className="convCircleBtn"
              onClick={() => adjustDistance(-4)}
              title="Acercar estímulos (Flecha Izquierda o -)"
              aria-label="Acercar estímulos"
            >
              <IconTriangleLeft />
            </button>

            <span className="convDistanceBadge">
              {Math.round(currentDistance)} px
            </span>

            {/* Alejar estímulos */}
            <button
              type="button"
              className="convCircleBtn"
              onClick={() => adjustDistance(4)}
              title="Alejar estímulos (Flecha Derecha o +)"
              aria-label="Alejar estímulos"
            >
              <IconTriangleRight />
            </button>
          </>
        ) : (
          <>
            {/* Play / Pausa del movimiento */}
            <button
              type="button"
              className={`convCircleBtn ${motionActive ? 'convCircleBtnPrimary' : ''}`}
              onClick={toggleMotionPlay}
              title={motionActive ? 'Pausar movimiento (Espacio)' : 'Iniciar movimiento (Espacio)'}
              aria-label={motionActive ? 'Pausar movimiento' : 'Iniciar movimiento'}
            >
              {motionActive ? <IconPause /> : <IconPlay />}
            </button>

            {/* Distancia actual */}
            <span className="convDistanceBadge">
              {Math.round(currentDistance)} px
            </span>

            {/* Reiniciar distancia inicial */}
            <button
              type="button"
              className="convCircleBtn"
              onClick={handleInGameReset}
              title="Reiniciar a distancia y velocidad iniciales (R)"
              aria-label="Reiniciar a distancia y velocidad iniciales"
            >
              <IconReset />
            </button>

            <div className="convBarDivider" aria-hidden="true" />

            {/* Reducir velocidad (-) */}
            <button
              type="button"
              className="convCircleBtn"
              onClick={() => adjustSpeed(-1)}
              disabled={speed <= 1}
              title="Reducir velocidad"
              aria-label="Reducir velocidad"
            >
              <IconMinus />
            </button>

            {/* Símbolo e indicador numérico de velocidad */}
            <span
              className="convSpeedBadge"
              title={`Velocidad progresiva: Nivel ${speed} (${motionSpeedLevels[speed - 1]?.label || ''})`}
            >
              <IconGauge />
              <span className="convSpeedNum">
                {speed}
              </span>
            </span>

            {/* Aumentar velocidad (+) */}
            <button
              type="button"
              className="convCircleBtn"
              onClick={() => adjustSpeed(1)}
              disabled={speed >= motionSpeedLevels.length}
              title="Aumentar velocidad"
              aria-label="Aumentar velocidad"
            >
              <IconPlus />
            </button>
          </>
        )}

        {/* ── Controles de Tamaño Comunes (Deduplicados para ambos modos) ── */}
        <div className="convBarDivider" aria-hidden="true" />

        {/* Reducir tamaño */}
        <button
          type="button"
          className="convCircleBtn"
          onClick={() => adjustSize(-4)}
          disabled={stimulusSize <= 36}
          title="Reducir tamaño (Flecha Abajo)"
          aria-label="Reducir tamaño"
        >
          <IconMinus />
        </button>

        <span className="convDistanceBadge" style={{ minWidth: '60px' }}>
          {stimulusSize} px
        </span>

        {/* Aumentar tamaño */}
        <button
          type="button"
          className="convCircleBtn"
          onClick={() => adjustSize(4)}
          disabled={stimulusSize >= 680}
          title="Aumentar tamaño (Flecha Arriba)"
          aria-label="Aumentar tamaño"
        >
          <IconPlus />
        </button>
      </div>
    </div>
  )
}
