export const CATEGORIES = [
  {
    id: 'oculomotricidad',
    title: 'OCULOMOTRICIDAD',
    description: 'Control del movimiento ocular, estabilidad de la fijación y campo visual.',
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
    description: 'Coordinación binocular, trabajo en equipo de ambos ojos y alineación visual.',
    games: [
      {
        id: 'convergence',
        title: 'Convergencia',
        href: '/games/convergence',
        description: 'Entrena la capacidad de coordinar ambos ojos hacia adentro manteniendo una imagen única',
        previewKey: 'convergence',
      },
      {
        id: 'divergence',
        title: 'Divergencia',
        href: '/games/divergence',
        description: 'Entrena la alineación visual hacia afuera y la relajación de la convergencia binocular',
        previewKey: 'divergence',
      },
      {
        id: 'vergence-flexibility',
        title: 'Flexibilidad',
        href: '/games/vergence-flexibility',
        description: 'Alternancia ágil entre demandas de convergencia y divergencia binocular',
        previewKey: 'flexibility',
      },
    ],
  },
  {
    id: 'percepcion',
    title: 'PERCEPCIÓN VISUAL',
    description: 'Procesamiento visual, memoria foveal y discriminación de formas.',
    games: [
      {
        id: 'visual-memory',
        title: 'Memoria visual',
        href: '/games/visual-memory',
        description: 'Entrena la retención visual, el reconocimiento de patrones y la memoria de trabajo',
        previewKey: 'memory',
      },
    ],
  },
]
