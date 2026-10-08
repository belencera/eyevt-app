'use client'

import React from 'react'

const PRESET_LETTERS = ['E', 'A', 'O', 'X']
const PRESET_WORDS = ['CASA', 'LUNA', 'LUZ']

/**
 * Control antisupresión compartido entre palabras y frases.
 */
function SuppressionControl({
  idPrefix,
  active,
  disabled,
  onChange,
  onSeedIncrement,
  description,
}) {
  return (
    <div className="dashDurationBlock">
      <div className="convModeHeader">
        <span className="controlLabel" id={`conv-suppression-label-${idPrefix}`}>
          Supresión de letras
        </span>
        <span className="convModeSubtext">
          {description || 'Control antisupresión eliminando letras de manera aleatoria'}
        </span>
      </div>
      <div
        className="durationRow"
        role="radiogroup"
        aria-labelledby={`conv-suppression-label-${idPrefix}`}
      >
        <button
          type="button"
          role="radio"
          aria-checked={!active}
          disabled={disabled}
          className={`dashPillBtn ${!active ? 'dashPillBtnActive' : ''}`}
          onClick={() => onChange(false)}
          title="Mostrar todo el texto completo en ambos ojos"
        >
          Desactivada
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={active}
          disabled={disabled}
          className={`dashPillBtn ${active ? 'dashPillBtnActive' : ''}`}
          onClick={() => {
            onChange(true)
            onSeedIncrement?.()
          }}
          title="Ocultar aleatoriamente letras en cada ojo para control antisupresión"
        >
          Activa
        </button>
      </div>
    </div>
  )
}

/**
 * Selector dinámico de texto para Letra, Palabra o Frase con píldoras predefinidas + input editable.
 */
export function FusionExtraControls({
  activePair,
  disabled,
  stimulusLetter,
  setStimulusLetter,
  stimulusWord,
  setStimulusWord,
  stimulusPhrase,
  setStimulusPhrase,
  letterSuppression,
  setLetterSuppression,
  setSuppressionSeed,
}) {
  if (!activePair) return null

  // ── Caso 1: Letra Dinámica ──
  if (activePair.isDynamicLetter) {
    return (
      <div className="dashDurationBlock">
        <span className="controlLabel" id="conv-letter-label">
          Letra del estímulo
        </span>
        <div
          className="durationRow"
          role="radiogroup"
          aria-labelledby="conv-letter-label"
        >
          {PRESET_LETTERS.map((char) => {
            const isSelected = stimulusLetter === char
            return (
              <button
                key={char}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                className={`dashPillBtn ${isSelected ? 'dashPillBtnActive' : ''}`}
                onClick={() => setStimulusLetter(char)}
                title={`Elegir letra ${char}`}
              >
                {char}
              </button>
            )
          })}

          <div
            className={`dashPillBtn convLetterInputPill ${
              !PRESET_LETTERS.includes(stimulusLetter) ? 'dashPillBtnActive' : ''
            }`}
            onClick={() => {
              const el = document.getElementById('custom-letter-input')
              if (el) el.focus()
            }}
          >
            <label htmlFor="custom-letter-input" className="convLetterInputPillLabel">
              Escribir:
            </label>
            <input
              id="custom-letter-input"
              type="text"
              maxLength={2}
              value={stimulusLetter}
              onChange={(e) => {
                const char = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1)
                if (char) setStimulusLetter(char)
              }}
              onFocus={(e) => e.target.select()}
              className="convLetterInlineInput"
              placeholder="E"
              title="Haz clic para escribir cualquier letra o número"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Caso 2: Palabra Dinámica ──
  if (activePair.isDynamicWord) {
    return (
      <>
        <div className="dashDurationBlock">
          <span className="controlLabel" id="conv-word-label">
            Palabra del estímulo
          </span>
          <div
            className="durationRow"
            role="radiogroup"
            aria-labelledby="conv-word-label"
          >
            {PRESET_WORDS.map((w) => {
              const isSelected = stimulusWord === w
              return (
                <button
                  key={w}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={disabled}
                  className={`dashPillBtn ${isSelected ? 'dashPillBtnActive' : ''}`}
                  onClick={() => setStimulusWord(w)}
                  title={`Elegir palabra ${w}`}
                >
                  {w}
                </button>
              )
            })}

            <div
              className={`dashPillBtn convWordInputPill ${
                !PRESET_WORDS.includes(stimulusWord) ? 'dashPillBtnActive' : ''
              }`}
              onClick={() => {
                const el = document.getElementById('custom-word-input')
                if (el) el.focus()
              }}
            >
              <label htmlFor="custom-word-input" className="convLetterInputPillLabel">
                Escribir:
              </label>
              <input
                id="custom-word-input"
                type="text"
                maxLength={8}
                value={stimulusWord}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '').toUpperCase()
                  if (val) setStimulusWord(val)
                }}
                onFocus={(e) => e.target.select()}
                className="convWordInlineInput"
                placeholder="CASA"
                title="Haz clic para escribir cualquier palabra"
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {activePair.category !== 'estereopsis' && (
          <SuppressionControl
            idPrefix="word"
            active={letterSuppression}
            disabled={disabled}
            onChange={setLetterSuppression}
            onSeedIncrement={() => setSuppressionSeed((s) => s + 1)}
            description="Control antisupresión eliminando letras de manera aleatoria"
          />
        )}
      </>
    )
  }

  // ── Caso 3: Frase Dinámica ──
  if (activePair.isDynamicPhrase) {
    const isDefaultPhrase = stimulusPhrase === 'ENTRENA TU VISIÓN'
    return (
      <>
        <div className="dashDurationBlock">
          <span className="controlLabel" id="conv-phrase-label">
            Frase del estímulo
          </span>
          <div
            className="durationRow"
            role="radiogroup"
            aria-labelledby="conv-phrase-label"
          >
            <button
              type="button"
              role="radio"
              aria-checked={isDefaultPhrase}
              disabled={disabled}
              className={`dashPillBtn ${isDefaultPhrase ? 'dashPillBtnActive' : ''}`}
              onClick={() => setStimulusPhrase('ENTRENA TU VISIÓN')}
              title="Elegir frase de ejemplo: ENTRENA TU VISIÓN"
              style={{ flex: 1.2 }}
            >
              ENTRENA TU VISIÓN
            </button>

            <div
              className={`dashPillBtn convPhraseInputPill ${
                !isDefaultPhrase ? 'dashPillBtnActive' : ''
              }`}
              onClick={() => {
                const el = document.getElementById('custom-phrase-input')
                if (el) el.focus()
              }}
            >
              <label htmlFor="custom-phrase-input" className="convLetterInputPillLabel">
                Escribir:
              </label>
              <input
                id="custom-phrase-input"
                type="text"
                maxLength={45}
                value={stimulusPhrase}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,¡!¿?]/g, '').toUpperCase()
                  if (val) setStimulusPhrase(val)
                }}
                onFocus={(e) => e.target.select()}
                className="convPhraseInlineInput"
                placeholder="ENTRENA TU VISIÓN"
                title="Escribe cualquier frase personalizada (se distribuirá en renglones)"
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {activePair.category !== 'estereopsis' && (
          <SuppressionControl
            idPrefix="phrase"
            active={letterSuppression}
            disabled={disabled}
            onChange={setLetterSuppression}
            onSeedIncrement={() => setSuppressionSeed((s) => s + 1)}
            description="Control antisupresión eliminando letras de manera aleatoria"
          />
        )}
      </>
    )
  }

  return null
}
