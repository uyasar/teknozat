import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Chess } from 'chess.js'
import { Star, ArrowRight, RefreshCw } from 'lucide-react'
import clsx from 'clsx'

const PUZZLES = [
  {
    id: 1, emoji: '♟', bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-400/30',
    title: 'Mat Bul!',
    description: 'Beyaz oynar ve tek hamlede mat verir. Bulabilir misin?',
    fen: '4k3/8/4K3/8/8/8/8/7R w - - 0 1',
    solution: ['Rh8'],
  },
  {
    id: 2, emoji: '♞', bg: 'from-blue-500/20 to-purple-500/20', border: 'border-blue-400/30',
    title: 'At Çatalı!',
    description: 'Atın güzel bir çatal yapmasını sağla!',
    fen: '4k3/8/8/3n4/8/8/4K3/8 b - - 0 1',
    solution: ['Nf4', 'Ne3', 'Nc3', 'Nb4', 'Nb6', 'Nc7', 'Ne7', 'Nf6'],
  },
  {
    id: 3, emoji: '♛', bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-400/30',
    title: 'Vezir Avı!',
    description: 'Rakip veziri taşla — ama dikkatli ol!',
    fen: 'r3k3/8/3q4/8/3Q4/8/8/R3K3 w - - 0 1',
    solution: ['Qxd6'],
  },
]

function KidBoard({ fen, onDrop, solved }) {
  const ref = useRef(null)
  const boardRef = useRef(null)
  const dropRef = useRef(onDrop)
  const fenAfterRef = useRef(null)
  const fenRef = useRef(fen)

  useEffect(() => { dropRef.current = onDrop }, [onDrop])
  useEffect(() => { fenRef.current = fen }, [fen])

  useEffect(() => {
    if (!ref.current || !window.Chessboard) return
    const board = window.Chessboard(ref.current, {
      draggable: !solved,
      position: fen,
      pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
      onDrop(src, tgt) {
        if (src === tgt) return 'snapback'
        const newFen = dropRef.current?.(src, tgt)
        if (!newFen) return 'snapback'
        fenAfterRef.current = newFen
        return undefined
      },
      onSnapEnd() {
        board.position(fenAfterRef.current ?? fenRef.current, false)
        fenAfterRef.current = null
      },
    })
    boardRef.current = board
    return () => board.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    boardRef.current?.position(fen, true)
  }, [fen])

  return <div ref={ref} style={{ width: Math.min(360, typeof window !== 'undefined' ? window.innerWidth - 80 : 360) }} />
}

export default function Cocuk() {
  const [selected, setSelected] = useState(0)
  const [boardFen, setBoardFen] = useState(PUZZLES[0].fen)
  const [solved, setSolved] = useState([])
  const [status, setStatus] = useState('idle') // idle | correct | wrong | solved
  const [moveCount, setMoveCount] = useState(0)

  const puzzle = PUZZLES[selected]

  useEffect(() => {
    setBoardFen(puzzle.fen)
    setStatus('idle')
  }, [selected, puzzle.fen])

  const handleSelect = (i) => {
    setSelected(i)
  }

  const handleReset = () => {
    setBoardFen(puzzle.fen)
    setStatus('idle')
  }

  const handleDrop = (from, to) => {
    const g = new Chess(boardFen)
    let move
    try { move = g.move({ from, to, promotion: 'q' }) } catch { return null }
    if (!move) return null

    setMoveCount(m => m + 1)
    const isInSolution = puzzle.solution.some(s => s === move.san || s === `${from}${to}`)

    if (isInSolution) {
      const newFen = g.fen()
      setBoardFen(newFen)
      if (!solved.includes(puzzle.id)) {
        setSolved(p => [...p, puzzle.id])
        setStatus('solved')
      } else {
        setStatus('correct')
      }
      return newFen
    }

    setBoardFen(g.fen())
    setStatus('wrong')
    setTimeout(() => setStatus('idle'), 1200)
    return g.fen()
  }

  const allSolved = solved.length === PUZZLES.length

  return (
    <main className="kids-mode pt-20 pb-20 min-h-screen
      bg-gradient-to-br from-[#0e0a2e] via-[#1a0e3d] to-[#0e1a3d]">
      {/* Floating blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF922B'].map((c,i) => (
          <div key={i} className="absolute rounded-full animate-pulse-slow"
            style={{
              background: c, opacity: 0.08,
              width: `${80+i*40}px`, height: `${80+i*40}px`,
              left: `${(i*19+5)%85}%`, top: `${(i*23+10)%75}%`,
              filter: 'blur(30px)', animationDelay: `${i*0.7}s`,
            }} />
        ))}
      </div>

      <div className="relative section max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-3 animate-float">♟</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-2
            bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Satranç Dünyası!
          </h1>
          <p className="text-lg text-white/50 font-bold">Oyna, öğren ve eğlen! 🎉</p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full
              bg-yellow-400/10 border border-yellow-400/25">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-300 font-bold text-sm">
                {solved.length} / {PUZZLES.length} çözüldü
              </span>
            </div>
            <div className="px-4 py-2 rounded-full bg-purple-400/10 border border-purple-400/25">
              <span className="text-purple-300 font-bold text-sm">{moveCount} hamle</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Puzzle selector */}
          <div className="w-full lg:w-64 shrink-0 space-y-3">
            <h2 className="text-xl font-extrabold text-white/70 mb-3">🎯 Görevler</h2>
            {PUZZLES.map((p, i) => (
              <button key={p.id} onClick={() => handleSelect(i)}
                className={clsx(
                  'w-full rounded-2xl p-4 text-left border-2 transition-all duration-200',
                  `bg-gradient-to-br ${p.bg}`, p.border,
                  selected === i && 'scale-[1.02] shadow-xl',
                  solved.includes(p.id) && 'opacity-70',
                )}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{p.emoji}</span>
                  {solved.includes(p.id) && (
                    <Star size={16} className="text-yellow-400 fill-yellow-400 mt-1" />
                  )}
                </div>
                <p className="font-extrabold text-base text-white mt-2">{p.title}</p>
                <p className="text-xs text-white/60 leading-relaxed mt-1">{p.description}</p>
              </button>
            ))}
          </div>

          {/* Board */}
          <div className="flex-1 flex flex-col items-center gap-5">
            <div className="relative">
              <KidBoard fen={boardFen} onDrop={handleDrop} solved={solved.includes(puzzle.id)} />
              {status === 'solved' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-7xl animate-bounce">🎉</div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className={clsx(
              'w-full max-w-sm rounded-2xl px-5 py-4 text-center font-extrabold text-lg border-2 transition-all',
              status === 'solved'  && 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
              status === 'correct' && 'bg-emerald-500/10 border-emerald-400/25 text-emerald-400',
              status === 'wrong'   && 'bg-red-500/15 border-red-400/40 text-red-300',
              status === 'idle'    && 'bg-white/5 border-white/10 text-white/50',
            )}>
              {status === 'solved'  && '⭐ Harika! Başardın!'}
              {status === 'correct' && '✓ Güzel hamle!'}
              {status === 'wrong'   && '✗ Tekrar dene!'}
              {status === 'idle'    && 'Taşları sürükle!'}
            </div>

            <button onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl
                bg-white/8 border-2 border-white/15 text-white/70 font-bold
                hover:bg-white/12 transition-colors">
              <RefreshCw size={15} /> Sıfırla
            </button>
          </div>
        </div>

        {/* All solved celebration */}
        {allSolved && (
          <div className="mt-12 rounded-3xl text-center
            bg-gradient-to-r from-yellow-500/15 via-pink-500/15 to-purple-500/15
            border-2 border-yellow-400/25 p-12 animate-slide-up">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-extrabold text-white mb-2">Süpersin!</h2>
            <p className="text-lg text-white/50 mb-7">Tüm bulmacaları çözdün!</p>
            <Link to="/dersler"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                bg-yellow-400 text-[#080810] font-extrabold text-lg hover:bg-yellow-300 transition-colors">
              Daha Fazla Öğren <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
