import React from 'react'

const svgCache = new Map()

/**
 * Pre-carga un archivo SVG en memoria si aún no está en caché.
 */
function preloadSvg(src) {
  if (!src || svgCache.has(src) || typeof window === 'undefined') return
  fetch(src)
    .then((r) => r.text())
    .then((text) => svgCache.set(src, text))
    .catch(() => {})
}

/**
 * Componente que renderiza un estímulo vectorial de Fusión Plana desde un único archivo SVG en disco.
 * El SVG contiene tanto la base común como los elementos antisupresión (<g id="fusion-left"> y <g id="fusion-right">).
 * La visibilidad de cada ojo se controla limpiamente por CSS sobre el contenedor padre.
 */
export function FlatFusionItem({ src, eye = 'both', size = 70, shadowColor = 'transparent', scale = 1 }) {
  const [svgHtml, setSvgHtml] = React.useState(() => (src ? svgCache.get(src) || '' : ''))

  React.useEffect(() => {
    if (!src) return
    if (svgCache.has(src)) {
      setSvgHtml(svgCache.get(src))
    } else {
      fetch(src)
        .then((res) => res.text())
        .then((text) => {
          svgCache.set(src, text)
          setSvgHtml(text)
        })
        .catch((err) => console.error('Error al cargar SVG de fusión:', src, err))
    }
  }, [src])

  const s = Math.round(size * scale)

  return (
    <div
      className={`flat-fusion-item fusion-eye-${eye}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        filter: shadowColor && shadowColor !== 'transparent' ? `drop-shadow(0 0 6px ${shadowColor})` : 'none',
      }}
    >
      <div
        style={{
          width: s,
          height: s,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
    </div>
  )
}

/**
 * Factoría modular y limpia para crear parejas de fusión plana a partir de un único archivo SVG en disco.
 */
export function createFlatFusionPair({
  id,
  name,
  src,
  shadowColor = 'rgba(56, 189, 248, 0.45)',
  previewScale = 0.82,
}) {
  preloadSvg(src)

  return {
    id,
    name,
    category: 'fusion-plana',
    src,
    renderLeft: (size = 70) => (
      <FlatFusionItem src={src} eye="left" size={size} shadowColor={shadowColor} />
    ),
    renderRight: (size = 70) => (
      <FlatFusionItem src={src} eye="right" size={size} shadowColor={shadowColor} />
    ),
    renderPreview: (size = 46) => (
      <FlatFusionItem src={src} eye="both" size={size} scale={previewScale} shadowColor={shadowColor} />
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
          <line x1="23" y1="8" x2="37" y2="8" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
          <line x1="30" y1="2" x2="30" y2="14" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
          <line x1="24" y1="4" x2="36" y2="4" stroke="#38bdf8" strokeWidth="2.6" strokeLinecap="round" />
          <line x1="30" y1="0" x2="30" y2="8" stroke="#38bdf8" strokeWidth="2.6" strokeLinecap="round" />
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
 * Estímulo de palabra con control antisupresión para fusión plana.
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
        <svg viewBox={`0 0 ${baseW} 60`} width={svgW} height={size} fill="none" style={{ overflow: 'visible' }}>
          <line x1={midX - 7} y1="8" x2={midX + 7} y2="8" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
        <svg viewBox={`0 0 ${baseW} 60`} width={svgW} height={size} fill="none" style={{ overflow: 'visible' }}>
          <line x1={midX} y1="2" x2={midX} y2="14" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
  const text = 'CASA'
  return (
    <svg viewBox="0 0 72 54" className="convWordThumbSvg" fill="none" style={{ overflow: 'visible' }}>
      <line x1="29" y1="5" x2="43" y2="5" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="36" y1="0" x2="36" y2="10" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
    return [words.slice(0, p1).join(' '), words.slice(p1, p2).join(' '), words.slice(p2).join(' ')]
  }
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

/**
 * Estímulo de frase en varios renglones con control antisupresión para fusión plana.
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
        <svg viewBox={`0 0 ${baseW} ${baseH}`} width={svgW} height={svgH} fill="none" style={{ overflow: 'visible' }}>
          <line x1={midX - 7} y1="8" x2={midX + 7} y2="8" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
        <svg viewBox={`0 0 ${baseW} ${baseH}`} width={svgW} height={svgH} fill="none" style={{ overflow: 'visible' }}>
          <line x1={midX} y1="2" x2={midX} y2="14" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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
  return (
    <svg viewBox="0 0 68 66" fill="none" style={{ overflow: 'visible', transform: 'translateY(2px)' }}>
      <line x1="26" y1="5" x2="42" y2="5" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="34" y1="0" x2="34" y2="10" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
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

/**
 * Catálogo de estímulos de Fusión Plana (2º grado).
 * Cada figura apunta a un único archivo .svg modular en /vergence/ con capas etiquetadas.
 */
export const FLAT_FUSION_PAIRS = [
  createLetterStimulusPair('E'),

  createFlatFusionPair({
    id: 'suns-fusion',
    name: 'Sol',
    src: '/vergence/sun.svg',
    shadowColor: 'rgba(255, 206, 49, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'tulip-fusion',
    name: 'Tulipán',
    src: '/vergence/tulip.svg',
    shadowColor: 'rgba(232, 77, 136, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'rabbit-fusion',
    name: 'Conejo',
    src: '/vergence/rabbit.svg',
    shadowColor: 'rgba(178, 182, 184, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'emoji-fusion',
    name: 'Emoji',
    src: '/vergence/emoji.svg',
    shadowColor: 'rgba(255, 221, 103, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'avocado-fusion',
    name: 'Aguacate',
    src: '/vergence/avocado.svg',
    shadowColor: 'rgba(105, 150, 53, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'eye-fusion',
    name: 'Ojo',
    src: '/vergence/eye.svg',
    shadowColor: 'rgba(66, 173, 226, 0.45)',
    previewScale: 1.05,
  }),

  createFlatFusionPair({
    id: 'pizza-fusion',
    name: 'Pizza',
    src: '/vergence/pizza.svg',
    shadowColor: 'rgba(201, 142, 82, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'traffic-light-fusion',
    name: 'Semáforo',
    src: '/vergence/traffic-light.svg',
    shadowColor: 'rgba(255, 230, 46, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'alien-fusion',
    name: 'Alien',
    src: '/vergence/alien-monster.svg',
    shadowColor: 'rgba(98, 251, 246, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'rocket-fusion',
    name: 'Cohete',
    src: '/vergence/rocket.svg',
    shadowColor: 'rgba(201, 71, 71, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'robot-fusion',
    name: 'Robot',
    src: '/vergence/robot.svg',
    shadowColor: 'rgba(0, 185, 241, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'palette-fusion',
    name: 'Pintura',
    src: '/vergence/palette.svg',
    shadowColor: 'rgba(246, 199, 153, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'ski-fusion',
    name: 'Ski',
    src: '/vergence/ski.svg',
    shadowColor: 'rgba(237, 76, 92, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'city-fusion',
    name: 'Ciudad',
    src: '/vergence/city.svg',
    shadowColor: 'rgba(66, 173, 226, 0.45)',
    previewScale: 0.82,
  }),

  createFlatFusionPair({
    id: 'desert-island-fusion',
    name: 'Isla',
    src: '/vergence/desert-island.svg',
    shadowColor: 'rgba(66, 173, 226, 0.45)',
    previewScale: 0.82,
  }),

  createWordStimulusPair('CASA'),
  createPhraseStimulusPair('ENTRENA TU VISIÓN'),
]
