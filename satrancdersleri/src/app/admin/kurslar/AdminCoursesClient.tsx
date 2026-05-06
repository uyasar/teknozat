'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

type Course = {
  id: string; title: string; slug: string; description: string; type: string; level: string
  featured: boolean; published: boolean; order: number
  _count: { lessons: number; enrollments: number }
}

const EMPTY = { title: '', description: '', type: 'ADULT', level: 'BEGINNER', featured: false, published: false, order: 0 }
const levelLabel: Record<string, string> = { BEGINNER: 'Başlangıç', INTERMEDIATE: 'Orta', ADVANCED: 'İleri' }
const typeLabel: Record<string, string> = { ADULT: 'Yetişkin', CHILD: 'Çocuk' }

export default function AdminCoursesClient({ initialCourses }: { initialCourses: Course[] }) {
  const router = useRouter()
  const [courses, setCourses] = useState(initialCourses)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const openCreate = () => { setEditing(null); setForm(EMPTY as any); setModal(true) }
  const openEdit = (c: Course) => { setEditing(c); setForm({ title: c.title, description: c.description, type: c.type, level: c.level, featured: c.featured, published: c.published, order: c.order }); setModal(true) }

  const save = async () => {
    if (!form.title.trim()) { toast.error('Başlık gerekli'); return }
    setSaving(true)
    try {
      const url = editing ? `/api/courses/${editing.id}` : '/api/courses'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) { const d = await res.json(); toast.error(d.error ?? 'Hata'); return }
      toast.success(editing ? 'Kurs güncellendi' : 'Kurs oluşturuldu')
      setModal(false)
      router.refresh()
      const updated = await fetch('/api/courses?published=false').catch(() => null)
      if (updated) { const d = await updated.json(); setCourses(d.courses ?? courses) }
    } finally { setSaving(false) }
  }

  const remove = async (id: string) => {
    if (!confirm('Bu kursu silmek istediğinize emin misiniz?')) return
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
    if (res.ok) { setCourses(prev => prev.filter(c => c.id !== id)); toast.success('Kurs silindi') }
    else toast.error('Silme başarısız')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-900">Kurslar</h1>
        <button onClick={openCreate} className="btn-primary rounded-xl flex items-center gap-2">
          <Plus size={16} /> Yeni Kurs
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Başlık', 'Tür', 'Seviye', 'Dersler', 'Durum', 'İşlem'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900 text-sm">{c.title}</p>
                  <p className="text-xs text-slate-400">{c._count.enrollments} kayıt</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`badge ${c.type === 'CHILD' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {typeLabel[c.type]}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{levelLabel[c.level]}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{c._count.lessons}</td>
                <td className="px-5 py-4">
                  <span className={`badge ${c.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {c.published ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><Pencil size={14} /></button>
                    <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div className="text-center py-12 text-slate-400">Henüz kurs yok. Yeni kurs ekleyin.</div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="font-bold text-lg text-slate-900">{editing ? 'Kursu Düzenle' : 'Yeni Kurs'}</h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Başlık *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="Kurs başlığı" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Açıklama</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input min-h-[80px] resize-none" placeholder="Kurs açıklaması" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Tür</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input">
                    <option value="ADULT">Yetişkin</option>
                    <option value="CHILD">Çocuk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Seviye</label>
                  <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="input">
                    <option value="BEGINNER">Başlangıç</option>
                    <option value="INTERMEDIATE">Orta</option>
                    <option value="ADVANCED">İleri</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm text-slate-700">Yayında</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded" />
                  <span className="text-sm text-slate-700">Öne Çıkar</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1 rounded-xl">İptal</button>
              <button onClick={save} disabled={saving} className="btn-primary flex-1 rounded-xl flex items-center justify-center gap-2">
                {saving ? <span className="spinner" /> : <><Save size={14} />{editing ? 'Kaydet' : 'Oluştur'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
