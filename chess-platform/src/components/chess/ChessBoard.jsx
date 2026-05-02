import { useMemo } from 'react'
import { Chessboard } from 'react-chessboard'
import { useTheme } from '../../context/ThemeContext'

/**
 * ChessBoard wraps react-chessboard (chessboardjs-compatible API)
 * with theme support, move highlighting and arrow annotations.
 */
export default function ChessBoard({
  fen,
  onPieceDrop,
  onSquareClick,
  orientation = 'white',
  selectedSquare,
  legalMoves = [],
  lastMove,
  arrows = [],
  disabled = false,
  boardWidth = 480,
  showCoords = true,
}) {
  const { currentBoard, customPieces } = useTheme()

  const customSquareStyles = useMemo(() => {
    const styles = {}

    if (lastMove) {
      styles[lastMove.from] = { backgroundColor: 'rgba(212, 168, 83, 0.35)' }
      styles[lastMove.to] = { backgroundColor: 'rgba(212, 168, 83, 0.5)' }
    }

    if (selectedSquare) {
      styles[selectedSquare] = { backgroundColor: 'rgba(212, 168, 83, 0.6)' }
    }

    legalMoves.forEach(sq => {
      styles[sq] = {
        background: 'radial-gradient(circle, rgba(212,168,83,0.5) 30%, transparent 30%)',
        borderRadius: '50%',
      }
    })

    return styles
  }, [lastMove, selectedSquare, legalMoves])

  const handlePieceDrop = (sourceSquare, targetSquare, piece) => {
    if (disabled) return false
    return onPieceDrop?.(sourceSquare, targetSquare, piece) ?? false
  }

  const handleSquareClick = (square) => {
    if (disabled) return
    onSquareClick?.(square)
  }

  return (
    <div className="chess-wrapper rounded-lg overflow-hidden shadow-2xl" style={{ width: boardWidth }}>
      <Chessboard
        id="main-board"
        position={fen}
        onPieceDrop={handlePieceDrop}
        onSquareClick={handleSquareClick}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: '6px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}
        customLightSquareStyle={{ backgroundColor: currentBoard.light }}
        customDarkSquareStyle={{ backgroundColor: currentBoard.dark }}
        customSquareStyles={customSquareStyles}
        customPieces={customPieces}
        customArrows={arrows}
        showBoardNotation={showCoords}
        areArrowsAllowed={false}
        isDraggablePiece={() => !disabled}
        boardWidth={boardWidth}
        animationDuration={200}
      />
    </div>
  )
}
