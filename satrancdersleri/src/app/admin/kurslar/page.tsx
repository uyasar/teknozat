import { prisma } from '@/lib/prisma'
import AdminCoursesClient from './AdminCoursesClient'

async function getCourses() {
  try {
    return await prisma.course.findMany({
      include: { _count: { select: { lessons: true, enrollments: true } } },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
  } catch { return [] }
}

export default async function AdminCoursesPage() {
  const courses = await getCourses()
  return <AdminCoursesClient initialCourses={courses} />
}
