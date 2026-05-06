import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileClient from '@/components/profile/ProfileClient'

async function getUserData(userId: string) {
  try {
    const [user, progress, puzzleSolves] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, boardTheme: true, createdAt: true, role: true },
      }),
      prisma.lessonProgress.findMany({
        where: { userId },
        include: { lesson: { select: { title: true, course: { select: { title: true } } } } },
      }),
      prisma.puzzleSolve.count({ where: { userId, solved: true } }),
    ])
    return { user, progress, puzzleSolves }
  } catch {
    return null
  }
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/giris')

  const data = await getUserData(session.user.id)
  if (!data?.user) redirect('/giris')

  const completedLessons = data.progress.filter(p => p.completed).length
  const totalLessons = data.progress.length

  return (
    <div className="section py-12">
      <ProfileClient
        user={data.user}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
        puzzlesSolved={data.puzzleSolves}
        progress={data.progress}
      />
    </div>
  )
}
