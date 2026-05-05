import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Shield, Search, Users, BookOpen, X, Save, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { COURSES, USERS, LESSONS } from '../data/mockData'
import clsx from 'clsx'

/* ── helpers ── */
const levelCls = {
  'Başlangıç': 'text-emerald-400 bg-emerald-400/10',
  'Orta':      'text-amber-400 bg-amber-400/10',
  'İleri':     'text-red-400 bg-red-400/10',
}

/* ── Course modal ── */
function CourseModal({ course, onClose, onSave }) {
  const [form, setForm] = useState(
    course ?? { title: '', description: '', level: 'Başlangıç', duration: '', lessons: 0 }
  )
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-bg-elevated border border-white/10
        shadow-2xl shadow-black/60 p-6 animate-slide-up space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{course ? 'Kursu Düzenle' : 'Yeni Kurs'}</h3>
          <button onClick={onClose} className="btn-icon text-white/40 hover:text-white"><X size={15} /></button>
        </div>
        <div className="space-y-4">
          <div><label className="label">Başlık</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} /></div>
          <div><label className="label">Açıklama</label>
            <textarea className="input min-h-[80px] resize-none" value={form.description}
              onChange={e => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Seviye</label>
              <select className="input" value={form.level} onChange={e => set('level', e.target.value)}>
                <option>Başlangıç</option><option>Orta</option><option>İleri</option>
              </select></div>
            <div><label className="label">Süre</label>
              <input className="input" value={form.duration} placeholder="4 saat"
                onChange={e => set('duration', e.target.value)} /></div>
          </div>
          <div><label className="label">Ders Sayısı</label>
            <input className="input" type="number" value={form.lessons}
              onChange={e => set('lessons', Number(e.target.value))} /></div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary">İptal</button>
          <button onClick={() => onSave(form)} className="btn-primary"><Save size={14} /> Kaydet</button>
        </div>
      </div>
    </div>
  )
}

/* ── Lesson modal ── */
function LessonModal({ lesson, courses, onClose, onSave }) {
  const [form, setForm] = useState(lesson ?? {
    title: '', courseId: courses[0]?.id ?? 1, videoUrl: '', duration: '',
    pgn: '', completed: false,
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-bg-elevated border border-white/10
        shadow-2xl shadow-black/60 p-6 animate-slide-up space-y-5 overflow-y-auto max-h-[90dvh]">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{lesson ? 'Dersi Düzenle' : 'Yeni Ders'}</h3>
          <button onClick={onClose} className="btn-icon text-white/40 hover:text-white"><X size={15} /></button>
        </div>
        <div className="space-y-4">
          <div><label className="label">Ders Başlığı</label>
            <input className="input" value={form.title}
              onChange={e => set('title', e.target.value)} placeholder="Piyon Hareketi…" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Kurs</label>
              <select className="input" value={form.courseId}
                onChange={e => set('courseId', Number(e.target.value))}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select></div>
            <div><label className="label">Süre</label>
              <input className="input" value={form.duration} placeholder="18:42"
                onChange={e => set('duration', e.target.value)} /></div>
          </div>
          <div><label className="label">Video URL</label>
            <input className="input" value={form.videoUrl || ''}
              onChange={e => set('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/embed/…" /></div>
          <div><label className="label">PGN</label>
            <textarea
              className="input resize-none font-mono text-xs leading-relaxed"
              style={{ minHeight: 140 }}
              value={form.pgn || ''}
              onChange={e => set('pgn', e.target.value)}
              placeholder={'[Event "Demo"]\n1. e4 e5 2. Nf3 Nc6 *'}
            /></div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn-secondary">İptal</button>
          <button onClick={() => onSave(form)} className="btn-primary"><Save size={14} /> Kaydet</button>
        </div>
      </div>
    </div>
  )
}

/* ── Admin page ── */
export default function Admin() {
  const { isAdmin } = useAuth()
  const [tab,      setTab]      = useState('courses')
  const [courses,  setCourses]  = useState(COURSES)
  const [users,    setUsers]    = useState(USERS)
  const [lessons,  setLessons]  = useState(LESSONS)
  const [search,   setSearch]   = useState('')

  const [editCourse,  setEditCourse]  = useState(null)
  const [newCourse,   setNewCourse]   = useState(false)
  const [editLesson,  setEditLesson]  = useState(null)
  const [newLesson,   setNewLesson]   = useState(false)

  if (!isAdmin) return <Navigate to="/" replace />

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()))
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()))
  const filteredLessons = lessons.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()))

  const handleSaveCourse = (form) => {
    if (editCourse) {
      setCourses(p => p.map(c => c.id === editCourse.id ? { ...c, ...form } : c))
    } else {
      setCourses(p => [...p, { ...form, id: Date.now(),
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
        rating: 0, enrolled: 0, progress: 0, tags: [] }])
    }
    setEditCourse(null); setNewCourse(false)
  }

  const handleDeleteCourse = (id) => {
    if (confirm('Bu kursu silmek istediğinize emin misiniz?'))
      setCourses(p => p.filter(c => c.id !== id))
  }

  const handleSaveLesson = (form) => {
    if (editLesson) {
      setLessons(p => p.map(l => l.id === editLesson.id ? { ...l, ...form } : l))
    } else {
      setLessons(p => [...p, { ...form, id: Date.now(),
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
        puzzles: [], completed: false }])
    }
    setEditLesson(null); setNewLesson(false)
  }

  const handleDeleteLesson = (id) => {
    if (confirm('Bu dersi silmek istediğinize emin misiniz?'))
      setLessons(p => p.filter(l => l.id !== id))
  }

  const handleRoleToggle = (userId) => {
    setUsers(p => p.map(u =>
      u.id === userId ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u))
  }

  const TABS = [
    { id: 'courses', label: 'Kurslar',      icon: BookOpen },
    { id: 'lessons', label: 'Dersler',      icon: FileText },
    { id: 'users',   label: 'Kullanıcılar', icon: Users    },
  ]

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <div className="section">

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield size={20} className="text-gold" />
          <h1 className="font-display font-bold text-2xl sm:text-3xl">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: BookOpen, label: 'Kurs',        value: courses.length },
            { icon: FileText, label: 'Ders',        value: lessons.length },
            { icon: Users,    label: 'Kullanıcı',   value: users.length   },
            { icon: Shield,   label: 'Admin',       value: users.filter(u => u.role === 'admin').length },
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

        {/* Tab bar + controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div className="flex border-b" style={{borderColor:'rgba(255,255,255,.07)'}}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setSearch('') }}
                className={clsx(
                  'flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors',
                  'border-b-2 -mb-px min-h-[44px]',
                  tab === t.id
                    ? 'text-gold border-gold'
                    : 'text-white/35 border-transparent hover:text-white/60'
                )}
              >
                <t.icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input className="input pl-9 w-full sm:w-48" placeholder="Ara…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {tab === 'courses' && (
              <button onClick={() => setNewCourse(true)} className="btn-primary shrink-0">
                <Plus size={14} /> <span className="hidden sm:inline">Yeni Kurs</span>
              </button>
            )}
            {tab === 'lessons' && (
              <button onClick={() => setNewLesson(true)} className="btn-primary shrink-0">
                <Plus size={14} /> <span className="hidden sm:inline">Yeni Ders</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Courses ── */}
        {tab === 'courses' && (
          <>
            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {filteredCourses.map(c => (
                <div key={c.id} className="card flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{c.title}</div>
                    <div className="text-xs text-white/30 mt-0.5 line-clamp-1">{c.description}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={clsx('badge text-[10px]', levelCls[c.level] ?? 'text-white/40 bg-white/5')}>{c.level}</span>
                      <span className="text-[10px] text-white/30">{c.lessons} ders</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => setEditCourse(c)} className="btn-icon text-white/40 hover:text-white" aria-label="Düzenle"><Pencil size={15} /></button>
                    <button onClick={() => handleDeleteCourse(c.id)} className="btn-icon text-white/40 hover:text-red-400" aria-label="Sil"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <div className="card overflow-hidden p-0 hidden md:block">
              <table className="w-full text-sm">
                <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                  {['Kurs','Seviye','Ders','Kayıtlı',''].map((h,i) => (
                    <th key={i} className={clsx('text-left px-5 py-3 text-xs text-white/30 font-semibold',
                      i===2||i===3 ? 'hidden lg:table-cell' : '', i===4 ? 'text-right' : '')}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredCourses.map((c, i) => (
                    <tr key={c.id} className="hover:bg-white/2" style={{borderBottom: i < filteredCourses.length-1 ? '1px solid rgba(255,255,255,.04)' : 'none'}}>
                      <td className="px-5 py-3.5">
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-white/30 mt-0.5 line-clamp-1">{c.description}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={clsx('badge text-xs', levelCls[c.level] ?? 'text-white/40 bg-white/5')}>{c.level}</span>
                      </td>
                      <td className="px-4 py-3.5 text-white/50 hidden lg:table-cell">{c.lessons}</td>
                      <td className="px-4 py-3.5 text-white/50 hidden lg:table-cell">{c.enrolled?.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setEditCourse(c)} className="btn-ghost p-2 text-white/40 hover:text-white"><Pencil size={13} /></button>
                          <button onClick={() => handleDeleteCourse(c.id)} className="btn-ghost p-2 text-white/40 hover:text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Lessons ── */}
        {tab === 'lessons' && (
          <>
            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {filteredLessons.map(l => {
                const course = courses.find(c => c.id === l.courseId)
                return (
                  <div key={l.id} className="card flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{l.title}</div>
                      <div className="text-xs text-white/30 mt-1">{course?.title ?? '—'}</div>
                      <div className="flex items-center gap-2 mt-2">
                        {l.videoUrl && <span className="badge text-[10px] text-blue-400 bg-blue-400/10">Video</span>}
                        {l.pgn && <span className="badge text-[10px] text-emerald-400 bg-emerald-400/10">PGN</span>}
                        {l.puzzles?.length > 0 && <span className="badge text-[10px] text-gold bg-gold/10">{l.puzzles.length} bulmaca</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditLesson(l)} className="btn-icon text-white/40 hover:text-white" aria-label="Düzenle"><Pencil size={15} /></button>
                      <button onClick={() => handleDeleteLesson(l.id)} className="btn-icon text-white/40 hover:text-red-400" aria-label="Sil"><Trash2 size={15} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Desktop */}
            <div className="card overflow-hidden p-0 hidden md:block">
              <table className="w-full text-sm">
                <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                  {['Ders','Kurs','İçerik',''].map((h,i) => (
                    <th key={i} className={clsx('text-left px-5 py-3 text-xs text-white/30 font-semibold',
                      i===3 ? 'text-right' : '')}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredLessons.map((l, i) => {
                    const course = courses.find(c => c.id === l.courseId)
                    return (
                      <tr key={l.id} className="hover:bg-white/2" style={{borderBottom: i < filteredLessons.length-1 ? '1px solid rgba(255,255,255,.04)' : 'none'}}>
                        <td className="px-5 py-3.5">
                          <div className="font-medium">{l.title}</div>
                          {l.duration && <div className="text-xs text-white/30 mt-0.5">{l.duration}</div>}
                        </td>
                        <td className="px-4 py-3.5 text-white/50 text-xs">{course?.title ?? '—'}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {l.videoUrl && <span className="badge text-[10px] text-blue-400 bg-blue-400/10">Video</span>}
                            {l.pgn && <span className="badge text-[10px] text-emerald-400 bg-emerald-400/10">PGN</span>}
                            {l.puzzles?.length > 0 && <span className="badge text-[10px] text-gold bg-gold/10">{l.puzzles.length} bulmaca</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => setEditLesson(l)} className="btn-ghost p-2 text-white/40 hover:text-white"><Pencil size={13} /></button>
                            <button onClick={() => handleDeleteLesson(l.id)} className="btn-ghost p-2 text-white/40 hover:text-red-400"><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <>
            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              {filteredUsers.map(u => (
                <div key={u.id} className="card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-gold font-bold shrink-0"
                    style={{background:'rgba(244,196,48,.12)',border:'1px solid rgba(244,196,48,.2)'}}>{u.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{u.name}</div>
                    <div className="text-xs text-white/30 truncate">{u.email}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={clsx('badge text-[10px]', u.role==='admin' ? 'text-gold bg-gold/10' : 'text-white/40 bg-white/5')}>
                      {u.role === 'admin' ? 'Admin' : 'Üye'}
                    </span>
                    <button onClick={() => handleRoleToggle(u.id)}
                      className="text-[10px] text-white/40 hover:text-white underline">
                      {u.role === 'admin' ? 'Üye yap' : 'Admin yap'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop */}
            <div className="card overflow-hidden p-0 hidden md:block">
              <table className="w-full text-sm">
                <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,.06)'}}>
                  {['Kullanıcı','Katılım','Rol','İşlem'].map((h,i) => (
                    <th key={i} className={clsx('text-left px-5 py-3 text-xs text-white/30 font-semibold',
                      i===1?'hidden md:table-cell':'', i===3?'text-right':'')}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u.id} className="hover:bg-white/2" style={{borderBottom: i < filteredUsers.length-1 ? '1px solid rgba(255,255,255,.04)' : 'none'}}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold text-xs font-bold shrink-0"
                            style={{background:'rgba(244,196,48,.12)',border:'1px solid rgba(244,196,48,.2)'}}>{u.name[0]}</div>
                          <div>
                            <div className="font-medium">{u.name}</div>
                            <div className="text-xs text-white/30">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-white/40 text-xs hidden md:table-cell">{u.joined}</td>
                      <td className="px-4 py-3.5">
                        <span className={clsx('badge', u.role==='admin' ? 'text-gold bg-gold/10' : 'text-white/40 bg-white/5')}>
                          {u.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => handleRoleToggle(u.id)} className="btn-ghost text-xs px-3 gap-1">
                          <Shield size={11} /> {u.role==='admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
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

      {/* Modals */}
      {(editCourse !== null || newCourse) && (
        <CourseModal course={editCourse}
          onClose={() => { setEditCourse(null); setNewCourse(false) }}
          onSave={handleSaveCourse} />
      )}
      {(editLesson !== null || newLesson) && (
        <LessonModal lesson={editLesson} courses={courses}
          onClose={() => { setEditLesson(null); setNewLesson(false) }}
          onSave={handleSaveLesson} />
      )}
    </main>
  )
}
