/**
 * Construcción de una pantalla de Encuentra el diferente:
 * `count` estímulos iguales y uno de ellos (en una posición al azar) con un detalle distinto.
 */

import {
  PBQD_LETTERS,
  UPPERCASE_ALPHABET,
  getIllustrationCategory,
  getRandomNumber,
  getRandomWord,
} from '../../_shared/data/constants'
import { shuffle } from '../../_shared/utils/shuffle'
import { pickRandom } from '../../_shared/utils/random'
import { canMakeVariant, makeTextVariant } from './variants'
import { removeSvgDetail } from './svgDetail'

const MAX_TEXT_ATTEMPTS = 30

/** Estímulo base de texto distinto del anterior y con variante posible */
function pickTextBase(type, settings, prevKey) {
  for (let attempt = 0; attempt < MAX_TEXT_ATTEMPTS; attempt++) {
    let value
    if (type === 'pbqd') value = pickRandom(PBQD_LETTERS)
    else if (type === 'letters') value = pickRandom(UPPERCASE_ALPHABET)
    else if (type === 'words') value = getRandomWord(settings.wordLength, prevKey)
    else if (type === 'numbers') value = getRandomNumber(settings.numberDigits, prevKey)

    if (value !== prevKey && canMakeVariant(type, value)) return value
  }
  return null
}

/** Base y variante de una categoría de texto */
function buildTextPair(type, settings, prevKey) {
  const value = pickTextBase(type, settings, prevKey)
  if (value === null) return null
  return { key: value, value, oddValue: makeTextVariant(type, value) }
}

/** Base y variante de una ilustración: se prueban los elementos al azar hasta encontrar uno con detalle */
async function buildIllustrationPair(type, prevKey) {
  const items = getIllustrationCategory(type)?.items ?? []
  for (const item of shuffle(items.filter((it) => it.id !== prevKey))) {
    const detail = await removeSvgDetail(item.src)
    if (detail) return { key: item.id, value: item, oddValue: { ...item, ...detail } }
  }
  return null
}

/**
 * @param {{ type: string, count: number, settings?: { wordLength?, numberDigits? }, prevKey?: string|null }} params
 * @returns {Promise<{ key: string, items: Array<any>, oddIndex: number } | null>}
 *   items: valores para StimulusItem (todos iguales salvo el de oddIndex); null si la categoría no sirve
 */
export async function buildOddRound({ type, count, settings = {}, prevKey = null }) {
  const pair = getIllustrationCategory(type)
    ? await buildIllustrationPair(type, prevKey)
    : buildTextPair(type, settings, prevKey)
  if (!pair) return null

  const oddIndex = Math.floor(Math.random() * count)
  const items = Array.from({ length: count }, (_, i) => (i === oddIndex ? pair.oddValue : pair.value))
  return { key: pair.key, items, oddIndex }
}
