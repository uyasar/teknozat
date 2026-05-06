import { prisma } from '@/lib/prisma'
import AdminLessonsClient from './AdminLessonsClient'

async function getData() {
  try {
    const [lessons, courses] = await Promise.all([
      prisma.lesson.findMany({
        include: { course: { select: { title: true } }, _count: { select: { puzzles: true, famousGames: true } } },
        orderBy: [{ courseId: 'asc' }, { order: 'asc' }],
      }),
      prisma.course.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    ])
    return { lessons, courses }
  } catch { return { lessons: [], courses: [] } }
}

export default async function AdminLessonsPage() {
  const { lessons, courses } = await getData()
  return <AdminLessonsClient initialLessons={lessons} courses={courses} />
}
