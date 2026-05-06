'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { BookOpen, Play, Trophy, Puzzle } from 'lucide-react'
import dynamic from 'next/dynamic'

const GameAnalyzer = dynamic(() => import('@/components/chess/GameAnalyzer'), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-slate-400">Yükleniyor...</div> })
const PuzzleBoard = dynamic(() => import('@/components/chess/PuzzleBoard'), { ssr: false, loading: () => <div className="h-64 flex items-center justify-center text-slate-400">Yükleniyor...</div> })

interface LessonData {
  id: string
  title: string
  description: string | null
  videoUrl: string | null
  videoType: string | null
  isOpening: boolean
  puzzles: Array<{
    id: string
    fen: string
    solution: string[]
    hint: string | null
    description: string | null
    difficulty: number
  }>
  famousGames: Array<{
    id: string
    whitePlayer: string
    blackPlayer: string
    year: number | null
    tournament: string | null
    result: string | null
    pgn: string
    description: string | null
  }>
}

const TABS = [
  { id: 'description', label: 'Açıklama', icon: BookOpen },
  { id: 'video', label: 'Video', icon: Play },
  { id: 'games', label: 'Ünlü Maçlar', icon: Trophy },
  { id: 'puzzles', label: 'Bulmacalar', icon: Puzzle },
]

export default function LessonTabs({ lesson }: { lesson: LessonData }) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('description')
  const [selectedGame, setSelectedGame] = useState<LessonData['famousGames'][0] | null>(null)
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set())

  const boardTheme = (session?.user as any)?.boardTheme ?? 'CLASSIC'

  const visibleTabs = TABS.filter(t => {
    if (t.id === 'video' && !lesson.videoUrl) return false
    if (t.id === 'games' && lesson.famousGames.length === 0) return false
    if (t.id === 'puzzles' && lesson.puzzles.length === 0) return false
    return true
  })

  const handlePuzzleSolved = async (puzzleId: string) => {
    setSolvedPuzzles(prev => new Set([...prev, puzzleId]))
    if (session?.user?.id) {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, completed: false }),
      }).catch(() => {})
    }
  }

  return (
    <div>
      {/* Tab nav */}
      <div className="flex gap-1 mb-8 border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => { setActiveTab(id); setSelectedGame(null) }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap
              ${activeTab === id
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'}`}>
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'description' && (
        <div className="max-w-3xl">
          {lesson.description ? (
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
              {lesson.description}
            </div>
          ) : (
            <p className="text-slate-400 italic">Bu ders için açıklama eklenmemiş.</p>
          )}
        </div>
      )}

      {activeTab === 'video' && lesson.videoUrl && (
        <div className="max-w-4xl">
          {lesson.videoType === 'youtube' ? (
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <iframe
                src={`https://www.youtube.com/embed/${lesson.videoUrl}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900">
              <video src={lesson.videoUrl} controls className="w-full h-full" />
            </div>
          )}
        </div>
      )}

      {activeTab === 'games' && (
        <div>
          {selectedGame ? (
            <div>
              <button onClick={() => setSelectedGame(null)} className="btn-ghost mb-4 text-sm">
                ← Tüm maçlar
              </button>
              <GameAnalyzer game={selectedGame} boardTheme={boardTheme} />
            </div>
          ) : (
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Ünlü Oyunlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lesson.famousGames.map((g) => (
                  <button key={g.id} onClick={() => setSelectedGame(g)}
                    className="card-hover p-5 text-left group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-bold">♔</div>
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-xs font-bold text-white">♚</div>
                      {g.result && <span className="badge bg-slate-100 text-slate-700 ml-auto">{g.result}</span>}
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {g.whitePlayer} vs {g.blackPlayer}
                    </h3>
                    {g.year && <p className="text-xs text-slate-500 mt-1">{g.year}{g.tournament ? ` · ${g.tournament}` : ''}</p>}
                    {g.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{g.description}</p>}
                    <p className="text-xs text-amber-500 font-medium mt-3 group-hover:underline">Oyunu İncele →</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'puzzles' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-900">Bulmacalar</h2>
            <p className="text-sm text-slate-500">{solvedPuzzles.size} / {lesson.puzzles.length} çözüldü</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lesson.puzzles.map((puzzle, i) => (
              <div key={puzzle.id} className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="font-semibold text-slate-900 text-sm">Bulmaca {i + 1}</span>
                  {solvedPuzzles.has(puzzle.id) && (
                    <span className="badge bg-emerald-100 text-emerald-700 ml-auto">✓ Çözüldü</span>
                  )}
                </div>
                <PuzzleBoard puzzle={puzzle} boardTheme={boardTheme} onSolved={handlePuzzleSolved} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
