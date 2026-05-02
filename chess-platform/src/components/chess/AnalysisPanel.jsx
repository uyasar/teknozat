import { useEffect, useState } from 'react'
import { Brain, Zap, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useStockfish } from '../../hooks/useStockfish'

function EvalBar({ normalized }) {
  const clampedScore = Math.max(-5, Math.min(5, normalized ?? 0))
  const whitePercent = 50 + (clampedScore / 5) * 50

  return (
    <div className="flex flex-col items-center gap-1 w-6">
      <span className="text-[10px] text-white/40">B</span>
      <div className="w-5 rounded-full overflow-hidden border border-white/10 flex flex-col" style={{ height: 200 }}>
        <div className="w-full bg-black/80 transition-all duration-500" style={{ height: `${100 - whitePercent}%` }} />
        <div className="w-full bg-white flex-1" />
      </div>
      <span className="text-[10px] text-white/40">S</span>
    </div>
  )
}

export default function AnalysisPanel({ fen, isWhiteTurn, mode = 'auto', pgn = '', deviationInfo = null }) {
  const { ready, evaluation, thinking, lines, analyze, stop, getEvalText } = useStockfish()
  const [autoRunning, setAutoRunning] = useState(false)

  useEffect(() => {
    if (!ready || !fen) return
    analyze(fen, 15)
  }, [fen, ready, analyze])

  useEffect(() => {
    return () => stop()
  }, [stop])

  const evalLabel = evaluation ? getEvalText(evaluation.score, isWhiteTurn) : '...'
  const evalNum = evaluation?.normalized ?? 0

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-accent" />
          <span className="font-semibold text-sm">Stockfish Analizi</span>
          {!ready && <span className="text-[10px] text-white/30 ml-1">(yükleniyor)</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {thinking && <Zap size={12} className="text-accent animate-pulse" />}
          <span className={clsx(
            'text-lg font-mono font-bold',
            evalNum > 0.5 ? 'text-emerald-400' : evalNum < -0.5 ? 'text-red-400' : 'text-white'
          )}>
            {evalLabel}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <EvalBar normalized={evalNum} />
        <div className="flex-1 space-y-1.5">
          {lines.length > 0 ? lines.map((line, i) => (
            <div key={i} className={clsx(
              'rounded-lg px-3 py-2 text-xs',
              i === 0 ? 'bg-accent/10 border border-accent/20' : 'bg-white/3'
            )}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={clsx('font-semibold', i === 0 ? 'text-accent' : 'text-white/50')}>
                  {i === 0 ? '★' : `${i + 1}.`}
                </span>
                {line.score && (
                  <span className="text-white/40 text-[10px]">
                    {line.score.type === 'mate' ? `M${Math.abs(line.score.value)}` : `${(line.score.value / 100).toFixed(1)}`}
                  </span>
                )}
              </div>
              <p className="font-mono text-white/80 leading-relaxed">{line.pv || '...'}</p>
            </div>
          )) : (
            <div className="text-white/30 text-sm py-4 text-center">
              {ready ? 'Analiz bekleniyor...' : 'Motor başlatılıyor...'}
            </div>
          )}
        </div>
      </div>

      {deviationInfo && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-3 space-y-1">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold text-xs">
            <ChevronRight size={12} />
            PGN Dışına Çıkıldı
          </div>
          <p className="text-white/70 text-xs leading-relaxed">{deviationInfo.explanation}</p>
          {deviationInfo.scoreLoss && (
            <p className="text-red-400 text-xs font-mono">
              Skor farkı: {deviationInfo.scoreLoss > 0 ? '-' : '+'}{Math.abs(deviationInfo.scoreLoss).toFixed(2)} puan
            </p>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <p className="text-white/30 text-xs">
          Manuel modda: PGN'den sapma anında açıklama gösterilir.
        </p>
      )}
    </div>
  )
}
