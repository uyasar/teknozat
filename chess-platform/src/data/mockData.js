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
    event: 'London',
    opening: 'Kral Gambiti',
    result: '1-0',
    pgn: `[Event "London"][White "Anderssen"][Black "Kieseritzky"][Result "1-0"]
1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6
7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6
13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2
18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
  },
  {
    id: 2,
    title: 'Evergreen Oyunu',
    white: 'Anderssen', black: 'Dufresne', year: 1852,
    event: 'Berlin',
    opening: 'Evans Gambiti',
    result: '1-0',
    pgn: `[Event "Berlin"][White "Anderssen"][Black "Dufresne"][Result "1-0"]
1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4
7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8
13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6
18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8
23. Bd7+ Kf8 24. Bxe7# 1-0`,
  },
  {
    id: 3,
    title: 'Paris Opera Oyunu',
    white: 'Morphy', black: 'Consultants', year: 1858,
    event: 'Paris Opera',
    opening: 'Philidor Savunması',
    result: '1-0',
    pgn: `[Event "Paris Opera"][White "Morphy"][Black "Consultants"][Result "1-0"]
1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6
7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7
12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7
16. Qb8+ Nxb8 17. Rd8# 1-0`,
  },
  {
    id: 4,
    title: 'Yüzyılın Oyunu',
    white: 'Byrne', black: 'Fischer', year: 1956,
    event: 'Rosenwald Trophy, New York',
    opening: 'Grünfeld Savunması',
    result: '0-1',
    pgn: `[Event "Rosenwald Trophy"][White "Byrne"][Black "Fischer"][Result "0-1"]
1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4
7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3
13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6
18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+
23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2
28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5
33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+
38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2# 0-1`,
  },
  {
    id: 5,
    title: 'Fischer – Spassky 1972, Oyun 6',
    white: 'Fischer', black: 'Spassky', year: 1972,
    event: 'Dünya Şampiyonası, Reykjavik',
    opening: 'Ruy Lopez',
    result: '1-0',
    pgn: `[Event "World Championship"][White "Fischer"][Black "Spassky"][Result "1-0"]
1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6
8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5
13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7
18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8
24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8
29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8
34. R1f2 Qe8 35. R2f3 Qd8 36. Bd3 Qe8 37. Qe4 Nf6 38. Rxf6 gxf6
39. Rxf6 Kg8 40. Bc4 Kh8 41. Qf4 1-0`,
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
  { id: 'blue',    name: 'Mavi',    light: '#cdd5e0', dark: '#5a7fa8' },
  { id: 'purple',  name: 'Mor',     light: '#d0c5e8', dark: '#8072a3' },
  { id: 'dark',    name: 'Koyu',    light: '#c0c0c0', dark: '#555555' },
]

export const PIECE_THEMES = [
  { id: 'standard', name: 'Standart' },
  { id: 'neo',      name: 'Neo'      },
  { id: 'alpha',    name: 'Alpha'    },
  { id: 'pixel',    name: 'Pixel'    },
]
