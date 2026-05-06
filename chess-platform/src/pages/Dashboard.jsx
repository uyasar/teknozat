import { Link, Navigate } from 'react-router-dom'
import { Trophy, BookOpen, Target, TrendingUp, CheckCircle2, Clock, Award, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { COURSES, ACHIEVEMENTS } from '../data/mockData'
import clsx from 'clsx'

const STAT_COLORS = {
  green:  { bg: '#f0fdf4', border: '#bbf7d0', icon: '#16a34a' },
  blue:   { bg: '#eff6ff', border: '#bfdbfe', icon: '#1d4ed8' },
  amber:  { bg: '#fffbeb', border: '#fde68a', icon: '#b45309' },
  violet: { bg: '#f5f3ff', border: '#ddd6fe', icon: '#7c3aed' },
}

function Stat({ icon: Icon, label, value, sub, color = 'green' }) {
  const c = STAT_COLORS[color]
  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}>
        <Icon size={20} style={{ color: c.icon }} />
      </div>
      <div>
        <div className="font-bold text-2xl text-stone-900 leading-none mb-1">{value}</div>
        <div className="text-xs text-stone-500">{label}</div>
        {sub && <div className="text-[10px] text-stone-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/giris" replace />

  const completed  = COURSES.filter(c => c.progress === 100)
  const inProgress = COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const overall    = Math.round(COURSES.reduce((s, c) => s + c.progress, 0) / COURSES.length)

  return (
    <main className="min-h-screen pt-16 pb-20" style={{background:'#f7f6f3'}}>

      {/* Page header */}
      <div className="bg-white border-b border-stone-200 pt-8 pb-8 mb-8">
        <div className="section">
          <p className="text-xs font-semibold uppercase tracking-widest text-chess mb-2">Dashboard</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-stone-900">
            Merhaba, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-500 text-sm mt-1">Öğrenme yolculuğunuza kaldığınız yerden devam edin.</p>
        </div>
      </div>

      <div className="section">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Stat icon={BookOpen}    label="Tamamlanan Kurs" value={completed.length}  color="green"  />
          <Stat icon={Target}      label="Genel İlerleme"  value={`${overall}%`}     color="blue"   />
          <Stat icon={Trophy}      label="Toplam Puan"     value="1.250"             color="amber"  />
          <Stat icon={TrendingUp}  label="Aktif Kurs"      value={inProgress.length} sub="devam ediyor" color="violet" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: courses */}
          <div className="lg:col-span-2 space-y-5">

            {/* In progress */}
            {inProgress.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Devam Eden Kurslar
                  </h2>
                  <Link to="/dersler" className="text-xs text-chess font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
                    Tüm kurslar <ArrowRight size={11} />
                  </Link>
                </div>
                <div className="space-y-3">
                  {inProgress.map(c => (
                    <Link key={c.id} to={`/dersler/${c.slug}`}
                      className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-stone-50 transition-colors group border border-transparent hover:border-stone-200">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 select-none"
                        style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)'}}>♟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-stone-900 mb-2 truncate group-hover:text-chess transition-colors">
                          {c.title}
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{ width: `${c.progress}%`, background: '#16a34a' }} />
                        </div>
                        <div className="text-[10px] text-stone-400 mt-1">{c.progress}% tamamlandı · {c.lessons} ders</div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                        style={{background:'#f0fdf4', color:'#166534'}}>
                        {c.progress}%
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Completed */}
            <div className="card">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h2 className="font-semibold text-stone-900">Tamamlanan Kurslar</h2>
              </div>

              {completed.length > 0 ? (
                <div className="space-y-2.5">
                  {completed.map(c => (
                    <div key={c.id} className="flex items-center gap-4 p-3.5 rounded-xl border"
                      style={{background:'#f0fdf4', borderColor:'#bbf7d0'}}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 select-none"
                        style={{background:'linear-gradient(135deg,#dcfce7,#bbf7d0)'}}>♟</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-stone-900 truncate">{c.title}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{c.lessons} ders · {c.duration}</div>
                      </div>
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock size={32} className="mx-auto mb-3 text-stone-300" />
                  <p className="font-medium text-stone-700 mb-1">Henüz tamamlanan kurs yok</p>
                  <p className="text-sm text-stone-500 mb-5">Öğrenmeye başlamak için bir kurs seçin.</p>
                  <Link to="/dersler" className="btn-primary inline-flex px-6 py-2.5 text-sm">
                    Kurslara Göz At <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right: achievements */}
          <div className="card h-fit">
            <div className="flex items-center gap-2 mb-5">
              <Award size={16} className="text-amber-600" />
              <h2 className="font-semibold text-stone-900">Başarılar</h2>
            </div>
            <div className="space-y-2.5">
              {ACHIEVEMENTS.map(a => (
                <div key={a.id}
                  className={clsx(
                    'flex items-center gap-3 p-3.5 rounded-xl border transition-all',
                    a.earned
                      ? 'border-amber-100'
                      : 'border-stone-100 opacity-45 grayscale'
                  )}
                  style={a.earned ? {background:'#fffbeb'} : {background:'#f9f8f7'}}>
                  <div className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0',
                    a.earned ? 'bg-amber-100' : 'bg-stone-200'
                  )}>
                    {a.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-stone-900">{a.title}</div>
                    <div className="text-xs text-stone-500 truncate">{a.description}</div>
                  </div>
                  {a.earned && <Trophy size={13} className="text-amber-600 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
