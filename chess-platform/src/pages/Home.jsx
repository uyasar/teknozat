import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { ArrowRight, Star, Users, BookOpen, Zap, Brain, Trophy } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { COURSES } from '../data/mockData'

function HeroBoard() {
  const { currentBoard } = useTheme()
  const [fen, setFen] = useState(new Chess().fen())

  useEffect(() => {
    const positions = [
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
      'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
      'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
    ]
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % positions.length
      setFen(positions[i])
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <Chessboard
        id="hero-board"
        position={fen}
        boardWidth={360}
        customLightSquareStyle={{ backgroundColor: currentBoard.light }}
        customDarkSquareStyle={{ backgroundColor: currentBoard.dark }}
        customBoardStyle={{ borderRadius: '8px', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
        areArrowsAllowed={false}
        isDraggablePiece={() => false}
        showBoardNotation={false}
        animationDuration={400}
      />
    </div>
  )
}

function CourseCard({ course }) {
  const levelColor = {
    'Başlangıç': 'text-emerald-400 bg-emerald-400/10',
    'Orta': 'text-amber-400 bg-amber-400/10',
    'İleri': 'text-red-400 bg-red-400/10',
  }[course.level] ?? 'text-white/50 bg-white/5'

  return (
    <Link to={`/dersler/${course.slug}`} className="card-hover group block">
      <div className="w-full aspect-video rounded-lg bg-white/5 border border-white/5 mb-4 flex items-center justify-center text-4xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        ♟
      </div>
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold group-hover:text-accent transition-colors">{course.title}</h3>
        <span className={`badge shrink-0 ${levelColor}`}>{course.level}</span>
      </div>
      <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2">{course.description}</p>
      <div className="flex items-center gap-4 text-xs text-white/30">
        <span className="flex items-center gap-1"><BookOpen size={11} />{course.lessons} ders</span>
        <span className="flex items-center gap-1"><Users size={11} />{course.enrolled.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-amber-400/70"><Star size={11} fill="currentColor" />{course.rating}</span>
      </div>
    </Link>
  )
}

const FEATURES = [
  { icon: Brain, title: 'Stockfish AI Analizi', desc: 'Her hamlenizi motor seviyesinde değerlendirin. Hataları anlayın.' },
  { icon: Zap, title: 'İnteraktif Bulmacalar', desc: 'Taktik reflekslerinizi gerçek pozisyonlarla geliştirin.' },
  { icon: Trophy, title: 'İlerleme Takibi', desc: 'Bitirdiğiniz dersler ve başarı puanlarınız anlık güncellenir.' },
]

export default function Home() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-16 md:gap-20">
            <div className="flex-1 text-center md:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
                <Zap size={11} /> Stockfish 16 ile güçlendirildi
              </div>
              <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
                Satranç<br />
                <span className="text-gradient">Ustalaşması</span><br />
                <span className="text-white/50 text-4xl md:text-5xl">yeniden tanımlandı</span>
              </h1>
              <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
                Video dersler, Stockfish destekli AI analizi ve interaktif bulmacalarla satranç öğrenmeyi tamamen yeniden yaşayın.
              </p>
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Link to="/dersler" className="btn-primary text-base px-6 py-3">
                  Dersleri Keşfet <ArrowRight size={16} />
                </Link>
                <Link to="/kayit" className="btn-secondary text-base px-6 py-3">
                  Ücretsiz Başla
                </Link>
              </div>
            </div>

            <div className="shrink-0 animate-fade-in">
              <HeroBoard />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card group hover:border-accent/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular courses */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl mb-1">Popüler Kurslar</h2>
            <p className="text-white/40 text-sm">En çok tercih edilen eğitim içerikleri</p>
          </div>
          <Link to="/dersler" className="btn-ghost text-sm">
            Tümünü gör <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COURSES.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl bg-gradient-to-r from-accent/15 via-accent/8 to-transparent border border-accent/20 px-8 py-12 text-center">
          <h2 className="font-display font-bold text-4xl mb-3">Hemen Başlayın</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">Ücretsiz üyelikle tüm başlangıç kurslarına erişin. Ödeme gerektirmez.</p>
          <Link to="/kayit" className="btn-primary text-base px-8 py-3 inline-flex">
            Ücretsiz Üye Ol <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}
