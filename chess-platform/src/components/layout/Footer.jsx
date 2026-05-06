import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{background:'#1c1917'}} className="text-stone-400 pt-14 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xl"
                style={{background:'linear-gradient(135deg,#166534,#15803d)'}}>
                ♛
              </div>
              <div className="leading-none">
                <span className="font-display font-bold text-white block text-sm">satrançdersleri</span>
                <span className="text-[10px] text-stone-500 uppercase tracking-wide">chess academy</span>
              </div>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Modern satranç eğitimi. Video dersler, yapay zeka analizi ve interaktif bulmacalarla öğrenin.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dersler"   className="text-stone-500 hover:text-white transition-colors">Dersler</Link></li>
              <li><Link to="/acilislar" className="text-stone-500 hover:text-white transition-colors">Açılışlar</Link></li>
              <li><Link to="/dashboard" className="text-stone-500 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/cocuk"     className="text-stone-500 hover:text-white transition-colors">Çocuk Sayfası</Link></li>
            </ul>
          </div>

          {/* Hesap */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">Hesap</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/giris" className="text-stone-500 hover:text-white transition-colors">Giriş yap</Link></li>
              <li><Link to="/kayit" className="text-stone-500 hover:text-white transition-colors">Üye ol</Link></li>
            </ul>
          </div>

          {/* Teknoloji */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">Teknoloji</h4>
            <ul className="space-y-2.5 text-sm text-stone-500">
              <li>chess.js</li>
              <li>react-chessboard</li>
              <li>Stockfish 16 NNUE</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
          <span>© 2025 satrançdersleri. Tüm hakları saklıdır.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-chess inline-block" />
            Güçlü: chess.js · Stockfish 16
          </span>
        </div>
      </div>
    </footer>
  )
}
