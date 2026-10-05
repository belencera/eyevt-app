export const CATEGORIES = [
  {
    id: 'oculomotricidad',
    title: 'OCULOMOTRICIDAD',
    description: 'Movimiento ocular, estabilidad de la fijación y atención periférica',
    games: [
      {
        id: 'fixation',
        title: 'Fijación',
        href: '/games/fixation',
        description: 'Estabilidad de la mirada y atención visual',
        previewKey: 'fixation',
      },
      {
        id: 'eye-tracking',
        title: 'Seguimientos',
        href: '/games/eye-tracking',
        description: 'Seguimiento de estímulos en movimiento',
        previewKey: 'tracking',
      },
      {
        id: 'sacades',
        title: 'Sacádicos',
        href: '/games/sacades',
        description: 'Cambios rápidos y precisos de fijación',
        previewKey: 'saccades',
      },
      {
        id: 'periphery',
        title: 'Periferia',
        href: '/games/periphery',
        description: 'Atención y detección visual periférica',
        previewKey: 'periphery',
      },
    ],
  },
  {
    id: 'binocularidad',
    title: 'BINOCULARIDAD',
    description: 'Coordinación visual mediante diferentes posiciones y configuraciones de estímulos',
    games: [
      {
        id: 'convergence',
        title: 'Convergencia',
        href: '/games/convergence',
        description: 'Percepción simultánea y fusión en convergencia',
        previewKey: 'convergence',
      },
      {
        id: 'divergence',
        title: 'Divergencia',
        href: '/games/divergence',
        description: 'Percepción simultánea y fusión en divergencia',
        previewKey: 'divergence',
      },
      {
        id: 'vergence-flexibility',
        title: 'Flexibilidad',
        href: '/games/vergence-flexibility',
        description: 'Alternancia convergencia y divergencia',
        previewKey: 'flexibility',
      },
    ],
  },
  {
    id: 'percepcion',
    title: 'PERCEPCIÓN VISUAL',
    description: 'Procesamiento y reconocimiento de información visual',
    games: [
      {
        id: 'visual-memory',
        title: 'Memoria visual',
        href: '/games/visual-memory',
        description: 'Memorización y recuerdo de patrones',
        previewKey: 'memory',
      },
    ],
  },
]
