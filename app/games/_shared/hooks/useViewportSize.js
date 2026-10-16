'use client'

import { useSyncExternalStore } from 'react'

// Tamaño de la ventana sin efectos ni estado propio (se recalcula al redimensionar)
const subscribeResize = (callback) => {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}
const getWidth = () => window.innerWidth
const getHeight = () => window.innerHeight
const getServerWidth = () => 1280
const getServerHeight = () => 800

/**
 * Ancho y alto de la ventana, para ajustar tableros y estímulos a la pantalla.
 *
 * @returns {{ width: number, height: number }}
 */
export function useViewportSize() {
  const width = useSyncExternalStore(subscribeResize, getWidth, getServerWidth)
  const height = useSyncExternalStore(subscribeResize, getHeight, getServerHeight)
  return { width, height }
}
