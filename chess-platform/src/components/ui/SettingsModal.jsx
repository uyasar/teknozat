import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { BOARD_THEMES, PIECE_THEMES } from '../../data/mockData'
import clsx from 'clsx'

export default function SettingsModal({ open, onClose }) {
  const { boardTheme, setBoardTheme, pieceTheme, setPieceTheme } = useTheme()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white border border-stone-200
        shadow-2xl p-6 space-y-6 animate-slide-up">

        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Tahta Ayarları</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400
              hover:text-stone-700 hover:bg-stone-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Board color */}
        <div className="space-y-3">
          <p className="label">Tahta Rengi</p>
          <div className="grid grid-cols-2 gap-2">
            {BOARD_THEMES.map(t => (
              <button key={t.id} onClick={() => setBoardTheme(t.id)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  boardTheme === t.id
                    ? 'border-chess bg-chess-subtle text-chess'
                    : 'border-stone-200 text-stone-600 hover:border-chess/40 hover:text-chess hover:bg-chess-subtle'
                )}>
                <div className="grid grid-cols-2 w-6 h-6 rounded-md overflow-hidden shrink-0">
                  <div style={{ background: t.light }} />
                  <div style={{ background: t.dark }} />
                  <div style={{ background: t.dark }} />
                  <div style={{ background: t.light }} />
                </div>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Piece style */}
        <div className="space-y-3">
          <p className="label">Taş Stili</p>
          <div className="grid grid-cols-2 gap-2">
            {PIECE_THEMES.map(pt => (
              <button key={pt.id} onClick={() => setPieceTheme(pt.id)}
                className={clsx(
                  'px-3 py-2.5 rounded-xl border text-sm font-medium transition-all',
                  pieceTheme === pt.id
                    ? 'border-chess bg-chess-subtle text-chess'
                    : 'border-stone-200 text-stone-600 hover:border-chess/40 hover:text-chess hover:bg-chess-subtle'
                )}>
                {pt.name}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full justify-center">Kaydet</button>
      </div>
    </div>
  )
}
