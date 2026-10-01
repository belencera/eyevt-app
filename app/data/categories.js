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
        description: 'Estabilidad de la mirada y mantenimiento de la atención sobre estímulos visuales estáticos',
        previewKey: 'fixation',
      },
      {
        id: 'eye-tracking',
        title: 'Seguimientos',
        href: '/games/eye-tracking',
        description: 'Control visual durante el desplazamiento continuo de estímulos por diferentes trayectorias',
        previewKey: 'tracking',
      },
      {
        id: 'sacades',
        title: 'Sacádicos',
        href: '/games/sacades',
        description: 'Cambios rápidos y precisos de fijación entre estímulos situados en diferentes posiciones',
        previewKey: 'saccades',
      },
      {
        id: 'periphery',
        title: 'Periferia',
        href: '/games/periphery',
        description: 'Detección y respuesta ante estímulos presentados fuera del área de fijación central',
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
        description: 'Control de vergencias frente a estímulos con demanda convergente y control antisupresión',
        previewKey: 'convergence',
      },
      {
        id: 'divergence',
        title: 'Divergencia',
        href: '/games/divergence',
        description: 'Control de vergencias frente a estímulos con diferentes demandas divergentes',
        previewKey: 'divergence',
      },
      {
        id: 'vergence-flexibility',
        title: 'Flexibilidad',
        href: '/games/vergence-flexibility',
        description: 'Alternancia entre demandas de convergencia y divergencia con distintos niveles de dificultad',
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
        description: 'Reconocimiento y memorización de distintos patrones visuales fijos',
        previewKey: 'memory',
      },
    ],
  },
]
