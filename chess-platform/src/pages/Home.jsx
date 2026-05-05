import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Brain, Trophy, BookOpen, Star, Users } from 'lucide-react'
import { Chess } from 'chess.js'
import { COURSES } from '../data/mockData'

// Ruy Lopez — first 3 full moves, loops
const DEMO_MOVES = ['e4','e5','Nf3','Nc6','Bb5','a6']

function HeroBoard() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !window.Chessboard) return

    const board = window.Chessboard(ref.current, {
      position:     'start',
      draggable:    false,
      showNotation: false,
      pieceTheme:   'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
    })

    const game = new Chess()
    let i = 0

    const id = setInterval(() => {
      if (i >= DEMO_MOVES.length) {
        game.reset()
        board.position('start', false)
        i = 0
        return
      }
      try { game.move(DEMO_MOVES[i]) } catch { /**/ }
      board.position(game.fen(), true)
      i++
    }, 1400)

    return () => { clearInterval(id); board.destroy() }
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute -inset-12 rounded-full pointer-events-none"
        style={{background:'radial-gradient(circle,rgba(244,196,48,.08),transparent 70%)'}} />
      <div
        ref={ref}
        style={{ width: Math.min(320, typeof window !== 'undefined' ? window.innerWidth - 64 : 320) }}
        className="relative z-10"
      />
    </div>
  )
}

const levelCls = {
  'Başlangıç': 'text-emerald-400 bg-emerald-400/10',
  'Orta':      'text-amber-400 bg-amber-400/10',
  'İleri':     'text-red-400 bg-red-400/10',
}

function CourseCard({ course }) {
  return (
    <Link to={`/dersler/${course.slug}`} className="card-hover group flex flex-col">
      <div className="aspect-[4/3] rounded-xl mb-4 flex items-center justify-center text-4xl relative overflow-hidden"
        style={{background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.06)'}}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{background:'radial-gradient(circle at center,rgba(244,196,48,.08),transparent)'}} />
        ♟
      </div>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-semibold text-sm leading-snug group-hover:text-gold transition-colors">
          {course.title}
        </h3>
        <span className={`badge shrink-0 ${levelCls[course.level] ?? 'text-white/40 bg-white/5'}`}>
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
  { icon: Brain,  title: 'Stockfish 16 Analizi', desc: 'Her pozisyonu motor seviyesinde değerlendirin. Çoklu varyasyon ve derinlik analizi.' },
  { icon: Zap,    title: 'İnteraktif Bulmacalar', desc: 'Gerçek oyunlardan alınan pozisyonlarla taktik reflekslerinizi geliştirin.' },
  { icon: Trophy, title: 'İlerleme Takibi',       desc: 'Kurs ilerlemesi, başarı rozetleri ve öğrenme istatistiklerinizi anlık izleyin.' },
]

export default function Home() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'radial-gradient(ellipse 80% 50% at 65% -10%, rgba(244,196,48,.06), transparent)'}} />
        <div className="section">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center md:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                border text-xs font-bold mb-6 text-gold"
                style={{background:'rgba(244,196,48,.08)',borderColor:'rgba(244,196,48,.2)'}}>
                <Zap size={11} /> Stockfish 16 NNUE destekli
              </div>
              <h1 className="font-display font-bold leading-[1.05] mb-5
                text-4xl sm:text-5xl md:text-6xl lg:text-[64px]">
                Satranç<br />
                <span className="text-gold-grad">Ustalaşması</span><br />
                <span className="text-3xl sm:text-4xl md:text-5xl" style={{color:'rgba(255,255,255,.25)'}}>
                  yeniden tanımlandı
                </span>
              </h1>
              <p className="text-base leading-relaxed mb-8 max-w-lg mx-auto md:mx-0"
                style={{color:'rgba(255,255,255,.45)'}}>
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
            <div key={title} className="card group hover:border-gold/20 transition-colors duration-200"
              style={{borderColor:'rgba(255,255,255,.06)'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gold mb-4"
                style={{background:'rgba(244,196,48,.1)',border:'1px solid rgba(244,196,48,.2)'}}>
                <Icon size={18} />
              </div>
              <h3 className="font-bold mb-1.5">{title}</h3>
              <p className="text-sm leading-relaxed" style={{color:'rgba(255,255,255,.4)'}}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section className="section py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-1">Popüler Kurslar</h2>
            <p className="text-sm" style={{color:'rgba(255,255,255,.3)'}}>En çok tercih edilen içerikler</p>
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
        <div className="rounded-2xl px-6 sm:px-12 py-12 sm:py-16 text-center relative overflow-hidden"
          style={{background:'linear-gradient(135deg,rgba(244,196,48,.1),rgba(99,102,241,.06))',
                  border:'1px solid rgba(244,196,48,.15)'}}>
          <div className="absolute inset-0 pointer-events-none"
            style={{background:'radial-gradient(circle at 50% 0%,rgba(244,196,48,.1),transparent 65%)'}} />
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3 relative">Hemen Başlayın</h2>
          <p className="mb-7 max-w-md mx-auto relative text-sm sm:text-base"
            style={{color:'rgba(255,255,255,.4)'}}>
            Ücretsiz üyelikle başlangıç kurslarına erişin. Kredi kartı gerekmez.
          </p>
          <Link to="/kayit" className="btn-primary px-8 py-3 inline-flex relative">
            Ücretsiz Üye Ol <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  )
}
