import React from 'react'

/**
 * Renderiza un estímulo visual individual dentro de un contenedor centrado.
 */
function renderSingleItem(src, alt, scale = 1, shadow, size = 70) {
  const s = Math.round(size * scale)
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={src}
        alt={alt}
        width={s}
        height={s}
        style={{ objectFit: 'contain', filter: `drop-shadow(0 0 8px ${shadow})` }}
        draggable={false}
      />
    </div>
  )
}

/**
 * Renderiza la miniatura compuesta de fusión plana.
 * Todas las capas se solapan al 100% en el centro con inset: 0 y margin: auto,
 * permitiendo aplicar máscaras (clipPath) y controles de supresión exactos.
 */
function renderFlatFusionPreview(base, overlayOrList, size = 46) {
  const baseSize = Math.round(size * (base.scale || 1))
  const overlayList = Array.isArray(overlayOrList) ? overlayOrList : [overlayOrList]

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={base.src}
        alt={base.alt}
        width={baseSize}
        height={baseSize}
        style={{
          position: base.pos?.position || 'absolute',
          inset: 0,
          margin: 'auto',
          objectFit: 'contain',
          filter: base.shadow === 'transparent' ? 'none' : `drop-shadow(0 0 4px ${base.shadow})`,
          ...base.pos,
        }}
        draggable={false}
      />
      {overlayList.map((overlay, index) => {
        const overlaySize = Math.round(size * (overlay.scale || 0.5))
        return (
          <img
            key={index}
            src={overlay.src}
            alt={overlay.alt}
            width={overlaySize}
            height={overlaySize}
            style={{
              position: overlay.pos?.position || 'absolute',
              inset: 0,
              margin: 'auto',
              objectFit: 'contain',
              filter: overlay.shadow === 'transparent' ? 'none' : `drop-shadow(0 0 4px ${overlay.shadow})`,
              ...overlay.pos,
            }}
            draggable={false}
          />
        )
      })}
    </div>
  )
}

/**
 * Factoría para parejas de estímulos de fusión plana (2º grado).
 */
function createStimulusPair({ id, name, left, right, preview }) {
  const isBaseRight = preview.base === 'right'
  const baseItem = isBaseRight ? right : left
  const overlayItem = isBaseRight ? left : right

  let overlayParam
  if (Array.isArray(preview.overlays)) {
    overlayParam = preview.overlays.map((ov) => ({
      src: (ov.fromBase ? baseItem : overlayItem).src,
      alt: (ov.fromBase ? baseItem : overlayItem).alt,
      scale: ov.scale ?? preview.overlayScale ?? preview.baseScale ?? 1,
      shadow: ov.shadow ?? preview.overlayShadow ?? overlayItem.previewShadow ?? overlayItem.shadow,
      pos: ov.pos ?? preview.overlayPos,
    }))
  } else {
    overlayParam = {
      src: overlayItem.src,
      alt: overlayItem.alt,
      scale: preview.overlayScale ?? 1,
      shadow: preview.overlayShadow || overlayItem.previewShadow || overlayItem.shadow,
      pos: preview.overlayPos,
    }
  }

  return {
    id,
    name,
    category: 'fusion-plana',
    renderLeft: (size = 70) => renderSingleItem(left.src, left.alt, left.scale ?? 1, left.shadow, size),
    renderRight: (size = 70) => renderSingleItem(right.src, right.alt, right.scale ?? 1, right.shadow, size),
    renderPreview: (size = 46) =>
      renderFlatFusionPreview(
        {
          src: baseItem.src,
          alt: baseItem.alt,
          scale: preview.baseScale || 1,
          shadow: preview.baseShadow || baseItem.previewShadow || baseItem.shadow,
          pos: preview.basePos,
        },
        overlayParam,
        size
      ),
  }
}

export const LETTER_FUSION_ID = 'letter-fusion'

/**
 * Estímulo de letra con control antisupresión para fusión plana:
 * - Ojo izquierdo: Letra con raya horizontal superior.
 * - Ojo derecho: Misma letra con raya vertical superior.
 * - Fusión / Vista previa: Letra coronada por una cruz completa (+).
 */
export function createLetterStimulusPair(initialLetter = 'E') {
  return {
    id: LETTER_FUSION_ID,
    name: 'Letra',
    category: 'fusion-plana',
    isDynamicLetter: true,
    renderLeft: (size = 70, letter) => {
      const char = (typeof letter === 'string' && letter.trim() ? letter : initialLetter).trim().charAt(0).toUpperCase() || 'E'
      return (
        <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
          {/* Raya horizontal superior pequeña (Ojo izquierdo) */}
          <line x1="23" y1="8" x2="37" y2="8" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Letra centrada dominante */}
          <text
            x="30"
            y="49"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="36"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            style={{ userSelect: 'none' }}
          >
            {char}
          </text>
        </svg>
      )
    },
    renderRight: (size = 70, letter) => {
      const char = (typeof letter === 'string' && letter.trim() ? letter : initialLetter).trim().charAt(0).toUpperCase() || 'E'
      return (
        <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
          {/* Raya vertical superior pequeña (Ojo derecho) */}
          <line x1="30" y1="2" x2="30" y2="14" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Letra centrada dominante */}
          <text
            x="30"
            y="49"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="36"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            style={{ userSelect: 'none' }}
          >
            {char}
          </text>
        </svg>
      )
    },
    renderPreview: (size = 46, letter) => {
      const char = (typeof letter === 'string' && letter.trim() ? letter : initialLetter).trim().charAt(0).toUpperCase() || 'E'
      return (
        <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
          {/* Cruz pequeña (+) superior al fusionar con holgura respecto a la letra */}
          <line x1="24" y1="4" x2="36" y2="4" stroke="#38bdf8" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="30" y1="0" x2="30" y2="8" stroke="#38bdf8" strokeWidth="2.6" strokeLinecap="round" />
          {/* Letra centrada dominante manteniendo su tamaño grande */}
          <text
            x="30"
            y="54"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="37"
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            style={{ userSelect: 'none' }}
          >
            {char}
          </text>
        </svg>
      )
    },
  }
}

export const WORD_FUSION_ID = 'word-fusion'

/**
 * Genera conjuntos de índices de letras para supresión dicóptica complementaria.
 * Para cada palabra de 2 o más letras:
 * - Ojo izquierdo oculta exactamente 1 letra aleatoria.
 * - Ojo derecho oculta exactamente 1 letra aleatoria distinta.
 * Las letras ocultas se mantienen en el DOM SVG con 'fill="transparent"' y 'visibility: hidden'
 * para garantizar métrica espacial y kerning 100% idénticos entre ambos ojos.
 */
export function getDichopticSuppressionIndices(text, seed = 0) {
  if (!text || typeof text !== 'string') return { left: new Set(), right: new Set() }

  const wordRegex = /[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]+/gi
  let match
  const left = new Set()
  const right = new Set()

  let s = Math.abs(seed) + 1
  const nextRandom = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0]
    const startIndex = match.index
    const len = word.length
    if (len >= 2) {
      const leftRel = Math.floor(nextRandom() * len)
      const offset = 1 + Math.floor(nextRandom() * (len - 1))
      const rightRel = (leftRel + offset) % len

      left.add(startIndex + leftRel)
      right.add(startIndex + rightRel)
    }
  }

  return { left, right }
}

/**
 * Estímulo de palabra con control antisupresión para fusión plana:
 * - Ojo izquierdo: Palabra con raya horizontal superior.
 * - Ojo derecho: Misma palabra con raya vertical superior.
 * - Fusión / Vista previa: Palabra coronada por una cruz completa (+).
 */
export function createWordStimulusPair(initialWord = 'CASA') {
  return {
    id: WORD_FUSION_ID,
    name: 'Palabras',
    category: 'fusion-plana',
    isDynamicWord: true,
    renderLeft: (size = 70, word, options = {}) => {
      const text = (typeof word === 'string' && word.trim() ? word : initialWord).trim().toUpperCase() || 'CASA'
      const baseW = Math.max(76, text.length * 17 + 24)
      const midX = baseW / 2
      const svgW = Math.round(size * (baseW / 60))
      const suppressed = options?.letterSuppression
        ? getDichopticSuppressionIndices(text, options.seed || 0).left
        : null

      return (
        <svg
          viewBox={`0 0 ${baseW} 60`}
          width={svgW}
          height={size}
          fill="none"
          style={{ overflow: 'visible' }}
        >
          {/* Raya horizontal superior pequeña (Ojo izquierdo) */}
          <line x1={midX - 7} y1="8" x2={midX + 7} y2="8" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Palabra centrada dominante */}
          <text
            x={midX}
            y="48"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="26"
            fontWeight="bold"
            letterSpacing="1px"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            style={{ userSelect: 'none' }}
          >
            {suppressed
              ? text.split('').map((char, i) => (
                  <tspan
                    key={i}
                    fill={suppressed.has(i) ? 'transparent' : '#38bdf8'}
                    style={suppressed.has(i) ? { visibility: 'hidden', opacity: 0 } : undefined}
                  >
                    {char}
                  </tspan>
                ))
              : text}
          </text>
        </svg>
      )
    },
    renderRight: (size = 70, word, options = {}) => {
      const text = (typeof word === 'string' && word.trim() ? word : initialWord).trim().toUpperCase() || 'CASA'
      const baseW = Math.max(76, text.length * 17 + 24)
      const midX = baseW / 2
      const svgW = Math.round(size * (baseW / 60))
      const suppressed = options?.letterSuppression
        ? getDichopticSuppressionIndices(text, options.seed || 0).right
        : null

      return (
        <svg
          viewBox={`0 0 ${baseW} 60`}
          width={svgW}
          height={size}
          fill="none"
          style={{ overflow: 'visible' }}
        >
          {/* Raya vertical superior pequeña (Ojo derecho) */}
          <line x1={midX} y1="2" x2={midX} y2="14" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Palabra centrada dominante */}
          <text
            x={midX}
            y="48"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="26"
            fontWeight="bold"
            letterSpacing="1px"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            style={{ userSelect: 'none' }}
          >
            {suppressed
              ? text.split('').map((char, i) => (
                  <tspan
                    key={i}
                    fill={suppressed.has(i) ? 'transparent' : '#38bdf8'}
                    style={suppressed.has(i) ? { visibility: 'hidden', opacity: 0 } : undefined}
                  >
                    {char}
                  </tspan>
                ))
              : text}
          </text>
        </svg>
      )
    },
    renderPreview: renderWordPreview,
  }
}

/**
 * Miniatura estándar para el estímulo de Palabras, compartida entre Fusión Plana y Estereopsis.
 */
export function renderWordPreview(size = 46) {
  // Miniatura fija siempre en 'CASA', ampliada de tamaño con separación de la cruz
  const text = 'CASA'
  return (
    <svg
      viewBox="0 0 72 54"
      className="convWordThumbSvg"
      fill="none"
      style={{ overflow: 'visible' }}
    >
      {/* Cruz (+) de fusión completa */}
      <line x1="29" y1="5" x2="43" y2="5" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="36" y1="0" x2="36" y2="10" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      {/* Palabra centrada dominante de gran tamaño */}
      <text
        x="36"
        y="48"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="28"
        fontWeight="bold"
        letterSpacing="0.8px"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        style={{ userSelect: 'none' }}
      >
        {text}
      </text>
    </svg>
  )
}

export const PHRASE_FUSION_ID = 'phrase-fusion'

/**
 * Divide una frase en 2 o 3 renglones equilibrados para facilitar la fusión binocular.
 */
export function splitPhraseIntoLines(phrase) {
  const clean = (typeof phrase === 'string' && phrase.trim() ? phrase : 'ENTRENA TU VISIÓN').trim().toUpperCase()
  const words = clean.split(/\s+/).filter(Boolean)
  if (words.length <= 1) return [clean]
  if (words.length === 2) return [words[0], words[1]]
  if (words.length === 3) return [words[0], `${words[1]} ${words[2]}`]
  if (words.length === 4) return [`${words[0]} ${words[1]}`, `${words[2]} ${words[3]}`]
  if (words.length >= 6) {
    const p1 = Math.ceil(words.length / 3)
    const p2 = Math.ceil((words.length * 2) / 3)
    return [
      words.slice(0, p1).join(' '),
      words.slice(p1, p2).join(' '),
      words.slice(p2).join(' '),
    ]
  }
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

/**
 * Estímulo de frase en varios renglones con control antisupresión para fusión plana:
 * - Ojo izquierdo: Frase multilínea con raya horizontal superior.
 * - Ojo derecho: Misma frase multilínea con raya vertical superior.
 * - Fusión: Frase multilínea coronada por una cruz completa (+).
 * - Miniatura: Fija en 'FRASE' con la misma cruz y escala destacada.
 */
export function createPhraseStimulusPair(initialPhrase = 'ENTRENA TU VISIÓN') {
  return {
    id: PHRASE_FUSION_ID,
    name: 'Frase',
    category: 'fusion-plana',
    isDynamicPhrase: true,
    renderLeft: (size = 70, phrase, options = {}) => {
      const lines = splitPhraseIntoLines(phrase || initialPhrase)
      const maxLen = Math.max(...lines.map((l) => l.length), 8)
      const baseW = Math.max(92, maxLen * 13 + 30)
      const lineHeight = 24
      const textStartY = 40
      const baseH = textStartY + (lines.length - 1) * lineHeight + 18
      const midX = baseW / 2
      const svgW = Math.round(size * (baseW / 60))
      const svgH = Math.round(size * (baseH / 60))

      return (
        <svg
          viewBox={`0 0 ${baseW} ${baseH}`}
          width={svgW}
          height={svgH}
          fill="none"
          style={{ overflow: 'visible' }}
        >
          {/* Raya horizontal superior pequeña (Ojo izquierdo) con clara separación */}
          <line x1={midX - 7} y1="8" x2={midX + 7} y2="8" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Frase distribuida en renglones holgados */}
          {lines.map((lineText, idx) => {
            const suppressed = options?.letterSuppression
              ? getDichopticSuppressionIndices(lineText, (options.seed || 0) + idx * 101).left
              : null

            return (
              <text
                key={idx}
                x={midX}
                y={textStartY + idx * lineHeight}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="20"
                fontWeight="bold"
                letterSpacing="0.8px"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                style={{ userSelect: 'none' }}
              >
                {suppressed
                  ? lineText.split('').map((char, charIdx) => (
                      <tspan
                        key={charIdx}
                        fill={suppressed.has(charIdx) ? 'transparent' : '#38bdf8'}
                        style={suppressed.has(charIdx) ? { visibility: 'hidden', opacity: 0 } : undefined}
                      >
                        {char}
                      </tspan>
                    ))
                  : lineText}
              </text>
            )
          })}
        </svg>
      )
    },
    renderRight: (size = 70, phrase, options = {}) => {
      const lines = splitPhraseIntoLines(phrase || initialPhrase)
      const maxLen = Math.max(...lines.map((l) => l.length), 8)
      const baseW = Math.max(92, maxLen * 13 + 30)
      const lineHeight = 24
      const textStartY = 40
      const baseH = textStartY + (lines.length - 1) * lineHeight + 18
      const midX = baseW / 2
      const svgW = Math.round(size * (baseW / 60))
      const svgH = Math.round(size * (baseH / 60))

      return (
        <svg
          viewBox={`0 0 ${baseW} ${baseH}`}
          width={svgW}
          height={svgH}
          fill="none"
          style={{ overflow: 'visible' }}
        >
          {/* Raya vertical superior pequeña (Ojo derecho) con clara separación */}
          <line x1={midX} y1="2" x2={midX} y2="14" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          {/* Frase distribuida en renglones holgados */}
          {lines.map((lineText, idx) => {
            const suppressed = options?.letterSuppression
              ? getDichopticSuppressionIndices(lineText, (options.seed || 0) + idx * 101).right
              : null

            return (
              <text
                key={idx}
                x={midX}
                y={textStartY + idx * lineHeight}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="20"
                fontWeight="bold"
                letterSpacing="0.8px"
                fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                style={{ userSelect: 'none' }}
              >
                {suppressed
                  ? lineText.split('').map((char, charIdx) => (
                      <tspan
                        key={charIdx}
                        fill={suppressed.has(charIdx) ? 'transparent' : '#38bdf8'}
                        style={suppressed.has(charIdx) ? { visibility: 'hidden', opacity: 0 } : undefined}
                      >
                        {char}
                      </tspan>
                    ))
                  : lineText}
              </text>
            )
          })}
        </svg>
      )
    },
    renderPreview: renderPhrasePreview,
  }
}

/**
 * Miniatura estándar para el estímulo de Frase, compartida entre Fusión Plana y Estereopsis.
 */
export function renderPhrasePreview(size = 46) {
  // Miniatura fija en 'ENTRENA TU VISIÓN': texto más grande, holgura con la cruz y pegado abajo junto a 'Frase'
  return (
    <svg
      viewBox="0 0 68 66"
      fill="none"
      style={{ overflow: 'visible', transform: 'translateY(2px)' }}
    >
      {/* Cruz (+) de fusión completa en la cúspide (alineada con la cruz de otras tarjetas) */}
      <line x1="26" y1="5" x2="42" y2="5" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="34" y1="0" x2="34" y2="10" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      {/* Frase en dos renglones: más grande, con separación de la cruz y cercana al título 'Frase' */}
      <text
        x="34"
        y="37"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="18.5"
        fontWeight="bold"
        letterSpacing="0.3px"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        style={{ userSelect: 'none' }}
      >
        ENTRENA
      </text>
      <text
        x="34"
        y="63"
        textAnchor="middle"
        fill="#38bdf8"
        fontSize="17"
        fontWeight="bold"
        letterSpacing="0.3px"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        style={{ userSelect: 'none' }}
      >
        TU VISIÓN
      </text>
    </svg>
  )
}

export const FLAT_FUSION_PAIRS = [
  createLetterStimulusPair('E'),

  createStimulusPair({
    id: 'suns-fusion',
    name: 'Sol',
    left: { src: '/vergence/sun-a.svg', alt: 'Sol 1', scale: 1, shadow: 'rgba(255, 206, 49, 0.45)', previewShadow: 'rgba(255, 206, 49, 0.35)' },
    right: { src: '/vergence/sun-b.svg', alt: 'Sol 2', scale: 1, shadow: 'rgba(255, 206, 49, 0.45)', previewShadow: 'rgba(255, 206, 49, 0.35)' },
    preview: { base: 'left', baseScale: 0.82, overlayScale: 0.82 },
  }),

  createStimulusPair({
    id: 'tulip-fusion',
    name: 'Tulipán',
    left: { src: '/vergence/tulip-a.svg', alt: 'Tulipán 1', scale: 1, shadow: 'rgba(232, 77, 136, 0.45)', previewShadow: 'rgba(232, 77, 136, 0.35)' },
    right: { src: '/vergence/tulip-b.svg', alt: 'Tulipán 2', scale: 1, shadow: 'rgba(232, 77, 136, 0.45)', previewShadow: 'rgba(232, 77, 136, 0.35)' },
    preview: { base: 'left', baseScale: 0.82, overlayScale: 0.82 },
  }),

  createStimulusPair({
    id: 'rabbit-fusion',
    name: 'Conejo',
    left: { src: '/vergence/rabbit-a.svg', alt: 'Conejo 1', scale: 1, shadow: 'rgba(178, 182, 184, 0.45)', previewShadow: 'rgba(178, 182, 184, 0.35)' },
    right: { src: '/vergence/rabbit-b.svg', alt: 'Conejo 2', scale: 1, shadow: 'rgba(178, 182, 184, 0.45)', previewShadow: 'rgba(178, 182, 184, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(0 50% 0 0)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'emoji-fusion',
    name: 'Emoji',
    left: { src: '/vergence/emoji-a.svg', alt: 'Emoji sin lengua', scale: 1, shadow: 'rgba(255, 221, 103, 0.45)', previewShadow: 'rgba(255, 221, 103, 0.35)' },
    right: { src: '/vergence/emoji-b.svg', alt: 'Emoji sin pupila', scale: 1, shadow: 'rgba(255, 221, 103, 0.45)', previewShadow: 'rgba(255, 221, 103, 0.35)' },
    preview: {
      base: 'right',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(0 0 50% 0)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'avocado-fusion',
    name: 'Aguacate',
    left: { src: '/vergence/avocado-a.svg', alt: 'Aguacate sin hueso', scale: 1, shadow: 'rgba(105, 150, 53, 0.45)', previewShadow: 'rgba(105, 150, 53, 0.35)' },
    right: { src: '/vergence/avocado-b.svg', alt: 'Aguacate con hueso', scale: 1, shadow: 'rgba(105, 150, 53, 0.45)', previewShadow: 'rgba(105, 150, 53, 0.35)' },
    preview: { base: 'left', baseScale: 0.82, overlayScale: 0.82 },
  }),

  createStimulusPair({
    id: 'eye-fusion',
    name: 'Ojo',
    left: { src: '/vergence/eye-a.svg', alt: 'Ojo 1', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    right: { src: '/vergence/eye-b.svg', alt: 'Ojo 2', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    preview: {
      base: 'right',
      baseScale: 1.05,
      overlayScale: 1.05,
      overlayPos: { clipPath: 'circle(13% at 50% 50%)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'pizza-fusion',
    name: 'Pizza',
    left: { src: '/vergence/pizza-a.svg', alt: 'Pizza con ingredientes', scale: 1, shadow: 'rgba(201, 142, 82, 0.45)', previewShadow: 'rgba(201, 142, 82, 0.35)' },
    right: { src: '/vergence/pizza-b.svg', alt: 'Pizza sin ingredientes', scale: 1, shadow: 'rgba(201, 142, 82, 0.45)', previewShadow: 'rgba(201, 142, 82, 0.35)' },
    preview: { base: 'right', baseScale: 0.82, overlayScale: 0.82 },
  }),

  createStimulusPair({
    id: 'traffic-light-fusion',
    name: 'Semáforo',
    left: { src: '/vergence/traffic-light-a.svg', alt: 'Semáforo 1', scale: 1, shadow: 'rgba(255, 230, 46, 0.45)', previewShadow: 'rgba(255, 230, 46, 0.35)' },
    right: { src: '/vergence/traffic-light-b.svg', alt: 'Semáforo 2', scale: 1, shadow: 'rgba(255, 230, 46, 0.45)', previewShadow: 'rgba(255, 230, 46, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(34% 0 34% 0)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'alien-fusion',
    name: 'Alien',
    left: { src: '/vergence/alien-monster-a.svg', alt: 'Alien 1', scale: 1, shadow: 'rgba(98, 251, 246, 0.45)', previewShadow: 'rgba(98, 251, 246, 0.35)' },
    right: { src: '/vergence/alien-monster-b.svg', alt: 'Alien 2', scale: 1, shadow: 'rgba(98, 251, 246, 0.45)', previewShadow: 'rgba(98, 251, 246, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(0 0 68% 0)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'rocket-fusion',
    name: 'Cohete',
    left: { src: '/vergence/rocket-a.svg', alt: 'Cohete 1', scale: 1, shadow: 'rgba(201, 71, 71, 0.45)', previewShadow: 'rgba(201, 71, 71, 0.35)' },
    right: { src: '/vergence/rocket-b.svg', alt: 'Cohete 2', scale: 1, shadow: 'rgba(201, 71, 71, 0.45)', previewShadow: 'rgba(201, 71, 71, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(0 0 58% 0)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'robot-fusion',
    name: 'Robot',
    left: { src: '/vergence/robot-a.svg', alt: 'Robot 1', scale: 1, shadow: 'rgba(0, 185, 241, 0.45)', previewShadow: 'rgba(0, 185, 241, 0.35)' },
    right: { src: '/vergence/robot-b.svg', alt: 'Robot 2', scale: 1, shadow: 'rgba(0, 185, 241, 0.45)', previewShadow: 'rgba(0, 185, 241, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(0 50% 0 0)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'palette-fusion',
    name: 'Pintura',
    left: { src: '/vergence/palette-a.svg', alt: 'Pintura 1', scale: 1, shadow: 'rgba(246, 199, 153, 0.45)', previewShadow: 'rgba(246, 199, 153, 0.35)' },
    right: { src: '/vergence/palette-b.svg', alt: 'Pintura 2', scale: 1, shadow: 'rgba(246, 199, 153, 0.45)', previewShadow: 'rgba(246, 199, 153, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlays: [
        {
          pos: { clipPath: 'inset(0 0 68% 28%)' },
          shadow: 'transparent',
        },
        {
          pos: { clipPath: 'inset(48% 66% 28% 8%)' },
          shadow: 'transparent',
        },
      ],
    },
  }),

  createStimulusPair({
    id: 'ski-fusion',
    name: 'Ski',
    left: { src: '/vergence/ski-a.svg', alt: 'Ski sin bufanda', scale: 1, shadow: 'rgba(237, 76, 92, 0.45)', previewShadow: 'rgba(237, 76, 92, 0.35)' },
    right: { src: '/vergence/ski-b.svg', alt: 'Ski con bufanda', scale: 1, shadow: 'rgba(237, 76, 92, 0.45)', previewShadow: 'rgba(237, 76, 92, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
    },
  }),

  createStimulusPair({
    id: 'city-fusion',
    name: 'Ciudad',
    left: { src: '/vergence/city-a.svg', alt: 'Ciudad sin luna', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    right: { src: '/vergence/city-b.svg', alt: 'Ciudad sin luces', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'inset(0 0 65% 60%)' },
      overlayShadow: 'transparent',
    },
  }),

  createStimulusPair({
    id: 'desert-island-fusion',
    name: 'Isla',
    left: { src: '/vergence/desert-island-a.svg', alt: 'Isla desierta sin sol', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    right: { src: '/vergence/desert-island-b.svg', alt: 'Isla desierta sin nubes', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    preview: {
      base: 'left',
      baseScale: 0.82,
      overlayScale: 0.82,
      overlayPos: { clipPath: 'circle(14% at 81.25% 18.75%)' },
      overlayShadow: 'transparent',
    },
  }),

  createWordStimulusPair('CASA'),
  createPhraseStimulusPair('ENTRENA TU VISIÓN'),
]
