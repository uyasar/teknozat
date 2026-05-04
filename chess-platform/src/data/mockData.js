export const COURSES = [
  {
    id: 1,
    title: 'Satranç Temelleri',
    slug: 'satranc-temelleri',
    description: 'Taşların nasıl hareket ettiğinden temel stratejilere sıfırdan başlayın.',
    level: 'Başlangıç',
    duration: '4 saat',
    lessons: 12,
    instructor: 'Stockfish AI',
    rating: 4.8,
    enrolled: 1240,
    tags: ['açılış', 'temel'],
    progress: 0,
  },
  {
    id: 2,
    title: 'Açılış Teorisi',
    slug: 'acilis-teorisi',
    description: 'Sicilyen, Fransız ve İspanyol açılışlarını derinlemesine inceleyin.',
    level: 'Orta',
    duration: '6 saat',
    lessons: 18,
    instructor: 'Stockfish AI',
    rating: 4.9,
    enrolled: 876,
    tags: ['açılış', 'teori'],
    progress: 35,
  },
  {
    id: 3,
    title: 'Taktik Kombinasyonları',
    slug: 'taktik-kombinasyonlari',
    description: 'Çatal, kement, pin ve benzeri taktikleri 200+ bulmaca ile pekiştirin.',
    level: 'Orta',
    duration: '8 saat',
    lessons: 24,
    instructor: 'Stockfish AI',
    rating: 4.7,
    enrolled: 2100,
    tags: ['taktik', 'bulmaca'],
    progress: 70,
  },
  {
    id: 4,
    title: 'Son Oyun Teknikleri',
    slug: 'son-oyun-teknikleri',
    description: 'Kale, fil ve at son oyunlarında kazanma ve berabere kalma yöntemleri.',
    level: 'İleri',
    duration: '5 saat',
    lessons: 15,
    instructor: 'Stockfish AI',
    rating: 4.6,
    enrolled: 540,
    tags: ['endgame', 'teknik'],
    progress: 100,
  },
]

export const LESSONS = [
  {
    id: 1,
    courseId: 1,
    title: 'Piyon Hareketi ve Piyonun Terfi',
    slug: 'piyon-hareketi',
    videoUrl: null,
    duration: '18:42',
    pgn: `[Event "Demo"]
[White "Anlatici"][Black "Demo"][Result "*"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O *`,
    puzzles: [
      {
        id: 1,
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        solution: ['Ng5'],
        hint: 'f7 karesine çift saldırı düşünün.',
        description: 'Beyaz, en iyi hamleyi yaparak f7 üzerinde baskı oluşturmalı.',
        difficulty: 2,
      },
      {
        id: 2,
        fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 5',
        solution: ['d3', 'O-O'],
        hint: 'Merkezi güçlendirin ve şahı güvene alın.',
        description: 'İki hamlede pozisyonu konsolide edin.',
        difficulty: 1,
      },
    ],
    completed: false,
  },
  {
    id: 2,
    courseId: 2,
    title: 'Ruy Lopez Açılışı',
    slug: 'ruy-lopez',
    videoUrl: null,
    duration: '24:10',
    pgn: `[Event "Demo"][White "A"][Black "B"][Result "*"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 *`,
    puzzles: [],
    completed: false,
  },
]

export const FAMOUS_GAMES = [
  {
    id: 1,
    title: 'İmmortale Oyun',
    white: 'Anderssen', black: 'Kieseritzky', year: 1851,
    pgn: `[Event "London"][White "Anderssen"][Black "Kieseritzky"][Result "1-0"]
1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6
7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6
13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2
18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
  },
]

export const USERS = [
  { id: 1, name: 'Ali Yılmaz', email: 'ali@example.com', role: 'user', joined: '2024-01-15', completedCourses: 2 },
  { id: 2, name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'user', joined: '2024-02-20', completedCourses: 4 },
  { id: 3, name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'admin', joined: '2023-11-01', completedCourses: 8 },
]

export const ACHIEVEMENTS = [
  { id: 1, title: 'İlk Adım', description: 'İlk dersi tamamla', icon: '♟', earned: true },
  { id: 2, title: 'Taktisyen', description: '10 bulmaca çöz', icon: '⚔', earned: true },
  { id: 3, title: 'Analist', description: 'AI analiz modunu kullan', icon: '🔍', earned: false },
  { id: 4, title: 'Maestro', description: 'Tüm temel dersleri bitir', icon: '♛', earned: false },
]

export const BOARD_THEMES = [
  { id: 'classic', name: 'Klasik',  light: '#f0d9b5', dark: '#b58863' },
  { id: 'ocean',   name: 'Okyanus', light: '#dee3e6', dark: '#8ca2ad' },
  { id: 'green',   name: 'Yeşil',   light: '#ffffdd', dark: '#86a666' },
  { id: 'dark',    name: 'Karanlık',light: '#aaaaaa', dark: '#444444' },
  { id: 'purple',  name: 'Mor',     light: '#d0c5e8', dark: '#8072a3' },
]

export const PIECE_THEMES = [
  { id: 'standard', name: 'Standart' },
  { id: 'neo',      name: 'Neo'      },
  { id: 'alpha',    name: 'Alpha'    },
  { id: 'pixel',    name: 'Pixel'    },
]
