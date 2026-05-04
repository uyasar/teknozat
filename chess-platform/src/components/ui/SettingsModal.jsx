import { X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { BOARD_THEMES, PIECE_THEMES } from '../../data/mockData'
import clsx from 'clsx'

export default function SettingsModal({ open, onClose }) {
  const { boardTheme, setBoardTheme, pieceTheme, setPieceTheme } = useTheme()
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-bg-elevated border border-bg-border
        shadow-2xl shadow-black/50 p-6 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Tahta Ayarları</h2>
          <button onClick={onClose} className="btn-ghost p-1.5"><X size={15} /></button>
        </div>

        <div className="space-y-3">
          <p className="label">Tahta Rengi</p>
          <div className="grid grid-cols-2 gap-2">
            {BOARD_THEMES.map(t => (
              <button key={t.id} onClick={() => setBoardTheme(t.id)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all',
                  boardTheme === t.id
                    ? 'border-gold/50 bg-gold/10 text-gold'
                    : 'border-bg-border text-white/50 hover:border-white/15 hover:text-white'
                )}>
                <div className="grid grid-cols-2 w-6 h-6 rounded overflow-hidden shrink-0">
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

        <div className="space-y-3">
          <p className="label">Taş Stili</p>
          <div className="grid grid-cols-2 gap-2">
            {PIECE_THEMES.map(pt => (
              <button key={pt.id} onClick={() => setPieceTheme(pt.id)}
                className={clsx(
                  'px-3 py-2.5 rounded-xl border text-sm transition-all',
                  pieceTheme === pt.id
                    ? 'border-gold/50 bg-gold/10 text-gold'
                    : 'border-bg-border text-white/50 hover:border-white/15 hover:text-white'
                )}>
                {pt.name}
              </button>
            ))}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full">Kapat</button>
      </div>
    </div>
  )
}
