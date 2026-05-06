import { prisma } from '@/lib/prisma'
import { Users, BookOpen, GraduationCap, Puzzle } from 'lucide-react'

async function getStats() {
  try {
    const [users, lessons, courses, puzzles] = await Promise.all([
      prisma.user.count(),
      prisma.lesson.count(),
      prisma.course.count(),
      prisma.puzzle.count(),
    ])
    return { users, lessons, courses, puzzles }
  } catch { return { users: 0, lessons: 0, courses: 0, puzzles: 0 } }
}

async function getRecentUsers() {
  try {
    return await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, role: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
  } catch { return [] }
}

export default async function AdminDashboard() {
  const [stats, recentUsers] = await Promise.all([getStats(), getRecentUsers()])

  const cards = [
    { icon: Users, label: 'Toplam Kullanıcı', value: stats.users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: GraduationCap, label: 'Toplam Kurs', value: stats.courses, color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: BookOpen, label: 'Toplam Ders', value: stats.lessons, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Puzzle, label: 'Toplam Bulmaca', value: stats.puzzles, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card p-6">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={20} className={color} />
            </div>
            <div className="font-display font-bold text-3xl text-slate-900">{value}</div>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-slate-900 mb-5">Son Üyeler</h2>
        <div className="space-y-3">
          {recentUsers.map(u => (
            <div key={u.id} className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {u.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{u.name ?? 'Kullanıcı'}</p>
                <p className="text-xs text-slate-400 truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                {u.role === 'ADMIN' && <span className="badge bg-amber-100 text-amber-700 text-xs">Admin</span>}
                <span className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
