'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface HelpModalProps {
    isOpen: boolean
    onClose: () => void
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    const dataRequirements = [
        {
            category: 'Elektrik Tüketimi',
            description: 'Yıllık elektrik tüketimi (kWh veya MWh cinsinden).',
            source: 'Elektrik faturalarınızdan veya enerji yönetim sistemlerinizden temin edebilirsiniz.'
        },
        {
            category: 'Doğal Gaz Tüketimi',
            description: 'Yıllık doğal gaz tüketimi (m³ cinsinden).',
            source: 'Doğal gaz faturalarınızdan veya tesis yönetim kayıtlarından alınabilir.'
        },
        {
            category: 'Su Tüketimi',
            description: 'Yıllık su tüketimi (m³ veya litre cinsinden).',
            source: 'Su faturalarınızdan veya su sayaç kayıtlarından elde edebilirsiniz.'
        },
        {
            category: 'Hammadde Kullanımı',
            description: 'Çelik, alüminyum, plastik ve kaplama kimyasalları kullanımı (ton cinsinden).',
            source: 'Üretim raporları, satın alma kayıtları veya envanter yönetim sistemlerinden temin edilebilir.'
        },
        {
            category: 'Hammadde Taşıma',
            description: 'Kara, deniz ve demiryolu taşımaları (ton-km cinsinden).',
            source: 'Lojistik departmanı raporları veya nakliye firmalarından alınan verilerle hesaplanabilir.'
        },
        {
            category: 'Araç Dağıtımı',
            description: 'Kara, deniz ve demiryolu dağıtım mesafeleri (ton-km cinsinden).',
            source: 'Dağıtım lojistik kayıtları veya üçüncü taraf lojistik firmalarından alınabilir.'
        },
        {
            category: 'Atık ve Fire',
            description: 'Metal, plastik ve kimyasal atık miktarları (ton cinsinden).',
            source: 'Atık yönetim raporları veya geri dönüşüm firmalarından temin edilebilir.'
        },
        {
            category: 'Personel Ulaşımı',
            description: 'Bireysel ve şirket ulaşım mesafeleri (km cinsinden).',
            source: 'Personel ulaşım anketleri, şirket araç kayıtları veya insan kaynakları verilerinden alınabilir.'
        }
    ]

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-900">Gerekli Veriler ve Temin Yöntemleri</h2>
                    <button
                        onClick={onClose}
                        className="text-blue-900 hover:text-blue-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <p className="text-blue-700 mb-6">
                    Karbon ayak izi hesaplaması için aşağıdaki verilere ihtiyacınız bulunmaktadır. Her veri, fabrikanızın çevresel etkisini doğru bir şekilde analiz etmek için kritik öneme sahiptir.
                </p>
                <div className="space-y-6">
                    {dataRequirements.map((item, index) => (
                        <div key={index} className="border-b border-blue-200 pb-4">
                            <h3 className="text-lg font-semibold text-blue-900">{item.category}</h3>
                            <p className="text-blue-700"><strong>Açıklama:</strong> {item.description}</p>
                            <p className="text-blue-700"><strong>Nereden Temin Edilir:</strong> {item.source}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md"
                    >
                        Kapat
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default HelpModal