import "./previews.css"

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
        <circle className="svg-tracking-dot" r="6" fill="#38bdf8">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path="M 25 45 Q 65 15, 100 45 T 175 45"
            keyPoints="0;1;0"
            keyTimes="0;0.5;1"
            calcMode="spline"
            keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
          />
        </circle>
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
