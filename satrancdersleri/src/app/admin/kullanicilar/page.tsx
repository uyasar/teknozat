import { prisma } from '@/lib/prisma'
import AdminUsersClient from './AdminUsersClient'

async function getUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        boardTheme: true,
        createdAt: true,
        _count: { select: { enrollments: true, puzzleSolves: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers()
  return <AdminUsersClient initialUsers={users} />
}
