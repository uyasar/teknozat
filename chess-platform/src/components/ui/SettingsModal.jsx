import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { BOARD_THEMES, PIECE_THEMES } from '../../data/mockData'
import clsx from 'clsx'

export default function SettingsModal({ open, onClose }) {
  const { boardTheme, setBoardTheme, pieceTheme, setPieceTheme } = useTheme()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl bg-surface-800 border border-white/10 shadow-2xl animate-slide-up p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-base">Tahta Ayarları</h2>
          <button onClick={onClose} className="btn-ghost p-1.5">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="label">Tahta Teması</label>
          <div className="grid grid-cols-2 gap-2">
            {BOARD_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setBoardTheme(theme.id)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-sm',
                  boardTheme === theme.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                )}
              >
                <div className="grid grid-cols-2 gap-0.5 w-6 h-6 rounded overflow-hidden shrink-0">
                  <div style={{ background: theme.light }} />
                  <div style={{ background: theme.dark }} />
                  <div style={{ background: theme.dark }} />
                  <div style={{ background: theme.light }} />
                </div>
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="label">Taş Stili</label>
          <div className="grid grid-cols-2 gap-2">
            {PIECE_THEMES.map(pt => (
              <button
                key={pt.id}
                onClick={() => setPieceTheme(pt.id)}
                className={clsx(
                  'px-3 py-2.5 rounded-lg border transition-all text-sm',
                  pieceTheme === pt.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                )}
              >
                {pt.name}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full">Tamam</button>
      </div>
    </div>
  )
}
