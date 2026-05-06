import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// One-time setup endpoint — only runs if database is empty
export async function GET() { return POST() }

export async function POST() {
  const existingUser = await prisma.user.findFirst()
  if (existingUser) {
    return NextResponse.json({ error: 'Veritabanı zaten kurulu' }, { status: 400 })
  }

  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@satrancdersleri.com', password: adminPassword, role: 'ADMIN' },
  })

  await prisma.user.create({
    data: {
      name: 'Demo Kullanıcı',
      email: 'demo@satrancdersleri.com',
      password: await bcrypt.hash('demo123', 12),
      role: 'USER',
    },
  })

  const beginnerCourse = await prisma.course.create({
    data: {
      title: 'Satranç Temelleri',
      slug: 'satranc-temelleri',
      description: 'Satrancın temel kurallarını, taş hareketlerini ve temel taktikleri öğrenin. Başlangıç seviyesi için ideal kurs.',
      type: 'ADULT',
      level: 'BEGINNER',
      published: true,
      order: 1,
    },
  })

  const tacticsCourse = await prisma.course.create({
    data: {
      title: 'Taktikler ve Kombinasyonlar',
      slug: 'taktikler-ve-kombinasyonlar',
      description: 'Çatal, iğne ve fil+kale çifti gibi temel taktikleri öğrenin.',
      type: 'ADULT',
      level: 'INTERMEDIATE',
      published: true,
      order: 2,
    },
  })

  await prisma.course.create({
    data: {
      title: 'Çocuklar İçin Satranç',
      slug: 'cocuklar-icin-satranc',
      description: 'Eğlenceli ve interaktif derslerle çocuklar için satranç öğrenimi.',
      type: 'CHILD',
      level: 'BEGINNER',
      published: true,
      order: 3,
    },
  })

  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'Taşlar ve Hareketleri',
      slug: 'taslar-ve-hareketler',
      description: 'Satrançtaki tüm taşların nasıl hareket ettiğini öğrenin: piyon, at, fil, kale, vezir ve şah.',
      order: 1,
      published: true,
      courseId: beginnerCourse.id,
    },
  })

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'Temel Mat Pozisyonları',
      slug: 'temel-mat-pozisyonlari',
      description: 'Kale matı ve vezir matı gibi temel mat pozisyonlarını bulmacalarla pratik yaparak öğrenin.',
      order: 2,
      published: true,
      courseId: beginnerCourse.id,
    },
  })

  const openingLesson = await prisma.lesson.create({
    data: {
      title: 'İtalyan Açılışı',
      slug: 'italyan-acilisi',
      description: 'Klasik bir açılış olan İtalyan Açılışını öğrenin ve ünlü oyunları analiz edin.',
      isOpening: true,
      order: 3,
      published: true,
      courseId: beginnerCourse.id,
    },
  })

  await prisma.lesson.create({
    data: {
      title: 'Çatal Taktiği',
      slug: 'catal-taktigi',
      description: 'Tek hamlede iki taşı aynı anda tehdit etme taktiği olan çatalı öğrenin.',
      order: 1,
      published: true,
      courseId: tacticsCourse.id,
    },
  })

  await prisma.puzzle.create({
    data: {
      description: 'Beyaz mat verir. Doğru hamleyi bulun! (Kale Matı)',
      fen: '8/8/8/8/8/k7/8/KR6 w - - 0 1',
      solution: ['Rb3#'],
      difficulty: 1,
      order: 1,
      lessonId: lesson2.id,
    },
  })

  await prisma.puzzle.create({
    data: {
      description: 'At çatalıyla iki taşı aynı anda tehdit edin.',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      solution: ['Ng5'],
      hint: 'At f7 karesini hem şahı hem de veziri tehdit edecek şekilde oynayabilir mi?',
      difficulty: 2,
      order: 1,
      lessonId: lesson1.id,
    },
  })

  await prisma.famousGame.create({
    data: {
      whitePlayer: 'Adolf Anderssen',
      blackPlayer: 'Lionel Kieseritzky',
      year: 1851,
      result: '1-0',
      description: '"Ölümsüz Oyun" olarak bilinen bu oyun, satranç tarihinin en güzel oyunlarından biridir.',
      pgn: '1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0',
      lessonId: openingLesson.id,
      order: 1,
    },
  })

  return NextResponse.json({
    success: true,
    message: 'Veritabanı başarıyla kuruldu',
    credentials: {
      admin: 'admin@satrancdersleri.com / admin123',
      demo: 'demo@satrancdersleri.com / demo123',
    },
  })
}
