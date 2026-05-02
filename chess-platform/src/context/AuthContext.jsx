import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'user@demo.com': { id: 1, name: 'Demo Kullanıcı', email: 'user@demo.com', role: 'user', password: 'demo123' },
  'admin@demo.com': { id: 2, name: 'Admin', email: 'admin@demo.com', role: 'admin', password: 'admin123' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('chess_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    await new Promise(r => setTimeout(r, 600))

    const found = DEMO_USERS[email]
    if (found && found.password === password) {
      const { password: _, ...safe } = found
      setUser(safe)
      localStorage.setItem('chess_user', JSON.stringify(safe))
      setLoading(false)
      return true
    }

    setError('E-posta veya şifre hatalı.')
    setLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('chess_user')
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, error, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
