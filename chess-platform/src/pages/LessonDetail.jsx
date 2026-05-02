import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, BookOpen } from 'lucide-react'
import { COURSES, LESSONS } from '../data/mockData'
import LessonLayout from '../components/lesson/LessonLayout'

export default function LessonDetail() {
  const { slug } = useParams()
  const course = COURSES.find(c => c.slug === slug)
  const lesson = LESSONS.find(l => l.courseId === course?.id) ?? LESSONS[0]

  if (!course) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">♟</p>
          <h2 className="font-display font-bold text-2xl mb-2">Kurs bulunamadı</h2>
          <Link to="/dersler" className="btn-secondary mt-4">Kurslara dön</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dersler" className="btn-ghost gap-1.5 text-sm">
            <ArrowLeft size={14} /> Kurslar
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white/40 text-sm truncate">{course.title}</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display font-bold text-3xl">{course.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5"><BookOpen size={13} /> {course.lessons} ders</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {course.duration}</span>
            <span className="text-white/20">|</span>
            <span>{course.instructor}</span>
          </div>
        </div>

        <LessonLayout lesson={lesson} />
      </div>
    </main>
  )
}
