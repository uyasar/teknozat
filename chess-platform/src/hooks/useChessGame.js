import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'

export function useChessGame() {
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState(() => gameRef.current.fen())
  const [history, setHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [lastMove, setLastMove] = useState(null)
  const [gameOver, setGameOver] = useState(null)

  const sync = useCallback((g, index) => {
    const hist = g.history({ verbose: true })
    setFen(g.fen())
    setHistory(hist)
    setCurrentIndex(index ?? hist.length - 1)
    setGameOver(
      g.isCheckmate() ? { reason: 'checkmate', winner: g.turn() === 'w' ? 'black' : 'white' }
      : g.isDraw()      ? { reason: 'draw' }
      : g.isStalemate() ? { reason: 'stalemate' }
      : null
    )
  }, [])

  const loadPgn = useCallback((pgn) => {
    const g = new Chess()
    try {
      g.loadPgn(pgn)
      gameRef.current = g
      sync(g)
      return true
    } catch {
      return false
    }
  }, [sync])

  const loadFen = useCallback((fenStr) => {
    try {
      const g = new Chess(fenStr)
      gameRef.current = g
      sync(g)
      return true
    } catch {
      return false
    }
  }, [sync])

  const reset = useCallback(() => {
    gameRef.current = new Chess()
    sync(gameRef.current)
    setLastMove(null)
  }, [sync])

  // Returns { move, fen } on success, null on failure
  const makeMove = useCallback((moveObj) => {
    const g = gameRef.current
    try {
      const result = g.move(moveObj)
      if (result) {
        setLastMove({ from: result.from, to: result.to })
        sync(g)
        return { move: result, fen: g.fen() }
      }
    } catch { /* invalid move */ }
    return null
  }, [sync])

  const getLegalMovesFrom = useCallback((square) => {
    return gameRef.current.moves({ square, verbose: true }).map(m => m.to)
  }, [])

  // Navigate to a specific move index in the history
  const goTo = useCallback((index) => {
    const hist = history
    if (index < -1 || index >= hist.length) return
    const g = new Chess()
    for (let i = 0; i <= index; i++) g.move(hist[i].san)
    setFen(g.fen())
    setCurrentIndex(index)
    setLastMove(index >= 0 ? { from: hist[index].from, to: hist[index].to } : null)
  }, [history])

  const goStart   = useCallback(() => goTo(-1), [goTo])
  const goEnd     = useCallback(() => goTo(history.length - 1), [goTo, history.length])
  const goBack    = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex])
  const goForward = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex])

  const pairedMoves = useCallback(() => {
    const pairs = []
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({ n: Math.floor(i / 2) + 1, w: history[i], b: history[i + 1] })
    }
    return pairs
  }, [history])

  return {
    game: gameRef.current,
    fen,
    history,
    currentIndex,
    lastMove,
    gameOver,
    loadPgn,
    loadFen,
    reset,
    makeMove,
    getLegalMovesFrom,
    goTo,
    goStart,
    goEnd,
    goBack,
    goForward,
    pairedMoves,
  }
}
