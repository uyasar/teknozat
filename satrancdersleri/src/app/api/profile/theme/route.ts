import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Giriş yapın' }, { status: 401 })
  }

  const { theme } = await req.json()
  const validThemes = ['CLASSIC', 'GREEN', 'BLUE', 'NIGHT', 'PINK']
  if (!validThemes.includes(theme)) {
    return NextResponse.json({ error: 'Geçersiz tema' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { boardTheme: theme },
    select: { boardTheme: true },
  })

  return NextResponse.json({ boardTheme: user.boardTheme })
}
