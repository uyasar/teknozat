import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="section py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-white mb-3">
              <span className="text-2xl">♔</span>
              <span>Satranç Dersleri</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Çocuklar ve yetişkinler için en kapsamlı online satranç eğitim platformu.
            </p>
          </div>

          {/* Kurslar */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Kurslar</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/kurslar?tur=yetiskin', label: 'Yetişkin Kursları' },
                { href: '/cocuk', label: 'Çocuk Kursları' },
                { href: '/acilislar', label: 'Açılış Ansiklopedisi' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hesap */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Hesap</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/giris', label: 'Giriş Yap' },
                { href: '/kayit', label: 'Üye Ol' },
                { href: '/profil', label: 'Profilim' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">İletişim</h3>
            <ul className="space-y-2 text-sm">
              <li>info@satrancdersleri.com</li>
              <li className="flex gap-3 mt-4">
                <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">♟</span>
                <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">♞</span>
                <span className="text-2xl hover:scale-110 transition-transform cursor-pointer">♜</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2024 Satranç Dersleri. Tüm hakları saklıdır.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-white transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
