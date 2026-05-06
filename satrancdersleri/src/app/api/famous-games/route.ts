import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const gameSchema = z.object({
  lessonId: z.string(),
  whitePlayer: z.string().min(1),
  blackPlayer: z.string().min(1),
  year: z.number().optional(),
  tournament: z.string().optional(),
  result: z.string().optional(),
  pgn: z.string().min(1),
  description: z.string().optional(),
  order: z.number().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = gameSchema.parse(body)
    const game = await prisma.famousGame.create({ data })
    return NextResponse.json({ game }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
