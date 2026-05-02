import { Link, Navigate } from 'react-router-dom'
import { Trophy, BookOpen, Target, Clock, TrendingUp, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { COURSES, ACHIEVEMENTS } from '../data/mockData'
import clsx from 'clsx'

function StatCard({ icon: Icon, label, value, color = 'text-accent' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center', color === 'text-accent' ? 'bg-accent/10 text-accent' : `bg-emerald-400/10 text-emerald-400`)}>
        <Icon size={18} />
      </div>
      <div>
        <div className="font-bold text-2xl">{value}</div>
        <div className="text-xs text-white/40">{label}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/giris" replace />

  const completedCourses = COURSES.filter(c => c.progress === 100)
  const inProgressCourses = COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const totalPoints = 1250
  const overallProgress = Math.round(
    COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length
  )

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-1">
            Hoşgeldiniz, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-white/40">İlerlemenizi takip edin ve öğrenmeye devam edin.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={BookOpen} label="Tamamlanan Kurs" value={completedCourses.length} />
          <StatCard icon={Target} label="Genel İlerleme" value={`${overallProgress}%`} />
          <StatCard icon={Trophy} label="Toplam Puan" value={totalPoints.toLocaleString()} />
          <StatCard icon={TrendingUp} label="Aktif Çalışma" value={`${inProgressCourses.length} kurs`} color="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* In Progress */}
            {inProgressCourses.length > 0 && (
              <div>
                <h2 className="font-semibold text-lg mb-4">Devam Eden Kurslar</h2>
                <div className="space-y-3">
                  {inProgressCourses.map(course => (
                    <Link key={course.id} to={`/dersler/${course.slug}`} className="card-hover flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-2xl shrink-0">♟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-2 truncate">{course.title}</div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${course.progress}%` }} />
                        </div>
                        <div className="text-[10px] text-white/30 mt-1">{course.progress}% tamamlandı</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Tamamlanan Kurslar</h2>
              {completedCourses.length > 0 ? (
                <div className="space-y-3">
                  {completedCourses.map(course => (
                    <div key={course.id} className="card flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-400/10 flex items-center justify-center text-2xl shrink-0">♟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1 truncate">{course.title}</div>
                        <div className="text-xs text-white/30">{course.lessons} ders · {course.duration}</div>
                      </div>
                      <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card text-center py-8 text-white/30">
                  <Clock size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Henüz tamamlanan kurs yok.</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Başarılar</h2>
            <div className="space-y-2">
              {ACHIEVEMENTS.map(a => (
                <div key={a.id} className={clsx(
                  'card flex items-center gap-3 transition-all',
                  !a.earned && 'opacity-40 grayscale'
                )}>
                  <div className={clsx(
                    'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                    a.earned ? 'bg-accent/15' : 'bg-white/5'
                  )}>
                    {a.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-xs text-white/40">{a.description}</div>
                  </div>
                  {a.earned && <Trophy size={12} className="text-accent ml-auto shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
