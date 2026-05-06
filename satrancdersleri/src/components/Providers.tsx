'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans text-sm',
          style: {
            background: '#0F172A',
            color: '#F8FAFC',
            borderRadius: '12px',
          },
        }}
      />
    </SessionProvider>
  )
}
