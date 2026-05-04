import { useEffect } from 'react'
import { Cpu, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { useStockfish } from '../../hooks/useStockfish'

export default function AnalysisPanel({ fen, isWhiteTurn }) {
  const { ready, evaluation, lines, thinking, analyze, stop, formatScore } = useStockfish()

  useEffect(() => {
    if (!fen) return
    if (ready) {
      analyze(fen, 20)
    }
    return () => stop()
  }, [fen, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  const evalStr = evaluation ? formatScore(evaluation.score, isWhiteTurn) : '—'
  const norm    = evaluation?.normalized ?? 0  // -5..+5 white perspective
  const whitePct = Math.round(50 + (norm / 5) * 44)  // 6%..94%

  const scoreColor = norm > 1 ? '#34d399' : norm < -1 ? '#f87171' : '#f4c430'

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu size={15} className="text-gold" />
          <span className="text-sm font-semibold text-white/70">Stockfish 16</span>
          {!ready && (
            <span className="flex items-center gap-1 text-[11px] text-white/30">
              <Loader2 size={10} className="animate-spin" /> Yükleniyor…
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {thinking && <Loader2 size={13} className="text-gold animate-spin" />}
          <span className="font-mono font-bold text-2xl tabular-nums" style={{ color: scoreColor }}>
            {evalStr}
          </span>
        </div>
      </div>

      {/* Eval bar */}
      <div className="relative h-3 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,.06)'}}>
        <div
          className="absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out rounded-l-full"
          style={{ width: `${whitePct}%`, background: 'linear-gradient(90deg, #fff 60%, #e0e0e0)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 rounded-r-full"
          style={{ width: `${100 - whitePct}%`, background: '#222' }}
        />
        {/* center marker */}
        <div className="absolute top-0 bottom-0 w-0.5 left-1/2 -translate-x-1/2"
          style={{background:'rgba(255,255,255,.3)'}} />
      </div>

      {/* Lines */}
      <div className="space-y-2">
        {lines.length > 0 ? lines.filter(Boolean).map((line, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3"
            style={{
              background: i === 0 ? 'rgba(244,196,48,.08)' : 'rgba(255,255,255,.03)',
              border: `1px solid ${i === 0 ? 'rgba(244,196,48,.2)' : 'rgba(255,255,255,.07)'}`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={clsx('text-xs font-bold', i === 0 ? 'text-gold' : 'text-white/30')}>
                {i === 0 ? '★ En iyi hamle' : `${i + 1}. seçenek`}
              </span>
              {line.score && (
                <span className="font-mono text-xs text-white/40">
                  {line.score.type === 'mate'
                    ? `M${Math.abs(line.score.value)}`
                    : `${(line.score.value / 100).toFixed(1)}`}
                </span>
              )}
            </div>
            <p className="font-mono text-sm text-white/80 leading-relaxed tracking-wide break-all">
              {line.pv}
            </p>
          </div>
        )) : (
          <div className="text-center py-8 text-white/25 text-sm space-y-1">
            {ready ? (
              <>
                <Loader2 size={18} className="mx-auto animate-spin opacity-40" />
                <p>Pozisyon analiz ediliyor…</p>
              </>
            ) : (
              <>
                <Cpu size={18} className="mx-auto opacity-30" />
                <p>Motor başlatılıyor…</p>
                <p className="text-[11px] text-white/20">İlk yüklemede 2–3 saniye sürebilir</p>
              </>
            )}
          </div>
        )}
      </div>

      {evaluation && (
        <p className="text-[10px] text-white/20 text-center">
          Derinlik {evaluation.depth} · Stockfish 16 NNUE
        </p>
      )}
    </div>
  )
}
