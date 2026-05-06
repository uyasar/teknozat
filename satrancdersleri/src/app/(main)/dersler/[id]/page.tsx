import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import LessonTabs from '@/components/lesson/LessonTabs'

async function getLesson(id: string) {
  try {
    return await prisma.lesson.findUnique({
      where: { id, published: true },
      include: {
        course: { select: { id: true, title: true, slug: true, type: true } },
        puzzles: { orderBy: { order: 'asc' } },
        famousGames: { orderBy: { order: 'asc' } },
      },
    })
  } catch { return null }
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lesson = await getLesson(id)
  if (!lesson) notFound()

  return (
    <div>
      {/* Header */}
      <div className="bg-slate-900 py-10">
        <div className="section">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-60 text-white">
            <Link href="/" className="hover:underline">Ana Sayfa</Link>
            <ChevronRight size={14} />
            <Link href="/kurslar" className="hover:underline">Kurslar</Link>
            <ChevronRight size={14} />
            <Link href={`/kurslar/${lesson.course.slug}`} className="hover:underline">{lesson.course.title}</Link>
            <ChevronRight size={14} />
            <span className="text-white opacity-100">{lesson.title}</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white">{lesson.title}</h1>
          {lesson.isOpening && (
            <span className="inline-flex mt-3 badge bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ♟ Açılış Dersi
            </span>
          )}
        </div>
      </div>

      {/* Tabs content */}
      <div className="section py-8">
        <LessonTabs lesson={lesson} />
      </div>
    </div>
  )
}
