import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Shield, Search, Users, BookOpen, X, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { COURSES, USERS } from '../data/mockData'
import clsx from 'clsx'

function CourseFormModal({ course, onClose, onSave }) {
  const [form, setForm] = useState(
    course ?? { title: '', description: '', level: 'Başlangıç', duration: '', lessons: 0 }
  )
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-bg-elevated border border-white/10
        shadow-2xl shadow-black/40 p-6 animate-slide-up space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{course ? 'Kursu Düzenle' : 'Yeni Kurs'}</h3>
          <button onClick={onClose} className="btn-icon text-white/50 hover:text-white"><X size={15} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Başlık</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Açıklama</label>
            <textarea
              className="input min-h-[80px] resize-none"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Seviye</label>
              <select className="input" value={form.level} onChange={e => set('level', e.target.value)}>
                <option>Başlangıç</option>
                <option>Orta</option>
                <option>İleri</option>
              </select>
            </div>
            <div>
              <label className="label">Süre</label>
              <input className="input" value={form.duration} placeholder="4 saat" onChange={e => set('duration', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Ders Sayısı</label>
            <input className="input" type="number" value={form.lessons} onChange={e => set('lessons', Number(e.target.value))} />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary">İptal</button>
          <button onClick={() => onSave(form)} className="btn-primary"><Save size={14} /> Kaydet</button>
        </div>
      </div>
    </div>
  )
}

const levelCls = {
  'Başlangıç': 'text-emerald-400 bg-emerald-400/10',
  'Orta':      'text-amber-400 bg-amber-400/10',
  'İleri':     'text-red-400 bg-red-400/10',
}

export default function Admin() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState('courses')
  const [courses, setCourses] = useState(COURSES)
  const [users, setUsers] = useState(USERS)
  const [search, setSearch] = useState('')
  const [editCourse, setEditCourse] = useState(null)
  const [newCourse, setNewCourse] = useState(false)

  if (!isAdmin) return <Navigate to="/" replace />

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveCourse = (form) => {
    if (editCourse) {
      setCourses(p => p.map(c => c.id === editCourse.id ? { ...c, ...form } : c))
    } else {
      setCourses(p => [...p, {
        ...form, id: Date.now(),
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
        rating: 0, enrolled: 0, progress: 0, tags: [],
      }])
    }
    setEditCourse(null)
    setNewCourse(false)
  }

  const handleDeleteCourse = (id) => {
    if (confirm('Bu kursu silmek istediğinize emin misiniz?')) {
      setCourses(p => p.filter(c => c.id !== id))
    }
  }

  const handleRoleToggle = (userId) => {
    setUsers(p => p.map(u =>
      u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u
    ))
  }

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="section">
        <div className="flex items-center gap-3 mb-8">
          <Shield size={20} className="text-gold" />
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: BookOpen, label: 'Toplam Kurs',  value: courses.length },
            { icon: Users,    label: 'Kullanıcı',    value: users.length },
            { icon: Shield,   label: 'Admin',        value: users.filter(u => u.role === 'admin').length },
            { icon: BookOpen, label: 'Toplam Ders',  value: courses.reduce((s, c) => s + c.lessons, 0) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card flex items-center gap-3">
              <Icon size={16} className="text-gold shrink-0" />
              <div>
                <div className="font-bold text-xl">{value}</div>
                <div className="text-xs text-white/30">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="flex gap-1 border-b border-white/5">
            {[
              { id: 'courses', label: 'Kurslar',      icon: BookOpen },
              { id: 'users',   label: 'Kullanıcılar', icon: Users },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSearch('') }}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  'min-h-[44px] border-b-2 -mb-px',
                  tab === t.id
                    ? 'text-gold border-gold'
                    : 'text-white/40 border-transparent hover:text-white'
                )}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                className="input pl-9 w-full sm:w-48"
                placeholder="Ara..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {tab === 'courses' && (
              <button onClick={() => setNewCourse(true)} className="btn-primary shrink-0">
                <Plus size={14} /> <span className="hidden sm:inline">Yeni Kurs</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Courses ── */}
        {tab === 'courses' && (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filteredCourses.map(c => (
                <div key={c.id} className="card flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{c.title}</div>
                    <div className="text-xs text-white/30 mt-0.5 line-clamp-1">{c.description}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={clsx('badge text-[10px]', levelCls[c.level] ?? 'text-white/40 bg-white/5')}>
                        {c.level}
                      </span>
                      <span className="text-[10px] text-white/30">{c.lessons} ders</span>
                      <span className="text-[10px] text-white/30">{c.enrolled.toLocaleString()} kayıtlı</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => setEditCourse(c)}
                      className="btn-icon text-white/40 hover:text-white"
                      aria-label="Düzenle"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="btn-icon text-white/40 hover:text-red-400"
                      aria-label="Sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="card overflow-hidden p-0 hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-xs text-white/30 font-medium">Kurs</th>
                    <th className="text-left px-4 py-3 text-xs text-white/30 font-medium">Seviye</th>
                    <th className="text-left px-4 py-3 text-xs text-white/30 font-medium hidden lg:table-cell">Ders</th>
                    <th className="text-left px-4 py-3 text-xs text-white/30 font-medium hidden lg:table-cell">Kayıtlı</th>
                    <th className="text-right px-5 py-3 text-xs text-white/30 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((c, i) => (
                    <tr key={c.id} className={clsx(
                      'border-b border-white/5 hover:bg-white/2',
                      i === filteredCourses.length - 1 && 'border-0'
                    )}>
                      <td className="px-5 py-3.5">
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-white/30 mt-0.5 line-clamp-1">{c.description}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={clsx('badge text-xs', levelCls[c.level] ?? 'text-white/40 bg-white/5')}>
                          {c.level}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white/50 hidden lg:table-cell">{c.lessons}</td>
                      <td className="px-4 py-3.5 text-white/50 hidden lg:table-cell">{c.enrolled.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setEditCourse(c)}
                            className="btn-ghost p-2 text-white/40 hover:text-white"
                            aria-label="Düzenle"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="btn-ghost p-2 text-white/40 hover:text-red-400"
                            aria-label="Sil"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <>
            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filteredUsers.map(u => (
                <div key={u.id} className="card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/25
                    flex items-center justify-center text-gold text-sm font-bold shrink-0">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{u.name}</div>
                    <div className="text-xs text-white/30 truncate">{u.email}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={clsx('badge text-[10px]',
                      u.role === 'admin' ? 'text-gold bg-gold/10' : 'text-white/40 bg-white/5'
                    )}>
                      {u.role === 'admin' ? 'Admin' : 'Üye'}
                    </span>
                    <button
                      onClick={() => handleRoleToggle(u.id)}
                      className="text-[10px] text-white/40 hover:text-white transition-colors underline"
                    >
                      {u.role === 'admin' ? 'Üye yap' : 'Admin yap'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="card overflow-hidden p-0 hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-xs text-white/30 font-medium">Kullanıcı</th>
                    <th className="text-left px-4 py-3 text-xs text-white/30 font-medium hidden md:table-cell">Katılım</th>
                    <th className="text-left px-4 py-3 text-xs text-white/30 font-medium">Rol</th>
                    <th className="text-right px-5 py-3 text-xs text-white/30 font-medium">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} className={clsx(
                      'border-b border-white/5 hover:bg-white/2',
                      i === filteredUsers.length - 1 && 'border-0'
                    )}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25
                            flex items-center justify-center text-gold text-xs font-bold shrink-0">
                            {u.name[0]}
                          </div>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-white/30">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-white/40 text-xs hidden md:table-cell">{u.joined}</td>
                      <td className="px-4 py-3.5">
                        <span className={clsx('badge',
                          u.role === 'admin' ? 'text-gold bg-gold/10' : 'text-white/40 bg-white/5'
                        )}>
                          {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleRoleToggle(u.id)}
                          className="btn-ghost text-xs py-1 px-2 gap-1"
                        >
                          <Shield size={11} />
                          {u.role === 'admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {(editCourse !== null || newCourse) && (
        <CourseFormModal
          course={editCourse}
          onClose={() => { setEditCourse(null); setNewCourse(false) }}
          onSave={handleSaveCourse}
        />
      )}
    </main>
  )
}
