/**
 * Quita un detalle pequeño de una ilustración SVG para crear el estímulo "diferente".
 *
 * Los SVG están formados por piezas (path, circle, ellipse…) y un path puede tener varios trozos
 * (ej. los dos ojos en el mismo path). Para cada pieza y cada trozo se compara el dibujo original con
 * el dibujo sin él y se cuenta qué proporción cambia. Solo valen los cambios entre DETAIL_MIN_RATIO y
 * DETAIL_MAX_RATIO: visibles, pero poco perceptibles (un ojo, una rueda, un brillo).
 *
 * Funciona con cualquier SVG nuevo sin listas manuales. Solo se ejecuta en el navegador (canvas).
 */

import { pickRandom } from '../../_shared/utils/random'
import { DETAIL_MAX_RATIO, DETAIL_MIN_RATIO } from './constants'

const RENDER_PX = 96 // Tamaño del dibujo al comparar
const PIXEL_THRESHOLD = 48 // Diferencia mínima (suma RGBA) para contar un píxel como cambiado
const SHAPE_SELECTOR = 'path, circle, ellipse, rect, polygon, polyline, line'
const NON_RENDERED_PARENTS = 'defs, clipPath, mask, pattern, symbol, marker'

/** Detalles que se pueden quitar, ya analizados, por imagen: src → Promise<{ text, candidates }> */
const analysisCache = new Map()

const parseSvg = (text) => new DOMParser().parseFromString(text, 'image/svg+xml')

/** Piezas visibles del SVG (las de <defs>, máscaras, etc. no se dibujan solas) */
const getShapes = (doc) =>
  [...doc.querySelectorAll(SHAPE_SELECTOR)].filter((el) => !el.closest(NON_RENDERED_PARENTS))

/**
 * Trozos de un path: cada uno empieza con un "M" absoluto. Los "m" relativos se quedan unidos
 * al trozo anterior porque dependen de dónde acaba.
 */
const getSubpaths = (el) =>
  el.tagName === 'path'
    ? (el.getAttribute('d') || '').split(/(?=M)/).map((part) => part.trim()).filter(Boolean)
    : []

/** Detalles que se pueden quitar: cada pieza entera y, si tiene varios trozos, cada trozo */
function getDetails(doc) {
  return getShapes(doc).flatMap((el, shape) => {
    const subpaths = getSubpaths(el)
    const parts = subpaths.length > 1 ? subpaths.map((_, part) => ({ shape, part })) : []
    return [{ shape, part: null }, ...parts]
  })
}

/** SVG sin un detalle (o completo si es null), con tamaño fijo para dibujarlo igual siempre */
function serializeWithout(text, detail) {
  const doc = parseSvg(text)
  const root = doc.documentElement
  root.setAttribute('width', RENDER_PX)
  root.setAttribute('height', RENDER_PX)

  if (detail) {
    const el = getShapes(doc)[detail.shape]
    if (detail.part === null) {
      el?.remove()
    } else {
      const remaining = getSubpaths(el).filter((_, part) => part !== detail.part)
      el?.setAttribute('d', remaining.join(' '))
    }
  }
  return new XMLSerializer().serializeToString(doc)
}

const toBlobUrl = (svgText) => URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }))

/** Píxeles RGBA del SVG dibujado a RENDER_PX */
async function rasterize(svgText) {
  const url = toBlobUrl(svgText)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = RENDER_PX
    canvas.height = RENDER_PX
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, RENDER_PX, RENDER_PX)
    return ctx.getImageData(0, 0, RENDER_PX, RENDER_PX).data
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Proporción del dibujo (píxeles no transparentes del original) que cambia */
function getChangeRatio(base, modified) {
  let drawn = 0
  let changed = 0
  for (let i = 0; i < base.length; i += 4) {
    if (base[i + 3] > 0) drawn++
    const diff =
      Math.abs(base[i] - modified[i]) +
      Math.abs(base[i + 1] - modified[i + 1]) +
      Math.abs(base[i + 2] - modified[i + 2]) +
      Math.abs(base[i + 3] - modified[i + 3])
    if (diff > PIXEL_THRESHOLD) changed++
  }
  return drawn > 0 ? changed / drawn : 0
}

/** Analiza una imagen una sola vez: qué detalles se pueden quitar */
async function analyzeSvg(src) {
  const text = await (await fetch(src)).text()
  const base = await rasterize(serializeWithout(text, null))

  const candidates = []
  for (const detail of getDetails(parseSvg(text))) {
    const ratio = getChangeRatio(base, await rasterize(serializeWithout(text, detail)))
    if (ratio >= DETAIL_MIN_RATIO && ratio <= DETAIL_MAX_RATIO) candidates.push(detail)
  }
  return { text, candidates }
}

function getAnalysis(src) {
  if (!analysisCache.has(src)) {
    // Si falla (red, SVG inválido) se olvida para poder reintentar más adelante
    const analysis = analyzeSvg(src).catch((error) => {
      analysisCache.delete(src)
      throw error
    })
    analysisCache.set(src, analysis)
  }
  return analysisCache.get(src)
}

/**
 * Devuelve la ilustración con un detalle menos: `{ src }` con una URL `blob:` lista para <img>,
 * o null si la imagen no tiene ningún detalle adecuado (o no se pudo cargar).
 *
 * @param {string} src - Ruta del SVG original (ej. '/animals/lion.svg')
 */
export async function removeSvgDetail(src) {
  try {
    const { text, candidates } = await getAnalysis(src)
    if (candidates.length === 0) return null
    return { src: toBlobUrl(serializeWithout(text, pickRandom(candidates))) }
  } catch {
    return null
  }
}
