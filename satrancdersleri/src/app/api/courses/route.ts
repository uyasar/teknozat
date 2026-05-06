import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['ADULT', 'CHILD']),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  thumbnail: z.string().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  order: z.number().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const featured = searchParams.get('featured')

  const courses = await prisma.course.findMany({
    where: {
      ...(type ? { type: type as any } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
      published: true,
    },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json({ courses })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = courseSchema.parse(body)
    const slug = slugify(data.title)

    const course = await prisma.course.create({
      data: { ...data, slug },
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
