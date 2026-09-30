'use client'

/**
 * Componente modular para renderizar el estímulo de animal ilustrado.
 *
 * @param {Object} props
 * @param {{ id: string, name: string, src: string }} [props.animal] - Datos del animal
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Tamaño del animal
 * @param {{ x: number, y: number }} props.position - Posición porcentual en pantalla
 * @param {boolean} [props.isPaused=false] - Indica si el ejercicio está en pausa
 */
export function StimulusAnimal({
  animal,
  size = 'md',
  position,
  isPaused = false,
}) {
  const current = animal || {
    id: 'perro',
    name: 'Perro',
    src: '/animals/1F436_color.png',
  }

  return (
    <div
      className={`stimulusAnimal stimulusAnimal-${size} ${
        isPaused ? 'stimulusAnimalPaused' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      role="img"
      aria-label={`Estímulo animal ${current.name}`}
    >
      <img
        src={current.src}
        alt={current.name}
        className="stimulusAnimalImg"
        draggable={false}
      />
    </div>
  )
}
