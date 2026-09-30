import Link from "next/link"
import Footer from "./components/Footer"
import { TrackingPreview, SaccadesPreview, PeripheryPreview } from "./components/GamePreviews"

export default function Home() {
  return (
    <div className="container">
      <header className="header">

        <div className="title-container">
          <img className="logo" src="/logo.png" alt="EYEVT logo" />
          <div>
            <h1 className="title">EYEVT</h1>
            <h2 className="subtitle">Eye Visual Therapy</h2>
          </div>
        </div>

        <p className="description">
          ¡Elige un juego y entrena tu visión!
        </p>
      </header>

      <main className="main">

        <div className="games-grid">

          <Link href="/games/eye-tracking" className="game-card">
            <TrackingPreview />
            <h3>Seguimientos</h3>
            <p>Mejora movimientos de seguimiento ocular con diferentes estímulos visuales</p>
          </Link>

          <Link href="/games/sacades" className="game-card">
            <SaccadesPreview />
            <h3>Sacádicos</h3>
            <p>Entrena movimientos oculares rápidos y precisos entre distintos puntos de fijación</p>
          </Link>

          <Link href="/games/periphery" className="game-card">
            <PeripheryPreview />
            <h3>Periferia</h3>
            <p>Amplía tu campo visual y estimula la atención periférica manteniendo la fijación central</p>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  )
}