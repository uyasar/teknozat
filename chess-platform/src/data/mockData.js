export const COURSES = [
  {
    id: 1,
    title: 'Satranç Temelleri',
    slug: 'satranc-temelleri',
    description: 'Taşların nasıl hareket ettiğinden başlayarak temel stratejileri öğrenin.',
    level: 'Başlangıç',
    duration: '4 saat',
    lessons: 12,
    thumbnail: null,
    instructor: 'Magnus Carlsen Tarzı AI',
    rating: 4.8,
    enrolled: 1240,
    tags: ['açılış', 'temel', 'strateji'],
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
    thumbnail: null,
    instructor: 'Stockfish AI',
    rating: 4.9,
    enrolled: 876,
    tags: ['açılış', 'teori', 'derinlik'],
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
    thumbnail: null,
    instructor: 'Stockfish AI',
    rating: 4.7,
    enrolled: 2100,
    tags: ['taktik', 'kombinasyon', 'bulmaca'],
    progress: 70,
  },
  {
    id: 4,
    title: 'Son Oyun Teknikleri',
    slug: 'son-oyun-teknikleri',
    description: 'Kale, fil ve at son oyunlarında kazanma ve berabere kalma teknikleri.',
    level: 'İleri',
    duration: '5 saat',
    lessons: 15,
    thumbnail: null,
    instructor: 'Stockfish AI',
    rating: 4.6,
    enrolled: 540,
    tags: ['endgame', 'teknik', 'ileri'],
    progress: 100,
  },
]

export const LESSONS = [
  {
    id: 1,
    courseId: 1,
    title: 'Piyon Hareketi ve Piyonun Terfi',
    slug: 'piyon-hareketi',
    videoUrl: 'https://www.youtube.com/embed/demoVideoId',
    duration: '18:42',
    pgn: `[Event "Demo Lesson"]
[Site "Teknozat"]
[White "Anlatici"]
[Black "Demo"]
[Result "1-0"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O`,
    puzzles: [
      {
        id: 1,
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        solution: ['Ng5'],
        hint: 'f7 karesine çift saldırı düşünün.',
        description: 'Beyaz, hangi hamle ile f7 üzerinde baskı oluşturabilir?',
        difficulty: 1,
      },
      {
        id: 2,
        fen: 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/2N2N2/PPPP1PPP/R1BQR1K1 w - - 0 7',
        solution: ['Bxf7+', 'Rxf7', 'Ng5'],
        hint: 'Kurban kombinasyonu var!',
        description: 'Kazançlı kombinasyonu bulun.',
        difficulty: 3,
      },
    ],
    completed: false,
  },
  {
    id: 2,
    courseId: 1,
    title: 'Merkez Kontrolü',
    slug: 'merkez-kontrolu',
    videoUrl: null,
    duration: '22:15',
    pgn: `[Event "Demo Lesson 2"]
1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6`,
    puzzles: [],
    completed: true,
  },
]

export const FAMOUS_GAMES = [
  {
    id: 1,
    title: 'İmmortale Oyun',
    white: 'Anderssen',
    black: 'Kieseritzky',
    year: 1851,
    event: 'London',
    description: 'Satranç tarihinin en güzel kurban kombinasyonlarından biri.',
    pgn: `[Event "London casual game"]
[White "Anderssen, A"]
[Black "Kieseritzky, L"]
[Result "1-0"]
[Year "1851"]
1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5
8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8
15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6
21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
  },
  {
    id: 2,
    title: 'Evergreen Oyun',
    white: 'Anderssen',
    black: 'Dufresne',
    year: 1852,
    event: 'Berlin',
    description: 'Kombinatif satranç sanatının zirvesi.',
    pgn: `[Event "Berlin casual game"]
[White "Anderssen, A"]
[Black "Dufresne, J"]
[Result "1-0"]
[Year "1852"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3
8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7
15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7
21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7# 1-0`,
  },
]

export const USERS = [
  { id: 1, name: 'Ali Yılmaz', email: 'ali@example.com', role: 'user', joined: '2024-01-15', completedCourses: 2, totalPoints: 1250 },
  { id: 2, name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'user', joined: '2024-02-20', completedCourses: 4, totalPoints: 3400 },
  { id: 3, name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'admin', joined: '2023-11-01', completedCourses: 8, totalPoints: 7800 },
]

export const ACHIEVEMENTS = [
  { id: 1, title: 'İlk Adım', description: 'İlk dersi tamamla', icon: '♟', earned: true },
  { id: 2, title: 'Taktisyen', description: '10 bulmaca çöz', icon: '⚔', earned: true },
  { id: 3, title: 'Analist', description: 'AI analiz modunu kullan', icon: '🔍', earned: false },
  { id: 4, title: 'Maestro', description: 'Tüm temel dersleri bitir', icon: '♛', earned: false },
]

export const BOARD_THEMES = [
  { id: 'classic', name: 'Klasik', light: '#f0d9b5', dark: '#b58863' },
  { id: 'ocean', name: 'Okyanus', light: '#dee3e6', dark: '#8ca2ad' },
  { id: 'green', name: 'Yeşil', light: '#ffffdd', dark: '#86a666' },
  { id: 'dark', name: 'Karanlık', light: '#aaaaaa', dark: '#4a4a4a' },
]

export const PIECE_THEMES = [
  { id: 'standard', name: 'Standart' },
  { id: 'neo', name: 'Neo' },
  { id: 'alpha', name: 'Alpha' },
  { id: 'pixel', name: 'Pixel' },
]
