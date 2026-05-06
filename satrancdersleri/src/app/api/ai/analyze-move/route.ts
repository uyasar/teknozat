import { NextRequest, NextResponse } from 'next/server'
import { analyzeChessMove } from '@/lib/claude'
import { z } from 'zod'

const schema = z.object({
  fen: z.string(),
  move: z.string(),
  pgn: z.string(),
  moveNumber: z.number(),
  isCorrectMove: z.boolean(),
  expectedMove: z.string().optional(),
  gameContext: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const params = schema.parse(body)
    const analysis = await analyzeChessMove(params)
    return NextResponse.json({ analysis })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Geçersiz parametre' }, { status: 400 })
    }
    console.error('AI analyze error:', error)
    return NextResponse.json({ error: 'AI analiz hatası' }, { status: 500 })
  }
}
