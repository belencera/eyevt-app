import React from 'react'

export const STIMULI_CATEGORIES = [
  { id: 'fusion-plana', label: 'Fusión plana · 2D' },
  { id: 'estereopsis', label: 'Estereopsis · 3D' },
  { id: 'dinamicos', label: 'Dinámicos' },
]

/**
 * Catálogo unificado de parejas complementarias de estímulos para convergencia.
 * Cada elemento define:
 * - id: Identificador único
 * - name: Nombre del estímulo
 * - category: 'fusion-plana' | 'estereopsis' | 'dinamicos'
 * - renderLeft: SVG para el ojo izquierdo
 * - renderRight: SVG para el ojo derecho
 * - renderPreview: Miniatura combinada resultante de la fusión
 */
export const STIMULI_PAIRS = [
  // ─── CATEGORÍA: FUSIÓN PLANA · 2D ──────────────────────────
  {
    id: 'cross',
    name: 'Cruz',
    category: 'fusion-plana',
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
  {
    id: 'target',
    name: 'Diana',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="4" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="7" fill="#38bdf8" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="4" />
        <circle cx="30" cy="30" r="7" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    id: 'square',
    name: 'Cuadrado con cruz',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <rect x="10" y="10" width="40" height="40" rx="4" stroke="#38bdf8" strokeWidth="3.5" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <line x1="30" y1="18" x2="30" y2="42" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="18" y1="30" x2="42" y2="30" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <rect x="10" y="10" width="40" height="40" rx="4" stroke="#38bdf8" strokeWidth="3.5" />
        <line x1="30" y1="18" x2="30" y2="42" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="18" y1="30" x2="42" y2="30" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'diamond',
    name: 'Rombo con punto',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <polygon points="30,8 52,30 30,52 8,30" stroke="#38bdf8" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="6" fill="#38bdf8" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <polygon points="30,8 52,30 30,52 8,30" stroke="#38bdf8" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="30" cy="30" r="6" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    id: 'triangle',
    name: 'Triángulo con círculo',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <polygon points="30,10 52,48 8,48" stroke="#38bdf8" strokeWidth="3.5" strokeLinejoin="round" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="34" r="6" fill="#38bdf8" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <polygon points="30,10 52,48 8,48" stroke="#38bdf8" strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="30" cy="34" r="6" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    id: 'circle-lines',
    name: 'Círculo con aspa',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="3.5" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <line x1="16" y1="16" x2="44" y2="44" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="44" y1="16" x2="16" y2="44" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="3.5" />
        <line x1="16" y1="16" x2="44" y2="44" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="44" y1="16" x2="16" y2="44" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'cat',
    name: 'Gato',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="32" r="18" stroke="#38bdf8" strokeWidth="3" />
        <polygon points="15,20 19,7 28,15" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.2)" strokeLinejoin="round" />
        <circle cx="23" cy="29" r="2.5" fill="#38bdf8" />
        <line x1="10" y1="33" x2="20" y2="34" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="38" x2="20" y2="37" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="32" r="18" stroke="#38bdf8" strokeWidth="3" />
        <polygon points="45,20 41,7 32,15" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.2)" strokeLinejoin="round" />
        <circle cx="37" cy="29" r="2.5" fill="#38bdf8" />
        <line x1="50" y1="33" x2="40" y2="34" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="38" x2="40" y2="37" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="32" r="18" stroke="#38bdf8" strokeWidth="3" />
        <polygon points="15,20 19,7 28,15" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.2)" strokeLinejoin="round" />
        <polygon points="45,20 41,7 32,15" stroke="#38bdf8" strokeWidth="2.5" fill="rgba(56, 189, 248, 0.2)" strokeLinejoin="round" />
        <circle cx="23" cy="29" r="2.5" fill="#38bdf8" />
        <circle cx="37" cy="29" r="2.5" fill="#38bdf8" />
        <line x1="10" y1="33" x2="20" y2="34" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="38" x2="20" y2="37" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="33" x2="40" y2="34" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="38" x2="40" y2="37" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
        <polygon points="30,34 32,37 28,37" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    id: 'football',
    name: 'Fútbol',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="3.5" />
        <polygon points="16,24 21,18 27,21 25,28 18,29" fill="#38bdf8" />
        <polygon points="17,35 24,35 26,42 20,45 15,41" fill="#38bdf8" />
        <line x1="27" y1="21" x2="33" y2="21" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
        <line x1="25" y1="28" x2="30" y2="31" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
      </svg>
    ),
    renderRight: (size = 70) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="3.5" />
        <polygon points="30,26 35,29 33,35 27,35 25,29" fill="#38bdf8" />
        <polygon points="44,24 39,18 33,21 35,28 42,29" fill="#38bdf8" />
        <polygon points="43,35 36,35 34,42 40,45 45,41" fill="#38bdf8" />
      </svg>
    ),
    renderPreview: (size = 46) => (
      <svg viewBox="0 0 60 60" width={size} height={size} fill="none" style={{ overflow: 'visible' }}>
        <circle cx="30" cy="30" r="22" stroke="#38bdf8" strokeWidth="3.5" />
        <polygon points="30,26 35,29 33,35 27,35 25,29" fill="#38bdf8" />
        <polygon points="16,24 21,18 27,21 25,28 18,29" fill="#38bdf8" />
        <polygon points="44,24 39,18 33,21 35,28 42,29" fill="#38bdf8" />
        <polygon points="17,35 24,35 26,42 20,45 15,41" fill="#38bdf8" />
        <polygon points="43,35 36,35 34,42 40,45 45,41" fill="#38bdf8" />
      </svg>
    ),
  },
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
