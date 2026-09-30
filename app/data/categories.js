export const CATEGORIES = [
  {
    id: 'oculomotricidad',
    title: 'OCULOMOTRICIDAD',
    description: 'Control del movimiento ocular, estabilidad de la fijación y atención periférica.',
    games: [
      {
        id: 'fixation',
        title: 'Fijación',
        href: '/games/fixation',
        description: 'Entrena la estabilidad visual y la capacidad de mantener la mirada en un punto fijo central',
        previewKey: 'fixation',
      },
      {
        id: 'eye-tracking',
        title: 'Seguimientos',
        href: '/games/eye-tracking',
        description: 'Mejora tus movimientos de seguimiento ocular con estímulos visuales personalizados',
        previewKey: 'tracking',
      },
      {
        id: 'sacades',
        title: 'Sacádicos',
        href: '/games/sacades',
        description: 'Entrena tus movimientos oculares rápidos y precisos entre distintos puntos de fijación',
        previewKey: 'saccades',
      },
      {
        id: 'periphery',
        title: 'Periferia',
        href: '/games/periphery',
        description: 'Amplía tu campo visual y estimula la atención periférica manteniendo la fijación central',
        previewKey: 'periphery',
      },
    ],
  },
  {
    id: 'binocularidad',
    title: 'BINOCULARIDAD Y VERGENCIAS',
    description: 'Coordinación binocular, control, amplitud y flexibilidad de vergencias.',
    games: [
      {
        id: 'convergence',
        title: 'Convergencia',
        href: '/games/convergence',
        description: 'Entrena la capacidad de converger manteniendo la visión binocular de distintos estímulos',
        previewKey: 'convergence',
      },
      {
        id: 'divergence',
        title: 'Divergencia',
        href: '/games/divergence',
        description: 'Entrena la capacidad de diverger manteniendo la visión binocular con estímulos fijos, a saltos y suaves',
        previewKey: 'divergence',
      },
      {
        id: 'vergence-flexibility',
        title: 'Flexibilidad',
        href: '/games/vergence-flexibility',
        description: 'Alternancia entre demandas de convergencia y divergencia de distintos niveles de dificultad',
        previewKey: 'flexibility',
      },
    ],
  },
  {
    id: 'percepcion',
    title: 'PERCEPCIÓN VISUAL',
    description: 'Procesamiento visual, memoria visual y discriminación.',
    games: [
      {
        id: 'visual-memory',
        title: 'Memoria visual',
        href: '/games/visual-memory',
        description: 'Entrena la memoria visual de manera personalizada',
        previewKey: 'memory',
      },
    ],
  },
]
