import { NextRequest, NextResponse } from 'next/server'
import { analyzeFullGame } from '@/lib/claude'
import { z } from 'zod'

const schema = z.object({
  pgn: z.string(),
  whitePlayer: z.string(),
  blackPlayer: z.string(),
  year: z.number().optional(),
  tournament: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pgn, ...gameInfo } = schema.parse(body)
    const analysis = await analyzeFullGame(pgn, gameInfo)
    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('AI game analyze error:', error)
    return NextResponse.json({ error: 'AI analiz hatası' }, { status: 500 })
  }
}
