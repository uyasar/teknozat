import { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, ChevronDown, ChevronRight, SkipBack, ChevronLeft as ChevLeft, ChevronRight as ChevRight, SkipForward, FlipHorizontal, Lightbulb } from 'lucide-react'
import clsx from 'clsx'
import ChessBoard from '../components/chess/ChessBoard'
import MoveList from '../components/chess/MoveList'
import { useChessGame } from '../hooks/useChessGame'
import { useBoardWidth } from '../hooks/useBoardWidth'
import { OPENINGS, OPENING_GROUPS } from '../data/openings'

const GROUP_ALL = { id: 'all', label: 'Tümü', color: '#ffffff' }
const ALL_GROUPS = [GROUP_ALL, ...OPENING_GROUPS]

function VariationItem({ variation, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(variation, true)}
      className={clsx(
        'w-full text-left px-3 py-2 rounded-lg text-xs transition-all',
        isSelected
          ? 'bg-gold/15 text-gold font-semibold border border-gold/30'
          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
      )}
    >
      <span className="font-mono text-[10px] mr-1.5 opacity-60">{variation.eco}</span>
      {variation.name}
    </button>
  )
}

function OpeningItem({ opening, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const isMainSelected = selectedId === opening.id
  const isAnyVarSelected = opening.variations?.some(v => v.id === selectedId)
  const isActive = isMainSelected || isAnyVarSelected

  useEffect(() => {
    if (isAnyVarSelected) setExpanded(true)
  }, [isAnyVarSelected])

  const groupColor = OPENING_GROUPS.find(g => g.id === opening.group)?.color ?? '#ffffff'

  return (
    <div className="mb-0.5">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSelect(opening, false)}
          className={clsx(
            'flex-1 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            isMainSelected
              ? 'bg-gold/15 text-gold border border-gold/30'
              : isActive
                ? 'text-white/80 bg-white/5'
                : 'text-white/60 hover:text-white hover:bg-white/5'
          )}
        >
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 w-1.5 h-1.5 rounded-full"
              style={{ background: groupColor }}
            />
            <span className="truncate">{opening.name}</span>
            {opening.alias && (
              <span className="hidden lg:inline text-[10px] text-white/30 font-normal shrink-0">
                ({opening.alias})
              </span>
            )}
          </div>
          <div className="mt-0.5 pl-3.5 font-mono text-[10px] text-white/25">{opening.eco}</div>
        </button>

        {opening.variations?.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
            aria-label={expanded ? 'Kapat' : 'Varyasyonlar'}
          >
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        )}
      </div>

      {expanded && opening.variations?.length > 0 && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/8 pl-2">
          {opening.variations.map(v => (
            <VariationItem
              key={v.id}
              variation={v}
              isSelected={selectedId === v.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Openings() {
  const {
    fen, history, currentIndex, lastMove,
    loadPgn, goTo, goStart, goEnd, goBack, goForward, pairedMoves,
  } = useChessGame()

  const boardWidth = useBoardWidth(420)

  const [query,        setQuery]        = useState('')
  const [activeGroup,  setActiveGroup]  = useState('all')
  const [selectedId,   setSelectedId]   = useState(null)
  const [selectedItem, setSelectedItem] = useState(null) // opening or variation object
  const [isVariation,  setIsVariation]  = useState(false)
  const [orientation,  setOrientation]  = useState('white')

  // Find parent opening for a variation
  const parentOpening = useMemo(() => {
    if (!isVariation || !selectedItem) return selectedItem
    return OPENINGS.find(o => o.variations?.some(v => v.id === selectedItem.id)) ?? null
  }, [isVariation, selectedItem])

  const filteredOpenings = useMemo(() => {
    return OPENINGS.filter(o => {
      const matchGroup = activeGroup === 'all' || o.group === activeGroup
      if (!matchGroup) return false
      if (!query) return true
      const q = query.toLowerCase()
      return (
        o.name.toLowerCase().includes(q) ||
        o.alias?.toLowerCase().includes(q) ||
        o.eco.toLowerCase().includes(q) ||
        o.variations?.some(v => v.name.toLowerCase().includes(q) || v.eco.toLowerCase().includes(q))
      )
    })
  }, [activeGroup, query])

  const handleSelect = useCallback((item, isVar) => {
    setSelectedId(item.id)
    setSelectedItem(item)
    setIsVariation(isVar)
    loadPgn(item.pgn)
  }, [loadPgn])

  // Select first opening on mount
  useEffect(() => {
    if (OPENINGS.length > 0) handleSelect(OPENINGS[0], false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const displayOpening = parentOpening ?? selectedItem

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Page header */}
      <div className="border-b border-white/6" style={{ background: 'rgba(255,255,255,.015)' }}>
        <div className="section py-6">
          <h1 className="text-2xl font-bold text-white">Açılış Ansiklopedisi</h1>
          <p className="text-sm text-white/40 mt-1">
            {OPENINGS.length} açılış · {OPENINGS.reduce((n, o) => n + (o.variations?.length ?? 0), 0)} varyasyon
          </p>
        </div>
      </div>

      <div className="section flex-1 flex gap-0 lg:gap-6 py-6">
        {/* ── Left sidebar ─────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 gap-3">

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Açılış ara…"
              className="input pl-9 py-2.5 text-sm"
            />
          </div>

          {/* Group filter */}
          <div className="flex gap-1 flex-wrap">
            {ALL_GROUPS.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  activeGroup === g.id
                    ? 'text-bg-base'
                    : 'text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/8'
                )}
                style={activeGroup === g.id ? { background: g.color ?? '#f4c430', color: '#0d0d0f' } : {}}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Opening list */}
          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1" style={{ maxHeight: 'calc(100vh - 260px)' }}>
            {filteredOpenings.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-8">Sonuç bulunamadı</p>
            ) : (
              filteredOpenings.map(o => (
                <OpeningItem
                  key={o.id}
                  opening={o}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col xl:flex-row gap-6">

          {/* Board + nav */}
          <div className="flex flex-col items-center gap-3">
            {/* Board controls */}
            <div className="flex items-center justify-between w-full" style={{ maxWidth: boardWidth }}>
              {selectedItem && (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-xs text-white/30">
                    {selectedItem.eco}
                  </span>
                  <span className="text-sm font-semibold text-white/80 truncate">
                    {isVariation ? selectedItem.name : (displayOpening?.name ?? '')}
                  </span>
                </div>
              )}
              <button
                onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')}
                className="btn-icon btn-secondary shrink-0 ml-2"
                aria-label="Tahtayı çevir"
              >
                <FlipHorizontal size={15} />
              </button>
            </div>

            <ChessBoard
              fen={fen}
              orientation={orientation}
              boardWidth={boardWidth}
              lastMove={lastMove}
              disabled={true}
            />

            {/* Navigation */}
            <div className="flex items-center gap-1.5">
              {[
                { icon: SkipBack,    action: goStart,   label: 'Başa git' },
                { icon: ChevLeft,    action: goBack,    label: 'Geri' },
                { icon: ChevRight,   action: goForward, label: 'İleri' },
                { icon: SkipForward, action: goEnd,     label: 'Sona git' },
              ].map(({ icon: Icon, action, label }) => (
                <button
                  key={label}
                  onClick={action}
                  aria-label={label}
                  className="btn-icon btn-secondary"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>

            {/* Move list (compact) */}
            {history.length > 0 && (
              <div className="card w-full" style={{ maxWidth: boardWidth }}>
                <MoveList
                  moves={pairedMoves()}
                  currentIndex={currentIndex}
                  onMoveClick={goTo}
                />
              </div>
            )}
          </div>

          {/* Opening info */}
          {displayOpening && (
            <div className="flex-1 min-w-0 space-y-4">

              {/* Title card */}
              <div className="card space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {isVariation ? selectedItem?.name : displayOpening.name}
                    </h2>
                    {displayOpening.alias && !isVariation && (
                      <p className="text-sm text-white/40 mt-0.5">{displayOpening.alias}</p>
                    )}
                    {isVariation && (
                      <p className="text-sm text-white/40 mt-0.5">{displayOpening.name}</p>
                    )}
                  </div>
                  <span className="shrink-0 badge text-[11px] font-mono px-2.5 py-1"
                    style={{ background: 'rgba(244,196,48,.12)', color: '#f4c430', border: '1px solid rgba(244,196,48,.25)' }}>
                    {isVariation ? selectedItem?.eco : displayOpening.eco}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{displayOpening.description}</p>
              </div>

              {/* Key ideas */}
              {displayOpening.keyIdeas?.length > 0 && (
                <div className="card space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                    <Lightbulb size={12} className="text-gold" />
                    Temel Fikirler
                  </h3>
                  <ul className="space-y-2">
                    {displayOpening.keyIdeas.map((idea, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                        <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-gold/60" />
                        {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Variations */}
              {!isVariation && displayOpening.variations?.length > 0 && (
                <div className="card space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">
                    Varyasyonlar
                  </h3>
                  <div className="space-y-2">
                    {displayOpening.variations.map(v => (
                      <button
                        key={v.id}
                        onClick={() => handleSelect(v, true)}
                        className={clsx(
                          'w-full text-left rounded-xl px-4 py-3 transition-all group',
                          selectedId === v.id
                            ? 'border border-gold/30'
                            : 'hover:bg-white/5 border border-white/6 hover:border-white/12'
                        )}
                        style={selectedId === v.id ? { background: 'rgba(244,196,48,.08)' } : { background: 'rgba(255,255,255,.02)' }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={clsx(
                              'font-mono text-[10px] shrink-0',
                              selectedId === v.id ? 'text-gold/60' : 'text-white/25'
                            )}>
                              {v.eco}
                            </span>
                            <span className={clsx(
                              'text-sm font-medium truncate',
                              selectedId === v.id ? 'text-gold' : 'text-white/70 group-hover:text-white'
                            )}>
                              {v.name}
                            </span>
                          </div>
                          <ChevRight size={13} className={clsx(
                            'shrink-0 transition-colors',
                            selectedId === v.id ? 'text-gold/60' : 'text-white/20 group-hover:text-white/50'
                          )} />
                        </div>
                        <p className="mt-1 pl-10 font-mono text-[10px] text-white/25 truncate">{v.pgn}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PGN display */}
              {selectedItem && (
                <div className="card space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Açılış Sırası</h3>
                  <p className="font-mono text-xs text-white/50 leading-relaxed break-all">
                    {selectedItem.pgn}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
