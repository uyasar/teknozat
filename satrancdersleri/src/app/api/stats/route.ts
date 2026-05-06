import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [userCount, lessonCount, courseCount, puzzleCount] = await Promise.all([
    prisma.user.count(),
    prisma.lesson.count({ where: { published: true } }),
    prisma.course.count({ where: { published: true } }),
    prisma.puzzle.count(),
  ])

  return NextResponse.json({ userCount, lessonCount, courseCount, puzzleCount })
}
