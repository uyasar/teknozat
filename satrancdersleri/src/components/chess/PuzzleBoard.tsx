'use client'

import { useState, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'
import ChessBoard from './ChessBoard'
import { Lightbulb, RotateCcw, CheckCircle2, XCircle } from 'lucide-react'

interface Puzzle {
  id: string
  fen: string
  solution: string[]
  hint?: string | null
  description?: string | null
  difficulty: number
}

interface PuzzleBoardProps {
  puzzle: Puzzle
  boardTheme?: string
  onSolved?: (puzzleId: string) => void
}

type Status = 'playing' | 'correct' | 'wrong' | 'solved'

export default function PuzzleBoard({ puzzle, boardTheme = 'CLASSIC', onSolved }: PuzzleBoardProps) {
  const [game, setGame] = useState(() => {
    const g = new Chess()
    g.load(puzzle.fen)
    return g
  })
  const [fen, setFen] = useState(puzzle.fen)
  const [status, setStatus] = useState<Status>('playing')
  const [moveIndex, setMoveIndex] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [legalMoves, setLegalMoves] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [message, setMessage] = useState('')

  const orientation = game.turn() === 'w' ? 'white' : 'black'

  const reset = () => {
    const g = new Chess()
    g.load(puzzle.fen)
    setGame(g)
    setFen(puzzle.fen)
    setStatus('playing')
    setMoveIndex(0)
    setSelectedSquare(null)
    setLegalMoves([])
    setLastMove(null)
    setShowHint(false)
    setMessage('')
  }

  const tryMove = useCallback((from: string, to: string) => {
    if (status !== 'playing') return null
    const expected = puzzle.solution[moveIndex]
    if (!expected) return null

    const gameCopy = new Chess(game.fen())
    let result: any
    try {
      result = gameCopy.move({ from, to, promotion: 'q' })
    } catch {
      return null
    }
    if (!result) return null

    const madeMove = result.san
    const expectedSan = (() => {
      const tmp = new Chess(game.fen())
      try { return tmp.move(expected)?.san } catch { return expected }
    })()

    if (madeMove === expectedSan || result.lan === expected || `${from}${to}` === expected) {
      setGame(gameCopy)
      setFen(gameCopy.fen())
      setLastMove({ from, to })
      setSelectedSquare(null)
      setLegalMoves([])
      const next = moveIndex + 1
      if (next >= puzzle.solution.length) {
        setStatus('solved')
        setMessage('Tebrikler! Bulmacayı çözdünüz! 🎉')
        onSolved?.(puzzle.id)
      } else {
        setStatus('correct')
        setMoveIndex(next)
        setMessage('Doğru hamle! Devam edin...')
        setTimeout(() => setStatus('playing'), 1000)
      }
      return gameCopy.fen()
    } else {
      setStatus('wrong')
      setMessage('Yanlış hamle! Tekrar deneyin.')
      setTimeout(() => setStatus('playing'), 1200)
      return null
    }
  }, [game, moveIndex, puzzle, status, onSolved])

  const handleSquareClick = useCallback((sq: string) => {
    if (status !== 'playing') return
    if (selectedSquare) {
      const newFen = tryMove(selectedSquare, sq)
      if (!newFen) {
        const piece = game.get(sq as any)
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(sq)
          const moves = game.moves({ square: sq as any, verbose: true })
          setLegalMoves(moves.map((m: any) => m.to))
        } else {
          setSelectedSquare(null)
          setLegalMoves([])
        }
      } else {
        setSelectedSquare(null)
        setLegalMoves([])
      }
    } else {
      const piece = game.get(sq as any)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(sq)
        const moves = game.moves({ square: sq as any, verbose: true })
        setLegalMoves(moves.map((m: any) => m.to))
      }
    }
  }, [selectedSquare, game, tryMove, status])

  const stars = Array.from({ length: 5 }, (_, i) => i < puzzle.difficulty ? '★' : '☆')

  return (
    <div className="flex flex-col items-center gap-4">
      {puzzle.description && (
        <div className="w-full card p-4 text-sm text-slate-600">{puzzle.description}</div>
      )}

      <div className="flex items-center gap-2 text-amber-500 text-sm">
        {stars.join('')} <span className="text-slate-400 text-xs">zorluk</span>
      </div>

      <ChessBoard
        fen={fen}
        onPieceDrop={tryMove}
        onSquareClick={handleSquareClick}
        orientation={orientation}
        boardWidth={400}
        disabled={status === 'solved'}
        lastMove={lastMove}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        theme={boardTheme}
      />

      {/* Status message */}
      {message && (
        <div className={`w-full rounded-xl p-3 text-sm font-medium text-center flex items-center justify-center gap-2
          ${status === 'solved' ? 'bg-emerald-50 text-emerald-700' :
            status === 'wrong' ? 'bg-red-50 text-red-600' :
            'bg-amber-50 text-amber-700'}`}>
          {status === 'solved' ? <CheckCircle2 size={16} /> : status === 'wrong' ? <XCircle size={16} /> : null}
          {message}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={reset} className="btn-secondary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
          <RotateCcw size={14} /> Sıfırla
        </button>
        {puzzle.hint && (
          <button onClick={() => setShowHint(!showHint)} className="btn-ghost px-4 py-2 text-sm rounded-xl flex items-center gap-2">
            <Lightbulb size={14} /> İpucu
          </button>
        )}
      </div>

      {showHint && puzzle.hint && (
        <div className="w-full rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
          💡 {puzzle.hint}
        </div>
      )}
    </div>
  )
}
