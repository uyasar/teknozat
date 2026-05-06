import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function analyzeChessMove(params: {
  fen: string
  move: string
  pgn: string
  moveNumber: number
  isCorrectMove: boolean
  expectedMove?: string
  gameContext?: string
}): Promise<string> {
  const { fen, move, pgn, moveNumber, isCorrectMove, expectedMove, gameContext } = params

  const systemPrompt = `Sen bir satranç uzmanısın. Pozisyonları Türkçe olarak açıklayacaksın.
Kısa, anlaşılır ve eğitici cevaplar ver. Maksimum 3-4 cümle.`

  const userMessage = isCorrectMove
    ? `Satranç pozisyonu: ${fen}
Oyun: ${pgn.slice(0, 200)}
${gameContext ? `Bağlam: ${gameContext}` : ''}

${moveNumber}. hamle: ${move} yapıldı.
Bu hamlenin amacını ve stratejik önemini kısaca açıkla.`
    : `Satranç pozisyonu: ${fen}
Beklenen hamle: ${expectedMove}
Yapılan hamle: ${move}

Oyuncu yanlış hamle yaptı. Neden ${expectedMove} daha iyi bir hamle?
${move} hamlesiyle ne kaybediliyor? Kısaca açıkla.`

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 300,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  return (message.content[0] as { type: string; text: string }).text
}

export async function analyzeFullGame(pgn: string, gameInfo: {
  whitePlayer: string
  blackPlayer: string
  year?: number
  tournament?: string
}): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 800,
    system: 'Sen bir satranç uzmanısın. Oyunları Türkçe olarak analiz et. Akıcı, eğitici ve ilgi çekici yaz.',
    messages: [{
      role: 'user',
      content: `Bu ünlü satranç oyununu analiz et:
Beyaz: ${gameInfo.whitePlayer}
Siyah: ${gameInfo.blackPlayer}
${gameInfo.year ? `Yıl: ${gameInfo.year}` : ''}
${gameInfo.tournament ? `Turnuva: ${gameInfo.tournament}` : ''}

PGN: ${pgn.slice(0, 500)}

Oyunun genel stratejisini, önemli noktalarını ve neden tarihi bir oyun olduğunu açıkla.`,
    }],
  })

  return (message.content[0] as { type: string; text: string }).text
}
