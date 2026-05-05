import { CheckCircle2, XCircle, Lightbulb, RotateCcw, ArrowRight, Target } from 'lucide-react'
import clsx from 'clsx'

const STATUS_CFG = {
  idle:    { bg: 'rgba(255,255,255,.06)', border: 'rgba(255,255,255,.1)',  icon: Target,       iconCls: 'text-gold',         text: 'Tahtada en iyi hamleyi yapın.' },
  correct: { bg: 'rgba(16,185,129,.15)', border: 'rgba(16,185,129,.4)',   icon: CheckCircle2, iconCls: 'text-emerald-400',  text: 'Doğru hamle! Devam edin.' },
  wrong:   { bg: 'rgba(239,68,68,.15)',  border: 'rgba(239,68,68,.5)',    icon: XCircle,      iconCls: 'text-red-400',      text: 'Yanlış hamle — tekrar deneyin.' },
  solved:  { bg: 'rgba(16,185,129,.18)', border: 'rgba(16,185,129,.5)',   icon: CheckCircle2, iconCls: 'text-emerald-300',  text: '🎉 Tebrikler! Bulmacayı çözdünüz!' },
}

export default function PuzzlePanel({
  puzzle, status, moveIndex, attempts, onReset, onNext, hintUsed, onHint,
}) {
  if (!puzzle) return (
    <div className="card text-center py-10 text-white/30 text-sm">
      Bu ders için bulmaca bulunmuyor.
    </div>
  )

  const total  = puzzle.solution?.length ?? 1
  const stars  = puzzle.difficulty ?? 2
  const cfg    = STATUS_CFG[status] ?? STATUS_CFG.idle
  const Icon   = cfg.icon

  return (
    <div className="card space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className={clsx('text-base', i < stars ? 'text-gold' : 'text-white/15')}>★</span>
            ))}
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{puzzle.description}</p>
        </div>
        <button onClick={onReset} className="btn-icon btn-ghost shrink-0" title="Sıfırla">
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-white/35">
          <span>Adım {Math.min(moveIndex + 1, total)} / {total}</span>
          {attempts > 0 && <span className="text-red-400/70">{attempts} yanlış deneme</span>}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,.08)'}}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((status === 'solved' ? total : moveIndex) / total) * 100}%`,
              background: 'linear-gradient(90deg, #f4c430, #f9d760)',
            }}
          />
        </div>
      </div>

      {/* Status banner — prominent and animated */}
      <div
        className={clsx(
          'flex items-center gap-3 rounded-xl px-4 py-4 transition-all duration-200',
          status === 'wrong' && 'animate-shake',
          status === 'solved' && 'animate-pulse-slow',
        )}
        style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
      >
        <Icon size={22} className={clsx(cfg.iconCls, 'shrink-0')} />
        <p className={clsx('text-sm font-semibold leading-snug', cfg.iconCls)}>
          {cfg.text}
        </p>
      </div>

      {/* Hint */}
      {status !== 'solved' && (
        !hintUsed ? (
          <button onClick={onHint} className="btn-ghost w-full text-xs gap-2">
            <Lightbulb size={13} /> İpucu göster
          </button>
        ) : puzzle.hint ? (
          <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{background:'rgba(244,196,48,.08)',border:'1px solid rgba(244,196,48,.2)'}}>
            <Lightbulb size={14} className="text-gold shrink-0 mt-0.5" />
            <p className="text-gold/80 text-sm leading-relaxed">{puzzle.hint}</p>
          </div>
        ) : null
      )}

      {/* Next puzzle button */}
      {status === 'solved' && onNext && (
        <button onClick={onNext} className="btn-primary w-full">
          Sonraki Bulmaca <ArrowRight size={14} />
        </button>
      )}
    </div>
  )
}
