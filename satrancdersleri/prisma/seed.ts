import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@satrancdersleri.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@satrancdersleri.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Demo user
  const userPassword = await bcrypt.hash('demo123', 12)
  await prisma.user.upsert({
    where: { email: 'demo@satrancdersleri.com' },
    update: {},
    create: {
      name: 'Demo Kullanıcı',
      email: 'demo@satrancdersleri.com',
      password: userPassword,
      role: 'USER',
    },
  })

  // Adult beginner course
  const beginnerCourse = await prisma.course.upsert({
    where: { slug: 'satranc-temelleri' },
    update: {},
    create: {
      title: 'Satranç Temelleri',
      slug: 'satranc-temelleri',
      description: 'Satrancın temel kurallarını, taş hareketlerini ve temel taktikleri öğrenin. Başlangıç seviyesi için ideal kurs.',
      type: 'ADULT',
      level: 'BEGINNER',
      published: true,
      order: 1,
    },
  })

  // Lessons for beginner course
  const lesson1 = await prisma.lesson.upsert({
    where: { slug: 'taslar-ve-hareketler' },
    update: {},
    create: {
      title: 'Taşlar ve Hareketleri',
      slug: 'taslar-ve-hareketler',
      description: 'Satrançtaki tüm taşların nasıl hareket ettiğini öğrenin: piyon, at, fil, kale, vezir ve şah.',
      content: '# Taşlar ve Hareketleri\n\nSatranç tahtası 8x8 kareden oluşur. Her oyuncu 16 taşla başlar...',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      order: 1,
      published: true,
      courseId: beginnerCourse.id,
    },
  })

  const lesson2 = await prisma.lesson.upsert({
    where: { slug: 'temel-mat-pozisyonlari' },
    update: {},
    create: {
      title: 'Temel Mat Pozisyonları',
      slug: 'temel-mat-pozisyonlari',
      description: 'Kale matı, iki kale matı ve vezir matı gibi temel mat pozisyonlarını öğrenin.',
      content: '# Temel Mat Pozisyonları\n\nMat vermek satrancın temel amacıdır...',
      order: 2,
      published: true,
      courseId: beginnerCourse.id,
    },
  })

  // Opening lesson
  const lesson3 = await prisma.lesson.upsert({
    where: { slug: 'italyan-acilisi' },
    update: {},
    create: {
      title: 'İtalyan Açılışı',
      slug: 'italyan-acilisi',
      description: 'Klasik bir açılış olan İtalyan Açılışını öğrenin ve ünlü oyunları analiz edin.',
      content: '# İtalyan Açılışı\n\n1.e4 e5 2.Af3 Ac6 3.Fc4 ile başlayan açılış...',
      isOpening: true,
      order: 3,
      published: true,
      courseId: beginnerCourse.id,
    },
  })

  // Famous games for opening lesson
  await prisma.famousGame.upsert({
    where: { id: 'evergreen-game' },
    update: {},
    create: {
      id: 'evergreen-game',
      title: 'Evergreen Oyunu',
      whitePlayer: 'Adolf Anderssen',
      blackPlayer: 'Jean Dufresne',
      year: 1852,
      result: '1-0',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7# 1-0',
      lessonId: lesson3.id,
      order: 1,
    },
  })

  // Puzzles for mat lesson
  await prisma.puzzle.upsert({
    where: { id: 'puzzle-1' },
    update: {},
    create: {
      id: 'puzzle-1',
      title: 'Kale Matı',
      description: 'Beyaz mat verir. Doğru hamleyi bulun!',
      fen: '8/8/8/8/8/k7/8/KR6 w - - 0 1',
      solution: ['Rb3#'],
      difficulty: 1,
      order: 1,
      lessonId: lesson2.id,
    },
  })

  await prisma.puzzle.upsert({
    where: { id: 'puzzle-2' },
    update: {},
    create: {
      id: 'puzzle-2',
      title: 'Vezir + Şah Matı',
      description: 'İki hamlede mat verin.',
      fen: '6k1/6p1/8/8/8/8/6PP/4K2Q w - - 0 1',
      solution: ['Qh7+', 'Qh8#'],
      difficulty: 2,
      order: 2,
      lessonId: lesson2.id,
    },
  })

  // Child course
  const childCourse = await prisma.course.upsert({
    where: { slug: 'cocuklar-icin-satranc' },
    update: {},
    create: {
      title: 'Çocuklar İçin Satranç',
      slug: 'cocuklar-icin-satranc',
      description: 'Eğlenceli ve interaktif derslerle çocuklar için satranç öğrenimi. Oyunlar ve bulmacalarla satranç öğren!',
      type: 'CHILD',
      level: 'BEGINNER',
      published: true,
      order: 2,
    },
  })

  await prisma.lesson.upsert({
    where: { slug: 'satranc-tahtasi-ve-taslar' },
    update: {},
    create: {
      title: 'Satranç Tahtası ve Taşlar',
      slug: 'satranc-tahtasi-ve-taslar',
      description: 'Satranç tahtasını ve taşları tanıyalım! Her taşın özel bir gücü var.',
      content: '# Merhaba Satranç Dünyasına!\n\nSatranç çok eğlenceli bir oyundur...',
      order: 1,
      published: true,
      courseId: childCourse.id,
    },
  })

  // Intermediate adult course
  await prisma.course.upsert({
    where: { slug: 'taktikler-ve-kombinasyonlar' },
    update: {},
    create: {
      title: 'Taktikler ve Kombinasyonlar',
      slug: 'taktikler-ve-kombinasyonlar',
      description: 'Çatal, iğne, fil+kale çifti gibi temel taktikleri ve güçlü kombinasyonları öğrenin.',
      type: 'ADULT',
      level: 'INTERMEDIATE',
      published: true,
      order: 3,
    },
  })

  console.log('Seed completed!')
  console.log(`Admin: admin@satrancdersleri.com / admin123`)
  console.log(`Demo:  demo@satrancdersleri.com / demo123`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
