'use client'

/**
 * Componente unificado para mostrar el feedback en tiempo real al terapeuta
 * según el estímulo activo (color, letra, palabra o animal).
 */
export function TherapistBadge({
  stimulusType,
  color,
  letter,
  word,
  animal,
  fruit,
  number,
  arrow,
}) {
  if (stimulusType === 'colors' && color) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Color actual</span>
        <div className="therapistColorBadge">
          <span
            className="therapistColorDot"
            style={{
              backgroundColor: color.hex,
              boxShadow: `0 0 10px ${color.hex}`,
            }}
          />
          <span className="therapistColorName">{color.name}</span>
        </div>
      </div>
    )
  }

  if (stimulusType === 'letters' && letter) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Letra actual</span>
        <div className="therapistLetterBadge">
          <span className="therapistLetterChar">{letter}</span>
        </div>
      </div>
    )
  }

  if (stimulusType === 'words' && word) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Palabra actual</span>
        <div className="therapistWordBadge">
          <span className="therapistWordText">{word}</span>
        </div>
      </div>
    )
  }

  if (stimulusType === 'numbers' && number != null) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Número actual</span>
        <div className="therapistWordBadge">
          <span className="therapistWordText">{number}</span>
        </div>
      </div>
    )
  }

  if (stimulusType === 'arrows' && arrow) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Dirección actual</span>
        <div className="therapistWordBadge therapistArrowBadge">
          <span className="therapistArrowSymbol">{arrow.symbol}</span>
          <span className="therapistWordText">{arrow.name}</span>
        </div>
      </div>
    )
  }

  if (stimulusType === 'animals' && animal) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Animal actual</span>
        <div className="therapistAnimalBadge">
          {animal.src ? (
            <img
              src={animal.src}
              alt={animal.name}
              className="therapistAnimalThumb"
            />
          ) : (
            <span>🦁</span>
          )}
          <span className="therapistAnimalName">{animal.name}</span>
        </div>
      </div>
    )
  }

  if (stimulusType === 'fruits' && fruit) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Fruta actual</span>
        <div className="therapistAnimalBadge therapistFruitBadge">
          {fruit.src ? (
            <img
              src={fruit.src}
              alt={fruit.name}
              className="therapistAnimalThumb"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span>🍓</span>
          )}
          <span className="therapistAnimalName">{fruit.name}</span>
        </div>
      </div>
    )
  }

  return null
}
