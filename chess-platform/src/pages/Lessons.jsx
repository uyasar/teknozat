import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Star, Users, Filter, Search, CheckCircle } from 'lucide-react'
import { COURSES } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const LEVELS = ['Tümü', 'Başlangıç', 'Orta', 'İleri']

export default function Lessons() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('Tümü')

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
    const matchLevel = levelFilter === 'Tümü' || c.level === levelFilter
    return matchSearch && matchLevel
  })

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-2">Kurslar</h1>
          <p className="text-white/40">{COURSES.length} kurs mevcut</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Kurs ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-white/30" />
            <div className="flex gap-1">
              {LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    levelFilter === l ? 'bg-accent text-surface-900' : 'bg-white/5 text-white/50 hover:text-white'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(course => (
            <Link key={course.id} to={`/dersler/${course.slug}`} className="card-hover group block">
              <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/5 mb-4 flex items-center justify-center text-5xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                ♟
                {user && course.progress === 100 && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm group-hover:text-accent transition-colors leading-snug">{course.title}</h3>
                <span className={clsx(
                  'badge shrink-0 text-[10px]',
                  course.level === 'Başlangıç' && 'text-emerald-400 bg-emerald-400/10',
                  course.level === 'Orta' && 'text-amber-400 bg-amber-400/10',
                  course.level === 'İleri' && 'text-red-400 bg-red-400/10',
                )}>
                  {course.level}
                </span>
              </div>

              <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">{course.description}</p>

              {user && course.progress > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-white/30 mb-1">
                    <span>İlerleme</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-[10px] text-white/25">
                <span className="flex items-center gap-1"><BookOpen size={10} />{course.lessons} ders</span>
                <span className="flex items-center gap-1"><Users size={10} />{course.enrolled.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-amber-400/60"><Star size={10} fill="currentColor" />{course.rating}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-5xl mb-4">♟</p>
            <p>Aramanızla eşleşen kurs bulunamadı.</p>
          </div>
        )}
      </div>
    </main>
  )
}
