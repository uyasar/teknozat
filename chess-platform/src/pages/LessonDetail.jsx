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
    <main className="pt-16 pb-20 min-h-screen" style={{background:'#f7f6f3'}}>
      {/* Breadcrumb header */}
      <div className="bg-white border-b border-stone-200 pt-6 pb-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
            <Link to="/dersler" className="flex items-center gap-1 hover:text-chess transition-colors">
              <ArrowLeft size={13} /> Kurslar
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-stone-700 font-medium truncate">{course.title}</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-stone-900">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm text-stone-500 mt-2">
            <span className="flex items-center gap-1.5"><BookOpen size={13} /> {course.lessons} ders</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {course.duration}</span>
            <span className="text-stone-300">·</span>
            <span>{course.instructor}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LessonLayout lesson={lesson} />
      </div>
    </main>
  )
}
