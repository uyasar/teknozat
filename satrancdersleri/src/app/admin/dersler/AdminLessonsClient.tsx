'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

type Lesson = {
  id: string
  title: string
  courseId: string
  published: boolean
  isOpening: boolean
  order: number
  videoUrl: string | null
  videoType: string | null
  course: { title: string }
  _count: { puzzles: number; famousGames: number }
}

type Course = { id: string; title: string }

const EMPTY = {
  courseId: '',
  title: '',
  description: '',
  videoUrl: '',
  videoType: 'youtube',
  order: 0,
  published: false,
  isOpening: false,
}

export default function AdminLessonsClient({
  initialLessons,
  courses,
}: {
  initialLessons: Lesson[]
  courses: Course[]
}) {
  const router = useRouter()
  const [lessons, setLessons] = useState(initialLessons)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Lesson | null>(null)
  const [form, setForm] = useState<typeof EMPTY & { courseId: string }>(EMPTY as any)
  const [saving, setSaving] = useState(false)
  const [filterCourse, setFilterCourse] = useState('')

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY, courseId: courses[0]?.id ?? '' })
    setModal(true)
  }

  const openEdit = (l: Lesson) => {
    setEditing(l)
    setForm({
      courseId: l.courseId,
      title: l.title,
      description: '',
      videoUrl: l.videoUrl ?? '',
      videoType: l.videoType ?? 'youtube',
      order: l.order,
      published: l.published,
      isOpening: l.isOpening,
    })
    setModal(true)
  }

  const save = async () => {
    if (!form.title.trim() || !form.courseId) {
      toast.error('Başlık ve kurs seçimi gerekli')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        videoUrl: form.videoUrl || undefined,
        videoType: form.videoType || undefined,
      }
      const url = editing ? `/api/lessons/${editing.id}` : '/api/lessons'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        toast.error(d.error ?? 'Hata oluştu')
        return
      }
      toast.success(editing ? 'Ders güncellendi' : 'Ders oluşturuldu')
      setModal(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Bu dersi silmek istediğinize emin misiniz?')) return
    const res = await fetch(`/api/lessons/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLessons(prev => prev.filter(l => l.id !== id))
      toast.success('Ders silindi')
    } else toast.error('Silme başarısız')
  }

  const filtered = filterCourse ? lessons.filter(l => l.courseId === filterCourse) : lessons

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-900">Dersler</h1>
        <button onClick={openCreate} className="btn-primary rounded-xl flex items-center gap-2">
          <Plus size={16} /> Yeni Ders
        </button>
      </div>

      <div className="mb-5">
        <select
          value={filterCourse}
          onChange={e => setFilterCourse(e.target.value)}
          className="input max-w-xs"
        >
          <option value="">Tüm Kurslar</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Başlık', 'Kurs', 'Bulmaca', 'Oyunlar', 'Durum', 'İşlem'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(l => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900 text-sm">{l.title}</p>
                    <div className="flex gap-1.5 mt-1">
                      {l.isOpening && <span className="badge bg-amber-100 text-amber-700 text-xs">Açılış</span>}
                      {l.videoUrl && <span className="badge bg-blue-100 text-blue-700 text-xs">Video</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{l.course.title}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{l._count.puzzles}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{l._count.famousGames}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${l.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {l.published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><Pencil size={14} /></button>
                      <button onClick={() => remove(l.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-400">Ders bulunamadı.</div>}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
              <h2 className="font-bold text-lg text-slate-900">{editing ? 'Dersi Düzenle' : 'Yeni Ders'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kurs *</label>
                <select
                  value={form.courseId}
                  onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
                  className="input"
                >
                  <option value="">Kurs seçin</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Başlık *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="input"
                  placeholder="Ders başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="input min-h-[80px] resize-none"
                  placeholder="Ders açıklaması"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Video Tipi</label>
                  <select value={form.videoType} onChange={e => setForm(f => ({ ...f, videoType: e.target.value }))} className="input">
                    <option value="youtube">YouTube</option>
                    <option value="cloudinary">Cloudinary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Sıra</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Video URL / ID</label>
                <input
                  value={form.videoUrl}
                  onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
                  className="input"
                  placeholder="YouTube video ID veya tam URL"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Yayında</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isOpening}
                    onChange={e => setForm(f => ({ ...f, isOpening: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-slate-700">Açılış Dersi</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200 sticky bottom-0 bg-white">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1 rounded-xl">İptal</button>
              <button
                onClick={save}
                disabled={saving}
                className="btn-primary flex-1 rounded-xl flex items-center justify-center gap-2"
              >
                {saving ? <span className="spinner" /> : <><Save size={14} />{editing ? 'Kaydet' : 'Oluştur'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
