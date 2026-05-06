'use client'

import { memo, useEffect, useRef } from 'react'

const PIECE_CDN = 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'

interface ChessBoardProps {
  fen?: string
  onPieceDrop?: (from: string, to: string) => string | null
  onSquareClick?: (square: string) => void
  orientation?: 'white' | 'black'
  boardWidth?: number
  disabled?: boolean
  lastMove?: { from: string; to: string } | null
  selectedSquare?: string | null
  legalMoves?: string[]
  inCheck?: string | null
  theme?: string
}

declare global {
  interface Window {
    Chessboard: any
    $: any
  }
}

const ChessBoardComponent = memo(function ChessBoardComponent({
  fen = 'start',
  onPieceDrop,
  onSquareClick,
  orientation = 'white',
  boardWidth = 480,
  disabled = false,
  lastMove = null,
  selectedSquare = null,
  legalMoves = [],
  inCheck = null,
  theme = 'CLASSIC',
}: ChessBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const boardRef = useRef<any>(null)
  const dropRef = useRef(onPieceDrop)
  const clickRef = useRef(onSquareClick)
  const fenAfterRef = useRef<string | null>(null)
  const fenRef = useRef(fen)
  const skipClickRef = useRef<string | null>(null)

  useEffect(() => { dropRef.current = onPieceDrop }, [onPieceDrop])
  useEffect(() => { clickRef.current = onSquareClick }, [onSquareClick])
  useEffect(() => { fenRef.current = fen }, [fen])

  useEffect(() => {
    if (!containerRef.current || !window.Chessboard) return
    const board = window.Chessboard(containerRef.current, {
      draggable: !disabled,
      position: fen === 'start' ? 'start' : fen,
      orientation,
      pieceTheme: PIECE_CDN,
      onDrop(source: string, target: string) {
        if (disabled) return 'snapback'
        if (source === target) {
          skipClickRef.current = source
          clickRef.current?.(source)
          return 'snapback'
        }
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

    const $ = window.$
    if ($) {
      $(containerRef.current).on('click.cb', '.square-55d63', function (this: HTMLElement) {
        if (disabled) return
        const sq = Array.from(this.classList)
          .find((c: string) => /^square-[a-h][1-8]$/.test(c))
          ?.replace('square-', '')
        if (!sq) return
        if (skipClickRef.current === sq) { skipClickRef.current = null; return }
        clickRef.current?.(sq)
      })
    }

    return () => {
      if ($ && containerRef.current) $(containerRef.current).off('click.cb')
      board.destroy()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { boardRef.current?.position(fen === 'start' ? 'start' : fen, true) }, [fen])
  useEffect(() => { boardRef.current?.orientation(orientation) }, [orientation])
  useEffect(() => {
    if (!containerRef.current || !boardRef.current) return
    containerRef.current.style.width = `${boardWidth}px`
    boardRef.current.resize()
  }, [boardWidth])

  useEffect(() => {
    highlight(containerRef.current, lastMove, legalMoves, selectedSquare, inCheck)
  }, [lastMove, legalMoves, selectedSquare, inCheck])

  const themeClass = `board-${theme.toLowerCase()}`

  return (
    <div
      ref={containerRef}
      style={{ width: boardWidth }}
      className={`touch-manipulation select-none ${themeClass}`}
    />
  )
})

export default ChessBoardComponent

function highlight(
  container: HTMLElement | null,
  lastMove: { from: string; to: string } | null,
  legalMoves: string[],
  selected: string | null,
  inCheck: string | null
) {
  if (!container || !window.$) return
  const $b = window.$(container)
  $b.find('.square-55d63').removeClass('sq-hl-from sq-hl-to sq-hl-sel sq-hl-legal sq-hl-check')
  if (lastMove?.from) $b.find(`.square-${lastMove.from}`).addClass('sq-hl-from')
  if (lastMove?.to) $b.find(`.square-${lastMove.to}`).addClass('sq-hl-to')
  if (selected) $b.find(`.square-${selected}`).addClass('sq-hl-sel')
  if (inCheck) $b.find(`.square-${inCheck}`).addClass('sq-hl-check')
  legalMoves?.forEach(sq => $b.find(`.square-${sq}`).addClass('sq-hl-legal'))
}
