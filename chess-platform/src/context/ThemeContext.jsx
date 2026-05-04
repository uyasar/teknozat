import { createContext, useContext, useState, useEffect } from 'react'
import { BOARD_THEMES } from '../data/mockData'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [boardTheme, setBoardThemeRaw] = useState(
    () => localStorage.getItem('chess_board') || 'classic'
  )
  const [pieceTheme, setPieceThemeRaw] = useState(
    () => localStorage.getItem('chess_pieces') || 'standard'
  )

  const setBoardTheme = (id) => {
    setBoardThemeRaw(id)
    localStorage.setItem('chess_board', id)
  }
  const setPieceTheme = (id) => {
    setPieceThemeRaw(id)
    localStorage.setItem('chess_pieces', id)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-board', boardTheme)
  }, [boardTheme])

  const currentBoard = BOARD_THEMES.find(t => t.id === boardTheme) || BOARD_THEMES[0]

  return (
    <ThemeContext.Provider value={{ boardTheme, setBoardTheme, pieceTheme, setPieceTheme, currentBoard }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
