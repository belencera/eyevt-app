import React from 'react'

export const STIMULI_CATEGORIES = [
  { id: 'fusion-plana', label: 'Fusión plana · 2D' },
  { id: 'estereopsis', label: 'Estereopsis · 3D' },
  { id: 'dinamicos', label: 'Dinámicos' },
]

/**
 * Catálogo de parejas complementarias de estímulos para convergencia.
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
    id: 'bird-cage',
    name: 'Pájaro · Jaula',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/vergence/bird.svg"
          alt="Pájaro"
          width={Math.round(size * 0.55)}
          height={Math.round(size * 0.55)}
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(255, 172, 51, 0.4))' }}
          draggable={false}
        />
      </div>
    ),
    renderRight: (size = 70) => (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/vergence/bird-cage.svg"
          alt="Jaula"
          width={size}
          height={size}
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' }}
          draggable={false}
        />
      </div>
    ),
    renderPreview: (size = 46) => (
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/vergence/bird-cage.svg"
          alt="Jaula"
          width={size}
          height={size}
          style={{ position: 'absolute', inset: 0, objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.35))' }}
          draggable={false}
        />
        <img
          src="/vergence/bird.svg"
          alt="Pájaro"
          width={Math.round(size * 0.52)}
          height={Math.round(size * 0.52)}
          style={{ position: 'relative', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(255, 172, 51, 0.5))' }}
          draggable={false}
        />
      </div>
    ),
  },
  {
    id: 'mouse-cheese',
    name: 'Ratón · Queso',
    category: 'fusion-plana',
    renderLeft: (size = 70) => (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/vergence/mouse.svg"
          alt="Ratón"
          width={size}
          height={size}
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.45))' }}
          draggable={false}
        />
      </div>
    ),
    renderRight: (size = 70) => (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/vergence/cheese.svg"
          alt="Queso"
          width={Math.round(size * 0.85)}
          height={Math.round(size * 0.85)}
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))' }}
          draggable={false}
        />
      </div>
    ),
    renderPreview: (size = 46) => (
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src="/vergence/mouse.svg"
          alt="Ratón"
          width={size}
          height={size}
          style={{ position: 'absolute', inset: 0, objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(148, 163, 184, 0.4))' }}
          draggable={false}
        />
        <img
          src="/vergence/cheese.svg"
          alt="Queso"
          width={Math.round(size * 0.52)}
          height={Math.round(size * 0.52)}
          style={{
            position: 'absolute',
            bottom: '1px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))',
          }}
          draggable={false}
        />
      </div>
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
