import { useState, useCallback, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'
import {
  ChevronLeft, ChevronRight, SkipBack, SkipForward,
  FlipHorizontal, Bot, User, BarChart2, List, Puzzle,
} from 'lucide-react'
import ChessBoard from '../chess/ChessBoard'
import MoveList from '../chess/MoveList'
import AnalysisPanel from '../chess/AnalysisPanel'
import PuzzlePanel from '../chess/PuzzlePanel'
import { useChessGame } from '../../hooks/useChessGame'
import { useBoardWidth } from '../../hooks/useBoardWidth'
import clsx from 'clsx'

const TABS = [
  { id: 'moves',    label: 'Hamleler', icon: List      },
  { id: 'analysis', label: 'Analiz',   icon: BarChart2 },
  { id: 'puzzle',   label: 'Bulmaca',  icon: Puzzle    },
]

export default function LessonLayout({ lesson }) {
  const {
    game, fen, history, currentIndex, lastMove,
    loadPgn, makeMove, getLegalMovesFrom,
    goTo, goStart, goEnd, goBack, goForward, pairedMoves,
  } = useChessGame()

  const boardWidth  = useBoardWidth(480)

  const [orientation,   setOrientation]  = useState('white')
  const [aiMode,        setAiMode]       = useState('auto')
  const [activeTab,     setActiveTab]    = useState('moves')
  const [selectedSq,    setSelectedSq]   = useState(null)
  const [legalMoves,    setLegalMoves]   = useState([])
  const [deviationInfo, setDeviationInfo]= useState(null)

  // ── Puzzle state ─────────────────────────────────────────────
  const puzzles        = lesson?.puzzles ?? []
  const [puzzleIdx,    setPuzzleIdx]   = useState(0)
  const [puzzleMvIdx,  setPuzzleMvIdx] = useState(0)
  const [puzzleFen,    setPuzzleFen]   = useState(null)
  const [puzzleStatus, setPuzzleStatus]= useState('idle')
  const [attempts,     setAttempts]    = useState(0)
  const [hintUsed,     setHintUsed]    = useState(false)
  const [solvedIds,    setSolvedIds]   = useState([])

  const currentPuzzle = puzzles[puzzleIdx] ?? null

  const resetPuzzle = useCallback(() => {
    setPuzzleMvIdx(0); setPuzzleFen(null)
    setPuzzleStatus('idle'); setAttempts(0); setHintUsed(false)
  }, [])

  useEffect(() => { resetPuzzle() }, [puzzleIdx, resetPuzzle])

  useEffect(() => {
    if (lesson?.pgn) loadPgn(lesson.pgn)
  }, [lesson?.pgn]) // eslint-disable-line react-hooks/exhaustive-deps

  const boardFen = activeTab === 'puzzle' && currentPuzzle
    ? (puzzleFen ?? currentPuzzle.fen)
    : fen

  const getCheckSq = useCallback((f) => {
    try {
      const g = new Chess(f)
      if (!g.isCheck()) return null
      for (const row of g.board())
        for (const sq of row)
          if (sq?.type === 'k' && sq?.color === g.turn()) return sq.square
    } catch { /**/ }
    return null
  }, [])

  // ── Drop handler ─────────────────────────────────────────────
  const handleDrop = useCallback((from, to) => {
    setSelectedSq(null); setLegalMoves([])

    if (activeTab === 'puzzle' && currentPuzzle) {
      const base = puzzleFen ?? currentPuzzle.fen
      const g = new Chess(base)
      let move
      try { move = g.move({ from, to, promotion: 'q' }) } catch { return null }
      if (!move) return null

      const expected = currentPuzzle.solution[puzzleMvIdx]
      const ok = move.san === expected || `${from}${to}` === expected

      if (!ok) {
        setPuzzleStatus('wrong')
        setAttempts(a => a + 1)
        setTimeout(() => setPuzzleStatus('idle'), 1500)
        return null
      }

      const newFen = g.fen()
      setPuzzleFen(newFen)
      const next = puzzleMvIdx + 1

      if (next >= currentPuzzle.solution.length) {
        setPuzzleStatus('solved')
        setSolvedIds(p => [...new Set([...p, currentPuzzle.id])])
        return newFen
      }

      // auto-play opponent reply
      setTimeout(() => {
        try {
          const g2 = new Chess(newFen)
          const r = g2.move(currentPuzzle.solution[next])
          if (r) {
            setPuzzleFen(g2.fen())
            setPuzzleMvIdx(next + 1)
            setPuzzleStatus('correct')
            setTimeout(() => setPuzzleStatus('idle'), 900)
          }
        } catch { /**/ }
      }, 450)
      return newFen
    }

    // Lesson mode
    if (aiMode === 'manual' && lesson?.pgn) {
      const pgnG = new Chess()
      try { pgnG.loadPgn(lesson.pgn) } catch { /**/ }
      const pgn = pgnG.history({ verbose: true })
      const exp  = pgn[currentIndex + 1]
      const res  = makeMove({ from, to, promotion: 'q' })
      if (!res) return null
      if (exp && (exp.from !== from || exp.to !== to)) {
        setDeviationInfo(`"${res.move.san}" ana hattan sapıyor. Beklenen: ${exp.san}`)
        setActiveTab('analysis')
      } else {
        setDeviationInfo(null)
      }
      return res.fen
    }

    const res = makeMove({ from, to, promotion: 'q' })
    return res?.fen ?? null
  }, [activeTab, currentPuzzle, puzzleFen, puzzleMvIdx, aiMode, lesson?.pgn, currentIndex, makeMove])

  // ── Square click (piece selection) ──────────────────────────
  const handleSquareClick = useCallback((sq) => {
    if (activeTab === 'puzzle') return
    const piece = game.get(sq)

    if (selectedSq && selectedSq !== sq) {
      if (piece?.color === game.turn()) {
        setSelectedSq(sq)
        setLegalMoves(getLegalMovesFrom(sq))
        return
      }
      const res = makeMove({ from: selectedSq, to: sq, promotion: 'q' })
      setSelectedSq(null)
      setLegalMoves([])
      if (res) return
    }

    if (piece?.color === game.turn()) {
      setSelectedSq(sq)
      setLegalMoves(getLegalMovesFrom(sq))
    } else {
      setSelectedSq(null)
      setLegalMoves([])
    }
  }, [activeTab, game, selectedSq, getLegalMovesFrom, makeMove])

  const hasPuzzles = puzzles.length > 0
  const inCheck    = getCheckSq(boardFen)

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">

      {/* ══ Board column ══════════════════════════════════════ */}
      <div className="flex flex-col items-center gap-3 w-full xl:w-auto">

        {/* Controls bar */}
        <div className="flex items-center justify-between w-full gap-2">
          {/* AI mode */}
          <div className="flex items-center gap-1 rounded-xl p-1" style={{background:'rgba(255,255,255,.05)'}}>
            {['auto', 'manual'].map(m => (
              <button
                key={m}
                onClick={() => setAiMode(m)}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all',
                  aiMode === m
                    ? 'bg-gold text-bg-base shadow-sm'
                    : 'text-white/40 hover:text-white'
                )}
              >
                {m === 'auto' ? <Bot size={12} /> : <User size={12} />}
                <span className="hidden sm:inline">{m === 'auto' ? 'Otomatik' : 'Manuel'}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')}
            className="btn-icon btn-secondary"
            aria-label="Tahtayı çevir"
          >
            <FlipHorizontal size={16} />
          </button>
        </div>

        {/* Board */}
        <div className="relative">
          <ChessBoard
            fen={boardFen}
            onPieceDrop={handleDrop}
            onSquareClick={activeTab !== 'puzzle' ? handleSquareClick : undefined}
            orientation={orientation}
            boardWidth={boardWidth}
            lastMove={activeTab === 'puzzle' ? null : lastMove}
            selectedSquare={selectedSq}
            legalMoves={legalMoves}
            inCheck={inCheck}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1.5">
          {[
            { icon: SkipBack,    action: goStart,   label: 'Başa git' },
            { icon: ChevronLeft, action: goBack,     label: 'Geri' },
            { icon: ChevronRight,action: goForward,  label: 'İleri' },
            { icon: SkipForward, action: goEnd,      label: 'Sona git' },
          ].map(({ icon: Icon, action, label }) => (
            <button
              key={label}
              onClick={action}
              aria-label={label}
              disabled={activeTab === 'puzzle'}
              className="btn-icon btn-secondary disabled:opacity-25"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        {/* Deviation alert */}
        {deviationInfo && (
          <div className="w-full rounded-xl px-4 py-3 text-xs text-amber-200 leading-relaxed"
            style={{background:'rgba(245,158,11,.08)',border:'1px solid rgba(245,158,11,.25)'}}>
            <span className="font-bold text-amber-400">⚠ Sapma: </span>
            {deviationInfo}
          </div>
        )}
      </div>

      {/* ══ Side panel ════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Video */}
        {lesson?.videoUrl && (
          <div className="rounded-2xl overflow-hidden aspect-video bg-black">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center border-b" style={{borderColor:'rgba(255,255,255,.07)'}}>
          {TABS.filter(t => t.id !== 'puzzle' || hasPuzzles).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wide',
                'transition-colors border-b-2 -mb-px',
                activeTab === id
                  ? 'text-gold border-gold'
                  : 'text-white/35 border-transparent hover:text-white/60'
              )}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{label}</span>
              {id === 'puzzle' && (
                <span className="ml-0.5 rounded-full px-1.5 text-[9px]"
                  style={{background:'rgba(255,255,255,.1)'}}>
                  {solvedIds.length}/{puzzles.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fade-in">
          {activeTab === 'moves' && (
            <div className="card">
              <MoveList
                moves={pairedMoves()}
                currentIndex={currentIndex}
                onMoveClick={goTo}
              />
            </div>
          )}
          {activeTab === 'analysis' && (
            <div className="card">
              <AnalysisPanel fen={fen} isWhiteTurn={game.turn() === 'w'} />
            </div>
          )}
          {activeTab === 'puzzle' && (
            <PuzzlePanel
              puzzle={currentPuzzle}
              status={puzzleStatus}
              moveIndex={puzzleMvIdx}
              attempts={attempts}
              hintUsed={hintUsed}
              onHint={() => setHintUsed(true)}
              onReset={resetPuzzle}
              onNext={puzzleIdx < puzzles.length - 1 ? () => setPuzzleIdx(i => i + 1) : undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}
