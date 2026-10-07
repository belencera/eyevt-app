import React from 'react'

/**
 * Renderiza el estímulo vectorial de anillos concéntricos con disparidad horizontal.
 *
 * - Anillo exterior: permanece centrado en (50, 50) en ambos ojos como plano de referencia (disparidad cero).
 * - Marcas de alineación cardinales: facilitan la correspondencia sensorial y el anclaje fusional.
 * - Anillo interior y punto central: desplazados horizontalmente según el valor de 'disparity'
 *   para inducir la percepción de profundidad 3D.
 */
export function StereoConcentricRingsSVG({ size = 76, disparity = 0, isPreview = false }) {
  const color = '#38bdf8'
  const innerCx = 50 + disparity

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        style={{
          overflow: 'visible',
          filter: `drop-shadow(0 0 ${isPreview ? '3px' : '6px'} rgba(56, 189, 248, 0.45))`,
        }}
      >
        {/* 1. Anillo Exterior de Referencia (Plano de Pantalla · Disparidad Cero) */}
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke={color}
          strokeWidth="3"
          opacity="0.85"
        />

        {/* 2. Marcas Cardinales de Fijación y Alineación */}
        <line x1="50" y1="3" x2="50" y2="10" stroke={color} strokeWidth="2.2" opacity="0.6" strokeLinecap="round" />
        <line x1="50" y1="90" x2="50" y2="97" stroke={color} strokeWidth="2.2" opacity="0.6" strokeLinecap="round" />
        <line x1="3" y1="50" x2="10" y2="50" stroke={color} strokeWidth="2.2" opacity="0.6" strokeLinecap="round" />
        <line x1="90" y1="50" x2="97" y2="50" stroke={color} strokeWidth="2.2" opacity="0.6" strokeLinecap="round" />

        {/* 3. Anillo Interior con Disparidad Horizontal */}
        <circle
          cx={innerCx}
          cy="50"
          r="23"
          stroke={color}
          strokeWidth="3.6"
          fill="rgba(56, 189, 248, 0.16)"
        />

        {/* 4. Punto Central de Enfoque */}
        <circle
          cx={innerCx}
          cy="50"
          r="4.5"
          fill={color}
        />
      </svg>
    </div>
  )
}

/**
 * Componente genérico para renderizar figuras compuestas SVG con efecto de estereopsis (profundidad 3D).
 *
 * @param {number} size - Tamaño en px del contenedor del estímulo.
 * @param {string} viewBox - ViewBox del SVG original (ej. "0 0 64 64").
 * @param {React.ReactNode} base - Elementos SVG fijos (plano 0 / fondo / estela / cuerpo).
 * @param {React.ReactNode} floating - Elementos SVG que se desplazan horizontalmente (estrella, ala, etc.).
 * @param {number} disparity - Desplazamiento horizontal en unidades del viewBox (- para ojo izq, + para ojo der, 0 para preview).
 * @param {boolean} isPreview - Si es miniatura en la tarjeta del selector.
 * @param {string} shadowColor - Color del resplandor/sombra sutil.
 */
export function StereoCompoundSVG({
  size = 76,
  viewBox = '0 0 64 64',
  base,
  floating,
  floatingBack = null,
  disparity = 0,
  isPreview = false,
  shadowColor = 'rgba(255, 208, 90, 0.45)',
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        style={{
          overflow: 'visible',
          filter: `drop-shadow(0 0 ${isPreview ? '3px' : '6px'} ${shadowColor})`,
        }}
      >
        {/* Capa de Profundidad (Disparidad invertida · Se hunde hacia detrás) */}
        {floatingBack && (
          <g transform={`translate(${-disparity}, 0)`}>
            {floatingBack}
          </g>
        )}

        {/* Capa Base (Plano 0 / Disparidad cero) */}
        {base}

        {/* Capa Flotante de Relieve (Disparidad directa · Flota hacia adelante) */}
        {floating && (
          <g transform={`translate(${disparity}, 0)`}>
            {floating}
          </g>
        )}
      </svg>
    </div>
  )
}

/**
 * Creador genérico y reutilizable de parejas de estímulos de estereopsis.
 * Permite registrar fácilmente nuevos SVGs definiendo simplemente su base y su elemento flotante.
 */
export function createStereoPair({
  id,
  name,
  description,
  viewBox = '0 0 64 64',
  base,
  floating,
  floatingBack = null,
  disparity = 1.8,
  shadowColor = 'rgba(255, 208, 90, 0.45)',
  previewScale = 1.0,
}) {
  return {
    id,
    name,
    category: 'estereopsis',
    description,
    renderLeft: (size = 76) => (
      <StereoCompoundSVG
        size={size}
        viewBox={viewBox}
        base={base}
        floating={floating}
        floatingBack={floatingBack}
        disparity={-disparity}
        shadowColor={shadowColor}
      />
    ),
    renderRight: (size = 76) => (
      <StereoCompoundSVG
        size={size}
        viewBox={viewBox}
        base={base}
        floating={floating}
        floatingBack={floatingBack}
        disparity={disparity}
        shadowColor={shadowColor}
      />
    ),
    renderPreview: (size = 38) => (
      <StereoCompoundSVG
        size={Math.round(size * previewScale)}
        viewBox={viewBox}
        base={base}
        floating={floating}
        floatingBack={floatingBack}
        disparity={0}
        isPreview
        shadowColor={shadowColor}
      />
    ),
  }
}

/**
 * Catálogo de parejas de estímulos para Estereopsis (3er grado de visión binocular).
 */
export const STEREOPSIS_PAIRS = [
  {
    id: 'concentric-rings',
    name: 'Círculos',
    category: 'estereopsis',
    description: 'Anillo interior flotando en 3D por disparidad retiniana horizontal.',
    renderLeft: (size = 76) => <StereoConcentricRingsSVG size={size} disparity={-3.5} />,
    renderRight: (size = 76) => <StereoConcentricRingsSVG size={size} disparity={3.5} />,
    renderPreview: (size = 38) => <StereoConcentricRingsSVG size={size} disparity={0} isPreview />,
  },

  // Estímulo de Estrella creado a partir de public/vergence/dizzy.svg
  createStereoPair({
    id: 'shooting-star',
    name: 'Estrella',
    description: 'Estrella flotando en relieve 3D sobre la estela fija de fondo.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <path
        fill="#ffdd7d"
        d="M59.7 13.8c1.7-5.2 1.2-14.9-16.6-3.2C25 22.5 6.2 50.3 7.6 55.4c1.1 4 17.3-5 26-17.2c.7-1 8.7 8.8 7.6 9.8C33.4 55.8 8.3 65.7 3 60.6c-6.1-5.9 16.7-39.8 40.1-53.3c6.4-3.7 25.5-12.5 16.6 6.5"
      />
    ),
    floating: (
      <path
        fill="#ffd05a"
        d="M60.6 49.5L46.7 48l-9.1 10.6l-2.9-13.7l-12.9-5.4l12.2-7l1.2-13.9L45.5 28l13.6-3.2l-5.7 12.7z"
      />
    ),
    disparity: 1.8,
    shadowColor: 'rgba(255, 208, 90, 0.45)',
  }),

  // Estímulo de Arcoíris creado a partir de public/vergence/rainbow.svg
  createStereoPair({
    id: 'rainbow',
    name: 'Arcoíris',
    description: 'Nube completa flotando en relieve 3D sobre el arcoíris de fondo.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        <path fill="#f66" d="M62 6.5V2C35 2 13.2 23.8 13.2 50.6h4.5C17.7 26.3 37.5 6.5 62 6.5" />
        <path fill="#fffb80" d="M17.7 50.6h4.5C22.2 28.8 40 11 62 11V6.5c-24.5 0-44.3 19.8-44.3 44.1" />
        <path fill="#a3e66f" d="M62 15.5V11c-22 0-39.8 17.7-39.8 39.6h4.5c0-19.4 15.8-35.1 35.3-35.1" />
        <path fill="#66c2ff" d="M26.7 50.6h4.5C31.3 33.7 45 20 62 20v-4.5c-19.5 0-35.3 15.7-35.3 35.1" />
        <path fill="#9180ff" d="M62 24.5V20c-17 0-30.7 13.7-30.7 30.6h4.5c0-14.4 11.7-26.1 26.2-26.1" />
      </>
    ),
    // La nube entera flotando hacia ADELANTE en 3D
    floating: (
      <>
        <path fill="#fff" d="M10.1 60.7q-1.05 0-2.1-.3c-2.8-.9-4.7-3.5-4.7-6.4c0-1.9.8-3.8 2.3-5.1l1.2-.9l.4-1.6c1.1-3.9 4.8-6.6 8.8-6.6c.4 0 .8 0 1.3.1c.4.1.7.1 1.1.2l.2-.3c1.6-2.9 4.8-4.8 8.1-4.8c5.1 0 9.3 4.2 9.3 9.3v.9c.4.2.8.3 1.2.5c2.5 1.4 4 4.1 4 6.9c0 3.7-2.6 6.9-6.2 7.8c-.6.1-1.2.2-1.8.2z" />
        <path fill="#75d6ff" d="M26.9 36.4c4.4 0 8 3.5 8 7.9v.6c-1.8.1-3.5.9-4.8 2q1.5-.9 3.3-.9c.4 0 .9 0 1.3.1c.7.1 1.4.4 2 .8c2 1.1 3.3 3.3 3.3 5.7c0 3.1-2.2 5.8-5.2 6.5c-.5.1-1 .2-1.5.2H10.1c-.6 0-1.2-.1-1.7-.3c-2.2-.7-3.7-2.7-3.7-5.1c0-1.6.7-3.1 1.9-4.1c.5-.5 1.1-.8 1.8-1q.9-.3 1.8-.3c1.7 0 3.3.8 4.3 2.1c-1.2-2.1-3.3-3.6-5.8-3.8c.9-3.2 3.9-5.6 7.5-5.6c.4 0 .8 0 1.1.1q1.05.15 2.1.6c2.4 1.1 4.2 3.3 4.6 6c0-3.1-1.6-5.7-4-7.3c1.3-2.6 3.9-4.2 6.9-4.2m0-2.7c-3.7 0-7.1 1.9-9 4.9h-.2c-.6-.1-1-.1-1.5-.1c-4.7 0-8.8 3.1-10.1 7.6l-.3 1.1c-.3.2-.7.5-1 .7a7.79 7.79 0 0 0-2.8 6c0 3.5 2.2 6.6 5.6 7.7c.8.3 1.7.4 2.6.4h23.2c.7 0 1.4-.1 2.1-.2c4.3-1 7.3-4.7 7.3-9.1c0-3.3-1.8-6.4-4.7-8.1c-.1-.1-.3-.2-.4-.2v-.1c-.1-5.9-4.9-10.6-10.8-10.6" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(117, 214, 255, 0.45)',
  }),

  // Estímulo de Girasol creado a partir de public/vergence/sunflower.svg
  createStereoPair({
    id: 'sunflower',
    name: 'Girasol',
    description: 'Centro del girasol flotando en relieve 3D sobre los pétalos.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        <path fill="#83bf4f" d="M39.4 49.5C32.7 54.7 30.9 64 30.9 64h2.4c9-13.1 26.5-22.2 26.5-22.2S48 42.9 39.4 49.5" />
        <path fill="#75a843" d="M30.5 1L33 64h-5z" />
        <path fill="#83bf4f" d="M23.9 50.7c5.8 6.2 6.5 13.3 6.5 13.3H28C19 48.7 4.2 43.4 4.2 43.4s12.8 0 19.7 7.3" />
        <g fill="#f4bc58">
          <path d="M42.8 23.6c-5.3-1.4-7.9-.2-8.5 2s1.1 4.6 6.4 6s12.8-.8 12.8-.8s-5.4-5.8-10.7-7.2m-24.3 2.1c5.3 1.4 7.9.2 8.5-2s-1.1-4.6-6.4-6s-12.8.8-12.8.8s5.4 5.7 10.7 7.2m11.2-13.2c-1.4 5.3-.2 7.9 2 8.5s4.6-1.1 6-6.4c1.3-5.3-.9-12.8-.9-12.8s-5.7 5.4-7.1 10.7m2 24.3c1.4-5.3.2-7.9-2-8.5s-4.6 1.1-6 6.4s.8 12.8.8 12.8s5.8-5.4 7.2-10.7" />
          <path d="M38.5 15.3c-4.8 2.7-5.7 5.5-4.6 7.4c1.1 2 4 2.5 8.7-.3c4.8-2.7 8.5-9.7 8.5-9.7s-7.8-.1-12.6 2.6M22.8 33.9c4.8-2.7 5.7-5.5 4.6-7.4c-1.1-2-4-2.5-8.7.3s-8.5 9.7-8.5 9.7s7.9.2 12.6-2.6m-1.4-17.1c2.7 4.8 5.5 5.7 7.4 4.6c2-1.1 2.5-4-.3-8.7c-2.7-4.8-9.7-8.5-9.7-8.5s-.2 7.8 2.6 12.6M40 32.5c-2.7-4.8-5.5-5.7-7.4-4.6c-2 1.1-2.5 4 .3 8.7c2.7 4.8 9.7 8.5 9.7 8.5s.1-7.9-2.6-12.6" />
        </g>
        <g fill="#fc6">
          <path d="M34.8 13.2c0 5.5-1.8 7.7-4.1 7.7s-4.1-2.2-4.1-7.7C26.5 7.7 30.7 1 30.7 1s4.1 6.7 4.1 12.2m-8.3 22.9c0-5.5 1.8-7.7 4.1-7.7s4.1 2.2 4.1 7.7s-4.1 12.2-4.1 12.2s-4.1-6.7-4.1-12.2m15.6-7.3c-5.5 0-7.7-1.8-7.7-4.1s2.2-4.1 7.7-4.1s12.2 4.1 12.2 4.1s-6.7 4.1-12.2 4.1m-22.9-8.3c5.5 0 7.7 1.8 7.7 4.1s-2.2 4.1-7.7 4.1S7 24.6 7 24.6s6.7-4.1 12.2-4.1" />
          <path d="M41.7 19.4c-3.9 3.9-6.8 4.1-8.4 2.5s-1.4-4.5 2.5-8.4s11.5-5.7 11.5-5.7s-1.7 7.8-5.6 11.6m-22 10.4c3.9-3.9 6.8-4.1 8.4-2.5s1.4 4.5-2.5 8.4c-4 3.8-11.6 5.6-11.6 5.6s1.8-7.6 5.7-11.5m16.2 5.8c-3.9-3.9-4.1-6.8-2.5-8.4s4.5-1.4 8.4 2.5s5.7 11.5 5.7 11.5s-7.8-1.7-11.6-5.6m-10.4-22c3.9 3.9 4.1 6.8 2.5 8.4s-4.5 1.4-8.4-2.5C15.8 15.6 14 7.9 14 7.9s7.6 1.8 11.5 5.7" />
        </g>
        <g fill="#ffd68d">
          <path d="M31.7 12.5c1.4 5.3.2 7.9-2 8.5s-4.6-1.1-6-6.4s.8-12.8.8-12.8s5.8 5.4 7.2 10.7m-2 24.3c-1.4-5.3-.2-7.9 2-8.5s4.6 1.1 6 6.4s-.8 12.8-.8 12.8s-5.8-5.4-7.2-10.7m13.1-11.1c-5.3 1.4-7.9.2-8.5-2s1.1-4.6 6.4-6s12.8.8 12.8.8s-5.4 5.7-10.7 7.2m-24.3-2.1c5.3-1.4 7.9-.2 8.5 2s-1.1 4.6-6.4 6c-5.2 1.4-12.7-.9-12.7-.9s5.3-5.7 10.6-7.1" />
          <path d="M40 16.8c-2.7 4.8-5.5 5.7-7.4 4.6c-2-1.1-2.5-4 .3-8.7c2.7-4.8 9.7-8.5 9.7-8.5s.1 7.8-2.6 12.6M21.4 32.5c2.7-4.8 5.5-5.7 7.4-4.6c2.1 1.1 2.5 4-.3 8.7c-2.7 4.8-9.7 8.5-9.7 8.5s-.2-7.9 2.6-12.6m17.1 1.4c-4.8-2.7-5.8-5.5-4.6-7.4s4-2.5 8.7.3c4.8 2.7 8.5 9.7 8.5 9.7s-7.8.2-12.6-2.6M22.8 15.3c4.8 2.7 5.7 5.5 4.6 7.4c-1.1 2-4 2.5-8.7-.3s-8.5-9.7-8.5-9.7s7.9-.1 12.6 2.6" />
        </g>
      </>
    ),
    floating: (
      <>
        <circle cx="30.7" cy="24.4" r="13.2" fill="#947151" />
        <circle cx="30.7" cy="24.4" r="10" fill="#3e4347" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(252, 204, 102, 0.45)',
  }),

  // Estímulo de Baloncesto creado a partir de public/vergence/basketball.svg
  createStereoPair({
    id: 'basketball',
    name: 'Baloncesto',
    description: 'Pelota de baloncesto flotando en relieve 3D sobre la canasta.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        <g fill="#d0d0d0">
          <path d="M42.2 62c-.2 0-.5-.1-.7-.2c-.4-.3-.6-.7-.5-1.1c0-.1 2.5-10.8-12.3-22.5c-.5-.4-.5-1.1-.1-1.5c.4-.5 1.2-.5 1.6-.1C42 46 43.6 54.7 43.5 58.9c9.5-6.1 14.8-12.4 15.9-18.8c.9-5.9-2.3-9.5-2.4-9.7c-.4-.5-.3-1.1.1-1.5c.5-.4 1.2-.3 1.6.1c.2.2 4 4.5 2.9 11.3c-1.2 7.4-7.5 14.7-19 21.6c.1 0-.2.1-.4.1" />
          <path d="M31.8 62c-.3 0-.5-.1-.8-.3c-.4-.3-.5-.8-.3-1.3c.2-.4 4.4-9.3-6.9-21.2c-.4-.5-.4-1.1.1-1.5s1.2-.4 1.6.1c8.4 8.9 8.9 16.4 8.2 20.4C52.8 44.6 51 33.2 51 33.1c-.1-.5.2-.9.6-1.2c.5-.2 1-.1 1.4.2c12.8 13 4 20.9 4 21c-.5.4-1.2.4-1.7 0c-.4-.4-.4-1.1 0-1.5c.3-.3 6.2-5.8-2.1-15.7c-.6 4.9-4 14.9-20.9 25.9c-.1.1-.3.2-.5.2" />
          <path d="M51.3 62H51c-.6-.2-1-.8-.8-1.3c.1-.4 2.9-10.2-10.2-21.5c-1 3.5-4.2 11.1-13.5 18.5c-.5.4-1.2.3-1.6-.1c-.4-.5-.4-1.1.1-1.5c11.6-9.2 13.2-19 13.2-19.1c.1-.4.3-.7.7-.9c.4-.1.8-.1 1.2.2c16 12.7 12.6 24.4 12.4 24.9s-.7.8-1.2.8" />
        </g>
        <path fill="#ed4c5c" d="M30.5 41.2c-12.7 0-11.1-6.2-9.4-8.5C25.8 26.4 43.6 20 53 20c10.8 0 9.1 6 6.8 9c-5.1 6.9-19.9 12.2-29.3 12.2M53 23.1c-7.7 0-21.9 5.2-26.6 9.7c-.9.9-2.6 3.3 4.2 3.3c8.4 0 21.2-5.2 25.1-9.8c1.3-1.7 2-3.2-2.7-3.2" />
      </>
    ),
    // La pelota entera (círculo naranja y líneas negras) con disparidad 3D hacia adelante
    floating: (
      <>
        <circle cx="22" cy="22" r="20" fill="#ff8736" />
        <g fill="#231f20">
          <path d="M7.8 8c.4 1.7 1.1 3.2 1.9 4.7s1.7 3 2.6 4.4c1.9 2.8 3.9 5.6 6.1 8.2s4.5 5.1 7 7.4c1.3 1.1 2.6 2.2 4 3.1c1.4 1 2.9 1.7 4.6 2.2c-1.7-.1-3.4-.8-5-1.6s-3-1.8-4.4-2.9c-2.7-2.2-5.2-4.7-7.4-7.3c-2.2-2.7-4.2-5.5-5.9-8.6c-.8-1.4-1.6-3-2.3-4.6c-.6-1.6-1.1-3.3-1.2-5M2 21.5c1.2 2.5 2.7 4.8 4.5 6.7q2.85 2.85 6.6 4.5c2.4 1.1 5.1 1.9 7.6 3c1.3.6 2.6 1.2 3.7 2.2c1.1.9 1.9 2.3 2.1 3.6c-.5-1.3-1.4-2.3-2.5-3s-2.4-1.2-3.7-1.6c-2.6-.9-5.3-1.6-7.9-2.8s-5-2.8-6.8-5c-1.8-2.3-3-4.9-3.6-7.6m36.1 12.4c-1.6.7-3.5 1-5.3.2s-2.8-2.6-3.5-4.2c-1.4-3.4-1.9-6.9-2.6-10.3s-1.5-6.8-3-9.8s-4-5.7-7.3-6.9c1.7.4 3.4 1.2 4.8 2.3s2.6 2.6 3.5 4.1c1.8 3.1 2.7 6.7 3.5 10.1l1 5.2c.3 1.7.7 3.4 1.3 5s1.3 3.1 2.7 4c1.3.8 3.2.7 4.9.3" />
          <path d="M33.6 5.7c.9.6 1.6 1.5 2.1 2.5s1 2 1.3 3.1c.7 2.1 1 4.3 1.1 6.6c.2 4.4-.9 9.1-3.4 12.9q-1.95 2.85-4.8 4.8c-1.9 1.3-4 2.2-6.2 2.7c-4.3 1.1-8.9 1-13.2.3c4.4.1 8.8-.1 12.8-1.4c4.1-1.3 7.7-3.7 10-7.2c2.4-3.5 3.4-7.8 3.5-12c0-2.1-.2-4.3-.6-6.4c-.4-2.2-1-4.4-2.6-5.9" />
        </g>
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(255, 135, 54, 0.45)',
  }),

  // Estímulo de Emoji creado a partir de public/vergence/smiling-face-with-sunglasses.svg
  createStereoPair({
    id: 'emoji',
    name: 'Emoji',
    description: 'Gafas de sol flotando en relieve 3D sobre la cara del emoji.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Cara amarilla del emoji */}
        <path fill="#ffdd67" d="M32 2c16.6 0 30 13.4 30 30S48.6 62 32 62S2 48.6 2 32S15.4 2 32 2" />
        {/* Sonrisa del emoji */}
        <path fill="#664e27" d="M44.6 42.3c-8.1 5.7-17.1 5.6-25.2 0c-1-.7-1.8.5-1.2 1.6c2.5 4 7.4 7.7 13.8 7.7s11.3-3.6 13.8-7.7c.6-1.1-.2-2.3-1.2-1.6" />
      </>
    ),
    // Gafas de sol enteras flotando hacia adelante en relieve 3D
    floating: (
      <path
        fill="#494949"
        d="M35.8 20.5c-2.2 1.1-5.5 1.1-7.7 0c-2.3-1.2-5.2-2-8.7-2.3c-3.4-.3-10.5-.3-14 1c-.4.1-.8.3-1.2.5c-.1.1-.2.2-.2.6v.5c0 1-.1.6.6 1c1.4.8 2.2 2.9 2.6 5.8c.6 4.2 2.7 6.9 6 8.1c3.1 1.2 6.6 1.1 9.7-.1c1.7-.7 3.2-1.7 4.4-3.5c2.1-3 1.4-4.9 2.5-7.5c.9-2.3 3.5-2.3 4.5 0c1.1 2.6.4 4.5 2.5 7.5c1.2 1.7 2.7 2.8 4.4 3.5c3.1 1.2 6.6 1.3 9.7.1c3.4-1.3 5.4-3.9 6-8.1c.4-2.9 1.2-5 2.6-5.8c.7-.4.6 0 .6-1v-.5c0-.4 0-.5-.3-.6c-.4-.2-.8-.4-1.2-.5c-3.6-1.3-10.7-1.3-14-1c-3.5.3-6.4 1.1-8.8 2.3"
      />
    ),
    disparity: 1.8,
    shadowColor: 'rgba(255, 221, 103, 0.45)',
  }),

  // Estímulo de Clips creado a partir de public/vergence/linked-paperclips.svg
  createStereoPair({
    id: 'paperclips',
    name: 'Clips',
    description: 'El clip azul flotando en relieve 3D sobre el clip rojo.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <g fill="#ed4c5c">
        <path d="M44.3 44.3H11.4c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4h33.1c-.1-.6-.2-1.3-.2-1.9z" />
        <path d="M54.8 52.2c-.8-3.9-3.9-6.9-7.7-7.7v.7c0 .8.1 1.6.4 2.3c2 .7 3.6 2.3 4.3 4.3c.3.7.4 1.5.4 2.3v.7c-.3 3.6-3.4 6.3-7 6.3H7.1c-2.3 0-4.2-1.9-4.2-4.2s1.8-4.1 4-4.2h33.3c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4H11.3c-.8 0-1.4.6-1.4 1.4s.6 1.4 1.4 1.4H40c.7 0 1.4-.2 2.1-.5c.7-.4 1.4-1.1 1.8-1.8c.4-.9.6-1.9.3-2.9c-.4-1.9-2.2-3.2-4.1-3.3H7c-3.8.1-7 3.2-7 7.1S3.2 64 7.1 64h38.1c5.2 0 9.4-4 9.8-9v-.9c0-.6 0-1.3-.2-1.9" />
      </g>
    ),
    // Clip azul flotando con disparidad 3D hacia adelante
    floating: (
      <g fill="#42ade2">
        <path d="M51.8 51.8c-2-.7-3.6-2.3-4.3-4.3c-.3-.7-.4-1.5-.4-2.3V7.1c0-2.3 1.9-4.2 4.2-4.2s4.1 1.8 4.2 4v33.3c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4V11.3c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4V40c0 .7.2 1.4.5 2.1c.4.7 1.1 1.4 1.8 1.8c.9.4 1.9.6 2.9.3c1.9-.4 3.2-2.2 3.3-4.1V7c0-3.9-3.2-7.1-7.1-7.1S44.2 3.1 44.2 7v38.1c0 .7.1 1.3.2 1.9c.8 3.9 3.8 6.9 7.7 7.7V54c.1-.7 0-1.5-.3-2.2" />
        <path d="M61.2 11.4v33.8c0 3.6-2.8 6.7-6.3 7c.1.6.2 1.3.2 2v.9c5-.4 9-4.7 9-9.8V11.5c0-.8-.6-1.4-1.4-1.4c-.9-.1-1.5.5-1.5 1.3" />
      </g>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(66, 173, 226, 0.45)',
  }),

  // Estímulo de Candado y Llave creado a partir de public/vergence/locked-with-key.svg
  createStereoPair({
    id: 'lock-key',
    name: 'Candado',
    description: 'Llave flotando en relieve 3D sobre el candado de fondo.',
    viewBox: '0 0 64 64',
    previewScale: 0.75,
    base: (
      <>
        {/* Cuerpo del candado (amarillo) */}
        <path fill="#ffce31" d="M2 28.3v31.4C2 62.1 3.9 64 6.3 64h51.4c2.4 0 4.3-1.9 4.3-4.3V28.3z" />
        {/* Borde superior del candado (naranja) */}
        <path fill="#ff8736" d="M62 24c0-2.4-1.9-4.3-4.3-4.3H6.3C3.9 19.6 2 21.6 2 24v4.3h60z" />
        {/* Remaches / agujeros */}
        <g fill="#3e4347">
          <ellipse cx="12.4" cy="23.5" rx="5.9" ry="2.5" />
          <ellipse cx="51.6" cy="23.5" rx="5.9" ry="2.5" />
        </g>
        {/* Arco del candado */}
        <path fill="#dfe9ef" d="M32 0C19.1 0 8.6 10.6 8.6 23.5c0 .8 1.6 1.4 3.8 1.4v-1.4c.8-11 9.3-19.7 19.6-19.7c10.4 0 18.9 8.7 19.6 19.7v1.4c2.2 0 3.8-.6 3.8-1.4C55.4 10.6 44.9 0 32 0" />
        <path fill="#b0bdc6" d="M51.6 23.5C50.9 12.6 42.4 3.9 32 3.9s-18.9 8.7-19.6 19.7V25c2.2 0 4.2-.6 4.2-1.4C16.5 16.4 22.5 8 32 8s15.5 8.4 15.5 15.5c0 .8 2 1.4 4.2 1.4z" />
        {/* Cerradura */}
        <path fill="#3e4347" d="m36.6 56.4l-1.9-12.3c1.1-.8 1.9-2.2 1.9-3.7c0-2.5-2-4.6-4.6-4.6s-4.6 2.1-4.6 4.6c0 1.5.7 2.9 1.9 3.7l-1.9 12.3z" />
      </>
    ),
    // La llave entera flotando con disparidad 3D hacia adelante
    floating: (
      <path
        fill="#42ade2"
        d="M43.2 27.3v8.2l2.3 2.2v3.8l-2.3 2.2v5l2.3 2.2v3.8l-2.3 2.2v3.4l4.7 3.8l4.7-3.8v-33C58.1 25.4 62 20.2 62 14c0-7.7-6.3-14-14.1-14s-14 6.3-14 14.1c0 6.1 3.9 11.3 9.3 13.2m9.4-17.9c0 2.6-2.1 4.6-4.6 4.6c-2.6 0-4.6-2.1-4.6-4.6c0-2.6 2.1-4.6 4.6-4.6s4.6 2.1 4.6 4.6"
      />
    ),
    disparity: 1.8,
    shadowColor: 'rgba(66, 173, 226, 0.45)',
  }),

  // Estímulo de Calendario creado a partir de public/vergence/spiral-calendar.svg
  createStereoPair({
    id: 'calendar',
    name: 'Calendario',
    description: 'El número 17 flotando en relieve 3D sobre la hoja del calendario.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Fondo / sombra del calendario */}
        <path fill="#93a2aa" d="M60 58.2c0 2.1-1.7 3.8-3.9 3.8H10.8c-2.1 0-3.9-1.7-3.9-3.8V13.9c0-2.1 1.7-3.8 3.9-3.8h45.4c2.1 0 3.9 1.7 3.9 3.8v44.3z" />
        {/* Cabecera roja */}
        <path fill="#ed4c5c" d="M57.1 13.9c0-2.1-1.7-3.8-3.9-3.8H7.9c-2.1 0-3.9 1.7-3.9 3.8v21.3h53.1z" />
        {/* Hoja blanca / gris claro */}
        <path fill="#d9e3e8" d="M4 35.1v23.1C4 60.3 5.7 62 7.9 62h45.4c2.1 0 3.9-1.7 3.9-3.8V35.1z" />
        {/* Agujeros y espiral */}
        <g fill="#3e4347">
          <ellipse cx="13.1" cy="17" rx="2.9" ry="2.8" />
          <ellipse cx="24.8" cy="17" rx="2.9" ry="2.8" />
          <ellipse cx="36.3" cy="17" rx="2.9" ry="2.8" />
          <ellipse cx="47.9" cy="17" rx="2.9" ry="2.8" />
          <path d="M40.6 4.6C39.9 3.4 38.9 2.1 37 2c-1.8-.1-1.9 2.1-.1 2.2c0 0 .4.3.3.2c.4.4.6.9.9 1.4c.6 1.4.8 2.9.8 4.4h2.9c-.1-1.9-.4-3.9-1.2-5.6m-3.7-.4q.15 0 0 0m-7.9.4c-.6-1.2-1.7-2.5-3.6-2.6c-1.8-.1-1.9 2.1-.1 2.2c0 0 .4.3.3.2c.4.4.6.9.9 1.4c.6 1.4.8 2.9.8 4.4h2.9c-.1-1.9-.3-3.9-1.2-5.6m-11.6 0c-.6-1.2-1.7-2.5-3.6-2.6c-1.8-.1-1.8 2.1 0 2.2c0 0 .4.3.3.2c.4.4.6.9.9 1.4c.6 1.4.8 2.9.8 4.4h2.9c-.1-1.9-.4-3.9-1.3-5.6m34.7 0c-.6-1.2-1.7-2.5-3.6-2.6c-1.8-.1-1.9 2.1-.1 2.2c0 0 .4.3.3.2c.4.4.6.9.9 1.4c.6 1.4.8 2.9.8 4.4h2.9c0-1.9-.3-3.9-1.2-5.6m-3.6-.4" />
        </g>
        {/* Sombras y brillos de la espiral */}
        <path fill="#94989b" d="M36.3 16c-.3 0 .4.1 0 0c.3.1-.4-.3-.2-.2c-.4-.4-.6-.9-.8-1.4c-.6-1.4-.8-2.9-.8-4.4s.2-3 .8-4.4c.2-.5.4-.8.8-1.3c.1-.1.1-.1.4-.3c-.3.2 0 0 .1 0c-.2.1-.2.1-.1 0h-.1c1.9-.1 1.9-2.3 0-2.2s-2.9 1.4-3.6 2.6c-.9 1.7-1.1 3.7-1.1 5.5s.3 3.8 1.1 5.5c.6 1.2 1.7 2.5 3.6 2.6c1.8.3 1.8-1.9-.1-2m-11.5 0c-.4 0 .3.1 0 0c.3.1-.4-.3-.2-.2c-.4-.4-.6-.9-.9-1.4c-.6-1.4-.8-2.9-.8-4.4s.2-3 .8-4.4c.2-.5.4-.8.8-1.3c0-.1.1-.1.4-.3c-.3.2 0 0 .1 0c-.2.1-.2.1-.1 0h-.1c1.9-.1 1.9-2.3 0-2.2s-2.9 1.4-3.6 2.6c-.9 1.7-1.1 3.7-1.1 5.5s.3 3.8 1.1 5.5c.6 1.2 1.7 2.5 3.6 2.6c1.8.3 1.8-1.9 0-2m-11.6 0c-.3 0 .3.1 0 0c.3.1-.4-.3-.2-.2c-.4-.4-.6-.9-.9-1.4c-.6-1.4-.8-2.9-.8-4.4s.2-3 .8-4.4c.2-.5.4-.8.8-1.3c0-.1.1-.1.4-.3c-.3.2 0 0 .1 0c-.2.1-.2.1-.1 0h-.1c1.9-.1 1.9-2.3 0-2.2s-2.9 1.4-3.6 2.6c-.9 1.7-1.1 3.7-1.1 5.5s.3 3.8 1.1 5.5c.6 1.2 1.7 2.5 3.6 2.6c1.9.3 1.9-1.9 0-2m34.7 0c-.3 0 .3.1 0 0c.3.1-.4-.3-.2-.2c-.4-.4-.6-.9-.9-1.4c-.6-1.4-.8-2.9-.8-4.4s.2-3 .8-4.4c.2-.5.4-.8.8-1.3c0-.1.1-.1.4-.3c-.3.2 0 0 .1 0c-.2.1-.2.1-.1 0h-.1c1.9-.1 1.9-2.3 0-2.2c-1.9.3-2.9 1.6-3.6 2.8c-.9 1.7-1.1 3.7-1.1 5.5s.3 3.8 1.1 5.5c.6 1.2 1.7 2.5 3.6 2.6s1.9-2.1 0-2.2" />
        <path fill="#d0d0d0" d="M33.5 10.1c0-1.5.2-3.1.8-4.6c.3-.7.9-2.1 2-2.1c.6 0 .6-.7 0-.7c-1.4 0-2.1 1.2-2.6 2c-.9 1.7-1.1 3.5-1.1 5.3c0 .6.9.6.9.1m-11.6 0c0-1.5.2-3.1.8-4.6c.3-.7.9-2.1 2-2.1c.6 0 .6-.7 0-.7c-1.4 0-2.1 1.2-2.6 2C21.2 6.4 21 8.2 21 10c.1.6.9.6.9.1m-11.5 0c0-1.5.2-3.1.8-4.6c.3-.7.9-2.1 2-2.1c.6 0 .6-.7 0-.7c-1.4 0-2.1 1.2-2.6 2c-.9 1.7-1.1 3.5-1.1 5.3c0 .6.9.6.9.1m34.7 0c0-1.5.2-3.1.8-4.6c.3-.7.9-2.1 2-2.1c.6 0 .6-.7 0-.7c-1.4 0-2.1 1.2-2.6 2c-.9 1.7-1.1 3.5-1.1 5.3c0 .6.9.6.9.1" />
        {/* Texto "JUL" en la cabecera */}
        <path fill="#fff" d="M19.1 28.4v.2c0 .8.1 1.4.3 1.7c.1.3.5.5 1 .5s.8-.2 1-.5c.1-.2.1-.6.1-1.1V22h2.2v7.1c0 .9-.2 1.6-.5 2.1c-.5.9-1.4 1.3-2.8 1.3s-2.2-.3-2.7-1s-.7-1.6-.7-2.9v-.2zm6.9-6.3h2.2v6.3q0 1.05.3 1.5c.3.6.8.9 1.7.9s1.5-.3 1.7-.9q.3-.45.3-1.5v-6.3h2.2v6.3c0 1.1-.2 1.9-.5 2.5c-.7 1.1-1.9 1.7-3.7 1.7s-3.1-.6-3.7-1.7c-.3-.6-.5-1.5-.5-2.5zm10.6 0h2.2v8.4h5.3v1.8h-7.5z" />
      </>
    ),
    // El número 17 flotando hacia adelante con disparidad 3D
    floating: (
      <path
        fill="#333"
        d="M16.1 44.5v-2.8c1.3-.1 2.1-.1 2.6-.3c.8-.2 1.4-.5 1.9-1.1c.3-.4.6-.9.8-1.5c.1-.4.2-.6.2-.8h3.3v20.6h-4.1V44.5zm28.9-3c-.6.6-1.4 1.7-2.5 3.2s-2 3.1-2.7 4.7c-.6 1.3-1.1 2.8-1.5 4.7c-.5 1.8-.7 3.4-.7 4.6h-4.1c.1-3.7 1.3-7.5 3.6-11.5c1.5-2.5 2.7-4.2 3.7-5.2H30.7l.1-3.6H45z"
      />
    ),
    disparity: 1.8,
    shadowColor: 'rgba(237, 76, 92, 0.45)',
  }),

  // Estímulo de Paraguas creado a partir de public/vergence/umbrella-with-rain-drops.svg
  createStereoPair({
    id: 'umbrella',
    name: 'Paraguas',
    description: 'Paraguas central con 2 gotas hacia adelante y 2 gotas hacia detrás.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        <path fill="#3e4347" d="M32 12c-.5 0-.9.4-.9.9v4.7H33v-4.7c-.1-.5-.5-.9-1-.9" />
        <path fill="#b8c2c4" d="M31.1 34.5H33v14.4h-1.9z" />
        <path fill="#ffbe5c" d="M32 16.7v24.4c1.8-2.3 4.5-3.8 7.7-3.8s5.9 1.5 7.7 3.8C45.9 27.3 39.7 16.7 32 16.7" />
        <path fill="#ed77a8" d="M32 16.7v24.4c-1.8-2.3-4.5-3.8-7.7-3.8c-3.1 0-5.9 1.5-7.7 3.8c1.5-13.8 7.7-24.4 15.4-24.4" />
        <path fill="#c7e86f" d="M32 16.7c7.7 0 13.9 10.6 15.4 24.4c1.8-2.3 4.5-3.8 7.7-3.8c2.7 0 5.2 1.1 7 2.9C59 26.8 46.7 16.7 32 16.7" />
        <path fill="#60d4e0" d="M32 16.7c-7.7 0-13.9 10.6-15.4 24.4c-1.8-2.3-4.5-3.8-7.7-3.8c-2.7 0-5.2 1.1-7 2.9C5 26.8 17.3 16.7 32 16.7" />
        <path fill="#3e4347" d="M30.1 48.9v5.6c0 2.1-1.7 3.8-3.8 3.8s-3.8-1.7-3.8-3.8c0-1-.8-1.9-1.9-1.9c-1 0-1.9.8-1.9 1.9c0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5v-5.6z" />
      </>
    ),
    // 2 gotas flotando hacia ADELANTE (en primer plano)
    floating: (
      <path
        fill="#75d6ff"
        d="M40.4 12.1c3.1 4.3 4.9 8.2 4.9 11.4c0 2.7-2.2 5-4.9 5s-4.9-2.2-4.9-5c-.1-3.2 1.8-7.2 4.9-11.4M6.9 12.1c3.1 4.3 4.9 8.2 4.9 11.4c0 2.7-2.2 5-4.9 5S2 26.3 2 23.5c0-3.2 1.8-7.2 4.9-11.4"
      />
    ),
    // 2 gotas hundiéndose hacia DETRÁS (en el fondo)
    floatingBack: (
      <path
        fill="#75d6ff"
        d="M57.1 2c3.1 4.3 4.9 8.2 4.9 11.4c0 2.7-2.2 5-4.9 5s-4.9-2.2-4.9-5c0-3.2 1.8-7.2 4.9-11.4M23.6 2c3.1 4.3 4.9 8.2 4.9 11.4c0 2.7-2.2 5-4.9 5s-4.9-2.2-4.9-5c0-3.2 1.9-7.2 4.9-11.4"
      />
    ),
    disparity: 1.8,
    shadowColor: 'rgba(117, 214, 255, 0.45)',
  }),

  // Estímulo de Castillo creado a partir de public/vergence/castle.svg
  createStereoPair({
    id: 'castle',
    name: 'Castillo',
    description: 'Las 3 ventanas y la puerta flotando en relieve 3D sobre el castillo.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Mástiles de las banderas */}
        <path
          fill="#3e4347"
          d="M12.5 11c0 .6-.4 1-1 1s-1-.4-1-1V1c0-.6.4-1 1-1s1 .4 1 1zm20 0c0 .6-.5 1-1 1s-1-.4-1-1V1c0-.6.5-1 1-1s1 .4 1 1zm20 0c0 .6-.5 1-1 1s-1-.4-1-1V1c0-.6.5-1 1-1s1 .4 1 1z"
        />
        {/* Muros de las torres */}
        <path fill="#b2c1c0" d="M22 22h18v16H22zM6 18h10v20H6zm40 0h10v20H46z" />
        {/* Tejados cónicos azules */}
        <path fill="#42ade2" d="m31.5 10l-12 12h24zm-20 0l-8 8h16zm40 0l-8 8h16z" />
        {/* Fachada frontal de piedra y almenas */}
        <path fill="#dae3ea" d="M57.5 32h-4c-.5 0-1 .5-1 1v4c0 .5-.5 1-1 1h-4c-.5 0-1-.5-1-1v-4c0-.5-.5-1-1-1h-4c-.5 0-1 .5-1 1v4c0 .5-.5 1-1 1h-4c-.5 0-1-.5-1-1v-4c0-.5-.5-1-1-1h-4c-.5 0-1 .5-1 1v4c0 .5-.5 1-1 1h-4c-.5 0-1-.5-1-1v-4c0-.5-.5-1-1-1h-4c-.5 0-1 .5-1 1v4c0 .5-.5 1-1 1h-4c-.6 0-1-.5-1-1v-4c0-.5-.4-1-1-1h-4c-.6 0-1 .5-1 1v4c0 .5.3 1.3.7 1.7l.6.6c.4.4.7 1.2.7 1.7v22c0 .5.4 1 1 1h16V52c0-4.4 3.6-8 8-8s8 3.6 8 8v12h16c.5 0 1-.5 1-1V41c0-.5.3-1.3.7-1.7l.6-.6c.4-.4.7-1.2.7-1.7v-4c0-.5-.5-1-1-1" />
        {/* Detalles de sillares de piedra */}
        <path fill="#b2c1c0" d="M10 44H6c-.6 0-1 .5-1 1v2c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-2c0-.5-.4-1-1-1" />
        <path fill="#b2c1c0" d="M13 50H9c-.6 0-1 .5-1 1v2c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-2c0-.5-.4-1-1-1m8.8 10h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1m-2.1-5h-4c-.6 0-1 .5-1 1v2c0 .5.4 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1m2.1-8h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1M19 39.9h-4c-.6 0-1 .5-1 1v2c0 .5.4 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1M10 56H6c-.6 0-1 .5-1 1v2c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-2c0-.5-.4-1-1-1m47-6h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1m-3 6h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1m-4.5-11.3h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.6-.5-1-1-1m-4 6.8h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1m1.9 8.5h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.5-.5-1-1-1m9.1-20.8h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.6-.5-1-1-1m-15.5 1h-4c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-2c0-.6-.5-1-1-1" />
        {/* Banderas originales en los mástiles */}
        <path fill="#42ade2" d="M20.5 6.6c-2.7-1.5-5.3 1.5-8 0V1.5c2.7 1.5 5.3-1.5 8 0c-.7.5-1.3 1.2-2 2.1c.7.8 1.3 1.7 2 3m20 0c-2.7-1.5-5.3 1.5-8 0V1.5c2.7 1.5 5.3-1.5 8 0c-.7.5-1.3 1.2-2 2.1c.7.8 1.3 1.7 2 3m20 0c-2.7-1.5-5.3 1.5-8 0V1.5c2.7 1.5 5.3-1.5 8 0c-.7.5-1.3 1.2-2 2.1c.7.8 1.3 1.7 2 3" />
      </>
    ),
    // Las 3 ventanas y la puerta de entrada flotando hacia ADELANTE en relieve 3D
    floating: (
      <>
        {/* Reja de la puerta de entrada */}
        <g fill="#3e4347">
          <path d="M26.5 43v20s.6 1 1 1s1-1 1-1V43zm5 0h-1v20s.6 1 1 1s1-1 1-1V43zm3 0v20s.6 1 1 1s1-1 1-1V43z" />
          <path d="M23 51h17v2H23zm0-4h17v2H23zm0 8h17v2H23zm0 4h17v2H23z" />
        </g>
        {/* Ventana central */}
        <g fill="#3e4347">
          <circle cx="31.5" cy="29" r="3" />
          <path d="M28.5 29h6v9h-6z" />
        </g>
        {/* Ventanas de las torres laterales */}
        <g fill="#3e4347">
          <path d="M9.5 22h4v6h-4z" />
          <circle cx="11.5" cy="22" r="2" />
          <path d="M49.5 22h4v6h-4z" />
          <circle cx="51.5" cy="22" r="2" />
        </g>
        {/* Repisas de las ventanas */}
        <path fill="#e8e8e8" d="M13.5 27.9h-4c-.6 0-1 .5-1 1v.2c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-.2c0-.6-.4-1-1-1m40 0h-4c-.5 0-1 .5-1 1v.2c0 .5.5 1 1 1h4c.5 0 1-.5 1-1v-.2c0-.6-.5-1-1-1" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(66, 173, 226, 0.45)',
  }),

  // Estímulo de Donut creado a partir de public/vergence/doughnut.svg
  createStereoPair({
    id: 'donut',
    name: 'Donut',
    description: 'Las virutas verdes y amarillas (4 en total) flotando en relieve 3D sobre el donut.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Masa del donut */}
        <path fill="#ffd170" d="M2 33.3C2 46.4 15.4 57 32 57s30-10.6 30-23.7S48.6 9.6 32 9.6S2 20.2 2 33.3m18.9 2.2c0-3.8 5-6.9 11.1-6.9s11.1 3.1 11.1 6.9s-5 6.9-11.1 6.9s-11.1-3.1-11.1-6.9" />
        {/* Glaseado rosa */}
        <path fill="#ff4085" d="M2 26.9c0 1.9.2 3.7.7 5.4c.6 2.3 1 6.2 2.3 8.1c.7.9 2.2-.3 3.4-.3c2.2 0 2.6 4.9 5.3 4.9c4 0 2.1 3.3 7.6 3.3c2.9 0 4.2-2.7 5.7-2.7c3.8 0 3.6 5.1 7.3 5.1c3.8 0 3.6-6 7.1-6c3.4 0 4.1 3.1 6.7 3.1c2.8 0 2.1-9.2 5.2-9.2c3.6 0 5.6-1.4 6.4-2.7c1.5-2.6 2.3-5.6 2.3-8.9C62 16.4 48.6 7 32 7S2 16.4 2 26.9m18.9.3c0-1.2 1.3-2.1 2.2-3.1c.7-.7 1.2-2.6 2.2-3.2c1.9-1 3.6 2.5 6.3 2.5c1.4 0 4.3-2.4 5.5-2.2c2 .5 1.2 1.8 2.4 2.9c1.3 1.1 3.5 1.6 3.5 3.1c0 3.8-2.4 6.9-11.1 6.9c-8.5 0-11-3.1-11-6.9" />
        {/* Virutas azules fijas en la base (2) */}
        <path fill="#63b6e6" d="m40.5 38.9l-5.8 3c-.9.5-1.8-1.1-.8-1.5l5.8-3c.9-.6 1.7 1 .8 1.5m10.8-19.1l-6.1-2.1c-1-.3-.4-2 .6-1.7l6.2 2.1c.9.4.3 2-.7 1.7" />
        {/* Virutas moradas fijas en la base (2) */}
        <path fill="#9729cc" d="m17.5 33.1l-6.2 2.1c-1 .3-1.6-1.3-.6-1.7l6.2-2.1c1-.3 1.6 1.4.6 1.7m11.4-17.5l-6-2.4c-1-.4-.3-2 .6-1.6l6 2.4c1 .4.4 2-.6 1.6" />
        {/* Virutas blancas fijas en la base (2) */}
        <path fill="#fff" d="M12.6 26.9L6.8 24c-.9-.5-.2-2 .8-1.6l5.8 2.9c.9.5.2 2.1-.8 1.6M57 24.8l-6.2 2.1c-1 .3-1.6-1.3-.6-1.7l6.2-2.1c1.1-.3 1.6 1.3.6 1.7" />
      </>
    ),
    // Virutas verdes y amarillas con disparidad 3D hacia adelante (4 en total)
    floating: (
      <>
        {/* Virutas amarillas (2: una arriba, una abajo) */}
        <path fill="#fff080" d="m25.4 40.4l-6.5.3c-1 0-1.1-1.7-.1-1.8l6.5-.3c1.1 0 1.2 1.8.1 1.8m17.4-28.5l-6.3 1.8c-1 .3-1.5-1.4-.5-1.7l6.3-1.8c1-.2 1.5 1.4.5 1.7" />
        {/* Virutas verdes (2: una arriba, una abajo) */}
        <path fill="#84e060" d="m46.6 32.8l6.5.3c1 0 1 1.8-.1 1.8l-6.5-.3c-1.1-.1-1-1.8.1-1.8m-28-15.5L12.3 19c-1 .3-1.5-1.4-.4-1.7l6.3-1.7c1-.2 1.4 1.4.4 1.7" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(255, 64, 133, 0.45)',
  }),

  // Estímulo de Noria creado a partir de public/vergence/ferris-wheel.svg
  createStereoPair({
    id: 'ferris-wheel',
    name: 'Noria',
    description: 'Las dos cabinas azules y la roja inferior flotando en relieve 3D sobre la noria.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Aro exterior de la noria */}
        <path fill="#d0d0d0" d="M32 2C18.2 2 7 13.2 7 27s11.2 25 25 25s25-11.2 25-25S45.8 2 32 2m0 47c-12.1 0-22-9.8-22-22S19.9 5 32 5s22 9.9 22 22s-9.8 22-22 22" />
        {/* Radios de la rueda */}
        <g fill="#d0d0d0">
          <rect x="8" y="26" width="48" height="2" />
          <rect x="31" y="3" width="2" height="48" />
          <rect x="8" y="26" width="48" height="2" transform="rotate(45 32 27)" />
          <rect x="8" y="26" width="48" height="2" transform="rotate(-45 32 27)" />
        </g>
        {/* Eje central de la rueda */}
        <circle cx="32" cy="27" r="8.2" fill="#3e4347" />
        <circle cx="32" cy="27" r="5.5" fill="#94989b" />
        {/* Cabina roja superior fija */}
        <path fill="#ed4c5c" d="M34.9 2.8h-2.1c0-.4-.4-.8-.8-.8s-.8.4-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6V5.4c0-1.4-1.1-2.6-2.6-2.6M36 8.3h-8V5.4c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M26.5 9.9h11.1v1.6H26.5z" />
        {/* Cabina amarilla izquierda fija */}
        <path fill="#f2b200" d="M10.4 26.9H8.3c0-.4-.3-.8-.8-.8s-.8.4-.8.8H4.6C3.2 26.9 2 28 2 29.5v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c.1-1.5-1.1-2.6-2.6-2.6m1.1 5.5h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M2 33.9h11.1v1.6H2z" />
        {/* Cabina verde superior derecha fija */}
        <path fill="#83bf4f" d="M52.2 9.6h-2.1c0-.4-.3-.8-.8-.8s-.8.3-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6V18c0 1.5 1.2 2.6 2.7 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c-.1-1.4-1.2-2.6-2.7-2.6m1.1 5.5h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M43.7 16.7h11.1v1.6H43.7z" />
        {/* Cabina verde inferior izquierda fija */}
        <path fill="#83bf4f" d="M17.6 44.1h-2.1c0-.4-.3-.8-.8-.8c-.4 0-.8.3-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c.1-1.4-1.1-2.6-2.6-2.6m1.1 5.6h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M9.2 51.2h11.1v1.6H9.2z" />
        {/* Cabina amarilla inferior derecha fija */}
        <path fill="#f2b200" d="M51.9 43.9h-2.1c0-.4-.3-.8-.8-.8c-.4 0-.8.3-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c.1-1.4-1.1-2.6-2.6-2.6m1.1 5.5h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M43.5 51h11.1v1.6H43.5z" />
        {/* Patas de soporte y perno rojo */}
        <g fill="#ed4c5c">
          <circle cx="32" cy="27" r="2.8" />
          <path d="m33 26.4l-1.1.6l-.9-.5L10.6 64h2.6L32 29.2L50.8 64h2.6z" />
        </g>
      </>
    ),
    // Las dos cabinas azules y la roja inferior en relieve 3D hacia adelante (3 en total)
    floating: (
      <>
        {/* Cabina azul superior izquierda */}
        <path fill="#42ade2" d="M17.9 9.8h-2.1c0-.4-.3-.8-.8-.8c-.4 0-.8.4-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c0-1.4-1.2-2.6-2.6-2.6m1.1 5.6h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M9.4 16.9h11.1v1.6H9.4z" />
        {/* Cabina azul derecha */}
        <path fill="#42ade2" d="M59.4 26.9h-2.1c0-.4-.3-.8-.8-.8s-.8.4-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c0-1.5-1.2-2.6-2.6-2.6m1 5.5h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M50.9 33.9H62v1.6H50.9z" />
        {/* Cabina roja inferior */}
        <path fill="#ed4c5c" d="M34.9 50.9h-2.1c0-.4-.3-.8-.8-.8s-.8.3-.8.8h-2.1c-1.5 0-2.6 1.2-2.6 2.6v5.8c0 1.5 1.2 2.6 2.6 2.6h5.8c1.5 0 2.6-1.2 2.6-2.6v-5.8c0-1.4-1.1-2.6-2.6-2.6m1.1 5.6h-8v-2.9c0-.6.5-1.1 1.1-1.1h5.8c.6 0 1.1.5 1.1 1.1z" />
        <path fill="#3e4347" d="M26.5 58h11.1v1.6H26.5z" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(66, 173, 226, 0.45)',
  }),

  // Estímulo de Barco creado a partir de public/vergence/sailboat.svg
  createStereoPair({
    id: 'sailboat',
    name: 'Barco',
    description: 'El barco de vela entero flotando en relieve 3D sobre el mar.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Mar / agua de fondo */}
        <path fill="#42ade2" d="M0 48h64v16H0z" />
      </>
    ),
    // El barco de vela entero con disparidad 3D hacia adelante
    floating: (
      <>
        {/* Mástil superior y línea de flotación */}
        <path fill="#3e4347" d="M31.5 2h1v10h-1zM57 59H16l-2-2s16.7-3.2 43 2" />
        {/* Mástil principal */}
        <path fill="#89664c" d="M33 47c0 .6-.4 1-1 1c-.5 0-1-.4-1-1V9c0-.6.5-1 1-1c.6 0 1 .4 1 1z" />
        {/* Casco blanco */}
        <path fill="#dae3ea" d="M54 52s-4.6-1.6-10-3c-3.4-.9-7.7-1.7-9.6-2.2c-.5-.1-1.3-.6-1.7-.9l-1.4-1.2c-.4-.4-1.2-.6-1.8-.6h-8.1c-.5 0-1.3.3-1.7.7L18.5 46c-.4.4-1.2.7-1.7.7H12c-.5 0-.9.4-.8 1l2 8c.1.5.7 1 1.2 1H54l1-2.5z" />
        {/* Sombra inferior del casco */}
        <path fill="#c5d0d8" d="M7 46.5S8.8 51 14 57c0 0 29.6 2 43 2l-2-5s-23-7.5-48-7.5" />
        {/* Ojos de buey / ventanas */}
        <path fill="#3e4347" d="M29.5 46.5c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5zm-4 0c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5v-1c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5z" />
        {/* Cabo de proa */}
        <path fill="#89664c" d="M12 41.3c-.6.5-1.4 1.2-2.1 2c-.8.7-1.5 1.5-2 2.1s-.8 1-.8 1s.4-.3 1-.8s1.4-1.2 2.1-2c.8-.7 1.5-1.5 2-2.1s.8-1 .8-1s-.4.3-1 .8" />
        {/* Vela delantera (beige) */}
        <path fill="#f9f3d9" d="M31 9S17 30.8 10 43.5c0 0 9.5-2.5 21-2.5z" />
        {/* Vela trasera (naranja) */}
        <path fill="#ff9d27" d="M33 9v32l14 3z" />
        {/* Salvavidas (rojo y blanco) */}
        <path fill="#f15744" d="M42.8 54H41c0-2.2 1.8-4 4-4v1.8c-1.2 0-2.2 1-2.2 2.2m2.2 4v-1.8c1.2 0 2.2-1 2.2-2.2H49c0 2.2-1.8 4-4 4" />
        <path fill="#fff" d="M45 58c-2.2 0-4-1.8-4-4h1.8c0 1.2 1 2.2 2.2 2.2zm4-4h-1.8c0-1.2-1-2.2-2.2-2.2V50c2.2 0 4 1.8 4 4" />
        {/* Banderín y franja roja de la vela */}
        <path fill="#f15744" d="M32.5 3v3.9c2.7.5 5.3-2.5 8-2c-2.7-1.8-5.3-.1-8-1.9M21.1 24.7c-.5.9-1.1 1.7-1.6 2.6c3.6.4 7.9 1.5 11.5 3.7v-3s-3.1-2.2-9.9-3.3" />
        {/* Franja amarilla de la vela */}
        <path fill="#ffce31" d="M16.7 32C27.9 32 31 35 31 35v-4c-3.6-2.3-7.9-3.3-11.5-3.7c-1 1.7-1.8 2.9-2.8 4.7" />
        {/* Cintas del salvavidas */}
        <path fill="#fff" d="M44.5 49h1v1h-1zm0 9h1v1h-1zm4.5-4.5h1v1h-1zm-9 0h1v1h-1z" />
        <path fill="#89664c" d="M40.8 53.5h-.5c0-.1.1-2 1.2-3.1c1.2-1.2 3-1.1 3.1-1.1v.5s-1.7-.1-2.7.9c-1.1 1-1.1 2.8-1.1 2.8m8.4 0s-.1-1.8-1-2.8c-1-1-2.7-.9-2.7-.9v-.5c.1 0 1.9-.1 3.1 1.1c1.1 1.1 1.2 3.1 1.2 3.1zm-4.8 5.3c-.4 0-1.9-.1-3-1.1c-1.1-1.1-1.2-3.1-1.2-3.2h.5s.1 1.8 1 2.8c1 1 2.7 1 2.7.9zq.15 0 0 0m1.2 0q-.15 0 0 0l-.1-.5s1.7.1 2.7-.9s1-2.8 1-2.8h.5c0 .1-.1 2-1.2 3.2c-1 .9-2.5 1-2.9 1" />
        {/* Ojo de buey de proa */}
        <circle cx="13" cy="50" r="1.5" fill="#3e4347" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(66, 173, 226, 0.45)',
  }),

  // Estímulo de Torre creado a partir de public/vergence/tokyo-tower.svg
  createStereoPair({
    id: 'tokyo-tower',
    name: 'Torre',
    description: 'La nube izquierda flotando delante de la torre y la nube derecha hundiéndose detrás.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    base: (
      <>
        {/* Estructura y celosía de la torre de Tokio */}
        <path fill="#dae3ea" d="M38.7 47.5H25.3L24 44h16z" />
        <path fill="#ed4c5c" d="M38.7 48.2H25.3C23.6 54.4 21.2 59 16 64h7.7s2.7-9.5 8.3-9.5s8.3 9.5 8.3 9.5H48c-5.2-5-7.6-9.6-9.3-15.8" />
        <path fill="#ed4c5c" d="M37.5 43.3h-11l1.6-5.6h7.8z" />
        <path fill="#dae3ea" d="M35.9 37h-7.8l.8-7h6z" />
        <path fill="#ed4c5c" d="M35 30h-6l.8-6.8h4.4z" />
        <path fill="#dae3ea" d="M28.4 19.6h7.2v2.9h-7.2zm0-4.6h7.2v1.8h-7.2z" />
        <path fill="#ed4c5c" d="M28.4 13.6h7.2V15h-7.2z" />
        <path fill="#c94747" d="M30.7 8.2h2.6v5.4h-2.6z" />
        <path fill="#dae3ea" d="M30.7 1.5h2.6v6.8h-2.6z" />
        <path fill="#ed4c5c" d="M30.7 0h2.6v1.5h-2.6z" />
        <path fill="#c5d0d8" d="M30 16.8h4v2.9h-4zM28.3 30h7.5v.7h-7.5z" />
        <path fill="#b2c1c0" d="M30.7 7.5h2.6v.7h-2.6zm-2.3 14.3h7.2v.7h-7.2zm-.1 8.9h7.5v.7h-7.5zm-.2 2.1H36v.7h-7.9zm-.4 2.1h8.6v.7h-8.6z" />
        <path fill="#c5d0d8" d="M28.1 32.1H36v.7h-7.9zm-.4 2.1h8.6v.7h-8.6zm-.3 2.1h9.3v.7h-9.3z" />
        <path fill="#c94747" d="M25.3 47.5h13.3v.7H25.3zm4.5-25h4.3v.7h-4.3zm-.2 21h-1.3v-3.3c0-.4.3-.6.6-.6c.4 0 .6.3.6.6zm2 0h-1.3v-3.3c0-.4.3-.6.6-.6c.4 0 .6.3.6.6zm2.1 0h-1.3v-3.3c0-.4.3-.6.6-.6c.4 0 .6.3.6.6zm2 0h-1.3v-3.3c0-.4.3-.6.6-.6c.4 0 .6.3.6.6zM31.6 30h-1.3v-3.3c0-.4.3-.6.6-.6c.4 0 .6.3.6.6zm2.1 0h-1.3v-3.3c0-.4.3-.6.6-.6c.4 0 .6.3.6.6z" />
        <path fill="#b2c1c0" d="M24 43.3h16v.7H24z" />
      </>
    ),
    // Nube de la izquierda flotando DELANTE en relieve 3D
    floating: (
      <path
        fill="#dae3ea"
        d="M18 25.7c0 .9-.7 1.7-1.7 1.7H1.7c-.9 0-1.7-.7-1.7-1.7S.7 24 1.7 24h14.7c.9 0 1.6.7 1.6 1.7m6.5-3.4c0 .9-.7 1.7-1.7 1.7H8.2c-.9 0-1.7-.7-1.7-1.7c0-.9.7-1.7 1.7-1.7h14.7c.9.1 1.6.8 1.6 1.7"
      />
    ),
    // Nube de la derecha hundiéndose DETRÁS en profundidad 3D
    floatingBack: (
      <path
        fill="#dae3ea"
        d="M64 40.7c0 .9-.7 1.7-1.7 1.7H47.7c-.9 0-1.7-.7-1.7-1.7c0-.9.7-1.7 1.7-1.7h14.7c.9 0 1.6.8 1.6 1.7M60.2 37.4c0 .9-.7 1.7-1.7 1.7H43.8c-.9 0-1.7-.7-1.7-1.7c0-.9.7-1.7 1.7-1.7h14.7c.9 0 1.7.7 1.7 1.7"
      />
    ),
    disparity: 1.8,
    shadowColor: 'rgba(237, 76, 92, 0.45)',
  }),

  // Estímulo de Camping creado a partir de public/vergence/camping.svg
  createStereoPair({
    id: 'camping',
    name: 'Camping',
    description: 'La tienda de campaña en relieve 3D delantero y la montaña nevada hundiéndose al fondo.',
    viewBox: '0 0 64 64',
    previewScale: 0.85,
    // La montaña entera hundiéndose al fondo en 3D
    floatingBack: (
      <>
        {/* Silueta y cuerpo de la montaña */}
        <g fill="#b2c1c0">
          <path d="m0 15l4-4l6.5-4L22 16l16 21H0z" />
          <path d="M38 37L22 16L10.5 7L9 14l4 4l-1 6l4 4l-2 9z" opacity=".5" />
        </g>
        {/* Nieve en la cumbre */}
        <path fill="#fff" d="M10.5 7L4 11l-2 2h3l-1.5 4.1L8 15l1 5l4-2l3.9 2v-3.5L22 16z" />
        {/* Sombra de la ladera */}
        <path fill="#b2c1c0" d="M38 37L22 16L10.5 7l-.5 5l3 6l-1 6l4 4l-2 9z" opacity=".5" />
        {/* Nubes altas */}
        <g fill="#fff">
          <path d="M34 7c0 1.1-.9 2-2 2H22c-1.1 0-2-.9-2-2s.9-2 2-2h10c1.1 0 2 .9 2 2" />
          <path d="M38 9c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2m4 8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2m10-5c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2s.9-2 2-2h4c1.1 0 2 .9 2 2" />
        </g>
      </>
    ),
    // Plano de referencia: prado verde, pino y arbustos
    base: (
      <>
        {/* Pradera y colinas verdes */}
        <path fill="#83bf4f" d="M0 32c.1 0 0 0 0 0m50.2 2.5C47 33.1 43.6 32 40 32s-6.8 1.7-9.6 2.4C14 38.7 0 32 0 32v32h64V36.3c-4.4.5-9.2-.1-13.8-1.8" />
        {/* Arbustos de la izquierda */}
        <g fill="#699635">
          <circle cx="5" cy="45" r="4" />
          <circle cx="6" cy="40" r="3" />
          <circle cx="12.2" cy="43" r="6" />
        </g>
        {/* Tronco del pino */}
        <path fill="#89664c" d="M55.8 33.8h2.7V42h-2.7z" />
        {/* Capas de follaje del pino */}
        <path fill="#699635" d="M59.4 22.9c-1.2-2.3-3.2-2.3-4.4 0l-4.2 7.8c-1.2 2.3 0 4.1 2.7 4.1c0 0 2.7-1 3.7-1s3.7 1 3.7 1c2.7 0 3.9-1.8 2.7-4.1z" />
        <path fill="#75a843" d="M58.9 18.4c-1-1.8-2.5-1.8-3.5 0l-3.3 6.3c-1 1.8 0 3.3 2.2 3.3c0 0 2.2-1 2.9-1s2.9 1 2.9 1c2.1 0 3.1-1.5 2.2-3.3z" />
        <path fill="#83bf4f" d="M58.5 14c-.7-1.4-1.9-1.4-2.6 0l-2.5 4.7c-.7 1.4 0 2.5 1.6 2.5c0 0 1.6-1 2.2-1s2.2 1 2.2 1c1.6 0 2.3-1.1 1.6-2.5z" />
        {/* Arbusto junto a la tienda */}
        <circle cx="19" cy="45" r="4" fill="#699635" />
      </>
    ),
    // La tienda de campaña entera flotando hacia DELANTE en relieve 3D
    floating: (
      <>
        {/* Lado derecho de la tienda */}
        <path fill="#ffdd7d" d="M30.8 36h18l7.4 13.4l-2.5 6.2l-15.4 2.6z" />
        {/* Frontal y estructura de la tienda */}
        <path fill="#dbb471" d="m24.4 55l-1.3-5.7L30.8 36l8.7 16.6l-1.2 6.6z" />
        {/* Interior de la entrada */}
        <path fill="#89664c" d="M30.8 36L27 55.8l6.1 1.8z" />
        {/* Solapas de la entrada */}
        <path fill="#ffdd7d" d="M30.8 36s1.4 12.1 3.7 16.6l-1.4 5zM27 55.8l-1.4-3.9s4.5-11.6 5.2-15.9z" />
        {/* Base / lona de suelo */}
        <path fill="#dbb471" d="m38.5 51.6l17.7-2.2l-1.5 7.2l-16.4 2.6z" />
      </>
    ),
    disparity: 1.8,
    shadowColor: 'rgba(219, 180, 113, 0.45)',
  }),
]
