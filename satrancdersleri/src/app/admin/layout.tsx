import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LayoutDashboard, BookOpen, GraduationCap, Users, Crown } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kurslar', label: 'Kurslar', icon: GraduationCap },
  { href: '/admin/dersler', label: 'Dersler', icon: BookOpen },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/')

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <Crown size={18} className="text-amber-400" />
            <span className="text-white">Admin <span className="text-amber-400">Paneli</span></span>
          </Link>
          <p className="text-xs text-slate-400 mt-1 truncate">{session.user.email}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors px-4 py-2">
            ← Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
