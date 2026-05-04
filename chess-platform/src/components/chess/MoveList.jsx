import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export default function MoveList({ moves, currentIndex, onMoveClick }) {
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex])

  if (!moves.length) {
    return <p className="text-white/25 text-sm text-center py-8">Henüz hamle yapılmadı</p>
  }

  return (
    <div className="space-y-0.5 overflow-y-auto max-h-64 pr-1">
      {moves.map(({ n, w, b }) => {
        const wi = (n - 1) * 2
        const bi = (n - 1) * 2 + 1
        return (
          <div key={n} className="flex items-stretch gap-1 text-sm font-mono">
            <span className="w-8 text-right text-white/20 py-0.5 shrink-0 text-xs leading-6">{n}.</span>
            <button
              ref={currentIndex === wi ? activeRef : null}
              onClick={() => onMoveClick?.(wi)}
              className={clsx('move-btn', currentIndex === wi && 'active')}
            >
              {w?.san}
            </button>
            {b && (
              <button
                ref={currentIndex === bi ? activeRef : null}
                onClick={() => onMoveClick?.(bi)}
                className={clsx('move-btn', currentIndex === bi && 'active')}
              >
                {b.san}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
