import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: {
        where: { published: true },
        orderBy: { order: 'asc' },
        select: { id: true, title: true, slug: true, order: true, videoUrl: true },
      },
      _count: { select: { enrollments: true } },
    },
  })

  if (!course) {
    return NextResponse.json({ error: 'Kurs bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ course })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  const { id } = await params
  const body = await req.json()
  const slug = body.title ? slugify(body.title) : undefined

  const course = await prisma.course.update({
    where: { id },
    data: { ...body, ...(slug ? { slug } : {}) },
  })

  return NextResponse.json({ course })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }
  const { id } = await params
  await prisma.course.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
