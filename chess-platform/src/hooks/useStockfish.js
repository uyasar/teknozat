import { useEffect, useRef, useState, useCallback } from 'react'

export function useStockfish() {
  const workerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [evaluation, setEvaluation] = useState(null) // { cp, mate, normalized, depth }
  const [lines, setLines] = useState([])             // top 3 lines
  const [thinking, setThinking] = useState(false)
  const [bestMove, setBestMove] = useState(null)
  const bestMoveCbRef = useRef(null)

  useEffect(() => {
    let worker
    try {
      worker = new Worker('/stockfish.js')
    } catch (e) {
      console.warn('Stockfish worker failed to load:', e)
      return
    }

    worker.onmessage = ({ data: msg }) => {
      if (typeof msg !== 'string') return

      if (msg === 'uciok') {
        worker.postMessage('setoption name MultiPV value 3')
        worker.postMessage('setoption name Threads value 1')
        worker.postMessage('isready')
      }
      if (msg === 'readyok') {
        setReady(true)
      }
      if (msg.startsWith('info') && msg.includes('depth')) {
        parseInfo(msg)
      }
      if (msg.startsWith('bestmove')) {
        const bm = msg.split(' ')[1]
        if (bm && bm !== '(none)') {
          setBestMove(bm)
          bestMoveCbRef.current?.(bm)
        }
        setThinking(false)
      }
    }

    worker.onerror = (e) => {
      console.warn('Stockfish error:', e.message)
    }

    worker.postMessage('uci')
    workerRef.current = worker

    return () => {
      worker.postMessage('quit')
      setTimeout(() => worker.terminate(), 200)
    }
  }, [])

  const parseInfo = useCallback((msg) => {
    const depth = parseInt(msg.match(/depth (\d+)/)?.[1] ?? '0')
    if (depth < 8) return

    const pvIdx = parseInt(msg.match(/multipv (\d+)/)?.[1] ?? '1') - 1
    const pv = msg.match(/ pv (.+)/)?.[1]?.trim().split(' ').slice(0, 6).join(' ') ?? ''

    const cpMatch = msg.match(/score cp (-?\d+)/)
    const mateMatch = msg.match(/score mate (-?\d+)/)
    let score = null
    if (mateMatch) score = { type: 'mate', value: parseInt(mateMatch[1]) }
    else if (cpMatch) score = { type: 'cp', value: parseInt(cpMatch[1]) }

    if (pvIdx === 0 && score) {
      const normalized = score.type === 'mate'
        ? (score.value > 0 ? 5 : -5)
        : Math.max(-5, Math.min(5, score.value / 100))
      setEvaluation({ score, normalized, depth })
    }

    setLines(prev => {
      const updated = [...prev]
      updated[pvIdx] = { score, pv, depth }
      return updated.slice(0, 3)
    })
  }, [])

  const analyze = useCallback((fen, depth = 18, onBestMove = null) => {
    if (!workerRef.current || !ready) return
    bestMoveCbRef.current = onBestMove
    setBestMove(null)
    setLines([])
    setThinking(true)
    workerRef.current.postMessage('stop')
    workerRef.current.postMessage(`position fen ${fen}`)
    workerRef.current.postMessage(`go depth ${depth}`)
  }, [ready])

  const stop = useCallback(() => {
    workerRef.current?.postMessage('stop')
    setThinking(false)
  }, [])

  const formatScore = useCallback((score, isWhiteTurn) => {
    if (!score) return '0.0'
    const flip = isWhiteTurn ? 1 : -1
    if (score.type === 'mate') {
      const m = score.value * flip
      return m > 0 ? `M${m}` : `-M${Math.abs(m)}`
    }
    const v = (score.value * flip) / 100
    return v >= 0 ? `+${v.toFixed(1)}` : v.toFixed(1)
  }, [])

  return { ready, evaluation, lines, thinking, bestMove, analyze, stop, formatScore }
}
