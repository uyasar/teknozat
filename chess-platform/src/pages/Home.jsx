import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Zap, Trophy, BookOpen, Star, Users, CheckCircle } from 'lucide-react'
import { Chess } from 'chess.js'
import { COURSES } from '../data/mockData'

const DEMO_MOVES = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6']

function HeroBoard() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !window.Chessboard) return

    const board = window.Chessboard(ref.current, {
      position:     'start',
      draggable:    false,
      showNotation: true,
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
    <div className="relative">
      {/* Subtle glow behind board */}
      <div className="absolute -inset-6 rounded-3xl pointer-events-none"
        style={{background:'radial-gradient(ellipse at center, rgba(22,101,52,.08) 0%, transparent 70%)'}} />
      <div
        ref={ref}
        className="relative z-10"
        style={{ width: Math.min(300, typeof window !== 'undefined' ? window.innerWidth - 80 : 300) }}
      />
    </div>
  )
}

const levelBadge = {
  'Başlangıç': 'text-emerald-700 bg-emerald-100',
  'Orta':      'text-amber-700  bg-amber-100',
  'İleri':     'text-red-700    bg-red-100',
}

const levelEmoji = { 'Başlangıç': '🌱', 'Orta': '⚡', 'İleri': '🔥' }

function CourseCard({ course }) {
  return (
    <Link to={`/dersler/${course.slug}`} className="card-hover group flex flex-col">
      {/* Thumbnail */}
      <div className="aspect-[4/3] rounded-xl mb-4 flex items-center justify-center text-4xl relative overflow-hidden"
        style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)'}}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{background:'linear-gradient(135deg,rgba(22,101,52,.06),transparent)'}} />
        <span className="relative z-10 select-none">{levelEmoji[course.level] ?? '♟'}</span>
      </div>

      {/* Meta */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-semibold text-sm text-stone-900 leading-snug group-hover:text-chess transition-colors">
          {course.title}
        </h3>
        <span className={`badge shrink-0 ${levelBadge[course.level] ?? 'text-stone-600 bg-stone-100'}`}>
          {course.level}
        </span>
      </div>

      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-3 flex-1">
        {course.description}
      </p>

      <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-3 border-t border-stone-100">
        <span className="flex items-center gap-1"><BookOpen size={10} /> {course.lessons} ders</span>
        <span className="flex items-center gap-1"><Users size={10} /> {course.enrolled.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-amber-600 ml-auto">
          <Star size={10} fill="currentColor" /> {course.rating}
        </span>
      </div>
    </Link>
  )
}

const FEATURES = [
  {
    icon: Brain,
    title: 'Stockfish 16 Analizi',
    desc: 'Her pozisyonu motor seviyesinde değerlendirin. Çoklu varyasyon ve derinlik analizi.',
    color: '#166534',
    bg:    '#f0fdf4',
    border:'#bbf7d0',
  },
  {
    icon: Zap,
    title: 'İnteraktif Bulmacalar',
    desc: 'Gerçek oyunlardan alınan 200+ pozisyonla taktik reflekslerinizi geliştirin.',
    color: '#b45309',
    bg:    '#fffbeb',
    border:'#fde68a',
  },
  {
    icon: Trophy,
    title: 'İlerleme Takibi',
    desc: 'Kurs ilerlemesi, başarı rozetleri ve öğrenme istatistiklerinizi anlık izleyin.',
    color: '#1d4ed8',
    bg:    '#eff6ff',
    border:'#bfdbfe',
  },
]

const STATS = [
  { n: '5.000+', l: 'Kayıtlı Öğrenci' },
  { n: '48+',    l: 'Eğitim Dersi' },
  { n: '4.8★',   l: 'Ortalama Puan' },
]

export default function Home() {
  return (
    <main className="pt-16">

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24"
        style={{background:'linear-gradient(170deg,#f0fdf4 0%,#f7f6f3 55%)'}}>

        {/* Decorative chess pattern */}
        <div className="absolute inset-0 pointer-events-none bg-chess-pattern opacity-60" />

        <div className="section relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">

            {/* Text side */}
            <div className="flex-1 text-center md:text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                text-xs font-semibold mb-6"
                style={{background:'rgba(22,101,52,.1)', border:'1px solid rgba(22,101,52,.15)', color:'#166534'}}>
                <Zap size={11} /> Stockfish 16 NNUE destekli
              </div>

              <h1 className="font-display font-bold leading-[1.08] mb-5
                text-4xl sm:text-5xl md:text-[58px] text-stone-900">
                Satranç Ustası<br />
                <span style={{color:'#166534'}}>Olun</span>
              </h1>

              <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 text-stone-600">
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

              {/* Trust signals */}
              <div className="flex items-center gap-4 mt-8 justify-center md:justify-start">
                <div className="flex -space-x-2">
                  {['A','K','M','B'].map((l, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                      style={{background:`hsl(${140 + i * 30},60%,${35 + i * 5}%)`}}>
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-stone-500">
                  <span className="font-semibold text-stone-800">5.000+</span> öğrenci öğreniyor
                </p>
              </div>
            </div>

            {/* Board side */}
            <div className="shrink-0 animate-fade-in">
              <HeroBoard />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="section relative z-10 mt-14">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map(({ n, l }) => (
              <div key={l} className="card text-center py-5">
                <div className="font-display font-bold text-2xl sm:text-3xl text-stone-900 leading-none mb-1">{n}</div>
                <div className="text-xs text-stone-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="section py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-chess mb-3">Neden Biz?</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 mb-3">
            Dünya Standartlarında Araçlar
          </h2>
          <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">
            Profesyonel satranç eğitimini herkes için erişilebilir kılıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg, border }) => (
            <div key={title} className="card group hover:shadow-md transition-shadow duration-200">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: bg, border: `1px solid ${border}` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">{title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Popular Courses ───────────────────────────────────── */}
      <section className="py-16" style={{background:'#efede8'}}>
        <div className="section">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-chess mb-2">Kurslar</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">
                Popüler Kurslar
              </h2>
            </div>
            <Link to="/dersler"
              className="text-sm font-medium text-chess flex items-center gap-1 hover:gap-2 transition-all">
              Tümünü gör <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COURSES.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* ─── What you'll learn ────────────────────────────────── */}
      <section className="section py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-chess mb-3">Müfredat</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-stone-900 mb-4">
              Ne Öğreneceksiniz?
            </h2>
            <p className="text-stone-500 leading-relaxed mb-8 text-sm">
              Temelden ileri seviyeye kadar yapılandırılmış bir öğrenme yolculuğu.
              Her seviye için özel hazırlanmış içerikler.
            </p>
            <ul className="space-y-3">
              {[
                'Taş hareketleri ve temel kurallar',
                'Açılış teorisi ve repertuar oluşturma',
                'Taktikler: çatal, kement, çakma, pin',
                'Orta oyun planlaması ve strateji',
                'Son oyun teknikleri ve kazanma yöntemleri',
                'Dünya ustalarının oyunlarını analiz etme',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-700">
                  <CheckCircle size={16} className="text-chess mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '♟', title: 'Temel Dersler', desc: '12 ders · Başlangıç', bg: '#f0fdf4', border: '#bbf7d0', tc: '#166534' },
              { emoji: '♞', title: 'Taktik Bulmacalar', desc: '200+ bulmaca', bg: '#fffbeb', border: '#fde68a', tc: '#b45309' },
              { emoji: '♜', title: 'Açılış Teorisi', desc: '18 ders · Orta', bg: '#eff6ff', border: '#bfdbfe', tc: '#1d4ed8' },
              { emoji: '♛', title: 'Son Oyun', desc: '15 ders · İleri', bg: '#faf5ff', border: '#ddd6fe', tc: '#7c3aed' },
            ].map(({ emoji, title, desc, bg, border, tc }) => (
              <div key={title} className="rounded-2xl p-5 border"
                style={{ background: bg, borderColor: border }}>
                <div className="text-3xl mb-3 select-none">{emoji}</div>
                <div className="font-semibold text-sm text-stone-900">{title}</div>
                <div className="text-xs mt-1" style={{ color: tc }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="section pb-24">
        <div className="rounded-3xl px-8 sm:px-16 py-14 sm:py-20 text-center relative overflow-hidden"
          style={{background:'linear-gradient(135deg,#14532d 0%,#166534 50%,#15803d 100%)'}}>

          {/* Subtle dot pattern */}
          <div className="absolute inset-0 pointer-events-none bg-chess-pattern opacity-20" />

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
            style={{background:'rgba(255,255,255,.04)'}} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
            style={{background:'rgba(255,255,255,.04)'}} />

          <div className="relative">
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest mb-4">
              Ücretsiz Başlayın
            </p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 leading-tight">
              Satranç Yolculuğunuzu<br />Bugün Başlatın
            </h2>
            <p className="mb-8 max-w-md mx-auto text-emerald-100 text-sm sm:text-base leading-relaxed">
              Ücretsiz üyelikle başlangıç kurslarına erişin.
              Kredi kartı gerekmez, hemen başlayın.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/kayit"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm
                  bg-white text-emerald-900 hover:bg-emerald-50 transition-colors shadow-lg">
                Hemen Üye Ol <ArrowRight size={15} />
              </Link>
              <Link to="/dersler"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm
                  border border-emerald-400/40 text-emerald-100 hover:border-emerald-300 hover:text-white transition-colors">
                Kurslara Göz At
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
