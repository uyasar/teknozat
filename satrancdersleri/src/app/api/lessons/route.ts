import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const lessonSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  videoType: z.string().optional(),
  order: z.number().optional(),
  published: z.boolean().optional(),
  isOpening: z.boolean().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  const lessons = await prisma.lesson.findMany({
    where: {
      ...(courseId ? { courseId } : {}),
      published: true,
    },
    include: {
      _count: { select: { puzzles: true, famousGames: true } },
    },
    orderBy: [{ order: 'asc' }],
  })

  return NextResponse.json({ lessons })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = lessonSchema.parse(body)
    const slug = slugify(data.title)

    const lesson = await prisma.lesson.create({
      data: { ...data, slug },
    })

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
