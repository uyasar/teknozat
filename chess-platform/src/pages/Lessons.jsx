import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Star, Users, Search, CheckCircle, SlidersHorizontal } from 'lucide-react'
import { COURSES } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const LEVELS = ['Tümü', 'Başlangıç', 'Orta', 'İleri']

const levelBadge = {
  'Başlangıç': 'text-emerald-700 bg-emerald-100',
  'Orta':      'text-amber-700  bg-amber-100',
  'İleri':     'text-red-700    bg-red-100',
}

const levelEmoji = { 'Başlangıç': '🌱', 'Orta': '⚡', 'İleri': '🔥' }

export default function Lessons() {
  const { user } = useAuth()
  const [search,      setSearch]      = useState('')
  const [levelFilter, setLevelFilter] = useState('Tümü')

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchLevel = levelFilter === 'Tümü' || c.level === levelFilter
    return matchSearch && matchLevel
  })

  return (
    <main className="min-h-screen" style={{background:'#f7f6f3'}}>

      {/* Page header */}
      <div className="bg-white border-b border-stone-200 pt-24 pb-8">
        <div className="section">
          <p className="text-xs font-semibold uppercase tracking-widest text-chess mb-2">Platform</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900 mb-1">Kurslar</h1>
          <p className="text-stone-500 text-sm">{COURSES.length} kurs mevcut · Video dersler ve interaktif bulmacalar</p>
        </div>
      </div>

      <div className="section py-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-start">
          <div className="relative w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Kurs ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-stone-400 shrink-0" />
            <div className="flex gap-1.5 flex-wrap">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  className={clsx(
                    'px-4 rounded-xl text-xs font-semibold transition-all min-h-[40px] border',
                    levelFilter === l
                      ? 'text-white border-transparent'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-chess/40 hover:text-chess'
                  )}
                  style={levelFilter === l ? { background: '#166534', borderColor: '#166534' } : {}}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(course => (
            <Link key={course.id} to={`/dersler/${course.slug}`} className="card-hover group block">

              {/* Thumbnail */}
              <div className="w-full aspect-video rounded-xl mb-4 flex items-center justify-center text-5xl relative overflow-hidden"
                style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)'}}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{background:'linear-gradient(135deg,rgba(22,101,52,.08),transparent)'}} />
                <span className="relative z-10 select-none">{levelEmoji[course.level] ?? '♟'}</span>
                {user && course.progress === 100 && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                    <CheckCircle size={16} className="text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-semibold text-sm text-stone-900 group-hover:text-chess transition-colors leading-snug">
                  {course.title}
                </h3>
                <span className={clsx('badge shrink-0 text-[10px]', levelBadge[course.level])}>
                  {course.level}
                </span>
              </div>

              <p className="text-xs text-stone-500 leading-relaxed mb-4 line-clamp-2">
                {course.description}
              </p>

              {/* Progress bar */}
              {user && course.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1.5">
                    <span className="text-stone-400">İlerleme</span>
                    <span className="font-semibold text-chess">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%`, background: '#16a34a' }} />
                  </div>
                </div>
              )}

              {/* Footer meta */}
              <div className="flex items-center gap-3 text-[10px] text-stone-400 pt-3 border-t border-stone-100">
                <span className="flex items-center gap-1"><BookOpen size={10} />{course.lessons} ders</span>
                <span className="flex items-center gap-1"><Users size={10} />{course.enrolled.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-amber-600 ml-auto">
                  <Star size={10} fill="currentColor" />{course.rating}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-6xl mb-5 select-none">♟</p>
            <h3 className="font-semibold text-stone-900 mb-2">Sonuç bulunamadı</h3>
            <p className="text-sm text-stone-500">Aramanızla eşleşen kurs bulunamadı.</p>
            <button onClick={() => { setSearch(''); setLevelFilter('Tümü') }}
              className="btn-secondary mt-6 px-5 py-2.5 text-sm mx-auto">
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
