import { useEffect, useRef } from 'react'

const PIECE_CDN = 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'

/**
 * React wrapper for chessboard.js (window.Chessboard from CDN).
 *
 * onPieceDrop(from, to) → new FEN string (valid move) | null (invalid → snapback)
 */
export default function ChessBoard({
  fen = 'start',
  onPieceDrop,
  orientation = 'white',
  boardWidth = 480,
  disabled = false,
  lastMove    = null,
  selectedSquare = null,
  legalMoves  = [],
  inCheck     = null,
}) {
  const containerRef = useRef(null)
  const boardRef     = useRef(null)
  const dropRef      = useRef(onPieceDrop)
  const fenAfterRef  = useRef(null)
  const fenRef       = useRef(fen)

  // keep callback refs fresh without re-initialising the board
  useEffect(() => { dropRef.current = onPieceDrop }, [onPieceDrop])
  useEffect(() => { fenRef.current  = fen          }, [fen])

  // ── init board once ─────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !window.Chessboard) return

    const board = window.Chessboard(containerRef.current, {
      draggable:  !disabled,
      position:   fen === 'start' ? 'start' : fen,
      orientation,
      pieceTheme: PIECE_CDN,
      onDrop(source, target) {
        if (disabled || source === target) return 'snapback'
        const newFen = dropRef.current?.(source, target)
        if (!newFen) return 'snapback'
        fenAfterRef.current = newFen
        return undefined
      },
      onSnapEnd() {
        // sync castling / en-passant / promotion visuals
        board.position(fenAfterRef.current ?? fenRef.current, false)
        fenAfterRef.current = null
      },
    })

    boardRef.current = board
    return () => board.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── sync position ───────────────────────────────────────────────
  useEffect(() => {
    boardRef.current?.position(fen === 'start' ? 'start' : fen, true)
  }, [fen])

  // ── sync orientation ────────────────────────────────────────────
  useEffect(() => {
    boardRef.current?.orientation(orientation)
  }, [orientation])

  // ── resize when boardWidth changes (responsive) ─────────────────
  useEffect(() => {
    if (!containerRef.current || !boardRef.current) return
    containerRef.current.style.width = `${boardWidth}px`
    boardRef.current.resize()
  }, [boardWidth])

  // ── square highlights via jQuery ────────────────────────────────
  useEffect(() => {
    highlight(containerRef.current, lastMove, legalMoves, selectedSquare, inCheck)
  }, [lastMove, legalMoves, selectedSquare, inCheck])

  return (
    <div
      ref={containerRef}
      style={{ width: boardWidth }}
      className="touch-manipulation"
    />
  )
}

function highlight(container, lastMove, legalMoves, selected, inCheck) {
  if (!container || !window.$) return
  const $b = window.$(container)
  $b.find('.square-55d63').removeClass('sq-hl-from sq-hl-to sq-hl-sel sq-hl-legal sq-hl-check')
  if (lastMove?.from) $b.find(`.square-${lastMove.from}`).addClass('sq-hl-from')
  if (lastMove?.to)   $b.find(`.square-${lastMove.to  }`).addClass('sq-hl-to')
  if (selected)       $b.find(`.square-${selected      }`).addClass('sq-hl-sel')
  if (inCheck)        $b.find(`.square-${inCheck        }`).addClass('sq-hl-check')
  legalMoves?.forEach(sq => $b.find(`.square-${sq}`).addClass('sq-hl-legal'))
}
