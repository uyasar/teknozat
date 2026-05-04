import { useEffect } from 'react'
import { Cpu, Zap } from 'lucide-react'
import clsx from 'clsx'
import { useStockfish } from '../../hooks/useStockfish'

export default function AnalysisPanel({ fen, isWhiteTurn }) {
  const { ready, evaluation, lines, thinking, analyze, stop, formatScore } = useStockfish()

  useEffect(() => {
    if (!ready || !fen) return
    analyze(fen, 18)
    return () => stop()
  }, [fen, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const evalStr = evaluation ? formatScore(evaluation.score, isWhiteTurn) : '…'
  const norm = evaluation?.normalized ?? 0 // -5..+5 white perspective
  const whitePercent = Math.round(50 + (norm / 5) * 45) // 5%..95%

  return (
    <div className="space-y-4">
      {/* Score header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white/60">
          <Cpu size={14} className="text-gold" />
          Stockfish 16
          {!ready && <span className="text-[10px] text-white/25 ml-1">(yükleniyor…)</span>}
        </div>
        <div className="flex items-center gap-2">
          {thinking && <Zap size={12} className="text-gold animate-pulse" />}
          <span className={clsx(
            'font-mono font-bold text-xl tabular-nums',
            norm > 0.8 ? 'text-emerald-400' : norm < -0.8 ? 'text-red-400' : 'text-white'
          )}>
            {evalStr}
          </span>
        </div>
      </div>

      {/* Eval bar */}
      <div className="relative h-2.5 rounded-full overflow-hidden bg-bg-elevated border border-bg-border">
        <div
          className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-500 rounded-full"
          style={{ width: `${whitePercent}%` }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 bg-[#333] transition-all duration-500 rounded-full"
          style={{ width: `${100 - whitePercent}%` }}
        />
      </div>

      {/* Lines */}
      <div className="space-y-2">
        {lines.length > 0 ? lines.filter(Boolean).map((line, i) => (
          <div key={i} className={clsx(
            'rounded-xl px-3.5 py-2.5 text-xs',
            i === 0
              ? 'bg-gold/8 border border-gold/20'
              : 'bg-white/3 border border-bg-border'
          )}>
            <div className="flex items-center justify-between mb-1">
              <span className={clsx('font-semibold', i === 0 ? 'text-gold' : 'text-white/30')}>
                {i === 0 ? '★ En iyi' : `${i + 1}.`}
              </span>
              {line.score && (
                <span className="font-mono text-white/40">
                  {line.score.type === 'mate'
                    ? `M${Math.abs(line.score.value)}`
                    : `${(line.score.value / 100).toFixed(1)}`}
                </span>
              )}
            </div>
            <p className="font-mono text-white/75 leading-relaxed tracking-wide">{line.pv}</p>
          </div>
        )) : (
          <div className="text-center py-6 text-white/25 text-sm">
            {ready ? 'Pozisyon analiz ediliyor…' : 'Motor başlatılıyor…'}
          </div>
        )}
      </div>

      <p className="text-[10px] text-white/20 text-center">
        {evaluation ? `Derinlik ${evaluation.depth}` : ''}
      </p>
    </div>
  )
}
