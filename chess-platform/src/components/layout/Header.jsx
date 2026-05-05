import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Settings, LogOut, LayoutDashboard, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SettingsModal from '../ui/SettingsModal'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropOpen,   setDropOpen]   = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dropRef = useRef(null)

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const onMouse = (e) => { if (!dropRef.current?.contains(e.target)) setDropOpen(false) }
    const onKey   = (e) => {
      if (e.key === 'Escape') { setDropOpen(false); setMobileOpen(false) }
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const navLinks = [
    { to: '/',          label: 'Ana Sayfa', end: true },
    { to: '/dersler',   label: 'Dersler' },
    { to: '/acilislar', label: 'Açılışlar' },
    { to: '/cocuk',     label: '♟ Çocuklar' },
  ]

  const navCls = (active) =>
    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center
     ${active ? 'text-gold bg-gold/8' : 'text-white/55 hover:text-white hover:bg-white/5'}`

  const dropItemCls = 'flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors min-h-[48px]'

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-bg-base/85 backdrop-blur-xl border-b border-white/5">
        <div className="section h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center
              text-bg-base font-bold text-lg select-none group-hover:bg-gold-light transition-colors">
              ♛
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight">satrancdersleri</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) => navCls(isActive)}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(p => !p)}
                  aria-expanded={dropOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl
                    hover:bg-white/5 transition-colors min-h-[44px]"
                >
                  <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/25
                    flex items-center justify-center text-gold text-xs font-bold shrink-0">
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:block text-sm text-white/70 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl
                    bg-bg-elevated border border-white/8 shadow-2xl shadow-black/40
                    py-1.5 animate-fade-in z-50">
                    <Link to="/dashboard" onClick={() => setDropOpen(false)}
                      className={`${dropItemCls} text-white/60 hover:text-white hover:bg-white/5`}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropOpen(false)}
                        className={`${dropItemCls} text-white/60 hover:text-white hover:bg-white/5`}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { setSettingsOpen(true); setDropOpen(false) }}
                      className={`${dropItemCls} text-white/60 hover:text-white hover:bg-white/5`}
                    >
                      <Settings size={15} /> Tahta Ayarları
                    </button>
                    <div className="hr my-1.5" />
                    <button
                      onClick={() => { logout(); navigate('/'); setDropOpen(false) }}
                      className={`${dropItemCls} text-red-400/70 hover:text-red-400 hover:bg-red-500/5`}
                    >
                      <LogOut size={15} /> Çıkış yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/giris" className="btn-ghost px-4 py-2">Giriş</Link>
                <Link to="/kayit" className="btn-primary px-4 py-2">Üye ol</Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className="btn-icon md:hidden"
              onClick={() => setMobileOpen(p => !p)}
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-white/5 bg-bg-base/95
            px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => navCls(isActive)}>
                {label}
              </NavLink>
            ))}
            {!user && (
              <div className="flex gap-2 pt-2">
                <Link to="/giris" onClick={() => setMobileOpen(false)}
                  className="btn-secondary flex-1 justify-center">Giriş</Link>
                <Link to="/kayit" onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 justify-center">Üye ol</Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
