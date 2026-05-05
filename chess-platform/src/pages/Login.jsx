import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login({ isRegister = false }) {
  const { login, user, error, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPw, setShowPw] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <main className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold flex items-center justify-center text-bg-base text-3xl mx-auto mb-4">♛</div>
          <h1 className="font-display font-bold text-2xl mb-1">
            {isRegister ? 'Üye Ol' : 'Giriş Yap'}
          </h1>
          <p className="text-white/40 text-sm">
            {isRegister ? 'Hesap oluşturun ve öğrenmeye başlayın.' : 'Hesabınıza erişin.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {isRegister && (
            <div>
              <label className="label">Ad Soyad</label>
              <input className="input" type="text" placeholder="Ali Yılmaz" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div>
            <label className="label">E-posta</label>
            <input className="input" type="email" placeholder="ornek@mail.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Şifre</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-surface-900/40 border-t-surface-900 rounded-full animate-spin" />
                Giriş yapılıyor...
              </span>
            ) : (
              <><LogIn size={15} /> {isRegister ? 'Üye Ol' : 'Giriş Yap'}</>
            )}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-white/40">
          {isRegister ? (
            <>Zaten hesabınız var mı? <Link to="/giris" className="text-gold hover:underline">Giriş yap</Link></>
          ) : (
            <>Hesabınız yok mu? <Link to="/kayit" className="text-gold hover:underline">Üye ol</Link></>
          )}
        </div>

        <div className="mt-6 rounded-lg bg-white/3 border border-white/5 px-4 py-3 text-xs text-white/30 space-y-1">
          <p className="font-medium text-white/40">Demo hesaplar:</p>
          <p>user@demo.com / demo123</p>
          <p>admin@demo.com / admin123</p>
        </div>
      </div>
    </main>
  )
}
