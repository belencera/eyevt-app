import React from 'react'

export const STIMULI_CATEGORIES = [
  { id: 'percepcion-simultanea', label: 'Percepción simultánea' },
  { id: 'fusion-plana', label: 'Fusión plana' },
  { id: 'estereopsis', label: 'Estereopsis' },
]

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
 * Renderiza la vista previa compuesta (miniatura) de una pareja de estímulos.
 */
function renderComposedPreview(base, overlay, size = 46) {
  const overlaySize = Math.round(size * (overlay.scale || 0.5))
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={base.src}
        alt={base.alt}
        width={size}
        height={size}
        style={{
          position: 'absolute',
          inset: 0,
          objectFit: 'contain',
          filter: `drop-shadow(0 0 4px ${base.shadow})`,
        }}
        draggable={false}
      />
      <img
        src={overlay.src}
        alt={overlay.alt}
        width={overlaySize}
        height={overlaySize}
        style={{
          position: overlay.pos?.position || 'absolute',
          objectFit: 'contain',
          filter: `drop-shadow(0 0 4px ${overlay.shadow})`,
          ...overlay.pos,
        }}
        draggable={false}
      />
    </div>
  )
}

/**
 * Factoría para crear parejas de estímulos basadas en imágenes SVG sin duplicar JSX.
 */
function createStimulusPair({ id, name, category = 'percepcion-simultanea', left, right, preview }) {
  const isBaseRight = preview.base === 'right'
  const baseItem = isBaseRight ? right : left
  const overlayItem = isBaseRight ? left : right

  return {
    id,
    name,
    category,
    renderLeft: (size = 70) => renderSingleItem(left.src, left.alt, left.scale ?? 1, left.shadow, size),
    renderRight: (size = 70) => renderSingleItem(right.src, right.alt, right.scale ?? 1, right.shadow, size),
    renderPreview: (size = 46) =>
      renderComposedPreview(
        {
          src: baseItem.src,
          alt: baseItem.alt,
          shadow: preview.baseShadow || baseItem.previewShadow || baseItem.shadow,
        },
        {
          src: overlayItem.src,
          alt: overlayItem.alt,
          scale: preview.overlayScale,
          shadow: preview.overlayShadow || overlayItem.previewShadow || overlayItem.shadow,
          pos: preview.overlayPos,
        },
        size
      ),
  }
}

/**
 * Catálogo de parejas complementarias de estímulos para convergencia.
 */
export const STIMULI_PAIRS = [
  // ─── CATEGORÍA: PERCEPCIÓN SIMULTÁNEA ───────────────────────
  {
    id: 'cross',
    name: 'Cruz',
    category: 'percepcion-simultanea',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <line x1="30" y1="8" x2="30" y2="52" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <line x1="8" y1="30" x2="52" y2="30" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <line x1="30" y1="8" x2="30" y2="52" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="8" y1="30" x2="52" y2="30" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },

  createStimulusPair({
    id: 'bird-cage',
    name: 'Pájaro · Jaula',
    left: { src: '/vergence/bird.svg', alt: 'Pájaro', scale: 0.55, shadow: 'rgba(255, 172, 51, 0.4)', previewShadow: 'rgba(255, 172, 51, 0.5)' },
    right: { src: '/vergence/bird-cage.svg', alt: 'Jaula', scale: 1, shadow: 'rgba(56, 189, 248, 0.4)', previewShadow: 'rgba(56, 189, 248, 0.35)' },
    preview: { base: 'right', overlayScale: 0.52, overlayPos: { position: 'relative' } },
  }),

  createStimulusPair({
    id: 'mouse-cheese',
    name: 'Ratón · Queso',
    left: { src: '/vergence/mouse.svg', alt: 'Ratón', scale: 1, shadow: 'rgba(148, 163, 184, 0.45)', previewShadow: 'rgba(148, 163, 184, 0.4)' },
    right: { src: '/vergence/cheese.svg', alt: 'Queso', scale: 0.85, shadow: 'rgba(251, 191, 36, 0.5)', previewShadow: 'rgba(251, 191, 36, 0.6)' },
    preview: { base: 'left', overlayScale: 0.52, overlayPos: { bottom: '1px' } },
  }),

  createStimulusPair({
    id: 'monkey-banana',
    name: 'Mono · Plátano',
    left: { src: '/vergence/monkey.svg', alt: 'Mono', scale: 1, shadow: 'rgba(180, 110, 60, 0.45)', previewShadow: 'rgba(180, 110, 60, 0.4)' },
    right: { src: '/vergence/banana.svg', alt: 'Plátano', scale: 0.9, shadow: 'rgba(250, 204, 21, 0.5)', previewShadow: 'rgba(250, 204, 21, 0.6)' },
    preview: { base: 'left', overlayScale: 0.62, overlayPos: { bottom: '2px', left: '2px' } },
  }),

  createStimulusPair({
    id: 'ball-goal',
    name: 'Balón · Portería',
    left: { src: '/vergence/soccer-ball.svg', alt: 'Balón', scale: 0.85, shadow: 'rgba(255, 255, 255, 0.5)', previewShadow: 'rgba(255, 255, 255, 0.6)' },
    right: { src: '/vergence/goal-net.svg', alt: 'Portería', scale: 1, shadow: 'rgba(56, 189, 248, 0.4)', previewShadow: 'rgba(56, 189, 248, 0.35)' },
    preview: { base: 'right', overlayScale: 0.58, overlayPos: { bottom: '4px' } },
  }),

  createStimulusPair({
    id: 'car-road',
    name: 'Coche · Carretera',
    left: { src: '/vergence/automobile.svg', alt: 'Coche', scale: 1, shadow: 'rgba(241, 87, 68, 0.45)', previewShadow: 'rgba(241, 87, 68, 0.55)' },
    right: { src: '/vergence/motorway.svg', alt: 'Carretera', scale: 1, shadow: 'rgba(56, 189, 248, 0.4)', previewShadow: 'rgba(56, 189, 248, 0.35)' },
    preview: { base: 'right', overlayScale: 0.72, overlayPos: { bottom: '3px' } },
  }),

  createStimulusPair({
    id: 'map-magnifier',
    name: 'Lupa · Mapa',
    left: { src: '/vergence/magnifying-glass-tilted-left.svg', alt: 'Lupa', scale: 1, shadow: 'rgba(176, 189, 198, 0.5)', previewShadow: 'rgba(176, 189, 198, 0.6)' },
    right: { src: '/vergence/world-map.svg', alt: 'Mapa', scale: 1, shadow: 'rgba(0, 192, 207, 0.45)', previewShadow: 'rgba(0, 192, 207, 0.35)' },
    preview: { base: 'right', overlayScale: 0.78, overlayPos: { inset: 0, margin: 'auto' } },
  }),

  createStimulusPair({
    id: 'crab-shell',
    name: 'Cangrejo · Caracola',
    left: { src: '/vergence/crab.svg', alt: 'Cangrejo', scale: 0.9, shadow: 'rgba(237, 76, 92, 0.45)', previewShadow: 'rgba(237, 76, 92, 0.55)' },
    right: { src: '/vergence/spiral-shell.svg', alt: 'Caracola', scale: 1, shadow: 'rgba(221, 177, 153, 0.45)', previewShadow: 'rgba(221, 177, 153, 0.35)' },
    preview: { base: 'right', overlayScale: 0.65, overlayPos: { bottom: '2px', right: '2px' } },
  }),

  createStimulusPair({
    id: 'firetruck-fire',
    name: 'Bomberos · Fuego',
    left: { src: '/vergence/fire-engine.svg', alt: 'Camión de bomberos', scale: 1, shadow: 'rgba(241, 78, 58, 0.45)', previewShadow: 'rgba(241, 78, 58, 0.35)' },
    right: { src: '/vergence/fire.svg', alt: 'Fuego', scale: 0.85, shadow: 'rgba(255, 157, 51, 0.5)', previewShadow: 'rgba(255, 157, 51, 0.6)' },
    preview: { base: 'left', overlayScale: 0.52, overlayPos: { top: '1px', right: '2px' } },
  }),

  createStimulusPair({
    id: 'tennis',
    name: 'Pelota · Raqueta',
    left: { src: '/vergence/tennis-ball.svg', alt: 'Pelota de tenis', scale: 0.58, shadow: 'rgba(199, 231, 85, 0.55)', previewShadow: 'rgba(199, 231, 85, 0.6)' },
    right: { src: '/vergence/tennis-racket.svg', alt: 'Raqueta de tenis', scale: 1, shadow: 'rgba(255, 113, 127, 0.45)', previewShadow: 'rgba(255, 113, 127, 0.35)' },
    preview: { base: 'right', overlayScale: 0.42, overlayPos: { top: '2px', left: '2px' } },
  }),
]

export const CONVERGENCE_MODES = [
  {
    value: 'fixed',
    label: 'Fijo',
    description: 'Distancia constante entre estímulos',
    icon: 'fixed',
  },
  {
    value: 'motion',
    label: 'En movimiento',
    description: 'Los estímulos se alejan de forma progresiva',
    icon: 'motion',
  },
]

export const INITIAL_DISTANCE_OPTIONS = [
  { value: 60, label: '60 px' },
  { value: 100, label: '100 px' },
  { value: 140, label: '140 px' },
  { value: 180, label: '180 px' },
  { value: 240, label: '240 px' },
  { value: 300, label: '300 px' },
]

export const SPEED_OPTIONS = [
  { value: 2, label: 'Muy lento' },
  { value: 4, label: 'Lento' },
  { value: 8, label: 'Medio' },
  { value: 14, label: 'Rápido' },
  { value: 20, label: 'Muy rápido' },
]

export const STIMULUS_SIZE_PX = {
  sm: 52,
  md: 76,
  lg: 104,
  xl: 132,
}

export const STIMULUS_SIZE_OPTIONS = [
  { value: 'sm', label: 'Pequeño' },
  { value: 'md', label: 'Mediano' },
  { value: 'lg', label: 'Grande' },
  { value: 'xl', label: 'Muy grande' },
]
