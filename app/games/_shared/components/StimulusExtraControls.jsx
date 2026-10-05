'use client'

import { OptionPicker } from './OptionPicker'
import {
  CHANGE_INTERVAL_OPTIONS,
  STIMULUS_SIZE_OPTIONS,
  WORD_LENGTH_OPTIONS,
  NUMBER_DIGITS_OPTIONS,
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
          id={id('change-interval')}
          label="Intervalo de cambio"
          value={stimulus.colorInterval}
          options={CHANGE_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setColorInterval}
        />
      )}

      {type === 'letters' && showIntervals && (
        <OptionPicker
          id={id('change-interval')}
          label="Intervalo de cambio"
          value={stimulus.letterInterval}
          options={CHANGE_INTERVAL_OPTIONS}
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
              id={id('change-interval')}
              label="Intervalo de cambio"
              value={stimulus.wordInterval}
              options={CHANGE_INTERVAL_OPTIONS}
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
              id={id('change-interval')}
              label="Intervalo de cambio"
              value={stimulus.numberInterval}
              options={CHANGE_INTERVAL_OPTIONS}
              disabled={disabled}
              onChange={stimulus.setNumberInterval}
            />
          )}
        </>
      )}

      {type === 'arrows' && showIntervals && (
        <OptionPicker
          id={id('change-interval')}
          label="Intervalo de cambio"
          value={stimulus.arrowInterval}
          options={CHANGE_INTERVAL_OPTIONS}
          disabled={disabled}
          onChange={stimulus.setArrowInterval}
        />
      )}

      {isIllustrationCategory(type) && showIntervals && (
        <OptionPicker
          id={id('change-interval')}
          label="Intervalo de cambio"
          value={stimulus.illustrationInterval}
          options={CHANGE_INTERVAL_OPTIONS}
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
