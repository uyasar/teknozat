import { memo, useEffect, useRef } from 'react'

const PIECE_CDN = 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'

/**
 * React wrapper for chessboard.js (window.Chessboard from CDN).
 * onPieceDrop(from, to) → new FEN string | null (snapback)
 * onSquareClick(square) → called on square click (for piece selection)
 */
const ChessBoard = memo(function ChessBoard({
  fen = 'start',
  onPieceDrop,
  onSquareClick,
  orientation = 'white',
  boardWidth = 480,
  disabled = false,
  lastMove      = null,
  selectedSquare = null,
  legalMoves    = [],
  inCheck       = null,
}) {
  const containerRef = useRef(null)
  const boardRef     = useRef(null)
  const dropRef      = useRef(onPieceDrop)
  const clickRef     = useRef(onSquareClick)
  const fenAfterRef  = useRef(null)
  const fenRef       = useRef(fen)

  useEffect(() => { dropRef.current  = onPieceDrop  }, [onPieceDrop])
  useEffect(() => { clickRef.current = onSquareClick }, [onSquareClick])
  useEffect(() => { fenRef.current   = fen           }, [fen])

  // ── init board once ──────────────────────────────────────────
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
        board.position(fenAfterRef.current ?? fenRef.current, false)
        fenAfterRef.current = null
      },
    })

    boardRef.current = board

    // ── square click via jQuery ──────────────────────────────
    const $ = window.$
    if ($) {
      $(containerRef.current).on('click.chessboard', '.square-55d63', function () {
        if (disabled) return
        const sq = Array.from(this.classList)
          .find(c => /^square-[a-h][1-8]$/.test(c))
          ?.replace('square-', '')
        if (sq) clickRef.current?.(sq)
      })
    }

    return () => {
      if ($ && containerRef.current) {
        $(containerRef.current).off('click.chessboard')
      }
      board.destroy()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── sync position ────────────────────────────────────────────
  useEffect(() => {
    boardRef.current?.position(fen === 'start' ? 'start' : fen, true)
  }, [fen])

  // ── sync orientation ─────────────────────────────────────────
  useEffect(() => {
    boardRef.current?.orientation(orientation)
  }, [orientation])

  // ── resize ───────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !boardRef.current) return
    containerRef.current.style.width = `${boardWidth}px`
    boardRef.current.resize()
  }, [boardWidth])

  // ── highlights ───────────────────────────────────────────────
  useEffect(() => {
    highlight(containerRef.current, lastMove, legalMoves, selectedSquare, inCheck)
  }, [lastMove, legalMoves, selectedSquare, inCheck])

  return (
    <div
      ref={containerRef}
      style={{ width: boardWidth }}
      className="touch-manipulation select-none"
    />
  )
})

export default ChessBoard

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
