'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
    AutomotiveSteps,
    CementSteps,
    ChemicalsSteps,
    ElectronicsSteps,
    FoodSteps,
    MetalsSteps,
    PackagingSteps,
    TextilesSteps
} from '@/types/calculator'

interface StepIndicatorProps {
    currentStep: AutomotiveSteps | CementSteps | ChemicalsSteps | ElectronicsSteps | FoodSteps | MetalsSteps | PackagingSteps | TextilesSteps
    calculatorType: 'automotive' | 'cement' | 'chemicals' | 'electronics' | 'food' | 'metals' | 'packaging' | 'textiles'
    progress: number
}

type AllSteps = AutomotiveSteps | CementSteps | ChemicalsSteps | ElectronicsSteps | FoodSteps | MetalsSteps | PackagingSteps | TextilesSteps

interface Step {
    id: AllSteps
    label: string
    icon: string // SVG ikon için base64
}

export default function StepIndicator({ currentStep, calculatorType, progress }: StepIndicatorProps) {
    const stepRefs = useRef<(HTMLDivElement | null)[]>([])

    // SVG ikonları
    const icons = {
        electricity: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0119 12c0 3.87-3.13 7-7 7A6.995 6.995 0 016 7.83L4.59 6.41 3.17 7.83 1.76 6.41C4.45 3.73 8.53 2 13 2c1.72 0 3.33.41 4.83 1.17z'/%3E%3C/svg%3E",
        naturalGas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E",
        water: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z'/%3E%3C/svg%3E",
        rawUsage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E",
        rawTransportation: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M18 4h-2V3c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2z'/%3E%3C/svg%3E",
        vehicleDistribution: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-1-9.5h-4.5l2 2H18l1-2z'/%3E%3C/svg%3E",
        waste: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M3 6l3-3h6l3 3h5v2H4v-2zm4 4v12h10V10H7zm5 8h-2v-6h2v6z'/%3E%3C/svg%3E",
        staffTransportation: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-6H8v-2h8v2z'/%3E%3C/svg%3E",
        logistics: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm9 14c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'/%3E%3C/svg%3E",
        usage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E",
        results: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E"
    }

    // Adım tanımları
    const steps: { [key: string]: Step[] } = {
        automotive: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'naturalGas', label: 'Doğal Gaz Tüketimi', icon: icons.naturalGas },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'rawTransportation', label: 'Hammadde Taşıma', icon: icons.rawTransportation },
            { id: 'vehicleDistribution', label: 'Araç Dağıtımı', icon: icons.vehicleDistribution },
            { id: 'waste', label: 'Atık ve Fire', icon: icons.waste },
            { id: 'staffTransportation', label: 'Personel Ulaşımı', icon: icons.staffTransportation },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        cement: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'naturalGas', label: 'Doğal Gaz Tüketimi', icon: icons.naturalGas },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'logistics', label: 'Lojistik', icon: icons.logistics },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        chemicals: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'naturalGas', label: 'Doğal Gaz Tüketimi', icon: icons.naturalGas },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'waste', label: 'Atık Yönetimi', icon: icons.waste },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        electronics: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'logistics', label: 'Lojistik', icon: icons.logistics },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        food: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'naturalGas', label: 'Doğal Gaz Tüketimi', icon: icons.naturalGas },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'logistics', label: 'Lojistik', icon: icons.logistics },
            { id: 'waste', label: 'Atık Yönetimi', icon: icons.waste },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        metals: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'naturalGas', label: 'Doğal Gaz Tüketimi', icon: icons.naturalGas },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'waste', label: 'Atık Yönetimi', icon: icons.waste },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        packaging: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'logistics', label: 'Lojistik', icon: icons.logistics },
            { id: 'waste', label: 'Atık Yönetimi', icon: icons.waste },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ],
        textiles: [
            { id: 'electricity', label: 'Elektrik Tüketimi', icon: icons.electricity },
            { id: 'water', label: 'Su Tüketimi', icon: icons.water },
            { id: 'rawUsage', label: 'Hammadde Kullanımı', icon: icons.rawUsage },
            { id: 'logistics', label: 'Lojistik', icon: icons.logistics },
            { id: 'waste', label: 'Atık Yönetimi', icon: icons.waste },
            { id: 'results', label: 'Sonuçlar', icon: icons.results }
        ]
    }

    // Mevcut hesap makinesi için adımları al
    const currentSteps = steps[calculatorType] || steps.automotive

    // Kaydırma ile ilerleme takibi
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 2
            stepRefs.current.forEach((ref) => {
                if (ref && ref.offsetTop <= scrollPosition) {
                    // Adım görünürse vurgulanabilir
                    ref.classList.add('opacity-100')
                    ref.classList.remove('opacity-50')
                }
            })
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Animasyon varyantları
    const stepVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-64 h-[calc(100vh-6rem)] overflow-y-auto sticky top-12">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">İlerleme Durumu</h3>
            <div className="relative">
                {/* İlerleme Çubuğu */}
                <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-100 rounded-full">
                    <motion.div
                        className="w-full bg-indigo-600 rounded-full"
                        initial={{ height: 0 }}
                        animate={{ height: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </div>

                {/* Adımlar */}
                <div className="space-y-4 mt-2">
                    {currentSteps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            ref={(el) => (stepRefs.current[index] = el)}
                            className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                                currentStep === step.id ? 'bg-blue-50 opacity-100' : 'opacity-50'
                            }`}
                            variants={stepVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                        >
                            <img src={step.icon} alt={`${step.label} ikonu`} className="w-6 h-6" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">{step.label}</p>
                                {currentStep === step.id && (
                                    <motion.span
                                        className="text-xs text-indigo-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        Aktif
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm font-semibold text-blue-800">Tamamlanma: {progress}%</p>
            </div>
        </div>
    )
}