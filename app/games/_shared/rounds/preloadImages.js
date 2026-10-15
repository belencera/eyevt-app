/**
 * Precarga las ilustraciones de una lista de elementos `{ value }` para que estén listas al mostrarse,
 * imprescindible en exposiciones muy cortas (Taquitoscopio a 50 ms) y al voltear cartas.
 */
export function preloadImages(items) {
  items.forEach(({ value }) => {
    if (value?.src) {
      const img = new Image()
      img.src = value.src
    }
  })
}
