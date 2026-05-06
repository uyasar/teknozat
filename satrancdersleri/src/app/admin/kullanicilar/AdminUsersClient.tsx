'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Crown, User } from 'lucide-react'

type UserRow = {
  id: string
  name: string | null
  email: string | null
  role: string
  boardTheme: string
  createdAt: Date
  _count: { enrollments: number; puzzleSolves: number }
}

export default function AdminUsersClient({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState(initialUsers)

  const toggleRole = async (user: UserRow) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
    if (!confirm(`${user.name ?? user.email} kullanıcısının rolünü ${newRole} yapmak istediğinize emin misiniz?`)) return
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
      toast.success('Rol güncellendi')
    } else toast.error('Rol değiştirilemedi')
  }

  const remove = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('Kullanıcı silindi')
    } else toast.error('Silme başarısız')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-slate-900">Kullanıcılar</h1>
        <span className="badge bg-slate-100 text-slate-700">{users.length} kullanıcı</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Kullanıcı', 'Rol', 'Kurs', 'Bulmaca', 'Kayıt Tarihi', 'İşlem'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{u.name ?? '-'}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                      {u.role === 'ADMIN' ? '👑 Admin' : 'Kullanıcı'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{u._count.enrollments}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{u._count.puzzleSolves}</td>
                  <td className="px-5 py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRole(u)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600"
                        title="Rol değiştir"
                      >
                        {u.role === 'ADMIN' ? <User size={14} /> : <Crown size={14} />}
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-center py-12 text-slate-400">Kullanıcı yok.</div>}
        </div>
      </div>
    </div>
  )
}
