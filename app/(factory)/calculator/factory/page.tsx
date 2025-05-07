'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FactoryCalculatorPage() {
    const industries = [
        {
            title: 'Otomotiv',
            description: 'Otomotiv sektörü için karbon ayak izi analizleri.',
            href: '/calculator/factory/automotive',
            image: '/otomotiv-sektor.png',
            badge: 'Yüksek Emisyon',
        },
        {
            title: 'Çimento',
            description: 'Çimento üretimi için emisyon hesaplamaları.',
            href: '/calculator/factory/cement',
            image: '/cimento-sektor.png',
            badge: 'Enerji Yoğun',
        },
        {
            title: 'Kimya',
            description: 'Kimya endüstrisi için emisyon analizleri.',
            href: '/calculator/factory/chemicals',
            image: '/kimya-sektor.png',
            badge: 'Kimyasal Atık',
        },
        {
            title: 'Elektronik',
            description: 'Elektronik üretimi için emisyon hesaplamaları.',
            href: '/calculator/factory/electronics',
            image: '/elektronik-sektor.png',
            badge: 'Hassas Üretim',
        },
        {
            title: 'Gıda',
            description: 'Gıda üretimi için karbon ayak izi analizleri.',
            href: '/calculator/factory/food',
            image: '/gida-sektor.jpg',
            badge: 'Organik Atık',
        },
        {
            title: 'Ambalaj',
            description: 'Ambalaj sektörü için emisyon hesaplamaları.',
            href: '/calculator/factory/packaging',
            image: '/ambalaj-sektor.jpg',
            badge: 'Geri Dönüşüm',
        },
        {
            title: 'Metal',
            description: 'Metal üretimi için karbon ayak izi analizleri.',
            href: '/calculator/factory/metals',
            image: '/metal-sektor.jpg',
            badge: 'Yüksek Enerji',
        },
        {
            title: 'Tekstil',
            description: 'Tekstil sektörü için emisyon analizleri.',
            href: '/calculator/factory/textiles',
            image: '/tekstil-sektor.png',
            badge: 'Su Tüketimi',
        },
    ];

    // Kart animasyon varyantları
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    // CTA buton animasyonu
    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.3 } },
        tap: { scale: 0.95 },
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Bölümü */}
            <section
                className="pt-24 pb-16 bg-gradient-to-r from-blue-900 via-indigo-800 to-blue-800 text-white text-center relative z-10"
            >
                {/* Hafif overlay için arka plan katmanı */}
                <div
                    className="absolute inset-0 bg-blue-900 opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23dbeafe' fill-opacity='0.1'%3E%3Cpath d='M0 78.59l5.66-5.66 2.83 2.83L2.83 80H0v-1.41zM0 1.41V0h2.83l5.66 5.66-2.83 2.83L0 1.41zM78.59 80l-5.66-5.66 2.83-2.83L80 78.59V80h-1.41zM80 1.41L74.34 7.07l-2.83-2.83L77.17 0H80v1.41zM40 38.59l5.66-5.66 2.83 2.83L40 44.41l-5.66-5.66 2.83-2.83L40 38.59z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Fabrika CO2 Emisyon Hesaplama Platformu
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Sektörünüze özel, yüksek doğruluklu karbon ayak izi analizleri ile sürdürülebilirliği güçlendirin.
                    </motion.p>
                    <motion.p
                        className="text-base text-blue-200 italic max-w-xl mx-auto mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Premium üyelikle özel raporlama ve stratejik danışmanlık hizmetlerinden yararlanın.
                    </motion.p>
                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link
                            href="#sectors"
                            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                        >
                            Sektörünüzü Seçin
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Sektör Kartları */}
            <section id="sectors" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-semibold text-blue-800 mb-10 text-center">
                    Analize Başlamak İçin Sektörünüzü Seçin
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={industry.title}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.15 }}
                        >
                            <Link
                                href={industry.href}
                                className="block p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-blue-100 relative overflow-hidden group"
                            >
                                {/* Premium Rozeti */}
                                <span className="absolute top-4 right-4 text-xs font-medium text-yellow-600 bg-yellow-100 rounded-full px-3 py-1">
                  Premium
                </span>
                                <img
                                    src={industry.image}
                                    alt={`${industry.title} sektörü resmi`}
                                    className="h-40 w-full object-cover rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                                    {industry.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">{industry.description}</p>
                                <span className="inline-block px-4 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                  {industry.badge}
                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}