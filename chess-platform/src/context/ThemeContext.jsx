import { createContext, useContext, useState, useEffect } from 'react'
import { BOARD_THEMES, PIECE_THEMES } from '../data/mockData'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [boardTheme, setBoardTheme] = useState(() =>
    localStorage.getItem('chess_board_theme') || 'classic'
  )
  const [pieceTheme, setPieceTheme] = useState(() =>
    localStorage.getItem('chess_piece_theme') || 'standard'
  )
  const [darkMode] = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-board-theme', boardTheme)
    localStorage.setItem('chess_board_theme', boardTheme)
  }, [boardTheme])

  useEffect(() => {
    localStorage.setItem('chess_piece_theme', pieceTheme)
  }, [pieceTheme])

  const currentBoard = BOARD_THEMES.find(t => t.id === boardTheme) || BOARD_THEMES[0]

  const customPieces = pieceTheme !== 'standard'
    ? Object.fromEntries(
        ['wK','wQ','wR','wB','wN','wP','bK','bQ','bR','bB','bN','bP'].map(p => [
          p,
          ({ squareWidth }) => (
            <div
              style={{ width: squareWidth, height: squareWidth, backgroundImage: `url(/pieces/${pieceTheme}/${p}.svg)`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            />
          )
        ])
      )
    : undefined

  return (
    <ThemeContext.Provider value={{ boardTheme, setBoardTheme, pieceTheme, setPieceTheme, darkMode, currentBoard, customPieces }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
