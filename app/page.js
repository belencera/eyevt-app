import Link from "next/link"
import Footer from "./components/Footer"
import { GamePreview } from "./components/GamePreviews"
import { CATEGORIES } from "./data/categories"

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
        <div className="categories-container">
          {CATEGORIES.map((category) => (
            <section key={category.id} className="category-section">
              <div className="category-header">
                <h2 className="category-title">{category.title}</h2>
              </div>

              <div className="games-grid">
                {category.games.map((game) => (
                  <Link key={game.id} href={game.href} className="game-card">
                    <GamePreview previewKey={game.previewKey} />
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}