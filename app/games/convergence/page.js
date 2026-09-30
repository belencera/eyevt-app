import Link from 'next/link'

export default function ConvergencePage() {
  return (
    <div className="coming-soon-container">
      <h1 className="coming-soon-text">Próximamente</h1>
      <Link href="/" className="coming-soon-back">
        ← Volver al inicio
      </Link>
    </div>
  )
}
