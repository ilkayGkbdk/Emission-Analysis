import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-green-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">CO2 Hesaplayıcı</h3>
                        <p className="text-green-200">
                            Karbon ayak izinizi hesaplayın ve çevreye olan etkinizi öğrenin.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-green-200 hover:text-white">
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-green-200 hover:text-white">
                                    Hakkında
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-green-200 hover:text-white">
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                        <ul className="space-y-2 text-green-200">
                            <li>Email: info@co2hesaplayici.com</li>
                            <li>Tel: +90 (XXX) XXX XX XX</li>
                            <li>Adres: İstanbul, Türkiye</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-green-700">
                    <p className="text-center text-green-200">
                        © {new Date().getFullYear()} CO2 Hesaplayıcı. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    )
}