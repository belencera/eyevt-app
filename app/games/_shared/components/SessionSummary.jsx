'use client'

import { Fragment, useEffect } from 'react'

/**
 * Pantalla de resumen al terminar una sesión (por tiempo, por fallos o al salir).
 *
 * Atajos: Esc = salir, R = jugar de nuevo (si se pasa onRestart).
 * GameShell desactiva sus atajos cuando la sesión ya no está en marcha,
 * por eso el resumen gestiona los suyos propios.
 *
 * @param {boolean} open - Muestra u oculta el resumen
 * @param {{ value: React.ReactNode, label: string, detail?: string }} [headline] - Cifra principal en grande
 *   (detail: nota pequeña debajo, ej. 'superado 2 veces')
 * @param {Array<{ label: string, value: React.ReactNode }>} [stats] - Métricas secundarias
 * @param {() => void} onExit - Cerrar el resumen y volver al menú del juego
 * @param {string} [exitLabel='Salir']
 * @param {() => void} [onRestart] - Empezar otra sesión con la misma configuración
 * @param {string} [restartLabel='Jugar de nuevo']
 * @param {boolean} [dismissOnBackdrop=false] - Cerrar también al pulsar fuera de la tarjeta
 */
export function SessionSummary({
  open,
  headline,
  stats = [],
  onExit,
  exitLabel = 'Salir',
  onRestart,
  restartLabel = 'Jugar de nuevo',
  dismissOnBackdrop = false,
}) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onExit?.()
        return
      }
      if (onRestart && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault()
        onRestart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onExit, onRestart])

  if (!open) return null

  return (
    <div
      className={`sessionSummaryOverlay ${dismissOnBackdrop ? 'sessionSummaryOverlayDismissable' : ''}`}
      onClick={dismissOnBackdrop ? onExit : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Resumen de la sesión"
    >
      <div className="sessionSummaryCard" onClick={(e) => e.stopPropagation()}>
        {headline && (
          <div className="sessionSummaryScoreGroup">
            <span className="sessionSummaryNumber">{headline.value}</span>
            <span className="sessionSummaryLabel">{headline.label}</span>
            {headline.detail && <span className="sessionSummaryDetail">{headline.detail}</span>}
          </div>
        )}

        {stats.length > 0 && (
          <div className="sessionSummaryMeta">
            {stats.map((stat, index) => (
              <Fragment key={stat.label}>
                {index > 0 && <span className="sessionSummaryMetaDivider">•</span>}
                <div className="sessionSummaryMetaItem">
                  <span className="sessionSummaryMetaKey">{stat.label}:</span>
                  <span className="sessionSummaryMetaVal">{stat.value}</span>
                </div>
              </Fragment>
            ))}
          </div>
        )}

        <div className="sessionSummaryActions">
          {onRestart && (
            <button type="button" className="sessionSummaryBtn" onClick={onRestart} autoFocus>
              {restartLabel}
            </button>
          )}
          <button
            type="button"
            className={`sessionSummaryBtn ${onRestart ? 'sessionSummaryBtnSecondary' : ''}`}
            onClick={onExit}
            autoFocus={!onRestart}
          >
            {exitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
