'use client'

/**
 * Componente modular unificado para renderizar estímulos gráficos basados en ilustraciones
 * (SVG o PNG), reutilizado para animales, frutas y futuras categorías.
 *
 * @param {Object} props
 * @param {{ id: string, name: string, src?: string }} [props.item] - Datos de la ilustración
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño de la ilustración
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el ejercicio está en pausa
 * @param {string} [props.category='illustration'] - Categoría ('animals' | 'fruits')
 */
export function StimulusIllustration({
  item,
  size = 'md',
  position,
  isPaused = false,
  category = 'illustration',
}) {
  const current = item || {
    id: 'placeholder',
    name: 'Estímulo',
    src: '',
  }

  return (
    <div
      className={`stimulusIllustration stimulusIllustration-${size} stimulusIllustration-${category} ${
        isPaused ? 'stimulusIllustrationPaused' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      role="img"
      aria-label={`Estímulo ${current.name}`}
    >
      {current.src ? (
        <img
          src={current.src}
          alt={current.name}
          className="stimulusIllustrationImg"
          draggable={false}
          onError={(e) => {
            // Si la imagen todavía no está en /public/fruits/ o da error 404, ocultar img rota y mostrar texto amigable
            e.currentTarget.style.display = 'none'
            if (e.currentTarget.nextElementSibling) {
              e.currentTarget.nextElementSibling.style.display = 'inline-flex'
            }
          }}
        />
      ) : null}
      <span
        className="stimulusIllustrationFallback"
        style={{ display: current.src ? 'none' : 'inline-flex' }}
      >
        {category === 'fruits' ? '🍓' : '🦁'} {current.name}
      </span>
    </div>
  )
}
