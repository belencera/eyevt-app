import React from 'react'

/**
 * Renderiza el estímulo vectorial de anillos concéntricos con disparidad horizontal.
 *
 * - Anillo exterior: permanece centrado en (50, 50) en ambos ojos como plano de referencia (disparidad cero).
 * - Marcas de alineación cardinales: facilitan la correspondencia sensorial y el anclaje fusional.
 * - Anillo interior y punto central: desplazados horizontalmente según el valor de 'disparity'
 *   para inducir la percepción de profundidad 3D (relieve hacia el usuario o profundidad hacia el fondo).
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
 * Catálogo de parejas de estímulos para Estereopsis (3er grado de visión binocular).
 */
export const STEREOPSIS_PAIRS = [
  {
    id: 'concentric-rings',
    name: 'Círculos',
    category: 'estereopsis',
    description: 'Anillo interior flotando en 3D por disparidad retiniana horizontal.',
    renderLeft: (size = 76) => <StereoConcentricRingsSVG size={size} disparity={-6} />,
    renderRight: (size = 76) => <StereoConcentricRingsSVG size={size} disparity={6} />,
    renderPreview: (size = 38) => <StereoConcentricRingsSVG size={size} disparity={0} isPreview />,
  },
]
