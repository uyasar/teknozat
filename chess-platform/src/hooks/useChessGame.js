import { useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'

export function useChessGame(initialPgn = '') {
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState(gameRef.current.fen())
  const [history, setHistory] = useState([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [gameOver, setGameOver] = useState(null)
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [lastMove, setLastMove] = useState(null)

  const syncState = useCallback((game) => {
    setFen(game.fen())
    const moves = game.history({ verbose: true })
    setHistory(moves)
    setCurrentMoveIndex(moves.length - 1)

    if (game.isGameOver()) {
      if (game.isCheckmate()) setGameOver({ reason: 'checkmate', winner: game.turn() === 'w' ? 'black' : 'white' })
      else if (game.isDraw()) setGameOver({ reason: 'draw' })
      else if (game.isStalemate()) setGameOver({ reason: 'stalemate' })
    } else {
      setGameOver(null)
    }
  }, [])

  const loadPgn = useCallback((pgn) => {
    try {
      const game = new Chess()
      game.loadPgn(pgn)
      gameRef.current = game
      syncState(game)
      return true
    } catch {
      return false
    }
  }, [syncState])

  const loadFen = useCallback((fenStr) => {
    try {
      const game = new Chess(fenStr)
      gameRef.current = game
      syncState(game)
      return true
    } catch {
      return false
    }
  }, [syncState])

  const reset = useCallback(() => {
    gameRef.current = new Chess()
    syncState(gameRef.current)
    setSelectedSquare(null)
    setLegalMoves([])
    setLastMove(null)
  }, [syncState])

  const makeMove = useCallback((move) => {
    const game = gameRef.current
    try {
      const result = game.move(move)
      if (result) {
        setLastMove({ from: result.from, to: result.to })
        syncState(game)
        return result
      }
    } catch {
      return null
    }
    return null
  }, [syncState])

  const getLegalMovesFrom = useCallback((square) => {
    const game = gameRef.current
    return game.moves({ square, verbose: true }).map(m => m.to)
  }, [])

  const onSquareClick = useCallback((square) => {
    const game = gameRef.current

    if (selectedSquare) {
      const move = makeMove({ from: selectedSquare, to: square, promotion: 'q' })
      if (move) {
        setSelectedSquare(null)
        setLegalMoves([])
        return { moved: true, move }
      }

      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
        setLegalMoves(getLegalMovesFrom(square))
        return { moved: false }
      }

      setSelectedSquare(null)
      setLegalMoves([])
      return { moved: false }
    }

    const piece = game.get(square)
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square)
      setLegalMoves(getLegalMovesFrom(square))
    }
    return { moved: false }
  }, [selectedSquare, makeMove, getLegalMovesFrom])

  const goToMove = useCallback((index) => {
    if (index < -1 || index >= history.length) return
    const game = new Chess()
    for (let i = 0; i <= index; i++) {
      game.move(history[i].san)
    }
    setFen(game.fen())
    setCurrentMoveIndex(index)
    if (index >= 0) setLastMove({ from: history[index].from, to: history[index].to })
    else setLastMove(null)
  }, [history])

  const goToStart = useCallback(() => goToMove(-1), [goToMove])
  const goToEnd = useCallback(() => goToMove(history.length - 1), [goToMove, history.length])
  const goBack = useCallback(() => goToMove(currentMoveIndex - 1), [goToMove, currentMoveIndex])
  const goForward = useCallback(() => goToMove(currentMoveIndex + 1), [goToMove, currentMoveIndex])

  const getPgnMoves = useCallback(() => {
    const paired = []
    for (let i = 0; i < history.length; i += 2) {
      paired.push({ moveNumber: Math.floor(i / 2) + 1, white: history[i], black: history[i + 1] })
    }
    return paired
  }, [history])

  return {
    game: gameRef.current,
    fen,
    history,
    currentMoveIndex,
    gameOver,
    selectedSquare,
    legalMoves,
    lastMove,
    loadPgn,
    loadFen,
    reset,
    makeMove,
    onSquareClick,
    goToMove,
    goToStart,
    goToEnd,
    goBack,
    goForward,
    getPgnMoves,
  }
}
