import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-blue-800 text-white">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Marka Bilgisi */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-2">
                            CO2 Hesaplama Aracı
                        </h3>
                        <p className="text-xs text-blue-200">
                            Sürdürülebilirlik için karbon ayak izi analizleri.
                        </p>
                    </div>

                    {/* Hızlı Bağlantılar */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-2">
                            Hızlı Bağlantılar
                        </h3>
                        <ul className="space-y-1 text-xs">
                            <li>
                                <Link
                                    href="/"
                                    className="text-blue-200 hover:text-white transition-colors"
                                >
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-blue-200 hover:text-white transition-colors"
                                >
                                    Hakkında
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-blue-200 hover:text-white transition-colors"
                                >
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-2">İletişim</h3>
                        <ul className="space-y-1 text-xs text-blue-200">
                            <li>E-posta: info@co2hesaplayici.com</li>
                            <li>Telefon: +90 (212) 555 55 55</li>
                            <li>Adres: İstanbul, Türkiye</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-700">
                    <p className="text-center text-xs text-blue-200">
                        © {new Date().getFullYear()} CO2 Hesaplama Aracı. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
}