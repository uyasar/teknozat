import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login({ isRegister = false }) {
  const { login, user, error, loading } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [showPw,   setShowPw]   = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <main className="pt-16 min-h-screen flex items-center justify-center px-4 py-12"
      style={{background:'linear-gradient(170deg,#f0fdf4 0%,#f7f6f3 50%)'}}>

      <div className="w-full max-w-sm animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-5 select-none"
            style={{
              background: 'linear-gradient(135deg,#166534,#15803d)',
              boxShadow: '0 8px 24px rgba(22,101,52,.25), 0 2px 6px rgba(0,0,0,.08)',
            }}>
            ♛
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900 mb-1.5">
            {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
          </h1>
          <p className="text-stone-500 text-sm">
            {isRegister
              ? 'Ücretsiz hesap oluşturun ve öğrenmeye başlayın.'
              : 'Hesabınıza erişerek öğrenmeye devam edin.'}
          </p>
        </div>

        {/* Form card */}
        <div className="card space-y-4">
          {isRegister && (
            <div>
              <label className="label">Ad Soyad</label>
              <input
                className="input"
                type="text"
                placeholder="Ali Yılmaz"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="label">E-posta</label>
            <input
              className="input"
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Şifre</label>
            <div className="relative">
              <input
                className="input pr-12"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button type="submit" onClick={handleSubmit} disabled={loading}
            className="btn-primary w-full justify-center mt-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                İşleniyor...
              </span>
            ) : isRegister ? (
              <><UserPlus size={15} /> Üye Ol</>
            ) : (
              <><LogIn size={15} /> Giriş Yap</>
            )}
          </button>
        </div>

        {/* Toggle link */}
        <div className="text-center mt-5 text-sm text-stone-500">
          {isRegister ? (
            <>Zaten hesabınız var mı?{' '}
              <Link to="/giris" className="text-chess font-semibold hover:underline">Giriş yap</Link>
            </>
          ) : (
            <>Hesabınız yok mu?{' '}
              <Link to="/kayit" className="text-chess font-semibold hover:underline">Ücretsiz üye ol</Link>
            </>
          )}
        </div>

        {/* Demo credentials */}
        <div className="mt-6 rounded-xl border border-stone-200 px-4 py-3.5 text-xs text-stone-500 space-y-1.5"
          style={{background:'#fafaf9'}}>
          <p className="font-semibold text-stone-700 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-chess inline-block" />
            Demo hesaplar:
          </p>
          <p className="font-mono text-stone-600">user@demo.com / demo123</p>
          <p className="font-mono text-stone-600">admin@demo.com / admin123</p>
        </div>
      </div>
    </main>
  )
}
