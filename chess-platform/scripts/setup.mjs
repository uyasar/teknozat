import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function cp(src, dest) {
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(src, dest)
}

const sfSingleJs = resolve(root, 'node_modules/stockfish/src/stockfish-nnue-16-single.js')
const sfSingleWasm = resolve(root, 'node_modules/stockfish/src/stockfish-nnue-16-single.wasm')

if (!existsSync(resolve(root, 'public/stockfish.js'))) {
  cp(sfSingleJs, resolve(root, 'public/stockfish.js'))
  cp(sfSingleWasm, resolve(root, 'public/stockfish-nnue-16-single.wasm'))
  console.log('✓ Stockfish copied to public/')
}
