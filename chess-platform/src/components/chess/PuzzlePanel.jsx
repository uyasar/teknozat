import { useState, useEffect, useCallback } from 'react'
import { CheckCircle, XCircle, Lightbulb, RotateCcw, ChevronRight } from 'lucide-react'
import { Chess } from 'chess.js'
import clsx from 'clsx'

export default function PuzzlePanel({ puzzle, onSolve, onNext }) {
  const [status, setStatus] = useState('idle') // idle | correct | wrong | solved
  const [moveIndex, setMoveIndex] = useState(0)
  const [hintUsed, setHintUsed] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [lastWrong, setLastWrong] = useState(null)

  useEffect(() => {
    setStatus('idle')
    setMoveIndex(0)
    setHintUsed(false)
    setAttemptCount(0)
    setLastWrong(null)
  }, [puzzle?.id])

  const checkMove = useCallback((from, to) => {
    if (!puzzle || status === 'solved') return null

    const game = new Chess(puzzle.fen)
    const expectedSan = puzzle.solution[moveIndex]

    let moveResult
    try {
      moveResult = game.move({ from, to, promotion: 'q' })
    } catch {
      return null
    }

    if (!moveResult) return null

    const isCorrect = moveResult.san === expectedSan ||
      (moveResult.lan && moveResult.lan === expectedSan) ||
      `${from}${to}` === expectedSan.replace(/[^a-h1-8]/g, '')

    const nextIndex = moveIndex + 1

    if (isCorrect) {
      if (nextIndex >= puzzle.solution.length) {
        setStatus('solved')
        onSolve?.(hintUsed, attemptCount)
      } else {
        setStatus('correct')
        setMoveIndex(nextIndex)
        setTimeout(() => setStatus('idle'), 800)
      }
      return moveResult
    }

    setStatus('wrong')
    setLastWrong(moveResult.san)
    setAttemptCount(p => p + 1)
    setTimeout(() => setStatus('idle'), 1000)
    return null
  }, [puzzle, status, moveIndex, hintUsed, attemptCount, onSolve])

  const reset = useCallback(() => {
    setStatus('idle')
    setMoveIndex(0)
    setAttemptCount(0)
    setLastWrong(null)
  }, [])

  if (!puzzle) return null

  const difficultyStars = Array.from({ length: 5 }, (_, i) => i < (puzzle.difficulty || 1))

  return (
    <div className="card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {difficultyStars.map((filled, i) => (
              <span key={i} className={filled ? 'text-accent' : 'text-white/15'}>★</span>
            ))}
          </div>
          <p className="text-white/80 text-sm leading-relaxed">{puzzle.description}</p>
        </div>
        <button
          onClick={reset}
          className="btn-ghost shrink-0 p-1.5"
          title="Yeniden başla"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <span>
          Adım {moveIndex + 1} / {puzzle.solution.length}
        </span>
        {attemptCount > 0 && (
          <span className="text-red-400/70">{attemptCount} yanlış hamle</span>
        )}
      </div>

      <div className={clsx(
        'rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300',
        status === 'solved' && 'bg-emerald-500/15 border border-emerald-500/30',
        status === 'correct' && 'bg-emerald-500/10 border border-emerald-500/20',
        status === 'wrong' && 'bg-red-500/10 border border-red-500/20',
        (status === 'idle') && 'bg-white/3 border border-white/5',
      )}>
        {status === 'solved' && <CheckCircle size={20} className="text-emerald-400 shrink-0" />}
        {status === 'correct' && <CheckCircle size={20} className="text-emerald-400/70 shrink-0" />}
        {status === 'wrong' && <XCircle size={20} className="text-red-400 shrink-0" />}
        {status === 'idle' && <ChevronRight size={16} className="text-accent shrink-0" />}

        <span className={clsx(
          'text-sm',
          status === 'solved' && 'text-emerald-300 font-semibold',
          status === 'correct' && 'text-emerald-400',
          status === 'wrong' && 'text-red-300',
          status === 'idle' && 'text-white/60',
        )}>
          {status === 'solved' && 'Mükemmel! Bulmacayı çözdünüz.'}
          {status === 'correct' && 'Doğru hamle! Devam edin.'}
          {status === 'wrong' && `"${lastWrong}" yanlış. Tekrar deneyin.`}
          {status === 'idle' && 'En iyi hamleyi bulun.'}
        </span>
      </div>

      {!hintUsed && status !== 'solved' && (
        <button
          onClick={() => setHintUsed(true)}
          className="btn-ghost w-full text-xs gap-1.5"
        >
          <Lightbulb size={13} />
          İpucu göster
        </button>
      )}

      {hintUsed && puzzle.hint && (
        <div className="rounded-lg bg-accent/10 border border-accent/20 px-3 py-2">
          <p className="text-accent text-xs flex items-start gap-1.5">
            <Lightbulb size={12} className="mt-0.5 shrink-0" />
            {puzzle.hint}
          </p>
        </div>
      )}

      {status === 'solved' && onNext && (
        <button onClick={onNext} className="btn-primary w-full">
          Sonraki bulmaca
          <ChevronRight size={15} />
        </button>
      )}

    </div>
  )
}
