'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
    if (!isOpen) return null

    const dataRequirements = [
        {
            category: 'Elektrik Tüketimi',
            description: 'Yıllık elektrik tüketimi (kWh veya MWh cinsinden).',
            source: 'Enerji faturaları veya tesis enerji yönetim sistemleri.'
        },
        {
            category: 'Doğal Gaz Tüketimi',
            description: 'Yıllık doğal gaz tüketimi (m³ cinsinden).',
            source: 'Doğal gaz faturaları veya tesis yönetim sistemleri.'
        },
        {
            category: 'Su Tüketimi',
            description: 'Yıllık su tüketimi (m³ veya litre cinsinden).',
            source: 'Su faturaları veya sayaç kayıtları.'
        },
        {
            category: 'Hammadde Tüketimi',
            description: 'Çelik, alüminyum, plastik ve kaplama kimyasalları tüketimi (ton cinsinden).',
            source: 'Üretim raporları, satın alma veya envanter kayıtları.'
        },
        {
            category: 'Hammadde Taşıma',
            description: 'Kara, deniz ve demiryolu taşıma yükleri (ton-km cinsinden).',
            source: 'Lojistik raporları veya nakliye firması verileri.'
        },
        {
            category: 'Araç Dağıtımı',
            description: 'Kara, deniz ve demiryolu dağıtım yükleri (ton-km cinsinden).',
            source: 'Dağıtım lojistik kayıtları veya üçüncü taraf nakliye verileri.'
        },
        {
            category: 'Atık ve Fire',
            description: 'Metal, plastik ve kimyasal atık miktarı (ton cinsinden).',
            source: 'Atık yönetim raporları veya geri dönüşüm firması verileri.'
        },
        {
            category: 'Personel Ulaşımı',
            description: 'Bireysel ve şirket ulaşım mesafeleri (km cinsinden).',
            source: 'Personel ulaşım anketleri, şirket araç kayıtları veya İK verileri.'
        }
    ]

    return (
        <motion.div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-md shadow-md p-6 max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Veri Gereksinimleri</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-900 hover:text-gray-700 text-lg font-bold"
                    >
                        ×
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                    Karbon ayak izi analizi için aşağıdaki veriler gereklidir. Doğru veri sağlanması, sonuçların güvenilirliğini artırır.
                </p>
                <div className="space-y-3">
                    {dataRequirements.map((item, index) => (
                        <div key={index} className="border-b border-gray-200 pb-2">
                            <h4 className="text-sm font-semibold text-gray-900">{item.category}</h4>
                            <p className="text-xs text-gray-600"><strong>Açıklama:</strong> {item.description}</p>
                            <p className="text-xs text-gray-600"><strong>Kaynak:</strong> {item.source}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 py-1.5 bg-gray-700 text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition"
                    >
                        Kapat
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}