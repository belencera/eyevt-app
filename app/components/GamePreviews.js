import "./previews.css"

export function FixationPreview() {
  return (
    <div className="card-preview fixation-preview">
      <svg className="preview-svg-path" viewBox="0 0 200 90" fill="none">
        {/* Retícula concéntrica sutil de fijación */}
        <circle cx="100" cy="45" r="30" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="45" r="16" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Ejes de mira central */}
        <line x1="100" y1="22" x2="100" y2="35" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="1" />
        <line x1="100" y1="55" x2="100" y2="68" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="1" />
        <line x1="77" y1="45" x2="90" y2="45" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="1" />
        <line x1="110" y1="45" x2="123" y2="45" stroke="rgba(148, 163, 184, 0.35)" strokeWidth="1" />

        {/* Halo respiratorio de enfoque */}
        <circle cx="100" cy="45" r="9" className="fixation-halo" />

        {/* Punto central de fijación */}
        <circle cx="100" cy="45" r="5" fill="#38bdf8" className="fixation-center-dot" />
      </svg>
    </div>
  )
}

export function TrackingPreview() {
  return (
    <div className="card-preview tracking-preview">
      <svg className="preview-svg-path" viewBox="0 0 200 90" fill="none">
        <path
          d="M 25 45 Q 65 15, 100 45 T 175 45"
          stroke="rgba(56, 189, 248, 0.3)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle className="svg-tracking-dot" r="6" fill="#38bdf8" />
      </svg>
    </div>
  )
}

export function SaccadesPreview() {
  return (
    <div className="card-preview saccades-preview">
      <span className="saccade-target t1"></span>
      <span className="saccade-target t2"></span>
      <span className="saccade-target t3"></span>
      <span className="saccade-target t4"></span>
      <div className="saccade-dot"></div>
    </div>
  )
}

export function PeripheryPreview() {
  return (
    <div className="card-preview periphery-preview">
      <svg className="preview-svg-path" viewBox="0 0 200 90" fill="none">
        {/* Retícula sutil del campo visual */}
        <line x1="55" y1="45" x2="145" y2="45" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="100" y1="10" x2="100" y2="80" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="1" strokeDasharray="2 3" />
        <circle cx="100" cy="45" r="20" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="100" cy="45" r="36" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Onda expansiva de estimulación periférica */}
        <circle cx="100" cy="45" r="36" className="svg-peripheral-wave" />

        {/* Marcadores de posición periféricos */}
        <circle cx="64" cy="45" r="4.5" stroke="rgba(56, 189, 248, 0.35)" strokeDasharray="2 2" strokeWidth="1" />
        <circle cx="136" cy="45" r="4.5" stroke="rgba(56, 189, 248, 0.35)" strokeDasharray="2 2" strokeWidth="1" />
        <circle cx="100" cy="11" r="4.5" stroke="rgba(56, 189, 248, 0.35)" strokeDasharray="2 2" strokeWidth="1" />
        <circle cx="100" cy="79" r="4.5" stroke="rgba(56, 189, 248, 0.35)" strokeDasharray="2 2" strokeWidth="1" />

        {/* Estímulos periféricos intermitentes */}
        <circle cx="64" cy="45" r="4" fill="#38bdf8" className="svg-peripheral-dot dot-left" />
        <circle cx="136" cy="45" r="4" fill="#38bdf8" className="svg-peripheral-dot dot-right" />
        <circle cx="100" cy="11" r="4" fill="#38bdf8" className="svg-peripheral-dot dot-top" />
        <circle cx="100" cy="79" r="4" fill="#38bdf8" className="svg-peripheral-dot dot-bottom" />

        {/* Punto de fijación central permanente */}
        <circle cx="100" cy="45" r="4" fill="#f8fafc" className="svg-center-fixation" />
      </svg>
    </div>
  )
}

export function VergenceFlexibilityPreview() {
  return (
    <div className="card-preview flexibility-preview">
      <svg className="preview-svg-path" viewBox="0 0 200 90" fill="none">
        {/* Rayos visuales oscilantes finos */}
        <line x1="76" y1="60" x2="76" y2="18" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" className="flex-ray flex-ray-left" />
        <line x1="124" y1="60" x2="124" y2="18" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" className="flex-ray flex-ray-right" />

        {/* Ojos con estilo fino */}
        <g className="optic-eye">
          <circle cx="76" cy="68" r="8.5" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1" fill="rgba(15, 23, 42, 0.75)" />
          <circle cx="76" cy="68" r="2.5" fill="#38bdf8" className="flex-pupil-left" />
        </g>
        <g className="optic-eye">
          <circle cx="124" cy="68" r="8.5" stroke="rgba(56, 189, 248, 0.45)" strokeWidth="1" fill="rgba(15, 23, 42, 0.75)" />
          <circle cx="124" cy="68" r="2.5" fill="#38bdf8" className="flex-pupil-right" />
        </g>
      </svg>
    </div>
  )
}

export function VisualMemoryPreview() {
  return (
    <div className="card-preview memory-preview">
      <svg className="preview-svg-path" viewBox="0 0 200 90" fill="none">
        <circle cx="82" cy="30" r="10" className="memory-node node-1" />
        <circle cx="118" cy="30" r="10" className="memory-node node-2" />
        <circle cx="82" cy="60" r="10" className="memory-node node-3" />
        <circle cx="118" cy="60" r="10" className="memory-node node-4" />
      </svg>
    </div>
  )
}

export function GamePreview({ previewKey }) {
  switch (previewKey) {
    case 'fixation':
      return <FixationPreview />
    case 'tracking':
      return <TrackingPreview />
    case 'saccades':
      return <SaccadesPreview />
    case 'periphery':
      return <PeripheryPreview />
    case 'fusion':
    case 'flexibility':
      return <VergenceFlexibilityPreview />
    case 'memory':
      return <VisualMemoryPreview />
    default:
      return <FixationPreview />
  }
}

