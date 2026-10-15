import Footer from "./components/Footer"
import GamesCatalog from "./components/GamesCatalog"

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="title-container">
          <img className="logo" src="/logo.png" alt="EYEVT logo" />
          <div>
            <h1 className="title">EYEVT</h1>
            <h2 className="subtitle">Eye Visual Training</h2>
          </div>
        </div>

        <p className="description">
          ¡Selecciona una actividad, personaliza los parámetros y comienza a entrenar!
        </p>
      </header>

      <main className="main">
        <GamesCatalog />
      </main>

      <Footer />
    </div>
  )
}