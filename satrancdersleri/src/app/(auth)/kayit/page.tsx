'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçerli bir email girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error ?? 'Kayıt başarısız'); return }
      await signIn('credentials', { email: data.email, password: data.password, redirect: false })
      toast.success('Hoş geldiniz!')
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl text-white mb-6">
            <span className="text-3xl">♔</span>
            <span>Satranç <span className="text-amber-400">Dersleri</span></span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Üye Ol</h1>
          <p className="text-slate-400 text-sm">Ücretsiz hesap oluştur ve hemen başla</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Ad Soyad</label>
              <input {...register('name')} type="text" placeholder="Adınız Soyadınız" className="input" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input {...register('email')} type="email" placeholder="ornek@email.com" className="input" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Şifre</label>
              <div className="relative">
                <input {...register('password')} type={showPass ? 'text' : 'password'} placeholder="En az 6 karakter" className="input pr-12" />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Şifre Tekrar</label>
              <input {...register('confirmPassword')} type={showPass ? 'text' : 'password'} placeholder="Şifrenizi tekrar girin" className="input" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl justify-center">
              {loading ? <span className="spinner" /> : <>Hesap Oluştur <ArrowRight size={16} /></>}
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Zaten hesabın var mı?{' '}
            <Link href="/giris" className="text-amber-600 font-semibold hover:text-amber-700">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
