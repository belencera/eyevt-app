'use client'

/**
 * Componente de estímulo visual.
 * 
 * En esta versión renderiza el estímulo por colores (o punto clásico),
 * con brillo dinámico acorde al tono actual.
 * Diseñado para extenderse fácilmente a letras, palabras, animales, etc.
 */
export function StimulusDot({
  position,
  color,
  isPaused = false,
  stimulusType = 'colors',
}) {
  const hex = color?.hex || '#38bdf8'

  return (
    <div
      className={`gameDot ${isPaused ? 'gameDotPaused' : ''}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        backgroundColor: hex,
        boxShadow: isPaused
          ? `0 0 16px ${hex}66`
          : `0 0 24px ${hex}, 0 0 48px ${hex}55`,
      }}
      aria-label={`Estímulo ${color?.name || ''}`}
    />
  )
}
