import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BookOpen, ChevronRight } from 'lucide-react'

async function getOpeningLessons() {
  try {
    return await prisma.lesson.findMany({
      where: { isOpening: true, published: true },
      include: {
        course: { select: { title: true, slug: true } },
        famousGames: { select: { id: true, whitePlayer: true, blackPlayer: true, year: true }, orderBy: { order: 'asc' }, take: 3 },
        _count: { select: { famousGames: true } },
      },
      orderBy: { order: 'asc' },
    })
  } catch { return [] }
}

export default async function OpeningsPage() {
  const openings = await getOpeningLessons()

  return (
    <div>
      {/* Header */}
      <div className="bg-slate-900 py-16">
        <div className="section text-center">
          <div className="text-6xl mb-4">♟</div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">Açılış Ansiklopedisi</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Satranç tarihinin en önemli açılışlarını öğrenin. Her açılış için ünlü oyunlar ve AI analizi.
          </p>
        </div>
      </div>

      <div className="section py-12">
        {openings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {openings.map((opening) => (
              <Link key={opening.id} href={`/dersler/${opening.id}`}
                className="card-hover group p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold">♟</div>
                  <span className="badge bg-amber-100 text-amber-700 text-xs">
                    {opening._count.famousGames} Oyun
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-amber-600 transition-colors">{opening.title}</h3>
                <p className="text-xs text-slate-400 mb-4">{opening.course.title}</p>

                {opening.famousGames.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    {opening.famousGames.map(g => (
                      <p key={g.id} className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        {g.whitePlayer} vs {g.blackPlayer}
                        {g.year && <span className="text-slate-400">({g.year})</span>}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <BookOpen size={12} /> İncele <ChevronRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">♟</div>
            <h2 className="font-display font-bold text-2xl text-slate-700 mb-2">Açılış dersleri yakında!</h2>
            <p className="text-slate-400">Çok yakında kapsamlı açılış dersleri eklenecek.</p>
          </div>
        )}
      </div>
    </div>
  )
}
