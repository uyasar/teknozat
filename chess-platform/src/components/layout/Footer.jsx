import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-accent flex items-center justify-center text-surface-900 font-bold">♛</div>
              <span className="font-display font-bold">Teknozat</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Modern satranç eğitimi. Video dersler, AI analizi ve interaktif bulmacalarla.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/dersler" className="hover:text-white transition-colors">Dersler</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/cocuk" className="hover:text-white transition-colors">Çocuk Sayfası</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Hesap</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link to="/giris" className="hover:text-white transition-colors">Giriş yap</Link></li>
              <li><Link to="/kayit" className="hover:text-white transition-colors">Üye ol</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Teknoloji</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li>chess.js</li>
              <li>react-chessboard</li>
              <li>Stockfish.js</li>
            </ul>
          </div>
        </div>

        <div className="divider pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/25">
          <span>© 2025 Teknozat. Tüm hakları saklıdır.</span>
          <span>Güçlü: chess.js · Stockfish 16</span>
        </div>
      </div>
    </footer>
  )
}
