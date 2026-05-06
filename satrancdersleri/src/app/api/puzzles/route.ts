import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const puzzleSchema = z.object({
  lessonId: z.string(),
  fen: z.string().min(1),
  solution: z.array(z.string()),
  hint: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
  order: z.number().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = puzzleSchema.parse(body)
    const puzzle = await prisma.puzzle.create({ data })
    return NextResponse.json({ puzzle }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
