import { ArrowLeft, Crown } from 'lucide-react'
import clsx from 'clsx'

const RESULT_CFG = {
  '1-0': { label: '1-0', cls: 'text-emerald-400 bg-emerald-400/10' },
  '0-1': { label: '0-1', cls: 'text-red-400 bg-red-400/10'       },
  '½-½': { label: '½-½', cls: 'text-amber-400 bg-amber-400/10'   },
}

export default function MasterGamesPanel({ games, selectedId, onSelect, onReturn }) {
  return (
    <div className="space-y-3">

      {/* Return to lesson button */}
      {onReturn && (
        <button
          onClick={onReturn}
          className="btn-secondary w-full gap-2 text-sm mb-1"
        >
          <ArrowLeft size={14} /> Derse Dön
        </button>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 py-1">
        <Crown size={13} className="text-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-white/40">
          {games.length} Usta Oyunu
        </span>
      </div>

      {/* Game list */}
      {games.length === 0 ? (
        <div className="text-center py-10 text-white/25 text-sm space-y-2">
          <Crown size={22} className="mx-auto opacity-30" />
          <p>Bu pozisyon için usta oyunu bulunamadı.</p>
        </div>
      ) : (
        games.map(game => {
          const isActive = game.id === selectedId
          const res = RESULT_CFG[game.result] ?? RESULT_CFG['½-½']
          return (
            <button
              key={game.id}
              onClick={() => onSelect(game)}
              className={clsx(
                'w-full text-left rounded-xl px-4 py-3.5 transition-all duration-150',
                isActive
                  ? 'border border-gold/35 bg-gold/8'
                  : 'border border-white/6 bg-white/[.025] hover:bg-white/[.045] hover:border-white/10',
              )}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={clsx(
                  'font-semibold text-sm leading-snug',
                  isActive ? 'text-gold' : 'text-white',
                )}>
                  {game.title}
                </span>
                <span className={clsx('badge shrink-0 text-[10px]', res.cls)}>
                  {res.label}
                </span>
              </div>

              {/* Players */}
              <p className="text-xs text-white/50 mb-1.5">
                {game.white} <span className="text-white/25">vs</span> {game.black}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-2 flex-wrap">
                {game.opening && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/35">
                    {game.opening}
                  </span>
                )}
                <span className="text-[11px] text-white/25">
                  {game.event && `${game.event} · `}{game.year}
                </span>
              </div>

              {isActive && (
                <p className="text-[11px] text-gold/60 mt-2 font-medium">
                  ▶ Tahta bu oyunu gösteriyor
                </p>
              )}
            </button>
          )
        })
      )}
    </div>
  )
}
