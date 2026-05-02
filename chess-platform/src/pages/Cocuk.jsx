import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Star, Trophy, ArrowRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'

const KID_PUZZLES = [
  {
    id: 1,
    emoji: '♟',
    title: 'Piyon İleri!',
    description: 'Piyonu ilerlet ve rakibe baskı yap!',
    fen: 'k7/8/8/8/8/8/4P3/K7 w - - 0 1',
    hint: 'Piyon iki kare ilerleyebilir!',
    color: 'from-yellow-500/20 to-orange-500/20',
    border: 'border-yellow-400/30',
  },
  {
    id: 2,
    emoji: '♞',
    title: 'At Sıçrıyor!',
    description: 'Atın L şeklinde hareket ettiğini öğren!',
    fen: '8/8/8/4N3/8/8/8/8 w - - 0 1',
    hint: 'At 8 farklı kareye gidebilir!',
    color: 'from-blue-500/20 to-purple-500/20',
    border: 'border-blue-400/30',
  },
  {
    id: 3,
    emoji: '♛',
    title: 'Vezir Güçlü!',
    description: 'Vezir tahtanın en güçlü taşıdır!',
    fen: '8/8/8/3Q4/8/8/8/8 w - - 0 1',
    hint: 'Vezir her yöne hareket eder!',
    color: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-400/30',
  },
]

const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF922B', '#CC5DE8']

function KidPuzzleCard({ puzzle, active, onSelect, solved }) {
  return (
    <button
      onClick={() => onSelect(puzzle)}
      className={clsx(
        'relative w-full rounded-3xl p-5 text-left transition-all duration-200 border-2',
        `bg-gradient-to-br ${puzzle.color}`,
        puzzle.border,
        active && 'scale-105 shadow-2xl',
        solved && 'opacity-60',
      )}
    >
      {solved && (
        <div className="absolute top-3 right-3 bg-emerald-400/20 rounded-full p-1">
          <Star size={16} className="text-emerald-400 fill-emerald-400" />
        </div>
      )}
      <div className="text-4xl mb-3">{puzzle.emoji}</div>
      <h3 className="font-extrabold text-xl text-white mb-1">{puzzle.title}</h3>
      <p className="text-white/70 text-sm">{puzzle.description}</p>
    </button>
  )
}

export default function Cocuk() {
  const { currentBoard } = useTheme()
  const [activePuzzle, setActivePuzzle] = useState(KID_PUZZLES[0])
  const [solved, setSolved] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [celebrate, setCelebrate] = useState(false)
  const [moveCount, setMoveCount] = useState(0)

  const handleMove = (from, to) => {
    const game = new Chess(activePuzzle.fen)
    const move = game.move({ from, to, promotion: 'q' })
    if (move) {
      setMoveCount(p => p + 1)
      if (!solved.includes(activePuzzle.id)) {
        setSolved(p => [...p, activePuzzle.id])
        setCelebrate(true)
        setTimeout(() => setCelebrate(false), 2000)
      }
      return true
    }
    return false
  }

  return (
    <main className="kids-mode pt-20 pb-20 min-h-screen bg-gradient-to-br from-[#1a1040] via-[#0f0f2e] to-[#1a1040]">
      {/* Floating bubbles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {COLORS.map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-pulse-slow"
            style={{
              background: c,
              width: `${60 + i * 30}px`,
              height: `${60 + i * 30}px`,
              left: `${(i * 17 + 5) % 90}%`,
              top: `${(i * 23 + 10) % 80}%`,
              animationDelay: `${i * 0.5}s`,
              filter: 'blur(20px)',
            }}
          />
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-bounce-gentle">♟</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Satranç Dünyası!
          </h1>
          <p className="text-xl text-white/60 font-semibold">Oyna, öğren ve eğlen! 🎉</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/15 border border-yellow-400/30">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-yellow-300">{solved.length} / {KID_PUZZLES.length} çözüldü</span>
            </div>
            {moveCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-400/15 border border-purple-400/30">
                <Trophy size={16} className="text-purple-300" />
                <span className="font-bold text-purple-300">{moveCount} hamle</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Puzzle selector */}
          <div className="w-full lg:w-72 shrink-0 space-y-3">
            <h2 className="text-2xl font-extrabold text-white/80 mb-4">Görevler</h2>
            {KID_PUZZLES.map(p => (
              <KidPuzzleCard
                key={p.id}
                puzzle={p}
                active={activePuzzle.id === p.id}
                onSelect={(pz) => { setActivePuzzle(pz); setShowHint(false) }}
                solved={solved.includes(p.id)}
              />
            ))}
          </div>

          {/* Board area */}
          <div className="flex-1 flex flex-col items-center gap-6">
            <div className="relative">
              {celebrate && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="text-6xl animate-bounce">🎉</div>
                </div>
              )}
              <Chessboard
                id="kids-board"
                position={activePuzzle.fen}
                onPieceDrop={handleMove}
                boardWidth={Math.min(420, typeof window !== 'undefined' ? window.innerWidth - 80 : 420)}
                customLightSquareStyle={{ backgroundColor: '#ffd700', borderRadius: '4px' }}
                customDarkSquareStyle={{ backgroundColor: '#b8860b', borderRadius: '4px' }}
                customBoardStyle={{
                  borderRadius: '16px',
                  boxShadow: '0 0 60px rgba(255,215,0,0.3), 0 20px 40px rgba(0,0,0,0.5)',
                  border: '3px solid rgba(255,215,0,0.3)',
                }}
                showBoardNotation
                animationDuration={300}
              />
            </div>

            {/* Hint */}
            <div className="w-full max-w-md space-y-3">
              <button
                onClick={() => setShowHint(p => !p)}
                className="w-full py-3 rounded-2xl text-lg font-extrabold transition-all duration-200 border-2 border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
              >
                💡 {showHint ? 'İpucunu Gizle' : 'İpucu Göster'}
              </button>

              {showHint && (
                <div className="rounded-2xl bg-white/5 border-2 border-white/10 px-5 py-4 text-white/80 font-semibold text-lg text-center animate-fade-in">
                  {activePuzzle.hint}
                </div>
              )}

              {solved.includes(activePuzzle.id) && (
                <div className="rounded-2xl bg-emerald-500/15 border-2 border-emerald-400/30 px-5 py-4 text-center animate-slide-up">
                  <div className="text-3xl mb-1">⭐</div>
                  <p className="font-extrabold text-emerald-300 text-xl">Harika! Başardınız!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        {solved.length === KID_PUZZLES.length && (
          <div className="mt-12 text-center rounded-3xl bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-purple-500/20 border-2 border-yellow-400/30 p-10 animate-slide-up">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-extrabold text-white mb-3">Tebrikler!</h2>
            <p className="text-xl text-white/60 mb-6">Tüm görevleri tamamladınız!</p>
            <a href="/dersler" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-yellow-400 text-surface-900 font-extrabold text-lg hover:bg-yellow-300 transition-colors">
              Daha Fazla Öğren <ArrowRight size={20} />
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
