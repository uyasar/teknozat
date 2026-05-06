import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, Users, ChevronRight, Play } from 'lucide-react'
import { prisma } from '@/lib/prisma'

async function getCourse(slug: string) {
  try {
    return await prisma.course.findUnique({
      where: { slug, published: true },
      include: {
        lessons: {
          where: { published: true },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, slug: true, order: true, videoUrl: true, isOpening: true },
        },
        _count: { select: { enrollments: true } },
      },
    })
  } catch { return null }
}

const levelLabel: Record<string, string> = {
  BEGINNER: 'Başlangıç', INTERMEDIATE: 'Orta', ADVANCED: 'İleri',
}
const levelColor: Record<string, string> = {
  BEGINNER: 'text-emerald-700 bg-emerald-100',
  INTERMEDIATE: 'text-amber-700 bg-amber-100',
  ADVANCED: 'text-red-700 bg-red-100',
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()
  const isChild = course.type === 'CHILD'

  return (
    <div>
      <section className="py-16" style={{
        background: isChild
          ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
          : 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      }}>
        <div className="section">
          <div className="flex items-center gap-2 text-sm mb-6 opacity-60 text-white">
            <Link href="/" className="hover:underline">Ana Sayfa</Link>
            <ChevronRight size={14} />
            <Link href="/kurslar" className="hover:underline">Kurslar</Link>
            <ChevronRight size={14} />
            <span>{course.title}</span>
          </div>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`badge ${levelColor[course.level]}`}>{levelLabel[course.level]}</span>
                <span className="badge bg-white/20 text-white">{isChild ? '👦 Çocuk' : '🎓 Yetişkin'}</span>
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">{course.title}</h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl">{course.description}</p>
              <div className="flex items-center gap-6 mt-8 text-white/70 text-sm">
                <span className="flex items-center gap-2"><BookOpen size={16} /> {course.lessons.length} Ders</span>
                <span className="flex items-center gap-2"><Users size={16} /> {course._count.enrollments} Öğrenci</span>
              </div>
            </div>
            <div className="card p-6 w-full lg:w-72 shrink-0">
              <div className="text-5xl text-center mb-4">{isChild ? '🎮' : '♟'}</div>
              <Link href={course.lessons[0] ? `/dersler/${course.lessons[0].id}` : '/kayit'} className="btn-amber w-full justify-center rounded-xl py-3 mb-3">
                {course.lessons[0] ? 'Kursa Başla' : 'Üye Ol'} <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-center text-slate-500">{course.lessons.length} ders · Kendi hızında öğren</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section py-12">
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">
          Ders Listesi <span className="text-slate-400 font-normal text-lg">({course.lessons.length} ders)</span>
        </h2>
        {course.lessons.length > 0 ? (
          <div className="space-y-3">
            {course.lessons.map((lesson, i) => (
              <Link key={lesson.id} href={`/dersler/${lesson.id}`}
                className="card-hover flex items-center gap-4 p-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 group-hover:text-amber-600 transition-colors">{lesson.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.videoUrl && <span className="text-xs text-slate-400 flex items-center gap-1"><Play size={10} /> Video</span>}
                    {lesson.isOpening && <span className="badge bg-amber-100 text-amber-700 text-xs">Açılış</span>}
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400"><p>Bu kursa henüz ders eklenmemiş.</p></div>
        )}
      </section>
    </div>
  )
}
