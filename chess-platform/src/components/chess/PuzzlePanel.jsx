import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, ArrowRight } from 'lucide-react'
import clsx from 'clsx'

export default function PuzzlePanel({
  puzzle,
  status,          // 'idle' | 'correct' | 'wrong' | 'solved'
  moveIndex,       // current step number (0-based)
  attempts,
  onReset,
  onNext,
  hintUsed,
  onHint,
}) {
  if (!puzzle) return (
    <div className="card-sm text-center py-8 text-white/30 text-sm">
      Bu ders için bulmaca yok.
    </div>
  )

  const total = puzzle.solution?.length ?? 1
  const stars = puzzle.difficulty ?? 1

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex gap-0.5 mb-1.5">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={i < stars ? 'text-gold text-sm' : 'text-white/15 text-sm'}>★</span>
            ))}
          </div>
          <p className="text-sm text-white/75 leading-relaxed">{puzzle.description}</p>
        </div>
        <button onClick={onReset} className="btn-ghost p-1.5 shrink-0" title="Sıfırla">
          <RotateCcw size={13} />
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 text-xs text-white/35">
        <span>Adım {Math.min(moveIndex + 1, total)} / {total}</span>
        <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-300"
            style={{ width: `${((status === 'solved' ? total : moveIndex) / total) * 100}%` }}
          />
        </div>
        {attempts > 0 && <span className="text-red-400/60">{attempts} yanlış</span>}
      </div>

      {/* Status banner */}
      <div className={clsx(
        'flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200',
        status === 'solved'  && 'bg-emerald-500/10 border border-emerald-500/25',
        status === 'correct' && 'bg-emerald-500/8 border border-emerald-500/15',
        status === 'wrong'   && 'bg-red-500/10 border border-red-500/25',
        status === 'idle'    && 'bg-white/3 border border-bg-border',
      )}>
        {status === 'solved'  && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
        {status === 'correct' && <CheckCircle2 size={18} className="text-emerald-400/70 shrink-0" />}
        {status === 'wrong'   && <XCircle size={18} className="text-red-400 shrink-0" />}
        {status === 'idle'    && <ArrowRight size={16} className="text-gold shrink-0" />}
        <p className={clsx(
          'text-sm',
          status === 'solved'  && 'text-emerald-300 font-semibold',
          status === 'correct' && 'text-emerald-400',
          status === 'wrong'   && 'text-red-300',
          status === 'idle'    && 'text-white/50',
        )}>
          {status === 'solved'  && '🎉 Bulmacayı çözdünüz!'}
          {status === 'correct' && 'Doğru! Devam edin.'}
          {status === 'wrong'   && 'Yanlış hamle. Tekrar deneyin.'}
          {status === 'idle'    && 'Tahtada en iyi hamleyi yapın.'}
        </p>
      </div>

      {/* Hint */}
      {!hintUsed && status !== 'solved' ? (
        <button onClick={onHint} className="btn-ghost w-full text-xs gap-1.5 py-2">
          <Lightbulb size={12} /> İpucu göster
        </button>
      ) : hintUsed && puzzle.hint ? (
        <div className="rounded-xl bg-gold/8 border border-gold/20 px-3.5 py-2.5 flex items-start gap-2">
          <Lightbulb size={13} className="text-gold shrink-0 mt-0.5" />
          <p className="text-gold/80 text-xs leading-relaxed">{puzzle.hint}</p>
        </div>
      ) : null}

      {status === 'solved' && onNext && (
        <button onClick={onNext} className="btn-primary w-full">
          Sonraki bulmaca <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}
