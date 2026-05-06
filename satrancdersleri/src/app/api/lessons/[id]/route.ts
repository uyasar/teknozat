import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      course: { select: { id: true, title: true, slug: true, type: true } },
      puzzles: { orderBy: { order: 'asc' } },
      famousGames: { orderBy: { order: 'asc' } },
    },
  })

  if (!lesson) {
    return NextResponse.json({ error: 'Ders bulunamadı' }, { status: 404 })
  }

  return NextResponse.json({ lesson })
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

  const lesson = await prisma.lesson.update({
    where: { id },
    data: { ...body, ...(slug ? { slug } : {}) },
  })

  return NextResponse.json({ lesson })
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
  await prisma.lesson.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
