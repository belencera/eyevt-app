/**
 * Construcción de rondas de los juegos con cuadrícula de respuesta
 * (Memoria Visual, Memoria Secuencial y Taquitoscopio).
 */

import { shuffle } from '../../_shared/utils/shuffle'
import { pickRandom } from '../../_shared/utils/random'
import { MAX_OPTIONS } from '../common/constants'
import { getCategoryItems, getGroupedNumbers, resolveNumberLength, toItems } from '../common/stimulusPool'
import { GRID_SIZE_STEPS, MIN_DISTRACTORS, SINGLE_ROW_MAX } from './constants'

/**
 * Número de opciones de la cuadrícula para un nivel, limitado al tamaño de la categoría.
 * Se mantiene par para que las 2 filas sean simétricas (salvo categorías de una sola fila).
 */
export function getOptionsCount(level, categorySize) {
  const step = [...GRID_SIZE_STEPS].reverse().find((s) => level >= s.minLevel) ?? GRID_SIZE_STEPS[0]
  if (categorySize <= SINGLE_ROW_MAX) return categorySize
  const available = categorySize - (categorySize % 2)
  return Math.min(step.options, available)
}

/**
 * Columnas de la cuadrícula: 1 fila para categorías pequeñas, 2 filas en el resto.
 */
export function getGridColumns(optionsCount) {
  return optionsCount <= SINGLE_ROW_MAX ? optionsCount : optionsCount / 2
}

/**
 * Elige los objetivos entre las opciones de la ronda.
 *
 * `candidates` son las opciones en orden de preferencia para ser objetivo
 * (en números, intercaladas por grupo para que haya un objetivo de cada grupo).
 *
 * - Sin repetición mientras queden al menos MIN_DISTRACTORS opciones que no son objetivo.
 * - Con más estímulos que eso, los objetivos se sortean con reemplazo (pueden repetirse),
 *   así cualquier categoría puede subir de nivel sin límite.
 * - En categorías de una fila (pbqd, flechas) todas las opciones pueden ser objetivo
 *   y los objetivos pueden repetirse desde el primer nivel.
 */
function assembleRound(candidates, count) {
  const optionsCount = candidates.length
  const isSingleRow = optionsCount <= SINGLE_ROW_MAX
  const targetPoolSize = isSingleRow ? optionsCount : optionsCount - MIN_DISTRACTORS
  const allowRepeats = isSingleRow || count > targetPoolSize

  const targetPool = candidates.slice(0, targetPoolSize)
  let targets
  if (isSingleRow) {
    // pbqd y flechas: sorteo libre con repetición desde el primer nivel
    targets = Array.from({ length: count }, () => pickRandom(targetPool))
  } else if (allowRepeats) {
    // Primero un objetivo por candidato (cubre todos los grupos de números) y el resto se repite al azar
    const extras = Array.from({ length: count - targetPool.length }, () => pickRandom(targetPool))
    targets = shuffle([...targetPool, ...extras])
  } else {
    targets = shuffle(candidates.slice(0, count))
  }

  return {
    options: shuffle(candidates),
    targets,
    columns: getGridColumns(optionsCount),
    allowRepeats,
  }
}

/**
 * Ronda de números de varias cifras: un grupo por objetivo (hasta la mitad de las opciones)
 * y todas las opciones de un grupo empiezan por la misma cifra que su objetivo.
 * Ej: objetivos 345 y 678 → opciones 345, 312, 389… y 678, 641, 607…
 */
function buildNumberRound(count, length) {
  const optionsCount = getOptionsCount(count, MAX_OPTIONS)
  const groups = Math.max(1, Math.min(count, Math.floor(optionsCount / 2)))
  return assembleRound(toItems(getGroupedNumbers(length, optionsCount, groups)), count)
}

/**
 * Construye una ronda: opciones de la cuadrícula y objetivos a recordar.
 *
 * @param {{ type: string, count: number, settings?: object }} params
 * @returns {{ options: Array, targets: Array, columns: number, allowRepeats: boolean }}
 */
export function buildRecallRound({ type, count, settings = {} }) {
  if (type === 'numbers') {
    const length = resolveNumberLength(settings.numberDigits ?? 1)
    if (length > 1) return buildNumberRound(count, length)
  }

  const items = getCategoryItems(type, settings)
  const optionsCount = getOptionsCount(count, items.length)
  // Las palabras ya vienen ordenadas de más a menos parecidas: se toman las primeras
  const pool = type === 'words' ? items : shuffle(items)
  return assembleRound(shuffle(pool.slice(0, optionsCount)), count)
}
