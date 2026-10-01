'use client'

import { OptionPicker } from './OptionPicker'
import {
  COLOR_INTERVAL_OPTIONS,
  LETTER_SIZE_OPTIONS,
  LETTER_INTERVAL_OPTIONS,
  WORD_SIZE_OPTIONS,
  WORD_LENGTH_OPTIONS,
  WORD_INTERVAL_OPTIONS,
  NUMBER_SIZE_OPTIONS,
  NUMBER_DIGITS_OPTIONS,
  NUMBER_INTERVAL_OPTIONS,
  ARROW_SIZE_OPTIONS,
  ARROW_INTERVAL_OPTIONS,
  ANIMAL_SIZE_OPTIONS,
  ANIMAL_INTERVAL_OPTIONS,
  FRUIT_SIZE_OPTIONS,
  FRUIT_INTERVAL_OPTIONS,
  getRandomWord,
  getRandomNumber,
} from '../data/constants'

/**
 * Renderiza los controles de ajuste (tamaño, longitud, intervalo…) para
 * el tipo de estímulo activo gestionado por useStimulusManager.
 *
 * Props:
 * - stimulus:      objeto devuelto por useStimulusManager()
 * - disabled:      deshabilita todos los controles (ej: !session.isIdle)
 * - prefix:        prefijo para IDs únicos (ej: 'fixation', 'sacade')
 * - showIntervals: muestra los pickers de intervalo de cambio (solo Seguimientos)
 */
export function StimulusExtraControls({
  stimulus,
  disabled = false,
  prefix = '',
  showIntervals = false,
}) {
  const id = (name) => (prefix ? `${prefix}-${name}` : name)

  switch (stimulus.stimulusType) {
    case 'classic':
      return null

    case 'colors':
      return showIntervals ? (
        <OptionPicker
          id={id('color-interval')}
          label="Cambio de color"
          value={stimulus.colorInterval}
          options={COLOR_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setColorInterval}
        />
      ) : null

    case 'letters':
      return (
        <>
          <OptionPicker
            id={id('letter-size')}
            label="Tamaño de letra"
            value={stimulus.letterSize}
            options={LETTER_SIZE_OPTIONS}
            disabled={disabled}
            onChange={stimulus.setLetterSize}
          />
          {showIntervals && (
            <OptionPicker
              id={id('letter-interval')}
              label="Cambio de letra"
              value={stimulus.letterInterval}
              options={LETTER_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setLetterInterval}
            />
          )}
        </>
      )

    case 'words':
      return (
        <>
          <OptionPicker
            id={id('word-size')}
            label="Tamaño de palabra"
            value={stimulus.wordSize}
            options={WORD_SIZE_OPTIONS}
            disabled={disabled}
            onChange={stimulus.setWordSize}
          />
          <OptionPicker
            id={id('word-length')}
            label="Longitud de palabra"
            value={stimulus.wordLength}
            options={WORD_LENGTH_OPTIONS}
            disabled={disabled}
            onChange={(val) => {
              stimulus.setWordLength(val)
              stimulus.setCurrentWord(getRandomWord(val))
            }}
          />
          {showIntervals && (
            <OptionPicker
              id={id('word-interval')}
              label="Cambio de palabra"
              value={stimulus.wordInterval}
              options={WORD_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setWordInterval}
            />
          )}
        </>
      )

    case 'numbers':
      return (
        <>
          <OptionPicker
            id={id('number-size')}
            label="Tamaño de número"
            value={stimulus.numberSize}
            options={NUMBER_SIZE_OPTIONS}
            disabled={disabled}
            onChange={stimulus.setNumberSize}
          />
          <OptionPicker
            id={id('number-digits')}
            label="Cifras"
            value={stimulus.numberDigits}
            options={NUMBER_DIGITS_OPTIONS}
            disabled={disabled}
            onChange={(val) => {
              stimulus.setNumberDigits(val)
              stimulus.setCurrentNumber(getRandomNumber(val))
            }}
          />
          {showIntervals && (
            <OptionPicker
              id={id('number-interval')}
              label="Cambio de número"
              value={stimulus.numberInterval}
              options={NUMBER_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setNumberInterval}
            />
          )}
        </>
      )

    case 'arrows':
      return (
        <>
          <OptionPicker
            id={id('arrow-size')}
            label="Tamaño de flecha"
            value={stimulus.arrowSize}
            options={ARROW_SIZE_OPTIONS}
            disabled={disabled}
            onChange={stimulus.setArrowSize}
          />
          {showIntervals && (
            <OptionPicker
              id={id('arrow-interval')}
              label="Cambio de flecha"
              value={stimulus.arrowInterval}
              options={ARROW_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setArrowInterval}
            />
          )}
        </>
      )

    case 'animals':
      return (
        <>
          <OptionPicker
            id={id('animal-size')}
            label="Tamaño de animal"
            value={stimulus.animalSize}
            options={ANIMAL_SIZE_OPTIONS}
            disabled={disabled}
            onChange={stimulus.setAnimalSize}
          />
          {showIntervals && (
            <OptionPicker
              id={id('animal-interval')}
              label="Cambio de animal"
              value={stimulus.animalInterval}
              options={ANIMAL_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setAnimalInterval}
            />
          )}
        </>
      )

    case 'fruits':
      return (
        <>
          <OptionPicker
            id={id('fruit-size')}
            label="Tamaño de fruta"
            value={stimulus.fruitSize}
            options={FRUIT_SIZE_OPTIONS}
            disabled={disabled}
            onChange={stimulus.setFruitSize}
          />
          {showIntervals && (
            <OptionPicker
              id={id('fruit-interval')}
              label="Cambio de fruta"
              value={stimulus.fruitInterval}
              options={FRUIT_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setFruitInterval}
            />
          )}
        </>
      )

    default:
      return null
  }
}

/**
 * Indica si el tipo de estímulo activo tiene controles extra que renderizar.
 * Útil para que GameShell sepa si mostrar el placeholder "sin ajustes".
 */
export function hasStimulusExtras(stimulusType, showIntervals = false) {
  if (stimulusType === 'classic') return false
  if (stimulusType === 'colors' && !showIntervals) return false
  return true
}
