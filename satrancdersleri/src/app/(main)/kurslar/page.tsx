import Link from 'next/link'
import { ArrowRight, BookOpen, Users, Clock, Filter } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getCourses(type?: string) {
  try {
    return await prisma.course.findMany({
      where: {
        published: true,
        ...(type ? { type: type as any } : {}),
      },
      include: {
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
  } catch {
    return []
  }
}

const levelLabel: Record<string, string> = {
  BEGINNER: 'Başlangıç', INTERMEDIATE: 'Orta', ADVANCED: 'İleri',
}
const levelColor: Record<string, string> = {
  BEGINNER: 'text-emerald-700 bg-emerald-100',
  INTERMEDIATE: 'text-amber-700 bg-amber-100',
  ADVANCED: 'text-red-700 bg-red-100',
}
const typeLabel: Record<string, string> = { ADULT: 'Yetişkin', CHILD: 'Çocuk' }

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string }>
}) {
  const { tur } = await searchParams
  const type = tur === 'yetiskin' ? 'ADULT' : tur === 'cocuk' ? 'CHILD' : undefined
  const courses = await getCourses(type)

  const adultCourses = courses.filter(c => c.type === 'ADULT')
  const childCourses = courses.filter(c => c.type === 'CHILD')

  return (
    <div className="section py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Kurslar</p>
        <h1 className="font-display font-bold text-4xl text-slate-900 mb-3">Tüm Kurslar</h1>
        <p className="text-slate-500 max-w-lg">
          Seviyenize ve hedefinize uygun kursu seçin. Her kurs video dersler, bulmacalar ve AI analiziyle desteklenmektedir.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-3 mb-10 flex-wrap">
        {[
          { href: '/kurslar', label: 'Tümü', active: !type },
          { href: '/kurslar?tur=yetiskin', label: 'Yetişkin', active: type === 'ADULT' },
          { href: '/kurslar?tur=cocuk', label: 'Çocuk', active: type === 'CHILD' },
        ].map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Adult Courses */}
      {(!type || type === 'ADULT') && adultCourses.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-900">🎓 Yetişkin Kursları</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adultCourses.map((course) => (
              <Link
                key={course.id}
                href={`/kurslar/${course.slug}`}
                className="card-hover group flex flex-col p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl">
                    ♟
                  </div>
                  <span className={`badge ${levelColor[course.level]}`}>
                    {levelLabel[course.level]}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-1"><BookOpen size={10} /> {course._count.lessons} ders</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {course._count.enrollments}</span>
                  <span className="ml-auto flex items-center gap-1 text-amber-500 font-medium">
                    Başla <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Child Courses */}
      {(!type || type === 'CHILD') && childCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-900">👦 Çocuk Kursları</h2>
            <Link href="/cocuk" className="text-sm text-purple-600 font-medium hover:underline">
              Çocuk sayfasına git →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {childCourses.map((course) => (
              <Link
                key={course.id}
                href={`/kurslar/${course.slug}`}
                className="group flex flex-col p-6 rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xl">
                    🎮
                  </div>
                  <span className="badge bg-purple-100 text-purple-700">
                    {levelLabel[course.level]}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-4 border-t border-purple-100">
                  <span className="flex items-center gap-1"><BookOpen size={10} /> {course._count.lessons} ders</span>
                  <span className="ml-auto flex items-center gap-1 text-purple-500 font-medium">
                    Başla <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {courses.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <div className="text-6xl mb-4">♟</div>
          <p className="text-lg font-medium">Henüz kurs eklenmemiş</p>
          <p className="text-sm mt-2">Yakında yeni kurslar eklenecek</p>
        </div>
      )}
    </div>
  )
}
