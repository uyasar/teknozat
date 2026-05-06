import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Settings, LogOut, LayoutDashboard, Shield, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SettingsModal from '../ui/SettingsModal'

export default function Header() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [dropOpen,   setDropOpen]     = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => { if (!dropRef.current?.contains(e.target)) setDropOpen(false) }
    const onKey   = (e) => { if (e.key === 'Escape') { setDropOpen(false); setMobileOpen(false) } }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown',   onKey)
    return () => { document.removeEventListener('mousedown', onMouse); document.removeEventListener('keydown', onKey) }
  }, [])

  const navLinks = [
    { to: '/',          label: 'Ana Sayfa',  end: true },
    { to: '/dersler',   label: 'Dersler' },
    { to: '/acilislar', label: 'Açılışlar' },
    { to: '/cocuk',     label: 'Çocuklar' },
  ]

  const navCls = (active) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px] flex items-center
     ${active
       ? 'text-chess bg-chess-subtle font-semibold'
       : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
     }`

  const dropItemCls = 'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left'

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-stone-200"
        style={{boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
        <div className="section h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xl select-none"
              style={{background:'linear-gradient(135deg,#166534,#15803d)',boxShadow:'0 2px 8px rgba(22,101,52,.3)'}}>
              ♛
            </div>
            <div className="leading-none">
              <span className="font-display font-bold text-[15px] tracking-tight text-stone-900 block">
                satrançdersleri
              </span>
              <span className="text-[10px] text-stone-400 font-sans tracking-wide uppercase">
                chess academy
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 ml-4">
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
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors min-h-[44px]"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{background:'linear-gradient(135deg,#166534,#15803d)'}}>
                    {user.name[0]}
                  </div>
                  <span className="hidden sm:block text-sm text-stone-700 max-w-[100px] truncate font-medium">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} className={`hidden sm:block text-stone-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white
                    border border-stone-200 shadow-xl py-1.5 animate-fade-in z-50">
                    <Link to="/dashboard" onClick={() => setDropOpen(false)}
                      className={`${dropItemCls} text-stone-600 hover:text-stone-900 hover:bg-stone-50`}>
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setDropOpen(false)}
                        className={`${dropItemCls} text-stone-600 hover:text-stone-900 hover:bg-stone-50`}>
                        <Shield size={15} /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { setSettingsOpen(true); setDropOpen(false) }}
                      className={`${dropItemCls} text-stone-600 hover:text-stone-900 hover:bg-stone-50`}
                    >
                      <Settings size={15} /> Tahta Ayarları
                    </button>
                    <div className="hr my-1" />
                    <button
                      onClick={() => { logout(); navigate('/'); setDropOpen(false) }}
                      className={`${dropItemCls} text-red-600 hover:text-red-700 hover:bg-red-50`}
                    >
                      <LogOut size={15} /> Çıkış yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/giris" className="btn-ghost px-4 py-2 text-sm">Giriş</Link>
                <Link to="/kayit" className="btn-primary px-5 py-2.5 text-sm">Üye Ol</Link>
              </>
            )}

            {/* Hamburger */}
            <button
              className="btn-icon md:hidden text-stone-600"
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
          <nav className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-1 animate-fade-in">
            {navLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => navCls(isActive)}>
                {label}
              </NavLink>
            ))}
            {!user && (
              <div className="flex gap-2 pt-3 border-t border-stone-100 mt-2">
                <Link to="/giris" onClick={() => setMobileOpen(false)}
                  className="btn-secondary flex-1 justify-center text-sm">Giriş</Link>
                <Link to="/kayit" onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 justify-center text-sm">Üye Ol</Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}
