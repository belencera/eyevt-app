import Link from "next/link"

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
          ¡Elige tu juego y entrena tu visión!
        </p>
      </header>

      <main className="main">

        <div className="games-grid">

          <Link href="/games/eye-tracking" className="game-card">
            <h3>Seguimientos</h3>
            <p>Seguimientos oculares, elije tu nivel y comienza</p>
          </Link>

          <Link href="/games/sacades" className="game-card">
            <h3>Sacádicos</h3>
            <p>Entrena tus movimientos oculares rápidos y precisos</p>
          </Link>

        </div>
      </main>
    </div>
  )
}