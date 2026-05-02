import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Settings, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SettingsModal from '../ui/SettingsModal'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Ana Sayfa' },
    { to: '/dersler', label: 'Dersler' },
    { to: '/cocuk', label: '♟ Çocuklar' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-surface-900 font-bold text-lg leading-none select-none">
              ♛
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Teknozat
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-accent bg-accent/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:block text-sm text-white/80">{user.name}</span>
                  <ChevronDown size={13} className="text-white/40" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-surface-800 border border-white/10 shadow-xl py-1 animate-fade-in">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        <Shield size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { setSettingsOpen(true); setUserMenuOpen(false) }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5"
                    >
                      <Settings size={14} />
                      Tahta Ayarları
                    </button>
                    <div className="divider my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5"
                    >
                      <LogOut size={14} />
                      Çıkış yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/giris" className="btn-ghost text-sm py-1.5">Giriş yap</Link>
                <Link to="/kayit" className="btn-primary text-sm py-1.5">Üye ol</Link>
              </>
            )}

            <button
              className="md:hidden btn-ghost p-2"
              onClick={() => setMenuOpen(p => !p)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-surface-900/95 px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-accent bg-accent/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
