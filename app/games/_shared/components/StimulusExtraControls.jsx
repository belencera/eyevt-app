'use client'

import { OptionPicker } from './OptionPicker'
import {
  COLOR_INTERVAL_OPTIONS,
  STIMULUS_SIZE_OPTIONS,
  LETTER_INTERVAL_OPTIONS,
  WORD_LENGTH_OPTIONS,
  WORD_INTERVAL_OPTIONS,
  NUMBER_DIGITS_OPTIONS,
  NUMBER_INTERVAL_OPTIONS,
  ARROW_INTERVAL_OPTIONS,
  ILLUSTRATION_INTERVAL_OPTIONS,
  isIllustrationCategory,
  getRandomWord,
  getRandomNumber,
} from '../data/constants'

/**
 * Renderiza los controles de ajuste para el estímulo activo.
 *
 * Todos los estímulos (punto fijo, colores, letras, palabras, números, flechas e ilustraciones)
 * comparten el mismo selector universal de tamaño, además de sus opciones específicas si aplican.
 */
export function StimulusExtraControls({
  stimulus,
  disabled = false,
  prefix = '',
  showIntervals = false,
}) {
  const id = (name) => (prefix ? `${prefix}-${name}` : name)
  const type = stimulus.stimulusType

  return (
    <>
      {/* ── Selector de Tamaño Universal para TODOS los estímulos ── */}
      <OptionPicker
        id={id('stimulus-size')}
        label="Tamaño del estímulo"
        value={stimulus.sizeLevel}
        options={STIMULUS_SIZE_OPTIONS}
        disabled={disabled}
        onChange={stimulus.setSizeLevel}
      />

      {/* ── Controles específicos de cada estímulo ── */}
      {type === 'colors' && showIntervals && (
        <OptionPicker
          id={id('color-interval')}
          label="Intervalo de cambio"
          value={stimulus.colorInterval}
          options={COLOR_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setColorInterval}
        />
      )}

      {type === 'letters' && showIntervals && (
        <OptionPicker
          id={id('letter-interval')}
          label="Intervalo de cambio"
          value={stimulus.letterInterval}
          options={LETTER_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setLetterInterval}
        />
      )}

      {type === 'words' && (
        <>
          <OptionPicker
            id={id('word-length')}
            label="Longitud de palabra"
            value={stimulus.wordLength}
            options={WORD_LENGTH_OPTIONS}
            disabled={disabled}
            onChange={(len) => {
              stimulus.setWordLength(len)
              stimulus.setCurrentWord(getRandomWord(len))
            }}
          />
          {showIntervals && (
            <OptionPicker
              id={id('word-interval')}
              label="Intervalo de cambio"
              value={stimulus.wordInterval}
              options={WORD_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setWordInterval}
            />
          )}
        </>
      )}

      {type === 'numbers' && (
        <>
          <OptionPicker
            id={id('number-digits')}
            label="Cantidad de dígitos"
            value={stimulus.numberDigits}
            options={NUMBER_DIGITS_OPTIONS}
            disabled={disabled}
            onChange={(digits) => {
              stimulus.setNumberDigits(digits)
              stimulus.setCurrentNumber(getRandomNumber(digits))
            }}
          />
          {showIntervals && (
            <OptionPicker
              id={id('number-interval')}
              label="Intervalo de cambio"
              value={stimulus.numberInterval}
              options={NUMBER_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setNumberInterval}
            />
          )}
        </>
      )}

      {type === 'arrows' && showIntervals && (
        <OptionPicker
          id={id('arrow-interval')}
          label="Intervalo de cambio"
          value={stimulus.arrowInterval}
          options={ARROW_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setArrowInterval}
        />
      )}

      {isIllustrationCategory(type) && showIntervals && (
        <OptionPicker
          id={id('illustration-interval')}
          label="Intervalo de cambio"
          value={stimulus.illustrationInterval}
          options={ILLUSTRATION_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setIllustrationInterval}
        />
      )}
    </>
  )
}

/**
 * Indica si el tipo de estímulo activo tiene controles extra que renderizar.
 * Dado que todos tienen selector de tamaño, siempre devuelve true.
 */
export function hasStimulusExtras() {
  return true
}
