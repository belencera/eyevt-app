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
 * Renderiza la miniatura compuesta de percepción simultánea.
 * La base se centra y el overlay respeta fielmente su posición libre (bottom, top, etc.)
 * sin forzar inset: 0 o margin: auto a menos que se especifique explícitamente.
 */
function renderSimultaneousPreview(base, overlay, size = 46) {
  const baseSize = Math.round(size * (base.scale || 1))
  const overlaySize = Math.round(size * (overlay.scale || 0.5))

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src={base.src}
        alt={base.alt}
        width={baseSize}
        height={baseSize}
        style={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
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
 * Factoría para parejas de estímulos de percepción simultánea (1er grado).
 */
function createSimultaneousPair({ id, name, left, right, preview }) {
  const isBaseRight = preview.base === 'right'
  const baseItem = isBaseRight ? right : left
  const overlayItem = isBaseRight ? left : right

  return {
    id,
    name,
    category: 'percepcion-simultanea',
    renderLeft: (size = 70) => renderSingleItem(left.src, left.alt, left.scale ?? 1, left.shadow, size),
    renderRight: (size = 70) => renderSingleItem(right.src, right.alt, right.scale ?? 1, right.shadow, size),
    renderPreview: (size = 46) =>
      renderSimultaneousPreview(
        {
          src: baseItem.src,
          alt: baseItem.alt,
          scale: preview.baseScale || 1,
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

export const SIMULTANEOUS_PERCEPTION_PAIRS = [
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

  createSimultaneousPair({
    id: 'bird-cage',
    name: 'Pájaro · Jaula',
    left: { src: '/vergence/bird.svg', alt: 'Pájaro', scale: 0.55, shadow: 'rgba(255, 172, 51, 0.4)', previewShadow: 'rgba(255, 172, 51, 0.5)' },
    right: { src: '/vergence/bird-cage.svg', alt: 'Jaula', scale: 1, shadow: 'rgba(56, 189, 248, 0.4)', previewShadow: 'rgba(56, 189, 248, 0.35)' },
    preview: { base: 'right', overlayScale: 0.52, overlayPos: { position: 'relative' } },
  }),

  createSimultaneousPair({
    id: 'mouse-cheese',
    name: 'Ratón · Queso',
    left: { src: '/vergence/mouse.svg', alt: 'Ratón', scale: 1, shadow: 'rgba(148, 163, 184, 0.45)', previewShadow: 'rgba(148, 163, 184, 0.4)' },
    right: { src: '/vergence/cheese.svg', alt: 'Queso', scale: 0.85, shadow: 'rgba(251, 191, 36, 0.5)', previewShadow: 'rgba(251, 191, 36, 0.6)' },
    preview: { base: 'left', overlayScale: 0.52, overlayPos: { bottom: '1px' } },
  }),

  createSimultaneousPair({
    id: 'spider-web',
    name: 'Araña · Telaraña',
    left: { src: '/vergence/spider.svg', alt: 'Araña', scale: 0.85, shadow: 'rgba(130, 130, 134, 0.45)', previewShadow: 'rgba(130, 130, 134, 0.4)' },
    right: { src: '/vergence/spider-web.svg', alt: 'Telaraña', scale: 1, shadow: 'rgba(151, 151, 151, 0.4)', previewShadow: 'rgba(151, 151, 151, 0.35)' },
    preview: { base: 'right', overlayScale: 0.65, overlayPos: { inset: 0, margin: 'auto' } },
  }),

  createSimultaneousPair({
    id: 'monkey-banana',
    name: 'Mono · Plátano',
    left: { src: '/vergence/monkey.svg', alt: 'Mono', scale: 1, shadow: 'rgba(180, 110, 60, 0.45)', previewShadow: 'rgba(180, 110, 60, 0.4)' },
    right: { src: '/vergence/banana.svg', alt: 'Plátano', scale: 0.9, shadow: 'rgba(250, 204, 21, 0.5)', previewShadow: 'rgba(250, 204, 21, 0.6)' },
    preview: { base: 'left', overlayScale: 0.62, overlayPos: { bottom: '2px', left: '2px' } },
  }),

  createSimultaneousPair({
    id: 'ball-goal',
    name: 'Balón · Portería',
    left: { src: '/vergence/soccer-ball.svg', alt: 'Balón', scale: 0.85, shadow: 'rgba(255, 255, 255, 0.5)', previewShadow: 'rgba(255, 255, 255, 0.6)' },
    right: { src: '/vergence/goal-net.svg', alt: 'Portería', scale: 1, shadow: 'rgba(56, 189, 248, 0.4)', previewShadow: 'rgba(56, 189, 248, 0.35)' },
    preview: { base: 'right', overlayScale: 0.58, overlayPos: { bottom: '4px' } },
  }),

  createSimultaneousPair({
    id: 'car-road',
    name: 'Coche · Carretera',
    left: { src: '/vergence/automobile.svg', alt: 'Coche', scale: 1, shadow: 'rgba(241, 87, 68, 0.45)', previewShadow: 'rgba(241, 87, 68, 0.55)' },
    right: { src: '/vergence/motorway.svg', alt: 'Carretera', scale: 1, shadow: 'rgba(56, 189, 248, 0.4)', previewShadow: 'rgba(56, 189, 248, 0.35)' },
    preview: { base: 'right', overlayScale: 0.72, overlayPos: { bottom: '3px' } },
  }),

  createSimultaneousPair({
    id: 'bus-stop',
    name: 'Bus · Parada',
    left: { src: '/vergence/bus.svg', alt: 'Bus', scale: 1, shadow: 'rgba(255, 206, 49, 0.45)', previewShadow: 'rgba(255, 206, 49, 0.55)' },
    right: { src: '/vergence/bus-stop.svg', alt: 'Parada', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    preview: { base: 'left', baseScale: 0.82, overlayScale: 0.78, overlayPos: { bottom: '2px', right: '2px' } },
  }),

  createSimultaneousPair({
    id: 'map-magnifier',
    name: 'Lupa · Mapa',
    left: { src: '/vergence/magnifying-glass-tilted-left.svg', alt: 'Lupa', scale: 1, shadow: 'rgba(176, 189, 198, 0.5)', previewShadow: 'rgba(176, 189, 198, 0.6)' },
    right: { src: '/vergence/world-map.svg', alt: 'Mapa', scale: 1, shadow: 'rgba(0, 192, 207, 0.45)', previewShadow: 'rgba(0, 192, 207, 0.35)' },
    preview: { base: 'right', overlayScale: 0.78, overlayPos: { inset: 0, margin: 'auto' } },
  }),

  createSimultaneousPair({
    id: 'pencil-paper',
    name: 'Lápiz · Papel',
    left: { src: '/vergence/memo-pencil.svg', alt: 'Lápiz', scale: 1, shadow: 'rgba(255, 206, 49, 0.45)', previewShadow: 'rgba(255, 206, 49, 0.55)' },
    right: { src: '/vergence/memo-paper.svg', alt: 'Papel', scale: 1, shadow: 'rgba(239, 216, 177, 0.5)', previewShadow: 'rgba(239, 216, 177, 0.4)' },
    preview: { base: 'right', baseScale: 0.92, overlayScale: 0.92, overlayPos: { inset: 0, margin: 'auto' } },
  }),

  createSimultaneousPair({
    id: 'flan-plate',
    name: 'Flan · Plato',
    left: { src: '/vergence/custard-flan.svg', alt: 'Flan', scale: 1, shadow: 'rgba(255, 209, 112, 0.5)', previewShadow: 'rgba(255, 209, 112, 0.6)' },
    right: { src: '/vergence/custard-plate.svg', alt: 'Plato', scale: 1, shadow: 'rgba(168, 82, 26, 0.45)', previewShadow: 'rgba(168, 82, 26, 0.35)' },
    preview: { base: 'right', baseScale: 0.95, overlayScale: 0.95, overlayPos: { inset: 0, margin: 'auto' } },
  }),

  createSimultaneousPair({
    id: 'crab-shell',
    name: 'Cangrejo · Caracola',
    left: { src: '/vergence/crab.svg', alt: 'Cangrejo', scale: 0.9, shadow: 'rgba(237, 76, 92, 0.45)', previewShadow: 'rgba(237, 76, 92, 0.55)' },
    right: { src: '/vergence/spiral-shell.svg', alt: 'Caracola', scale: 1, shadow: 'rgba(221, 177, 153, 0.45)', previewShadow: 'rgba(221, 177, 153, 0.35)' },
    preview: { base: 'right', overlayScale: 0.65, overlayPos: { bottom: '2px', right: '2px' } },
  }),

  createSimultaneousPair({
    id: 'dolphin-water',
    name: 'Delfín · Agua',
    left: { src: '/vergence/dolphin-animal.svg', alt: 'Delfín', scale: 1, shadow: 'rgba(56, 191, 214, 0.45)', previewShadow: 'rgba(56, 191, 214, 0.4)' },
    right: { src: '/vergence/dolphin-water.svg', alt: 'Agua', scale: 1, shadow: 'rgba(66, 173, 226, 0.45)', previewShadow: 'rgba(66, 173, 226, 0.35)' },
    preview: { base: 'right', baseScale: 0.95, overlayScale: 0.95, overlayPos: { inset: 0, margin: 'auto' } },
  }),

  createSimultaneousPair({
    id: 'firetruck-fire',
    name: 'Bomberos · Fuego',
    left: { src: '/vergence/fire-engine.svg', alt: 'Camión de bomberos', scale: 1, shadow: 'rgba(241, 78, 58, 0.45)', previewShadow: 'rgba(241, 78, 58, 0.35)' },
    right: { src: '/vergence/fire.svg', alt: 'Fuego', scale: 0.85, shadow: 'rgba(255, 157, 51, 0.5)', previewShadow: 'rgba(255, 157, 51, 0.6)' },
    preview: { base: 'left', overlayScale: 0.52, overlayPos: { top: '1px', right: '2px' } },
  }),

  createSimultaneousPair({
    id: 'tennis',
    name: 'Pelota · Raqueta',
    left: { src: '/vergence/tennis-ball.svg', alt: 'Pelota de tenis', scale: 0.58, shadow: 'rgba(199, 231, 85, 0.55)', previewShadow: 'rgba(199, 231, 85, 0.6)' },
    right: { src: '/vergence/tennis-racket.svg', alt: 'Raqueta de tenis', scale: 1, shadow: 'rgba(255, 113, 127, 0.45)', previewShadow: 'rgba(255, 113, 127, 0.35)' },
    preview: { base: 'right', overlayScale: 0.42, overlayPos: { top: '2px', left: '2px' } },
  }),

  createSimultaneousPair({
    id: 'clown-circus',
    name: 'Payaso · Circo',
    left: { src: '/vergence/clown-face.svg', alt: 'Payaso', scale: 0.72, shadow: 'rgba(255, 82, 99, 0.5)', previewShadow: 'rgba(255, 82, 99, 0.6)' },
    right: { src: '/vergence/circus-tent.svg', alt: 'Circo', scale: 1, shadow: 'rgba(237, 76, 92, 0.45)', previewShadow: 'rgba(237, 76, 92, 0.35)' },
    preview: { base: 'right', overlayScale: 0.52, overlayPos: { bottom: '3px', left: 0, right: 0, margin: 'auto' } },
  }),

  createSimultaneousPair({
    id: 'bee-flower',
    name: 'Abeja · Flor',
    left: { src: '/vergence/honeybee.svg', alt: 'Abeja', scale: 0.85, shadow: 'rgba(250, 204, 21, 0.5)', previewShadow: 'rgba(250, 204, 21, 0.6)' },
    right: { src: '/vergence/hibiscus.svg', alt: 'Flor', scale: 1, shadow: 'rgba(244, 63, 94, 0.45)', previewShadow: 'rgba(244, 63, 94, 0.35)' },
    preview: { base: 'right', baseScale: 1.15, overlayScale: 0.70, overlayPos: { top: '-2px', right: '-2px' } },
  }),

  createSimultaneousPair({
    id: 'target-arrow',
    name: 'Diana · Flecha',
    left: { src: '/vergence/target.svg', alt: 'Diana', scale: 1, shadow: 'rgba(66, 139, 193, 0.45)', previewShadow: 'rgba(66, 139, 193, 0.4)' },
    right: { src: '/vergence/arrow.svg', alt: 'Flecha', scale: 1, shadow: 'rgba(242, 178, 0, 0.45)', previewShadow: 'rgba(242, 178, 0, 0.55)' },
    preview: { base: 'left', baseScale: 1., overlayScale: 1, overlayPos: { inset: 0, margin: 'auto' } },
  }),
]
