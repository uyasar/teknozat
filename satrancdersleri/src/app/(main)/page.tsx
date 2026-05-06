import Link from 'next/link'
import { ArrowRight, Brain, Zap, Trophy, BookOpen, Users, Star, CheckCircle, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getStats() {
  try {
    const [userCount, lessonCount, puzzleCount] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count({ where: { published: true } }),
      prisma.puzzle.count(),
    ])
    return { userCount, lessonCount, puzzleCount }
  } catch {
    return { userCount: 5000, lessonCount: 48, puzzleCount: 200 }
  }
}

async function getFeaturedCourses() {
  try {
    return await prisma.course.findMany({
      where: { featured: true, published: true },
      include: { _count: { select: { lessons: true, enrollments: true } } },
      orderBy: { order: 'asc' },
      take: 4,
    })
  } catch {
    return []
  }
}

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Destekli Analiz',
    desc: 'Claude AI ile her hamleyi gerçek zamanlı analiz edin. Türkçe açıklamalarla öğrenin.',
    color: '#0F172A',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    accent: '#F59E0B',
  },
  {
    icon: Zap,
    title: 'İnteraktif Bulmacalar',
    desc: 'Gerçek maçlardan alınan pozisyonlarla taktik düşüncenizi geliştirin.',
    color: '#0F172A',
    bg: '#FFFBEB',
    border: '#FDE68A',
    accent: '#F59E0B',
  },
  {
    icon: Trophy,
    title: 'İlerleme Takibi',
    desc: 'Kurs ilerlemesi, çözülen bulmacalar ve öğrenme istatistiklerinizi takip edin.',
    color: '#0F172A',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    accent: '#10B981',
  },
]

const LEARN_ITEMS = [
  'Taş hareketleri ve temel satranç kuralları',
  'Açılış teorisi: Sicilyen, İspanyol, Fransız açılışları',
  'Taktik kombinasyonları: çatal, kement, pin, çakma',
  'Orta oyun planlaması ve strateji',
  'Son oyun teknikleri ve kazanma yöntemleri',
  'Dünya ustalarının tarihi oyunlarını analiz etme',
]

const levelLabel: Record<string, string> = {
  BEGINNER: 'Başlangıç',
  INTERMEDIATE: 'Orta',
  ADVANCED: 'İleri',
}

const levelColor: Record<string, string> = {
  BEGINNER: 'text-emerald-700 bg-emerald-100',
  INTERMEDIATE: 'text-amber-700 bg-amber-100',
  ADVANCED: 'text-red-700 bg-red-100',
}

export default async function HomePage() {
  const stats = await getStats()
  const featuredCourses = await getFeaturedCourses()

  return (
    <div>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="section relative z-10 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-8">
              <Sparkles size={12} />
              Claude AI Destekli Satranç Eğitimi
            </div>

            <h1 className="font-display font-bold leading-tight mb-6 text-5xl sm:text-6xl md:text-7xl">
              Satranç Ustası{' '}
              <span className="text-amber-400">Olun</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              Video dersler, AI analizi ve interaktif bulmacalarla satranç öğrenmeyi
              tamamen yeni bir deneyime dönüştürün.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mb-16">
              <Link
                href="/kurslar"
                className="btn-amber px-8 py-4 text-base rounded-2xl shadow-lg shadow-amber-500/25"
              >
                Dersleri Keşfet <ArrowRight size={18} />
              </Link>
              <Link
                href="/kayit"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base
                  border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { n: `${stats.userCount.toLocaleString()}+`, l: 'Kayıtlı Öğrenci' },
                { n: `${stats.lessonCount}+`, l: 'Video Ders' },
                { n: `${stats.puzzleCount}+`, l: 'Bulmaca' },
              ].map(({ n, l }) => (
                <div key={l} className="text-center">
                  <div className="font-display font-bold text-2xl sm:text-3xl text-amber-400 mb-1">{n}</div>
                  <div className="text-xs text-slate-400">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 80" className="w-full fill-slate-50">
            <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ─── Target Audience Cards ─────────────────────── */}
      <section className="section py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">Kime Yönelik?</p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mb-4">
            Herkes İçin Satranç
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Yaşınız ne olursa olsun, size özel hazırlanmış öğrenme yolculuğu sizi bekliyor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Child Card */}
          <Link
            href="/cocuk"
            className="group relative overflow-hidden rounded-3xl p-8 text-white transition-transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
            }}
          >
            <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
              🎮
            </div>
            <div className="text-5xl mb-4">👦</div>
            <h3 className="font-display font-bold text-2xl mb-2">Çocuklar İçin</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              6-14 yaş arası çocuklara özel eğlenceli dersler, oyunlar ve bulmacalarla
              satranç öğren!
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold">
              Hemen Başla <ArrowRight size={16} />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </Link>

          {/* Adult Card */}
          <Link
            href="/kurslar?tur=yetiskin"
            className="group relative overflow-hidden rounded-3xl p-8 text-white transition-transform hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)',
            }}
          >
            <div className="absolute top-4 right-4 text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
              ♟
            </div>
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="font-display font-bold text-2xl mb-2">Yetişkinler İçin</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Profesyonel satranç teorisi, açılış repertuarı ve usta oyunlarıyla
              seviyenizi yükseltin.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
              Kursları Keşfet <ArrowRight size={16} />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
          </Link>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────── */}
      <section className="bg-slate-900 py-20">
        <div className="section">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Özellikler</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Neden Satranç Dersleri?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, bg, border, accent }) => (
              <div
                key={title}
                className="rounded-2xl p-6 border"
                style={{ background: bg, borderColor: border }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: accent + '20' }}
                >
                  <Icon size={22} style={{ color: accent }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Courses ─────────────────────────── */}
      {featuredCourses.length > 0 && (
        <section className="section py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Kurslar</p>
              <h2 className="font-display font-bold text-3xl text-slate-900">Öne Çıkan Kurslar</h2>
            </div>
            <Link href="/kurslar" className="btn-ghost flex items-center gap-1 text-sm">
              Tümü <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/kurslar/${course.slug}`}
                className="card-hover p-5 group"
              >
                <div className="aspect-[4/3] rounded-xl mb-4 bg-slate-100 flex items-center justify-center text-4xl">
                  {course.type === 'CHILD' ? '🎮' : '♟'}
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    {course.title}
                  </h3>
                  <span className={`badge shrink-0 ${levelColor[course.level] ?? 'text-slate-600 bg-slate-100'}`}>
                    {levelLabel[course.level]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{course.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <BookOpen size={10} /> {course._count.lessons} ders
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={10} /> {course._count.enrollments.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── What You Learn ───────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div className="section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-3">Müfredat</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mb-4">
                Ne Öğreneceksiniz?
              </h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Temelden ileri seviyeye kadar yapılandırılmış öğrenme yolculuğu.
              </p>
              <ul className="space-y-3">
                {LEARN_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '♟', title: 'Temel Dersler', desc: 'Sıfırdan başlayın', bg: '#F0FDF4', border: '#BBF7D0' },
                { emoji: '♞', title: 'Taktik Bulmacalar', desc: '200+ pozisyon', bg: '#FFFBEB', border: '#FDE68A' },
                { emoji: '♜', title: 'Açılış Teorisi', desc: '20+ açılış', bg: '#EFF6FF', border: '#BFDBFE' },
                { emoji: '♛', title: 'Son Oyun', desc: 'Kazanma teknikleri', bg: '#FAF5FF', border: '#DDD6FE' },
              ].map(({ emoji, title, desc, bg, border }) => (
                <div
                  key={title}
                  className="rounded-2xl p-5 border"
                  style={{ background: bg, borderColor: border }}
                >
                  <div className="text-3xl mb-3">{emoji}</div>
                  <div className="font-semibold text-sm text-slate-900">{title}</div>
                  <div className="text-xs mt-1 text-slate-500">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────── */}
      <section className="section py-20">
        <div
          className="rounded-3xl px-8 sm:px-16 py-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-5xl mb-6">♔</div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Satranç Yolculuğunuzu Bugün Başlatın
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Ücretsiz üyelikle başlangıç kurslarına erişin. Kredi kartı gerekmez.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kayit" className="btn-amber px-8 py-4 rounded-2xl text-base">
                Hemen Üye Ol <ArrowRight size={18} />
              </Link>
              <Link
                href="/kurslar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm
                  border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-colors"
              >
                Kurslara Göz At
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
