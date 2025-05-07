'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 mb-4">
                    Hakkımızda
                </h1>
                <p className="text-xl text-green-600 max-w-3xl mx-auto">
                    Karbon ayak izini hesaplayarak sürdürülebilir bir gelecek için çalışıyoruz
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-green-800">
                        Misyonumuz
                    </h2>
                    <p className="text-gray-600">
                        Bireylerin ve kurumların karbon ayak izlerini anlamalarına ve azaltmalarına yardımcı olarak,
                        çevre dostu bir gelecek inşa etmeyi amaçlıyoruz. Kullanıcı dostu araçlarımızla,
                        herkesin sürdürülebilirlik yolculuğuna katkıda bulunmasını sağlıyoruz.
                    </p>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">2M+</div>
                            <div className="text-sm text-green-800">Hesaplama</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">50K+</div>
                            <div className="text-sm text-green-800">Kullanıcı</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
                            <div className="text-sm text-green-800">Azaltım</div>
                        </div>
                    </div>
                </div>
                <div className="relative h-96 rounded-xl overflow-hidden">
                    <Image
                        src="/about-image.jpg"
                        alt="Sürdürülebilir Gelecek"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                        Doğru Hesaplama
                    </h3>
                    <p className="text-gray-600">
                        En güncel emisyon faktörlerini ve bilimsel verileri kullanarak doğru sonuçlar sunuyoruz.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                        Kişiselleştirilmiş Öneriler
                    </h3>
                    <p className="text-gray-600">
                        Her kullanıcıya özel, uygulanabilir emisyon azaltım önerileri sunuyoruz.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                        Güvenilir Veriler
                    </h3>
                    <p className="text-gray-600">
                        Uluslararası standartlara uygun, güncel veri kaynakları kullanıyoruz.
                    </p>
                </div>
            </div>

            <div className="bg-green-50 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-semibold text-green-800 mb-4">
                    Sürdürülebilir Bir Gelecek İçin
                </h2>
                <p className="text-green-600 max-w-2xl mx-auto mb-6">
                    Karbon ayak izinizi hesaplayarak çevre dostu bir yaşam için ilk adımı atın.
                    Gezegenimizin geleceği için bugünden harekete geçin.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                    Hesaplamaya Başla
                </Link>
            </div>
        </div>
    )
}