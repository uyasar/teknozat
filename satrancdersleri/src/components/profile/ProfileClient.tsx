'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { User, Trophy, BookOpen, Puzzle, Palette, CheckCircle } from 'lucide-react'

const THEMES = [
  { id: 'CLASSIC', label: 'Klasik', light: '#f0d9b5', dark: '#b58863' },
  { id: 'GREEN', label: 'Yeşil', light: '#ffffdd', dark: '#86a666' },
  { id: 'BLUE', label: 'Mavi', light: '#dee3e6', dark: '#8ca2ad' },
  { id: 'NIGHT', label: 'Gece', light: '#4d4d4d', dark: '#1a1a1a' },
  { id: 'PINK', label: 'Pembe', light: '#fce4ec', dark: '#e91e63' },
]

interface Props {
  user: { id: string; name: string | null; email: string | null; boardTheme: string; createdAt: Date; role: string }
  completedLessons: number
  totalLessons: number
  puzzlesSolved: number
  progress: Array<{ completed: boolean; lesson: { title: string; course: { title: string } } }>
}

export default function ProfileClient({ user, completedLessons, totalLessons, puzzlesSolved, progress }: Props) {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState(user.boardTheme)
  const [saving, setSaving] = useState(false)

  const saveTheme = async (themeId: string) => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      })
      if (res.ok) {
        setSelectedTheme(themeId)
        toast.success('Tema kaydedildi!')
        router.refresh()
      }
    } finally { setSaving(false) }
  }

  const stats = [
    { icon: BookOpen, label: 'Tamamlanan Ders', value: completedLessons, color: 'text-amber-500' },
    { icon: Trophy, label: 'Toplam Ders', value: totalLessons, color: 'text-blue-500' },
    { icon: Puzzle, label: 'Çözülen Bulmaca', value: puzzlesSolved, color: 'text-emerald-500' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile header */}
      <div className="card p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold shrink-0">
          {user.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">{user.name ?? 'Kullanıcı'}</h1>
          <p className="text-slate-500">{user.email}</p>
          <div className="flex items-center gap-2 mt-2">
            {user.role === 'ADMIN' && (
              <span className="badge bg-amber-100 text-amber-700">👑 Admin</span>
            )}
            <span className="badge bg-slate-100 text-slate-600">
              Üye: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <Icon size={22} className={`${color} mx-auto mb-2`} />
            <div className="font-display font-bold text-2xl text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Board theme selector */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Palette size={18} className="text-amber-500" />
          <h2 className="font-bold text-slate-900">Tahta Teması</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {THEMES.map(({ id, label, light, dark }) => (
            <button key={id} onClick={() => saveTheme(id)} disabled={saving}
              className={`relative rounded-xl overflow-hidden border-2 transition-all
                ${selectedTheme === id ? 'border-amber-500 scale-105' : 'border-transparent hover:border-slate-300'}`}>
              <div className="grid grid-cols-2 aspect-square">
                <div style={{ background: light }} />
                <div style={{ background: dark }} />
                <div style={{ background: dark }} />
                <div style={{ background: light }} />
              </div>
              {selectedTheme === id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <CheckCircle size={16} className="text-white" />
                </div>
              )}
              <p className="text-center text-xs py-1.5 bg-white font-medium text-slate-700">{label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {progress.length > 0 && (
        <div className="card p-6">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <BookOpen size={18} className="text-amber-500" /> Ders İlerlememiz
          </h2>
          <div className="space-y-3">
            {progress.slice(0, 10).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                  ${p.completed ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  {p.completed && <CheckCircle size={12} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{p.lesson.title}</p>
                  <p className="text-xs text-slate-400 truncate">{p.lesson.course.title}</p>
                </div>
                <span className={`badge text-xs ${p.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.completed ? 'Tamamlandı' : 'Devam ediyor'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
