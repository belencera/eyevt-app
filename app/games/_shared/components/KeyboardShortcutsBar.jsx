'use client'

/**
 * Componente unificado para mostrar la barra inferior de atajos de teclado.
 *
 * @param {Array<{ keys: string[], label: string }>} shortcuts - Lista de atajos
 * @param {string} [hint] - Texto informativo adicional alineado a la derecha
 */
export function KeyboardShortcutsBar({ shortcuts = [], hint }) {
  if (!shortcuts || shortcuts.length === 0) return null

  return (
    <div className="dashShortcutsBar">
      <div className="dashShortcutsLeft">
        <span className="dashShortcutsLabel">Atajos:</span>
        <div className="dashShortcutsPills">
          {shortcuts.map((item, index) => (
            <span key={item.label || index} className="dashPillItemWrapper">
              {index > 0 && (
                <span className="dashPillSep" aria-hidden="true">
                  •
                </span>
              )}
              <div className="dashPillItem">
                {item.keys.map((k, kIdx) => (
                  <kbd key={kIdx} className="dashKey">
                    {k}
                  </kbd>
                ))}
                <span>{item.label}</span>
              </div>
            </span>
          ))}
        </div>
      </div>

      {hint && <span className="dashShortcutsBaseHint">{hint}</span>}
    </div>
  )
}
