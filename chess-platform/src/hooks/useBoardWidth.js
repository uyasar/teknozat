import { useState, useEffect, useCallback } from 'react'

/**
 * Returns a responsive chess board width.
 * Caps at `max` (default 480), uses viewport width minus padding on small screens.
 */
export function useBoardWidth(max = 480) {
  const calc = useCallback(() => {
    const vw = window.innerWidth
    // On very small screens leave 16px padding on each side
    return Math.min(max, vw - 32)
  }, [max])

  const [width, setWidth] = useState(calc)

  useEffect(() => {
    const onResize = () => setWidth(calc())
    window.addEventListener('resize', onResize, { passive: true })
    // run once after mount (SSR-safe)
    setWidth(calc())
    return () => window.removeEventListener('resize', onResize)
  }, [calc])

  return width
}
