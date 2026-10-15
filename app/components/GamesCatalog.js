'use client'

import { useState } from "react"
import Link from "next/link"
import { GamePreview } from "./GamePreviews"
import { CATEGORIES } from "../data/categories"

const ALL = 'all'

// Todos los juegos en el orden de las categorías, cada uno con la suya para filtrar
const GAMES = CATEGORIES.flatMap((category) =>
  category.games.map((game) => ({ ...game, categoryId: category.id }))
)

const FILTERS = [
  { id: ALL, label: 'Todas' },
  ...CATEGORIES.map(({ id, label, description }) => ({ id, label, description })),
]

/**
 * Rejilla con todos los juegos y botones para filtrar por categoría ("Todas" por defecto).
 */
export default function GamesCatalog() {
  const [filter, setFilter] = useState(ALL)
  const visibleGames = filter === ALL ? GAMES : GAMES.filter((game) => game.categoryId === filter)

  return (
    <div className="games-catalog">
      <div className="games-filters" role="group" aria-label="Filtrar por categoría">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.description}
            className={`games-filter-btn ${filter === option.id ? 'games-filter-btn-active' : ''}`}
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="games-grid">
        {visibleGames.map((game) => (
          <Link key={game.id} href={game.href} className="game-card">
            <GamePreview previewKey={game.previewKey} />
            <h3>{game.title}</h3>
            <p>{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
