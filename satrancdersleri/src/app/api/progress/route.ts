import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Giriş yapın' }, { status: 401 })
  }

  const progress = await prisma.lessonProgress.findMany({
    where: { userId: session.user.id },
    include: {
      lesson: {
        select: { title: true, courseId: true, course: { select: { title: true } } },
      },
    },
  })

  return NextResponse.json({ progress })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Giriş yapın' }, { status: 401 })
  }

  const { lessonId, completed, watchTime } = await req.json()

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId } },
    update: {
      completed: completed ?? false,
      watchTime: watchTime ?? 0,
      ...(completed ? { completedAt: new Date() } : {}),
    },
    create: {
      userId: session.user.id,
      lessonId,
      completed: completed ?? false,
      watchTime: watchTime ?? 0,
      ...(completed ? { completedAt: new Date() } : {}),
    },
  })

  return NextResponse.json({ progress })
}
