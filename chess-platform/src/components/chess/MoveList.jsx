import { useEffect, useRef } from 'react'
import clsx from 'clsx'

export default function MoveList({ moves, currentIndex, onMoveClick, compact = false }) {
  const activeRef = useRef(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [currentIndex])

  if (!moves.length) {
    return (
      <div className="text-white/30 text-sm text-center py-6">
        Henüz hamle yapılmadı
      </div>
    )
  }

  return (
    <div className={clsx('font-mono text-sm overflow-y-auto', compact ? 'max-h-40' : 'max-h-72')}>
      {moves.map(({ moveNumber, white, black }) => {
        const whiteIdx = (moveNumber - 1) * 2
        const blackIdx = (moveNumber - 1) * 2 + 1
        const isWhiteActive = currentIndex === whiteIdx
        const isBlackActive = currentIndex === blackIdx

        return (
          <div key={moveNumber} className="flex items-center gap-1 hover:bg-white/3 rounded px-1">
            <span className="text-white/25 w-7 text-right shrink-0">{moveNumber}.</span>
            <button
              ref={isWhiteActive ? activeRef : null}
              onClick={() => onMoveClick?.(whiteIdx)}
              className={clsx(
                'flex-1 text-left px-2 py-0.5 rounded transition-colors',
                isWhiteActive ? 'bg-accent/20 text-accent' : 'text-white/80 hover:text-white hover:bg-white/5'
              )}
            >
              {white?.san}
            </button>
            {black && (
              <button
                ref={isBlackActive ? activeRef : null}
                onClick={() => onMoveClick?.(blackIdx)}
                className={clsx(
                  'flex-1 text-left px-2 py-0.5 rounded transition-colors',
                  isBlackActive ? 'bg-accent/20 text-accent' : 'text-white/80 hover:text-white hover:bg-white/5'
                )}
              >
                {black.san}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
