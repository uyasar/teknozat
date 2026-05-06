'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Chess } from 'chess.js'
import ChessBoard from './ChessBoard'
import { Play, Pause, ChevronLeft, ChevronRight, Brain, Loader2, User, Trophy } from 'lucide-react'

interface FamousGame {
  id: string
  whitePlayer: string
  blackPlayer: string
  year?: number | null
  tournament?: string | null
  result?: string | null
  pgn: string
  description?: string | null
}

interface GameAnalyzerProps {
  game: FamousGame
  boardTheme?: string
}

type Mode = 'auto' | 'manual'

export default function GameAnalyzer({ game, boardTheme = 'CLASSIC' }: GameAnalyzerProps) {
  const [mode, setMode] = useState<Mode>('manual')
  const [chess] = useState(() => new Chess())
  const [moves, setMoves] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [fen, setFen] = useState('start')
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [userInputFen, setUserInputFen] = useState<string | null>(null)
  const [gameAnalysis, setGameAnalysis] = useState('')
  const [gameAnalysisLoading, setGameAnalysisLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const fensRef = useRef<string[]>([])

  // Parse PGN and get all FENs
  useEffect(() => {
    try {
      chess.loadPgn(game.pgn)
      const history = chess.history({ verbose: true })
      const fens: string[] = []
      const c = new Chess()
      fens.push(c.fen())
      const mv: string[] = []
      for (const h of history) {
        c.move(h.san)
        fens.push(c.fen())
        mv.push(h.san)
      }
      fensRef.current = fens
      setMoves(mv)
      setFen('start')
      setCurrentIndex(-1)
    } catch (e) {
      console.error('PGN parse error', e)
    }
  }, [game.pgn, chess])

  const goToMove = useCallback((idx: number) => {
    const fens = fensRef.current
    if (idx < -1 || idx >= moves.length) return
    const newFen = idx === -1 ? 'start' : fens[idx + 1]
    setFen(newFen)
    setCurrentIndex(idx)
    setUserInputFen(null)
    if (idx >= 0) {
      const c = new Chess(fens[idx])
      const detail = c.moves({ verbose: true }).find(m => m.san === moves[idx])
      if (detail) setLastMove({ from: detail.from, to: detail.to })
    } else {
      setLastMove(null)
    }
  }, [moves])

  const analyzeMove = useCallback(async (idx: number, isCorrect: boolean, userMove?: string) => {
    setAiLoading(true)
    setAiText('')
    try {
      const currentFen = fensRef.current[Math.max(0, idx)]
      const expectedMove = moves[idx]
      const res = await fetch('/api/ai/analyze-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fen: currentFen,
          move: isCorrect ? expectedMove : (userMove ?? ''),
          pgn: game.pgn,
          moveNumber: Math.floor(idx / 2) + 1,
          isCorrectMove: isCorrect,
          expectedMove: isCorrect ? undefined : expectedMove,
          gameContext: `${game.whitePlayer} vs ${game.blackPlayer}${game.year ? `, ${game.year}` : ''}`,
        }),
      })
      const data = await res.json()
      setAiText(data.analysis ?? '')
    } catch { setAiText('AI analizi şu an kullanılamıyor.') }
    finally { setAiLoading(false) }
  }, [game, moves])

  // Auto mode interval
  useEffect(() => {
    if (!isPlaying) { if (intervalRef.current) clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = prev + 1
        if (next >= moves.length) { setIsPlaying(false); return prev }
        goToMove(next)
        if (mode === 'auto') analyzeMove(next, true)
        return next
      })
    }, 2500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, moves.length, mode, goToMove, analyzeMove])

  const handleManualNext = () => {
    const next = currentIndex + 1
    if (next >= moves.length) return
    goToMove(next)
    analyzeMove(next, true)
  }

  const handleManualPrev = () => {
    const prev = currentIndex - 1
    goToMove(prev)
    setAiText('')
  }

  const handlePieceDrop = (from: string, to: string): string | null => {
    if (mode !== 'manual') return null
    const expectedMove = moves[currentIndex + 1]
    if (!expectedMove) return null
    const c = new Chess(fensRef.current[currentIndex + 1])
    let detail: any
    try { detail = c.moves({ verbose: true }).find((m: any) => m.from === from && m.to === to) }
    catch { return null }
    if (!detail) return null

    const expectedDetail = new Chess(fensRef.current[currentIndex + 1])
    const expectedDetails = expectedDetail.moves({ verbose: true }).find((m: any) => m.san === expectedMove)

    if (detail.san === expectedMove || (expectedDetails && from === expectedDetails.from && to === expectedDetails.to)) {
      goToMove(currentIndex + 1)
      analyzeMove(currentIndex + 1, true)
      return fensRef.current[currentIndex + 2] ?? null
    } else {
      setUserInputFen(`${from}${to}`)
      analyzeMove(currentIndex + 1, false, detail.san)
      return null
    }
  }

  const loadGameAnalysis = async () => {
    if (gameAnalysis) return
    setGameAnalysisLoading(true)
    try {
      const res = await fetch('/api/ai/analyze-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgn: game.pgn,
          whitePlayer: game.whitePlayer,
          blackPlayer: game.blackPlayer,
          year: game.year,
          tournament: game.tournament,
        }),
      })
      const data = await res.json()
      setGameAnalysis(data.analysis ?? '')
    } catch { setGameAnalysis('Analiz yüklenemedi.') }
    finally { setGameAnalysisLoading(false) }
  }

  return (
    <div className="space-y-4">
      {/* Game info */}
      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-sm bg-white border border-slate-300" />
              <span className="font-semibold">{game.whitePlayer}</span>
            </div>
            <span className="text-slate-400 text-xs font-bold">VS</span>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-sm bg-slate-900" />
              <span className="font-semibold">{game.blackPlayer}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            {game.year && <span className="flex items-center gap-1"><Trophy size={11} /> {game.year}</span>}
            {game.tournament && <span>{game.tournament}</span>}
            {game.result && <span className="badge bg-slate-100 text-slate-700">{game.result}</span>}
          </div>
        </div>
      </div>

      {/* Mode selector */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200">
        {(['manual', 'auto'] as Mode[]).map(m => (
          <button key={m} onClick={() => { setMode(m); setIsPlaying(false); goToMove(-1); setAiText('') }}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === m ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            {m === 'manual' ? '🕹️ Manuel Mod' : '🤖 Otomatik Mod'}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex flex-col items-center gap-4">
          <ChessBoard
            fen={fen}
            onPieceDrop={mode === 'manual' ? handlePieceDrop : undefined}
            orientation="white"
            boardWidth={400}
            disabled={mode === 'auto'}
            lastMove={lastMove}
            theme={boardTheme}
          />

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => goToMove(-1)} className="btn-secondary p-2 rounded-xl" title="Başa al">
              <ChevronLeft size={16} />
            </button>
            {mode === 'manual' ? (
              <>
                <button onClick={handleManualPrev} disabled={currentIndex < 0} className="btn-secondary px-4 py-2 rounded-xl text-sm disabled:opacity-40">
                  ← Geri
                </button>
                <button onClick={handleManualNext} disabled={currentIndex >= moves.length - 1} className="btn-primary px-4 py-2 rounded-xl text-sm disabled:opacity-40">
                  İleri →
                </button>
              </>
            ) : (
              <button onClick={() => setIsPlaying(!isPlaying)}
                className={`px-6 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}>
                {isPlaying ? <><Pause size={14} /> Duraklat</> : <><Play size={14} /> Oynat</>}
              </button>
            )}
            <button onClick={() => goToMove(moves.length - 1)} className="btn-secondary p-2 rounded-xl" title="Sona git">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Move counter */}
          <p className="text-xs text-slate-400">
            Hamle: {currentIndex + 1} / {moves.length}
          </p>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* AI Analysis panel */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={16} className="text-amber-500" />
              <h3 className="font-semibold text-sm text-slate-900">AI Analizi</h3>
              {aiLoading && <Loader2 size={14} className="text-slate-400 animate-spin ml-auto" />}
            </div>
            {aiText ? (
              <p className="text-sm text-slate-700 leading-relaxed">{aiText}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                {currentIndex === -1 ? 'Hamle yapın veya oyunu başlatın...' : 'Analiz bekleniyor...'}
              </p>
            )}
          </div>

          {/* Move list */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm text-slate-900 mb-3">Hamleler</h3>
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto scrollbar-hide">
              {moves.map((move, i) => (
                <button key={i} onClick={() => { goToMove(i); analyzeMove(i, true) }}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors
                    ${i === currentIndex ? 'bg-amber-500 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'}`}>
                  {i % 2 === 0 && <span className="text-slate-400 mr-1">{Math.floor(i / 2) + 1}.</span>}
                  {move}
                </button>
              ))}
            </div>
          </div>

          {/* Full game analysis */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-slate-900">Oyun Özeti</h3>
              {!gameAnalysis && (
                <button onClick={loadGameAnalysis} disabled={gameAnalysisLoading}
                  className="btn-ghost text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                  {gameAnalysisLoading ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
                  AI ile Analiz Et
                </button>
              )}
            </div>
            {game.description && <p className="text-sm text-slate-600 leading-relaxed mb-3">{game.description}</p>}
            {gameAnalysis && <p className="text-sm text-slate-700 leading-relaxed">{gameAnalysis}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
