import Link from 'next/link'
import { ArrowRight, Star, Zap, Trophy, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getChildCourses() {
  try {
    return await prisma.course.findMany({
      where: { published: true, type: 'CHILD' },
      include: { _count: { select: { lessons: true } } },
      orderBy: { order: 'asc' },
    })
  } catch {
    return []
  }
}

const EMOJIS = ['🎯', '🌟', '🎮', '🏆', '🎨', '🚀']

export default async function ChildPage() {
  const courses = await getChildCourses()

  return (
    <div>
      {/* Hero - colorful gradient */}
      <section
        className="relative overflow-hidden py-20 text-white"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 40%, #F59E0B 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating chess pieces */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">♟</div>
        <div className="absolute top-20 right-20 text-4xl opacity-30 animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-20 left-1/4 text-5xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>♞</div>
        <div className="absolute bottom-10 right-1/4 text-4xl opacity-30 animate-bounce" style={{ animationDelay: '1.5s' }}>🎯</div>

        <div className="section relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold mb-6">
            <Star size={14} /> Çocuklara Özel Satranç Dersleri!
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight">
            Satrancı<br />
            <span className="text-yellow-300">Oynayarak</span> Öğren!
          </h1>

          <p className="text-white/90 text-lg sm:text-xl mb-8 max-w-lg mx-auto">
            Eğlenceli dersler ve bulmacalarla satranç ustası ol! 🎉
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/kayit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg
                bg-white text-purple-600 hover:bg-yellow-100 transition-colors shadow-xl"
            >
              🚀 Hemen Başla!
            </Link>
            <Link
              href="#kurslar"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg
                border-2 border-white/50 text-white hover:bg-white/20 transition-colors"
            >
              Kurslara Bak 👇
            </Link>
          </div>
        </div>
      </section>

      {/* Fun stats */}
      <section className="bg-yellow-400 py-8">
        <div className="section">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { n: '1000+', l: 'Mutlu Öğrenci', e: '😊' },
              { n: '50+', l: 'Eğlenceli Ders', e: '📚' },
              { n: '200+', l: 'Bulmaca', e: '🧩' },
            ].map(({ n, l, e }) => (
              <div key={l}>
                <div className="text-2xl mb-1">{e}</div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-slate-900">{n}</div>
                <div className="text-xs font-semibold text-slate-700">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="section py-16">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-center text-slate-900 mb-10">
          Neden Satranç Öğrenmeli? 🤔
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: '🧠', title: 'Zeka Gelişimi',
              desc: 'Satranç düşünme ve problem çözme becerilerini güçlendirir!',
              bg: 'bg-purple-50', border: 'border-purple-200',
            },
            {
              icon: '🎯', title: 'Konsantrasyon',
              desc: 'Odaklanma yeteneğini artırır ve sabır öğretir!',
              bg: 'bg-pink-50', border: 'border-pink-200',
            },
            {
              icon: '🏆', title: 'Başarı Hissi',
              desc: 'Her ilerleme seni daha da mutlu eder ve motivasyonunu artırır!',
              bg: 'bg-yellow-50', border: 'border-yellow-200',
            },
          ].map(({ icon, title, desc, bg, border }) => (
            <div key={title} className={`rounded-2xl p-6 border-2 ${bg} ${border} text-center`}>
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Courses */}
      <section id="kurslar" className="py-16" style={{ background: 'linear-gradient(135deg, #faf5ff, #fdf2f8)' }}>
        <div className="section">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-center text-slate-900 mb-10">
            Kurslarımız 🎓
          </h2>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <Link
                  key={course.id}
                  href={`/kurslar/${course.slug}`}
                  className="group bg-white rounded-3xl p-6 border-2 border-purple-200 hover:border-purple-400
                    hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="text-5xl mb-4">{EMOJIS[i % EMOJIS.length]}</div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-600 font-semibold flex items-center gap-1">
                      <BookOpen size={14} /> {course._count.lessons} Ders
                    </span>
                    <span className="btn-primary px-4 py-2 text-xs rounded-xl">
                      Başla! <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-xl font-bold text-slate-700">Yakında yeni kurslar geliyor!</p>
              <p className="text-slate-500 mt-2">Şimdi üye ol, ilk kurslar eklenince haber al.</p>
              <Link href="/kayit" className="btn-amber mt-6 inline-flex rounded-2xl px-8 py-3">
                Üye Ol 🚀
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section py-16 text-center">
        <div
          className="rounded-3xl p-12 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Satranç Şampiyonu Olmaya Hazır mısın?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Ücretsiz kaydol ve hemen öğrenmeye başla!
          </p>
          <Link
            href="/kayit"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-purple-600
              bg-white hover:bg-yellow-100 transition-colors shadow-xl text-lg"
          >
            🚀 Ücretsiz Başla!
          </Link>
        </div>
      </section>
    </div>
  )
}
