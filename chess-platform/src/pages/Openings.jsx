import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Search, ChevronDown, ChevronRight,
  SkipBack, ChevronLeft as ChevLeft, ChevronRight as ChevRight, SkipForward,
  FlipHorizontal, Lightbulb, List, BarChart2, Crown, Play, Trophy,
} from 'lucide-react'
import clsx from 'clsx'
import ChessBoard from '../components/chess/ChessBoard'
import MoveList from '../components/chess/MoveList'
import AnalysisPanel from '../components/chess/AnalysisPanel'
import { useChessGame } from '../hooks/useChessGame'
import { useBoardWidth } from '../hooks/useBoardWidth'
import { OPENINGS, OPENING_GROUPS } from '../data/openings'

const GROUP_ALL  = { id: 'all', label: 'Tümü', color: '#ffffff' }
const ALL_GROUPS = [GROUP_ALL, ...OPENING_GROUPS]

const RIGHT_TABS = [
  { id: 'variations', label: 'Varyasyonlar',  icon: List     },
  { id: 'masters',    label: 'Usta Oyunları', icon: Crown    },
  { id: 'analysis',  label: 'Analiz',         icon: BarChart2 },
]

const RESULT_CFG = {
  '1-0':  { label: '1-0',  cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  '0-1':  { label: '0-1',  cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
  '½-½':  { label: '½-½',  cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
}

/* ── Sidebar: single opening row with expandable variations ── */
function OpeningItem({ opening, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const isMainSelected  = selectedId === opening.id
  const isAnyVarSel     = opening.variations?.some(v => v.id === selectedId)
  const isActive        = isMainSelected || isAnyVarSel
  const groupColor      = OPENING_GROUPS.find(g => g.id === opening.group)?.color ?? '#fff'

  useEffect(() => { if (isAnyVarSel) setExpanded(true) }, [isAnyVarSel])

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
            <span className="shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: groupColor }} />
            <span className="truncate">{opening.name}</span>
            {opening.alias && (
              <span className="hidden xl:inline text-[10px] text-white/25 font-normal shrink-0">
                ({opening.alias})
              </span>
            )}
          </div>
          <div className="mt-0.5 pl-3.5 font-mono text-[10px] text-white/25">{opening.eco}</div>
        </button>

        {opening.variations?.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg
              text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        )}
      </div>

      {expanded && opening.variations?.length > 0 && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/8 pl-2">
          {opening.variations.map(v => (
            <button
              key={v.id}
              onClick={() => onSelect(v, true)}
              className={clsx(
                'w-full text-left px-3 py-2 rounded-lg text-xs transition-all',
                selectedId === v.id
                  ? 'bg-gold/15 text-gold font-semibold border border-gold/30'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <span className="font-mono text-[10px] mr-1.5 opacity-60">{v.eco}</span>
              {v.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Master game card ── */
function MasterGameCard({ mg, isActive, onSelect }) {
  const res = RESULT_CFG[mg.result] ?? RESULT_CFG['½-½']
  return (
    <button
      onClick={() => onSelect(mg)}
      className={clsx(
        'w-full text-left rounded-xl px-4 py-3 transition-all group border',
        isActive
          ? 'border-gold/30 bg-gold/8'
          : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/5'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className={clsx('text-sm font-semibold leading-tight', isActive ? 'text-gold' : 'text-white/80 group-hover:text-white')}>
          {mg.title}
        </span>
        <span className={clsx('shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border', res.cls)}>
          {res.label}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-white/40">
        <Trophy size={10} className="shrink-0" />
        <span className="truncate">{mg.white} – {mg.black}</span>
        <span className="shrink-0 font-mono">{mg.year}</span>
      </div>
      {mg.event && (
        <p className="mt-0.5 text-[10px] text-white/25 truncate">{mg.event}</p>
      )}
    </button>
  )
}

/* ══ Main page ══════════════════════════════════════════════════ */
export default function Openings() {
  const {
    fen, history, currentIndex, lastMove,
    loadPgn, goTo, goStart, goEnd, goBack, goForward, pairedMoves,
  } = useChessGame()

  const boardWidth = useBoardWidth(420)

  const [query,           setQuery]           = useState('')
  const [activeGroup,     setActiveGroup]     = useState('all')
  const [selectedId,      setSelectedId]      = useState(null)
  const [selectedItem,    setSelectedItem]    = useState(null)
  const [isVariation,     setIsVariation]     = useState(false)
  const [orientation,     setOrientation]     = useState('white')
  const [activeRightTab,  setActiveRightTab]  = useState('variations')
  const [activeMasterGame, setActiveMasterGame] = useState(null)
  const [engineBestMove,  setEngineBestMove]  = useState(null)

  // Parent opening for a selected variation
  const parentOpening = useMemo(() => {
    if (!isVariation || !selectedItem) return selectedItem
    return OPENINGS.find(o => o.variations?.some(v => v.id === selectedItem.id)) ?? null
  }, [isVariation, selectedItem])

  const displayOpening = parentOpening ?? selectedItem

  const filteredOpenings = useMemo(() => {
    return OPENINGS.filter(o => {
      if (activeGroup !== 'all' && o.group !== activeGroup) return false
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
    setActiveMasterGame(null)
    loadPgn(item.pgn)
  }, [loadPgn])

  const handleMasterGame = useCallback((mg) => {
    setActiveMasterGame(mg)
    loadPgn(mg.pgn)
  }, [loadPgn])

  const handleReturnToOpening = useCallback(() => {
    setActiveMasterGame(null)
    if (selectedItem) loadPgn(selectedItem.pgn)
  }, [selectedItem, loadPgn])

  // Reset when switching tabs away from analysis
  const handleRightTabChange = useCallback((id) => {
    setActiveRightTab(id)
    if (id !== 'analysis') setEngineBestMove(null)
  }, [])

  // Select first opening on mount
  useEffect(() => {
    if (OPENINGS.length > 0) handleSelect(OPENINGS[0], false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalVariations = OPENINGS.reduce((n, o) => n + (o.variations?.length ?? 0), 0)

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Page header */}
      <div className="border-b border-white/6" style={{ background: 'rgba(255,255,255,.015)' }}>
        <div className="section py-5">
          <h1 className="text-2xl font-bold text-white">Açılış Ansiklopedisi</h1>
          <p className="text-sm text-white/40 mt-1">
            {OPENINGS.length} açılış · {totalVariations} varyasyon
          </p>
        </div>
      </div>

      <div className="section flex-1 flex gap-0 lg:gap-6 py-6">

        {/* ── Left sidebar ───────────────────────────────────────── */}
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
                    : 'text-white/40 hover:text-white/70 bg-white/5'
                )}
                style={activeGroup === g.id ? { background: g.color ?? '#f4c430', color: '#0d0d0f' } : {}}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* Opening list */}
          <div
            className="flex-1 overflow-y-auto space-y-0.5 pr-1"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
          >
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

        {/* ── Main content ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col xl:flex-row gap-6">

          {/* Board column */}
          <div className="flex flex-col items-center gap-3">
            {/* Board top bar */}
            <div className="flex items-center justify-between w-full" style={{ maxWidth: boardWidth }}>
              <div className="flex items-center gap-2 min-w-0">
                {activeMasterGame ? (
                  <>
                    <span className="text-xs text-gold/80 font-semibold truncate">
                      ♛ {activeMasterGame.white} – {activeMasterGame.black} ({activeMasterGame.year})
                    </span>
                    <button
                      onClick={handleReturnToOpening}
                      className="shrink-0 text-xs text-white/35 hover:text-white transition-colors"
                    >
                      ← Geri
                    </button>
                  </>
                ) : selectedItem && (
                  <>
                    <span className="font-mono text-xs text-white/30 shrink-0">{selectedItem.eco}</span>
                    <span className="text-sm font-semibold text-white/80 truncate">
                      {isVariation ? selectedItem.name : displayOpening?.name}
                    </span>
                  </>
                )}
              </div>
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
              engineMove={activeRightTab === 'analysis' ? engineBestMove : null}
            />

            {/* Navigation */}
            <div className="flex items-center gap-1.5">
              {[
                { icon: SkipBack,    action: goStart,   label: 'Başa git' },
                { icon: ChevLeft,    action: goBack,    label: 'Geri' },
                { icon: ChevRight,   action: goForward, label: 'İleri' },
                { icon: SkipForward, action: goEnd,     label: 'Sona git' },
              ].map(({ icon: Icon, action, label }) => (
                <button key={label} onClick={action} aria-label={label} className="btn-icon btn-secondary">
                  <Icon size={15} />
                </button>
              ))}
            </div>

            {/* Move list */}
            {history.length > 0 && (
              <div className="card w-full" style={{ maxWidth: boardWidth }}>
                <MoveList moves={pairedMoves()} currentIndex={currentIndex} onMoveClick={goTo} />
              </div>
            )}
          </div>

          {/* Right info panel */}
          {displayOpening && (
            <div className="flex-1 min-w-0 space-y-4">

              {/* Opening title */}
              <div className="card space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {isVariation && !activeMasterGame ? selectedItem?.name : displayOpening.name}
                    </h2>
                    {displayOpening.alias && !isVariation && (
                      <p className="text-sm text-white/40 mt-0.5">{displayOpening.alias}</p>
                    )}
                    {isVariation && (
                      <p className="text-sm text-white/40 mt-0.5">{displayOpening.name}</p>
                    )}
                  </div>
                  <span className="shrink-0 badge font-mono text-[11px] px-2.5 py-1"
                    style={{ background:'rgba(244,196,48,.12)', color:'#f4c430', border:'1px solid rgba(244,196,48,.25)' }}>
                    {isVariation ? selectedItem?.eco : displayOpening.eco}
                  </span>
                </div>
                <p className="text-sm text-white/55 leading-relaxed">{displayOpening.description}</p>
              </div>

              {/* Tabs */}
              <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                {RIGHT_TABS.filter(t =>
                  t.id !== 'masters' || (displayOpening.masterGames?.length > 0)
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleRightTabChange(id)}
                    className={clsx(
                      'flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wide',
                      'transition-colors border-b-2 -mb-px',
                      activeRightTab === id
                        ? 'text-gold border-gold'
                        : 'text-white/35 border-transparent hover:text-white/60'
                    )}
                  >
                    <Icon size={12} />
                    <span className="hidden sm:inline">{label}</span>
                    {id === 'masters' && displayOpening.masterGames?.length > 0 && (
                      <span className="ml-0.5 rounded-full px-1.5 text-[9px]"
                        style={{ background: 'rgba(255,255,255,.1)' }}>
                        {displayOpening.masterGames.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="animate-fade-in">

                {/* ── Variations tab ── */}
                {activeRightTab === 'variations' && (
                  <div className="space-y-4">
                    {/* Key ideas */}
                    {displayOpening.keyIdeas?.length > 0 && (
                      <div className="card space-y-3">
                        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40">
                          <Lightbulb size={12} className="text-gold" /> Temel Fikirler
                        </h3>
                        <ul className="space-y-2">
                          {displayOpening.keyIdeas.map((idea, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                              <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-gold/60" />
                              {idea}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Variations list */}
                    {!isVariation && displayOpening.variations?.length > 0 && (
                      <div className="card space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Varyasyonlar</h3>
                        <div className="space-y-2">
                          {displayOpening.variations.map(v => (
                            <button
                              key={v.id}
                              onClick={() => handleSelect(v, true)}
                              className={clsx(
                                'w-full text-left rounded-xl px-4 py-3 transition-all group border',
                                selectedId === v.id
                                  ? 'border-gold/30 bg-gold/8'
                                  : 'border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/5'
                              )}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className={clsx('font-mono text-[10px] shrink-0',
                                    selectedId === v.id ? 'text-gold/60' : 'text-white/25')}>
                                    {v.eco}
                                  </span>
                                  <span className={clsx('text-sm font-medium truncate',
                                    selectedId === v.id ? 'text-gold' : 'text-white/70 group-hover:text-white')}>
                                    {v.name}
                                  </span>
                                </div>
                                <ChevronRight size={13} className={clsx('shrink-0',
                                  selectedId === v.id ? 'text-gold/60' : 'text-white/20 group-hover:text-white/50')} />
                              </div>
                              <p className="mt-1 pl-10 font-mono text-[10px] text-white/25 truncate">{v.pgn}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PGN */}
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

                {/* ── Master games tab ── */}
                {activeRightTab === 'masters' && (
                  <div className="space-y-3">
                    {activeMasterGame && (
                      <div className="flex items-center justify-between rounded-xl px-4 py-2.5 text-xs"
                        style={{ background:'rgba(244,196,48,.07)', border:'1px solid rgba(244,196,48,.2)' }}>
                        <span className="text-gold/80 font-semibold truncate">
                          ♛ {activeMasterGame.white} – {activeMasterGame.black} ({activeMasterGame.year})
                        </span>
                        <button onClick={handleReturnToOpening}
                          className="shrink-0 ml-3 text-white/40 hover:text-white transition-colors">
                          ← Açılışa dön
                        </button>
                      </div>
                    )}

                    {displayOpening.masterGames?.length > 0 ? (
                      displayOpening.masterGames.map(mg => (
                        <MasterGameCard
                          key={mg.id}
                          mg={mg}
                          isActive={activeMasterGame?.id === mg.id}
                          onSelect={handleMasterGame}
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 text-white/25 text-sm">
                        <Crown size={20} className="mx-auto mb-2 opacity-40" />
                        <p>Bu açılış için usta oyunu eklenmemiş</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Analysis tab ── */}
                {activeRightTab === 'analysis' && (
                  <div className="card">
                    <AnalysisPanel
                      fen={fen}
                      isWhiteTurn={true}
                      onBestMoveChange={setEngineBestMove}
                    />
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
