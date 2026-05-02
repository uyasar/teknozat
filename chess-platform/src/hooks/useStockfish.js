import { useEffect, useRef, useState, useCallback } from 'react'

const STOCKFISH_DEPTH = 15

export function useStockfish() {
  const engineRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [evaluation, setEvaluation] = useState(null)
  const [bestMove, setBestMove] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [lines, setLines] = useState([])
  const callbackRef = useRef(null)

  useEffect(() => {
    try {
      const worker = new Worker('/stockfish/stockfish.js')

      worker.onmessage = (e) => {
        const msg = e.data
        if (typeof msg !== 'string') return

        if (msg === 'uciok') {
          worker.postMessage('setoption name MultiPV value 3')
          worker.postMessage('isready')
        }

        if (msg === 'readyok') {
          setReady(true)
        }

        if (msg.startsWith('info')) {
          parseInfoLine(msg)
        }

        if (msg.startsWith('bestmove')) {
          const parts = msg.split(' ')
          const move = parts[1]
          if (move && move !== '(none)') {
            setBestMove(move)
            setThinking(false)
            callbackRef.current?.(move, evaluation)
          }
        }
      }

      worker.onerror = (e) => {
        console.warn('Stockfish worker error:', e)
        setReady(false)
      }

      worker.postMessage('uci')
      engineRef.current = worker
    } catch (err) {
      console.warn('Stockfish unavailable:', err)
    }

    return () => {
      engineRef.current?.postMessage('quit')
      engineRef.current?.terminate()
    }
  }, [])

  const parseInfoLine = useCallback((msg) => {
    const depthMatch = msg.match(/depth (\d+)/)
    const depth = depthMatch ? parseInt(depthMatch[1]) : 0
    if (depth < 10) return

    const pvMatch = msg.match(/ pv (.+)/)
    const pvStr = pvMatch ? pvMatch[1].trim().split(' ').slice(0, 5).join(' ') : ''

    const cpMatch = msg.match(/score cp (-?\d+)/)
    const mateMatch = msg.match(/score mate (-?\d+)/)
    const multiPvMatch = msg.match(/multipv (\d+)/)
    const pvIndex = multiPvMatch ? parseInt(multiPvMatch[1]) - 1 : 0

    let score = null
    if (cpMatch) score = { type: 'cp', value: parseInt(cpMatch[1]) }
    if (mateMatch) score = { type: 'mate', value: parseInt(mateMatch[1]) }

    if (score && pvIndex === 0) {
      const normalized = score.type === 'cp'
        ? Math.max(-1000, Math.min(1000, score.value)) / 100
        : score.value > 0 ? 99 : -99
      setEvaluation({ score, normalized, depth })
    }

    setLines(prev => {
      const updated = [...prev]
      updated[pvIndex] = { score, pv: pvStr, depth }
      return updated.slice(0, 3)
    })
  }, [])

  const analyze = useCallback((fen, depth = STOCKFISH_DEPTH, onBestMove = null) => {
    if (!engineRef.current || !ready) return
    callbackRef.current = onBestMove
    setThinking(true)
    setBestMove(null)
    setLines([])
    engineRef.current.postMessage('stop')
    engineRef.current.postMessage(`position fen ${fen}`)
    engineRef.current.postMessage(`go depth ${depth}`)
  }, [ready])

  const stop = useCallback(() => {
    engineRef.current?.postMessage('stop')
    setThinking(false)
  }, [])

  const getEvalText = useCallback((scoreObj, isWhiteTurn) => {
    if (!scoreObj) return '0.0'
    const { type, value } = scoreObj
    const sign = isWhiteTurn ? 1 : -1
    if (type === 'mate') return `M${Math.abs(value)}`
    const adjusted = (value * sign) / 100
    return adjusted > 0 ? `+${adjusted.toFixed(1)}` : adjusted.toFixed(1)
  }, [])

  return { ready, evaluation, bestMove, thinking, lines, analyze, stop, getEvalText }
}
