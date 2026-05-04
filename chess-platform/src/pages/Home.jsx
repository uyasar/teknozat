import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Brain, Trophy, BookOpen, Star, Users } from 'lucide-react'
import { COURSES } from '../data/mockData'

/* Animated board that uses chessboard.js from CDN */
function HeroBoard() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !window.Chessboard) return

    const POSITIONS = [
      'start',
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
      'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'r1bq1rk1/pppp1ppp/2n2n2/1Bb1p3/4P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 6',
    ]

    const board = window.Chessboard(ref.current, {
      position:   'start',
      draggable:  false,
      showNotation: false,
      pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    })

    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % POSITIONS.length
      board.position(POSITIONS[i], true)
    }, 2200)

    return () => { clearInterval(id); board.destroy() }
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-10 bg-gold/6 rounded-full blur-3xl pointer-events-none" />
      <div
        ref={ref}
        style={{ width: Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 64 : 320) }}
        className="relative z-10"
      />
    </div>
  )
}

function CourseCard({ course }) {
  const lc = { 'Başlangıç': 'text-emerald-400 bg-emerald-400/10', 'Orta': 'text-amber-400 bg-amber-400/10', 'İleri': 'text-red-400 bg-red-400/10' }
  return (
    <Link to={`/dersler/${course.slug}`} className="card-hover group flex flex-col">
      <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/2
        border border-white/5 flex items-center justify-center text-4xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/3 opacity-0 group-hover:opacity-100 transition-opacity" />
        ♟
      </div>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-semibold text-sm leading-snug group-hover:text-gold transition-colors">
          {course.title}
        </h3>
        <span className={`badge shrink-0 ${lc[course.level] ?? 'text-white/40 bg-white/5'}`}>
          {course.level}
        </span>
      </div>
      <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-3 flex-1">
        {course.description}
      </p>
      <div className="flex items-center gap-3 text-[11px] text-white/25">
        <span className="flex items-center gap-1"><BookOpen size={10} /> {course.lessons} ders</span>
        <span className="flex items-center gap-1"><Users size={10} /> {course.enrolled.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-amber-400/60 ml-auto">
          <Star size={10} fill="currentColor" /> {course.rating}
        </span>
      </div>
    </Link>
  )
}

const FEATURES = [
  { icon: Brain,  title: 'Stockfish AI Analizi',  desc: 'Her hamlenizi motor seviyesinde değerlendirin.' },
  { icon: Zap,    title: 'İnteraktif Bulmacalar', desc: 'Taktik reflekslerinizi gerçek pozisyonlarla geliştirin.' },
  { icon: Trophy, title: 'İlerleme Takibi',       desc: 'Puanlarınız ve başarı rozetlerinizi anlık izleyin.' },
]

export default function Home() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_65%_-10%,rgba(233,196,106,.07),transparent)] pointer-events-none" />
        <div className="section">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
            {/* Text */}
            <div className="flex-1 text-center md:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-gold/10 border border-gold/20 text-gold text-xs font-semibold mb-5">
                <Zap size={11} /> Stockfish 16 destekli
              </div>
              <h1 className="font-display font-bold leading-[1.05] mb-5
                text-4xl sm:text-5xl md:text-6xl lg:text-[64px]">
                Satranç<br />
                <span className="text-gold-grad">Ustalaşması</span><br />
                <span className="text-white/30 text-3xl sm:text-4xl md:text-5xl">yeniden tanımlandı</span>
              </h1>
              <p className="text-base text-white/45 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
                Video dersler, yapay zeka analizi ve interaktif bulmacalarla
                satranç öğrenmeyi farklı bir deneyime dönüştürün.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                <Link to="/dersler" className="btn-primary w-full sm:w-auto px-7 py-3 text-sm">
                  Dersleri Keşfet <ArrowRight size={15} />
                </Link>
                <Link to="/kayit" className="btn-secondary w-full sm:w-auto px-7 py-3 text-sm">
                  Ücretsiz Başla
                </Link>
              </div>
            </div>
            {/* Board */}
            <div className="shrink-0 animate-fade-in">
              <HeroBoard />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-gold/20 transition-colors duration-200">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20
                flex items-center justify-center text-gold mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="section py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-1">Popüler Kurslar</h2>
            <p className="text-sm text-white/35">En çok tercih edilen içerikler</p>
          </div>
          <Link to="/dersler" className="btn-ghost text-sm gap-1">
            Tümü <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COURSES.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="section py-10 pb-24">
        <div className="rounded-2xl bg-gradient-to-br from-gold/10 via-gold/5 to-transparent
          border border-gold/15 px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(233,196,106,.12),transparent_70%)] pointer-events-none" />
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3 relative">Hemen Başlayın</h2>
          <p className="text-white/40 mb-7 max-w-md mx-auto relative text-sm sm:text-base">
            Ücretsiz üyelikle başlangıç kurslarına erişin. Kart bilgisi gerekmez.
          </p>
          <Link to="/kayit" className="btn-primary px-8 py-3 inline-flex relative">
            Ücretsiz Üye Ol <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}
