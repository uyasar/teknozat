import { useState, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, FlipHorizontal, Bot, User } from 'lucide-react'
import ChessBoard from '../chess/ChessBoard'
import MoveList from '../chess/MoveList'
import AnalysisPanel from '../chess/AnalysisPanel'
import PuzzlePanel from '../chess/PuzzlePanel'
import { useChessGame } from '../../hooks/useChessGame'
import { useStockfish } from '../../hooks/useStockfish'

export default function LessonLayout({ lesson }) {
  const {
    fen, history, currentMoveIndex, lastMove, selectedSquare, legalMoves,
    loadPgn, makeMove, onSquareClick, goToMove, goToStart, goToEnd, goBack, goForward,
    getPgnMoves, game,
  } = useChessGame(lesson?.pgn)

  const { evaluate: sfEvaluate } = useStockfish()
  const [orientation, setOrientation] = useState('white')
  const [activeTab, setActiveTab] = useState('moves') // moves | analysis | puzzle
  const [aiMode, setAiMode] = useState('auto') // auto | manual
  const [deviationInfo, setDeviationInfo] = useState(null)
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0)
  const [solvedPuzzles, setSolvedPuzzles] = useState([])

  useEffect(() => {
    if (lesson?.pgn) loadPgn(lesson.pgn)
  }, [lesson?.pgn, loadPgn])

  const pgnGame = useCallback(() => {
    if (!lesson?.pgn) return null
    const g = new Chess()
    try { g.loadPgn(lesson.pgn) } catch { return null }
    return g
  }, [lesson?.pgn])

  const handlePieceDrop = useCallback((from, to) => {
    if (aiMode === 'manual') {
      const pgnG = pgnGame()
      if (pgnG) {
        const pgnHistory = pgnG.history({ verbose: true })
        const expectedMove = pgnHistory[currentMoveIndex + 1]
        const move = makeMove({ from, to, promotion: 'q' })
        if (!move) return false

        if (expectedMove && (expectedMove.from !== from || expectedMove.to !== to)) {
          setDeviationInfo({
            explanation: `"${move.san}" hamlesi ana hatdan sapıyor. Beklenen hamle: ${expectedMove.san}. Stockfish bu konumu değerlendiriyor...`,
            scoreLoss: null,
          })
          setActiveTab('analysis')
        } else {
          setDeviationInfo(null)
        }
        return true
      }
    }

    const result = makeMove({ from, to, promotion: 'q' })
    return !!result
  }, [aiMode, currentMoveIndex, makeMove, pgnGame])

  const handleSquareClickWrapper = useCallback((sq) => {
    onSquareClick(sq)
  }, [onSquareClick])

  const puzzles = lesson?.puzzles ?? []
  const currentPuzzle = puzzles[currentPuzzleIdx] ?? null

  const handlePuzzleSolve = useCallback((hintUsed) => {
    setSolvedPuzzles(p => [...new Set([...p, currentPuzzle?.id])])
  }, [currentPuzzle])

  const handlePuzzleNext = useCallback(() => {
    if (currentPuzzleIdx < puzzles.length - 1) setCurrentPuzzleIdx(p => p + 1)
  }, [currentPuzzleIdx, puzzles.length])

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Video area */}
      {lesson?.videoUrl && (
        <div className="xl:hidden w-full">
          <div className="rounded-xl overflow-hidden aspect-video bg-black">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        </div>
      )}

      {/* Chess board column */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 self-stretch justify-between">
          <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
            <button
              onClick={() => setAiMode('auto')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                aiMode === 'auto' ? 'bg-accent text-surface-900' : 'text-white/50 hover:text-white'
              }`}
            >
              <Bot size={12} /> Otomatik
            </button>
            <button
              onClick={() => setAiMode('manual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                aiMode === 'manual' ? 'bg-accent text-surface-900' : 'text-white/50 hover:text-white'
              }`}
            >
              <User size={12} /> Manuel
            </button>
          </div>
          <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="btn-ghost p-1.5" title="Tahtayı çevir">
            <FlipHorizontal size={15} />
          </button>
        </div>

        <ChessBoard
          fen={fen}
          orientation={orientation}
          onPieceDrop={handlePieceDrop}
          onSquareClick={handleSquareClickWrapper}
          selectedSquare={selectedSquare}
          legalMoves={legalMoves}
          lastMove={lastMove}
          boardWidth={480}
        />

        <div className="flex items-center gap-1">
          {[
            { icon: SkipBack, action: goToStart, title: 'Başa git' },
            { icon: ChevronLeft, action: goBack, title: 'Geri' },
            { icon: ChevronRight, action: goForward, title: 'İleri' },
            { icon: SkipForward, action: goToEnd, title: 'Sona git' },
          ].map(({ icon: Icon, action, title }) => (
            <button key={title} onClick={action} title={title} className="btn-secondary px-3 py-2">
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* Side panel */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Video (desktop) */}
        {lesson?.videoUrl && (
          <div className="hidden xl:block rounded-xl overflow-hidden aspect-video bg-black">
            <iframe
              src={lesson.videoUrl}
              className="w-full h-full"
              allowFullScreen
              title={lesson.title}
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5 pb-1">
          {[
            { id: 'moves', label: 'Hamleler' },
            { id: 'analysis', label: 'Analiz' },
            ...(puzzles.length ? [{ id: 'puzzle', label: `Bulmaca (${puzzles.length})` }] : []),
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id ? 'text-accent bg-accent/10 border-b-2 border-accent' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          {activeTab === 'moves' && (
            <div className="card">
              <MoveList
                moves={getPgnMoves()}
                currentIndex={currentMoveIndex}
                onMoveClick={goToMove}
              />
            </div>
          )}

          {activeTab === 'analysis' && (
            <AnalysisPanel
              fen={fen}
              isWhiteTurn={game.turn() === 'w'}
              mode={aiMode}
              pgn={lesson?.pgn}
              deviationInfo={deviationInfo}
            />
          )}

          {activeTab === 'puzzle' && currentPuzzle && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white/40 px-1">
                <span>Bulmaca {currentPuzzleIdx + 1} / {puzzles.length}</span>
                <span>{solvedPuzzles.length} çözüldü</span>
              </div>
              <PuzzlePanel
                puzzle={currentPuzzle}
                onSolve={handlePuzzleSolve}
                onNext={currentPuzzleIdx < puzzles.length - 1 ? handlePuzzleNext : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
