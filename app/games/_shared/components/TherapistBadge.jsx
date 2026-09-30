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

  if (stimulusType === 'animals' && animal) {
    return (
      <div className="therapistFeedback">
        <span className="therapistFeedbackLabel">Animal actual</span>
        <div className="therapistAnimalBadge">
          <img
            src={animal.src}
            alt={animal.name}
            className="therapistAnimalThumb"
          />
          <span className="therapistAnimalName">{animal.name}</span>
        </div>
      </div>
    )
  }

  return null
}
