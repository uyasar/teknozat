import { Link, Navigate } from 'react-router-dom'
import { Trophy, BookOpen, Target, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { COURSES, ACHIEVEMENTS } from '../data/mockData'
import clsx from 'clsx'

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-gold/10 border border-gold/20
        flex items-center justify-center text-gold shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <div className="font-bold text-2xl leading-none mb-0.5">{value}</div>
        <div className="text-xs text-white/35">{label}</div>
        {sub && <div className="text-[10px] text-white/20 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/giris" replace />

  const completed = COURSES.filter(c => c.progress === 100)
  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const overall = Math.round(COURSES.reduce((s, c) => s + c.progress, 0) / COURSES.length)

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="section">
        <div className="mb-10">
          <h1 className="font-display font-bold text-4xl mb-1">
            Merhaba, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-white/35 text-sm">Öğrenme yolculuğunuza devam edin.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <Stat icon={BookOpen} label="Tamamlanan" value={completed.length} sub="kurs" />
          <Stat icon={Target} label="Genel İlerleme" value={`${overall}%`} />
          <Stat icon={Trophy} label="Toplam Puan" value="1.250" />
          <Stat icon={TrendingUp} label="Aktif Kurs" value={inProgress.length} sub="devam ediyor" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {inProgress.length > 0 && (
              <div>
                <h2 className="font-semibold mb-3">Devam Eden Kurslar</h2>
                <div className="space-y-2.5">
                  {inProgress.map(c => (
                    <Link key={c.id} to={`/dersler/${c.slug}`}
                      className="card-hover flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl shrink-0">♟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1.5 truncate">{c.title}</div>
                        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full transition-all"
                            style={{ width: `${c.progress}%` }} />
                        </div>
                        <div className="text-[10px] text-white/25 mt-1">{c.progress}% tamamlandı</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="font-semibold mb-3">Tamamlanan Kurslar</h2>
              {completed.length > 0 ? (
                <div className="space-y-2.5">
                  {completed.map(c => (
                    <div key={c.id} className="card flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-2xl shrink-0">♟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{c.title}</div>
                        <div className="text-xs text-white/30 mt-0.5">{c.lessons} ders · {c.duration}</div>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card text-center py-10 text-white/25">
                  <Clock size={24} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Henüz tamamlanan kurs yok.</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="font-semibold mb-3">Başarılar</h2>
            <div className="space-y-2">
              {ACHIEVEMENTS.map(a => (
                <div key={a.id} className={clsx(
                  'card-sm flex items-center gap-3 transition-all',
                  !a.earned && 'opacity-35 grayscale'
                )}>
                  <div className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0',
                    a.earned ? 'bg-gold/12' : 'bg-white/5'
                  )}>
                    {a.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{a.title}</div>
                    <div className="text-xs text-white/35 truncate">{a.description}</div>
                  </div>
                  {a.earned && <Trophy size={12} className="text-gold ml-auto shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
