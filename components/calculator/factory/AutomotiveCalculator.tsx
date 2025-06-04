'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { TypeAnimation } from 'react-type-animation'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { AutomotiveCalculationResults, AutomotiveSteps } from '@/types/calculator'
import { useEmission } from '@/context/EmissionContext'
import { COEFFICIENTS } from '@/constants/coefficients'
import HelpModal from "@/components/calculator/factory/HelpModal";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

const AutomotiveCalculator = () => {
    // Adım kontrolü
    const [currentStep, setCurrentStep] = useState<AutomotiveSteps>('form')
    const formRef = useRef<HTMLDivElement>(null)

    // Help modal state
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

    // Input state'leri
    const [electricity, setElectricity] = useState('')
    const [electricityUnit, setElectricityUnit] = useState<'kWh' | 'MWh'>('kWh')
    const [naturalGas, setNaturalGas] = useState('')
    const [water, setWater] = useState('')
    const [waterUnit, setWaterUnit] = useState<'m³' | 'litre'>('m³')
    const [rawSteelUsage, setRawSteelUsage] = useState('')
    const [rawAluminumUsage, setRawAluminiumUsage] = useState('')
    const [rawPlasticUsage, setRawPlasticUsage] = useState('')
    const [rawCoatingAndPaintChemicals, setRawCoatingAndPaintChemicals] = useState('')
    const [rawTransLand, setRawTransLand] = useState('')
    const [rawTransSea, setRawTransSea] = useState('')
    const [rawTransRailway, setRawTransRailway] = useState('')
    const [vehicleDistrLand, setVehicleDistrLand] = useState('')
    const [vehicleDistrSea, setVehicleDistrSea] = useState('')
    const [vehicleDistrRailway, setVehicleDistrRailway] = useState('')
    const [wasteMetal, setWasteMetal] = useState('')
    const [wastePlastic, setWastePlastic] = useState('')
    const [wasteChemicals, setWasteChemicals] = useState('')
    const [staffTransPersonal, setStaffTransPersonal] = useState('')
    const [staffTransCompany, setStaffTransCompany] = useState('')

    // Hata mesajları
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    // Sonuçlar state
    const [results, setResults] = useState<AutomotiveCalculationResults>({
        electricityCO2: null,
        electricityM3: null,
        naturalGasCO2: null,
        naturalGasM3: null,
        waterCO2: null,
        waterM3: null,
        rawUsageCO2: null,
        rawUsageM3: null,
        rawTransportationCO2: null,
        rawTransportationM3: null,
        vehicleDistributionCO2: null,
        vehicleDistributionM3: null,
        wasteCO2: null,
        wasteM3: null,
        staffTransportationCO2: null,
        staffTransportationM3: null,
        totalCO2: null,
        totalM3: null
    })

    const { addToCO2, resetCO2 } = useEmission()

    // İkonlar
    const icons = {
        electricity: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0119 12c0 3.87-3.13 7-7 7A6.995 6.995 0 016 7.83L4.59 6.41 3.17 7.83 1.76 6.41C4.45 3.73 8.53 2 13 2c1.72 0 3.33.41 4.83 1.17z'/%3E%3C/svg%3E",
        naturalGas: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E",
        water: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z'/%3E%3C/svg%3E",
        rawUsage: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E",
        rawTransportation: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M18 4h-2V3c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2z'/%3E%3C/svg%3E",
        vehicleDistribution: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-1-9.5h-4.5l2 2H18l1-2z'/%3E%3C/svg%3E",
        waste: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M3 6l3-3h6l3 3h5v2H4v-2zm4 4v12h10V10H7zm5 8h-2v-6h2v6z'/%3E%3C/svg%3E",
        staffTransportation: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-6H8v-2h8v2z'/%3E%3C/svg%3E",
        results: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dbeafe'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E"
    }

    // Formun tamamlanma yüzdesi
    const calculateProgress = () => {
        const fields = [
            electricity,
            naturalGas,
            water,
            rawSteelUsage,
            rawAluminumUsage,
            rawPlasticUsage,
            rawCoatingAndPaintChemicals,
            rawTransLand,
            rawTransSea,
            rawTransRailway,
            vehicleDistrLand,
            vehicleDistrSea,
            vehicleDistrRailway,
            wasteMetal,
            wastePlastic,
            wasteChemicals,
            staffTransPersonal,
            staffTransCompany
        ]
        const filledFields = fields.filter(field => field !== '').length
        return Math.round((filledFields / fields.length) * 100)
    }

    // Hesaplama fonksiyonları
    const rawUsageTotal = () => {
        const steelCO2 = parseFloat(rawSteelUsage) * COEFFICIENTS.factory.automotive.rawUsage.steel
        const aluminumCO2 = parseFloat(rawAluminumUsage) * COEFFICIENTS.factory.automotive.rawUsage.aluminum
        const plasticCO2 = parseFloat(rawPlasticUsage) * COEFFICIENTS.factory.automotive.rawUsage.plastic
        const coatingAndPaintChemicalsCO2 = parseFloat(rawCoatingAndPaintChemicals) * COEFFICIENTS.factory.automotive.rawUsage.coatingAndPaintChemicals
        return steelCO2 + aluminumCO2 + plasticCO2 + coatingAndPaintChemicalsCO2
    }

    const rawTransportationTotal = () => {
        const landCO2 = parseFloat(rawTransLand) * COEFFICIENTS.factory.automotive.rawTransportation.land
        const seaCO2 = parseFloat(rawTransSea) * COEFFICIENTS.factory.automotive.rawTransportation.sea
        const railwayCO2 = parseFloat(rawTransRailway) * COEFFICIENTS.factory.automotive.rawTransportation.railway
        return landCO2 + seaCO2 + railwayCO2
    }

    const vehicleDistributionTotal = () => {
        const landCO2 = parseFloat(vehicleDistrLand) * COEFFICIENTS.factory.automotive.vehicleDistribution.land
        const seaCO2 = parseFloat(vehicleDistrSea) * COEFFICIENTS.factory.automotive.vehicleDistribution.sea
        const railwayCO2 = parseFloat(vehicleDistrRailway) * COEFFICIENTS.factory.automotive.vehicleDistribution.railway
        return landCO2 + seaCO2 + railwayCO2
    }

    const wasteTotal = () => {
        const metalCO2 = parseFloat(wasteMetal) * COEFFICIENTS.factory.automotive.waste.metal
        const plasticCO2 = parseFloat(wastePlastic) * COEFFICIENTS.factory.automotive.waste.plastic
        const chemicalsCO2 = parseFloat(wasteChemicals) * COEFFICIENTS.factory.automotive.waste.chemicals
        return metalCO2 + plasticCO2 + chemicalsCO2
    }

    const staffTransportationTotal = () => {
        const personalCO2 = parseFloat(staffTransPersonal) * COEFFICIENTS.factory.automotive.staffTransportation.personal
        const companyCO2 = parseFloat(staffTransCompany) * COEFFICIENTS.factory.automotive.staffTransportation.company
        return personalCO2 + companyCO2
    }

    const calculateFinalResults = () => {
        const electricityValue = electricityUnit === 'MWh' ? parseFloat(electricity) * 1000 : parseFloat(electricity)
        const electricityCO2 = electricityValue * COEFFICIENTS.factory.automotive.electricity
        const electricityM3 = electricityCO2 * COEFFICIENTS.m3Conversion
        const naturalGasCO2 = parseFloat(naturalGas) * COEFFICIENTS.factory.automotive.naturalGas
        const naturalGasM3 = naturalGasCO2 * COEFFICIENTS.m3Conversion
        const waterValue = waterUnit === 'litre' ? parseFloat(water) / 1000 : parseFloat(water)
        const waterCO2 = waterValue * COEFFICIENTS.factory.automotive.water
        const waterM3 = waterCO2 * COEFFICIENTS.m3Conversion
        const rawUsageCO2 = rawUsageTotal()
        const rawUsageM3 = rawUsageCO2 * COEFFICIENTS.m3Conversion
        const rawTransportationCO2 = rawTransportationTotal()
        const rawTransportationM3 = rawTransportationCO2 * COEFFICIENTS.m3Conversion
        const vehicleDistributionCO2 = vehicleDistributionTotal()
        const vehicleDistributionM3 = vehicleDistributionCO2 * COEFFICIENTS.m3Conversion
        const wasteCO2 = wasteTotal()
        const wasteM3 = wasteCO2 * COEFFICIENTS.m3Conversion
        const staffTransportationCO2 = staffTransportationTotal()
        const staffTransportationM3 = staffTransportationCO2 * COEFFICIENTS.m3Conversion
        const totalCO2 = electricityCO2 + naturalGasCO2 + waterCO2 + rawUsageCO2 + rawTransportationCO2 + vehicleDistributionCO2 + wasteCO2 + staffTransportationCO2
        const totalM3 = totalCO2 * COEFFICIENTS.m3Conversion

        setResults({
            electricityCO2,
            electricityM3,
            naturalGasCO2,
            naturalGasM3,
            waterCO2,
            waterM3,
            rawUsageCO2,
            rawUsageM3,
            rawTransportationCO2,
            rawTransportationM3,
            vehicleDistributionCO2,
            vehicleDistributionM3,
            wasteCO2,
            wasteM3,
            staffTransportationCO2,
            staffTransportationM3,
            totalCO2,
            totalM3
        })

        addToCO2(totalCO2)
    }

    // Karbon ayak izi skoru
    const calculateCarbonScore = () => {
        const totalCO2 = results.totalCO2 || 0
        if (totalCO2 < 1000) return { score: 'A', color: 'bg-green-500', text: 'Mükemmel! Çok düşük karbon ayak izi.' }
        if (totalCO2 < 5000) return { score: 'B', color: 'bg-lime-500', text: 'İyi! Daha fazla optimizasyon mümkün.' }
        if (totalCO2 < 10000) return { score: 'C', color: 'bg-yellow-500', text: 'Orta. İyileştirme alanları var.' }
        if (totalCO2 < 20000) return { score: 'D', color: 'bg-orange-500', text: 'Yüksek emisyon. Azaltma önerilir.' }
        return { score: 'E', color: 'bg-red-500', text: 'Çok yüksek! Acil iyileştirme gerekli.' }
    }

    // Form doğrulama
    const isFormValid = () => {
        const newErrors: { [key: string]: string } = {}

        if (electricity === '') newErrors.electricity = 'Elektrik tüketimi boş olamaz.'
        if (parseFloat(electricity) < 0) newErrors.electricity = 'Elektrik tüketimi negatif olamaz.'
        if (naturalGas === '') newErrors.naturalGas = 'Doğal gaz tüketimi boş olamaz.'
        if (parseFloat(naturalGas) < 0) newErrors.naturalGas = 'Doğal gaz tüketimi negatif olamaz.'
        if (water === '') newErrors.water = 'Su tüketimi boş olamaz.'
        if (parseFloat(water) < 0) newErrors.water = 'Su tüketimi negatif olamaz.'
        if (rawSteelUsage === '') newErrors.rawSteelUsage = 'Çelik kullanımı boş olamaz.'
        if (parseFloat(rawSteelUsage) < 0) newErrors.rawSteelUsage = 'Çelik kullanımı negatif olamaz.'
        if (rawAluminumUsage === '') newErrors.rawAluminumUsage = 'Alüminyum kullanımı boş olamaz.'
        if (parseFloat(rawAluminumUsage) < 0) newErrors.rawAluminumUsage = 'Alüminyum kullanımı negatif olamaz.'
        if (rawPlasticUsage === '') newErrors.rawPlasticUsage = 'Plastik kullanımı boş olamaz.'
        if (parseFloat(rawPlasticUsage) < 0) newErrors.rawPlasticUsage = 'Plastik kullanımı negatif olamaz.'
        if (rawCoatingAndPaintChemicals === '') newErrors.rawCoatingAndPaintChemicals = 'Kaplama kimyasalları boş olamaz.'
        if (parseFloat(rawCoatingAndPaintChemicals) < 0) newErrors.rawCoatingAndPaintChemicals = 'Kaplama kimyasalları negatif olamaz.'
        if (rawTransLand === '') newErrors.rawTransLand = 'Kara taşıma boş olamaz.'
        if (parseFloat(rawTransLand) < 0) newErrors.rawTransLand = 'Kara taşıma negatif olamaz.'
        if (rawTransSea === '') newErrors.rawTransSea = 'Deniz taşıma boş olamaz.'
        if (parseFloat(rawTransSea) < 0) newErrors.rawTransSea = 'Deniz taşıma negatif olamaz.'
        if (rawTransRailway === '') newErrors.rawTransRailway = 'Demiryolu taşıma boş olamaz.'
        if (parseFloat(rawTransRailway) < 0) newErrors.rawTransRailway = 'Demiryolu taşıma negatif olamaz.'
        if (vehicleDistrLand === '') newErrors.vehicleDistrLand = 'Kara dağıtım boş olamaz.'
        if (parseFloat(vehicleDistrLand) < 0) newErrors.vehicleDistrLand = 'Kara dağıtım negatif olamaz.'
        if (vehicleDistrSea === '') newErrors.vehicleDistrSea = 'Deniz dağıtım boş olamaz.'
        if (parseFloat(vehicleDistrSea) < 0) newErrors.vehicleDistrSea = 'Deniz dağıtım negatif olamaz.'
        if (vehicleDistrRailway === '') newErrors.vehicleDistrRailway = 'Demiryolu dağıtım boş olamaz.'
        if (parseFloat(vehicleDistrRailway) < 0) newErrors.vehicleDistrRailway = 'Demiryolu dağıtım negatif olamaz.'
        if (wasteMetal === '') newErrors.wasteMetal = 'Metal atık boş olamaz.'
        if (parseFloat(wasteMetal) < 0) newErrors.wasteMetal = 'Metal atık negatif olamaz.'
        if (wastePlastic === '') newErrors.wastePlastic = 'Plastik atık boş olamaz.'
        if (parseFloat(wastePlastic) < 0) newErrors.wastePlastic = 'Plastik atık negatif olamaz.'
        if (wasteChemicals === '') newErrors.wasteChemicals = 'Kimyasal atık boş olamaz.'
        if (parseFloat(wasteChemicals) < 0) newErrors.wasteChemicals = 'Kimyasal atık negatif olamaz.'
        if (staffTransPersonal === '') newErrors.staffTransPersonal = 'Bireysel ulaşım boş olamaz.'
        if (parseFloat(staffTransPersonal) < 0) newErrors.staffTransPersonal = 'Bireysel ulaşım negatif olamaz.'
        if (staffTransCompany === '') newErrors.staffTransCompany = 'Şirket ulaşımı boş olamaz.'
        if (parseFloat(staffTransCompany) < 0) newErrors.staffTransCompany = 'Şirket ulaşımı negatif olamaz.'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Form gönderimi
    const handleSubmit = () => {
        if (isFormValid()) {
            calculateFinalResults()
            setCurrentStep('results')
        }
    }

    // Sıfırlama
    const handleReset = () => {
        setCurrentStep('form')
        setElectricity('')
        setElectricityUnit('kWh')
        setNaturalGas('')
        setWater('')
        setWaterUnit('m³')
        setRawSteelUsage('')
        setRawAluminiumUsage('')
        setRawPlasticUsage('')
        setRawCoatingAndPaintChemicals('')
        setRawTransLand('')
        setRawTransSea('')
        setRawTransRailway('')
        setVehicleDistrLand('')
        setVehicleDistrSea('')
        setVehicleDistrRailway('')
        setWasteMetal('')
        setWastePlastic('')
        setWasteChemicals('')
        setStaffTransPersonal('')
        setStaffTransCompany('')
        setErrors({})
        setResults({
            electricityCO2: null,
            electricityM3: null,
            naturalGasCO2: null,
            naturalGasM3: null,
            waterCO2: null,
            waterM3: null,
            rawUsageCO2: null,
            rawUsageM3: null,
            rawTransportationCO2: null,
            rawTransportationM3: null,
            vehicleDistributionCO2: null,
            vehicleDistributionM3: null,
            wasteCO2: null,
            wasteM3: null,
            staffTransportationCO2: null,
            staffTransportationM3: null,
            totalCO2: null,
            totalM3: null
        })
        resetCO2()
    }

    // Sonuçları kaydet
    const handleSaveResults = () => {
        localStorage.setItem('automotiveResults', JSON.stringify(results))
        alert('Sonuçlar tarayıcıda kaydedildi!')
    }

    // Grafik verileri
    const pieData = useMemo(() => ({
        labels: [
            'Elektrik',
            'Doğal Gaz',
            'Su',
            'Hammadde Kullanımı',
            'Hammadde Taşıma',
            'Araç Dağıtımı',
            'Atık ve Fire',
            'Personel Ulaşımı'
        ],
        datasets: [{
            data: [
                results.electricityCO2 || 0,
                results.naturalGasCO2 || 0,
                results.waterCO2 || 0,
                results.rawUsageCO2 || 0,
                results.rawTransportationCO2 || 0,
                results.vehicleDistributionCO2 || 0,
                results.wasteCO2 || 0,
                results.staffTransportationCO2 || 0
            ],
            backgroundColor: [
                '#4F46E5', // indigo-600
                '#818CF8', // indigo-400
                '#BFDBFE', // blue-200
                '#FBBF24', // yellow-400
                '#F59E0B', // amber-500
                '#EF4444', // red-500
                '#10B981', // emerald-500
                '#6B7280'  // gray-500
            ],
            borderColor: '#ffffff',
            borderWidth: 2
        }]
    }), [results])

    const barData = useMemo(() => ({
        labels: [
            'Elektrik',
            'Doğal Gaz',
            'Su',
            'Hammadde',
            'Hammadde Taşıma',
            'Araç Dağıtımı',
            'Atık',
            'Personel Ulaşımı'
        ],
        datasets: [{
            label: 'CO2 Emisyonları (kg)',
            data: [
                results.electricityCO2 || 0,
                results.naturalGasCO2 || 0,
                results.waterCO2 || 0,
                results.rawUsageCO2 || 0,
                results.rawTransportationCO2 || 0,
                results.vehicleDistributionCO2 || 0,
                results.wasteCO2 || 0,
                results.staffTransportationCO2 || 0
            ],
            backgroundColor: '#4F46E5',
            borderColor: '#4F46E5',
            borderWidth: 1,
            borderRadius: 8
        }]
    }), [results])

    // Öneriler
    const getSuggestions = () => {
        const suggestions = []
        if (results.electricityCO2 && results.electricityCO2 > 1000) {
            suggestions.push('Elektrik tüketiminizi yenilenebilir enerji kaynaklarıyla (güneş, rüzgar) azaltabilirsiniz.')
        }
        if (results.rawUsageCO2 && results.rawUsageCO2 > 5000) {
            suggestions.push('Geri dönüştürülmüş malzemeler kullanarak hammadde emisyonlarını düşürebilirsiniz.')
        }
        if (results.vehicleDistributionCO2 && results.vehicleDistributionCO2 > 2000) {
            suggestions.push('Elektrikli veya hibrit araçlarla dağıtım yaparak emisyonları azaltabilirsiniz.')
        }
        return suggestions.length > 0 ? suggestions : ['Sürdürülebilirlik hedeflerinize ulaşmak için mevcut süreçlerinizi gözden geçirin.']
    }

    // Animasyon varyantları
    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
    }

    const buttonVariants = {
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 }
    }

    // Klavye navigasyonu
    const handleKeyDown = (e: React.KeyboardEvent, nextInput?: string) => {
        if (e.key === 'Enter' && nextInput) {
            document.getElementById(nextInput)?.focus()
        }
    }

    // Sonuç ekranına geçişte en üste kaydırma
    useEffect(() => {
        if (currentStep === 'results' && formRef.current) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [currentStep])

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="absolute inset-0 bg-white opacity-5" style={{
                backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5e7eb'%3E%3Cpath d='M20 4h-6c-1.1 0-2 .9-2 2v1c-1.1 0-2 .9-2 2h-2V3c0-1.1.9-2 2-2h6v2h2c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-12v-2h6c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2h-2V5h6c1.1 0 2-.9 2-2v-1z'/%3E%3C/svg%3E')`
            }} />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:px-8">
                {/* Başlık ve Yardım Butonu */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <TypeAnimation
                        sequence={[
                            'Otomotiv Karbon Ayak İzi Analizi',
                            750,
                            'Sürdürülebilirlik Raporlama Platformu',
                            750
                        ]}
                        wrapper="h1"
                        repeat={Infinity}
                        className="text-xl font-extrabold text-gray-900"
                    />
                    <p className="text-sm text-gray-600 mt-3">
                        Bu form, fabrikanızın karbon emisyonlarını resmi standartlara uygun şekilde hesaplar. Tüm alanları doğru ve eksiksiz doldurun.
                    </p>
                    <motion.button
                        onClick={() => setIsHelpModalOpen(true)}
                        className="mt-4 px-4 py-1.5 bg-gray-800 text-white rounded-md text-sm font-semibold hover:bg-gray-900 transition-colors"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Veri Gereksinimleri
                    </motion.button>
                </motion.div>

                {/* Form veya Sonuçlar */}
                <motion.div
                    ref={formRef}
                    className="bg-white p-6 rounded-md shadow-md border border-gray-300"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {currentStep === 'form' && (
                        <div>
                            <h2 className="text-lg font-extrabold text-gray-900 mb-4">Karbon Ayak İzi Veri Girişi</h2>
                            <p className="text-sm text-gray-600 mb-4">Aşağıdaki bilgileri eksiksiz sağlayın.</p>

                            {/* Elektrik Tüketimi */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.electricity} alt="Elektrik ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Elektrik Tüketimi</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık elektrik tüketimi.</p>
                                <div className="relative">
                                    <input
                                        id="electricity"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={electricity}
                                        onChange={(e) => setElectricity(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, 'naturalGas')}
                                        className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        placeholder={`Tüketim (${electricityUnit})`}
                                    />
                                    <select
                                        value={electricityUnit}
                                        onChange={(e) => setElectricityUnit(e.target.value as 'kWh' | 'MWh')}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-gray-50 rounded-md text-gray-900 text-xs"
                                    >
                                        <option value="kWh">kWh</option>
                                        <option value="MWh">MWh</option>
                                    </select>
                                </div>
                                {errors.electricity && <p className="text-red-600 text-xs mt-1">{errors.electricity}</p>}
                            </div>

                            {/* Doğal Gaz Tüketimi */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.naturalGas} alt="Doğal gaz ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Doğal Gaz Tüketimi</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık doğal gaz tüketimi (m³).</p>
                                <input
                                    id="naturalGas"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={naturalGas}
                                    onChange={(e) => setNaturalGas(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 'water')}
                                    className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                    placeholder="Tüketim (m³)"
                                />
                                {errors.naturalGas && <p className="text-red-600 text-xs mt-1">{errors.naturalGas}</p>}
                            </div>

                            {/* Su Tüketimi */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.water} alt="Su ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Su Tüketimi</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık su tüketimi.</p>
                                <div className="relative">
                                    <input
                                        id="water"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={water}
                                        onChange={(e) => setWater(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, 'rawSteelUsage')}
                                        className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                        placeholder={`Tüketim (${waterUnit})`}
                                    />
                                    <select
                                        value={waterUnit}
                                        onChange={(e) => setWaterUnit(e.target.value as 'm³' | 'litre')}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-gray-50 rounded-md text-gray-900 text-xs"
                                    >
                                        <option value="m³">m³</option>
                                        <option value="litre">litre</option>
                                    </select>
                                </div>
                                {errors.water && <p className="text-red-600 text-xs mt-1">{errors.water}</p>}
                            </div>

                            {/* Hammadde Kullanımı */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.rawUsage} alt="Hammadde ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Hammadde Kullanımı</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık hammadde tüketimi (ton).</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                    <div>
                                        <input
                                            id="rawSteelUsage"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={rawSteelUsage}
                                            onChange={(e) => setRawSteelUsage(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'rawAluminumUsage')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Çelik (ton)"
                                        />
                                        {errors.rawSteelUsage && <p className="text-red-600 text-xs mt-1">{errors.rawSteelUsage}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="rawAluminumUsage"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={rawAluminumUsage}
                                            onChange={(e) => setRawAluminiumUsage(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'rawPlasticUsage')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Alüminyum (ton)"
                                        />
                                        {errors.rawAluminumUsage && <p className="text-red-600 text-xs mt-1">{errors.rawAluminumUsage}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="rawPlasticUsage"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={rawPlasticUsage}
                                            onChange={(e) => setRawPlasticUsage(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'rawCoatingAndPaintChemicals')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Plastik (ton)"
                                        />
                                        {errors.rawPlasticUsage && <p className="text-red-600 text-xs mt-1">{errors.rawPlasticUsage}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="rawCoatingAndPaintChemicals"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={rawCoatingAndPaintChemicals}
                                            onChange={(e) => setRawCoatingAndPaintChemicals(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'rawTransLand')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Kaplama kimyasalları (ton)"
                                        />
                                        {errors.rawCoatingAndPaintChemicals && <p className="text-red-600 text-xs mt-1">{errors.rawCoatingAndPaintChemicals}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Hammadde Taşıma */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.rawTransportation} alt="Hammadde taşıma ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Hammadde Taşıma</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık taşıma yükleri (ton-km).</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            id="rawTransLand"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={rawTransLand}
                                            onChange={(e) => setRawTransLand(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'rawTransSea')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Kara (ton-km)"
                                        />
                                        {errors.rawTransLand && <p className="text-red-600 text-xs mt-1">{errors.rawTransLand}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="rawTransSea"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={rawTransSea}
                                            onChange={(e) => setRawTransSea(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'rawTransRailway')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Deniz (ton-km)"
                                        />
                                        {errors.rawTransSea && <p className="text-red-600 text-xs mt-1">{errors.rawTransSea}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="rawTransRailway"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={rawTransRailway}
                                            onChange={(e) => setRawTransRailway(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'vehicleDistrLand')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Demiryolu (ton-km)"
                                        />
                                        {errors.rawTransRailway && <p className="text-red-600 text-xs mt-1">{errors.rawTransRailway}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Araç Dağıtımı */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.vehicleDistribution} alt="Araç dağıtım ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Araç Dağıtımı</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık dağıtım mesafeleri (ton-km).</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            id="vehicleDistrLand"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={vehicleDistrLand}
                                            onChange={(e) => setVehicleDistrLand(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'vehicleDistrSea')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Kara (ton-km)"
                                        />
                                        {errors.vehicleDistrLand && <p className="text-red-600 text-xs mt-1">{errors.vehicleDistrLand}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="vehicleDistrSea"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={vehicleDistrSea}
                                            onChange={(e) => setVehicleDistrSea(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'vehicleDistrRailway')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Deniz (ton-km)"
                                        />
                                        {errors.vehicleDistrSea && <p className="text-red-600 text-xs mt-1">{errors.vehicleDistrSea}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="vehicleDistrRailway"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={vehicleDistrRailway}
                                            onChange={(e) => setVehicleDistrRailway(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'wasteMetal')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Demiryolu (ton-km)"
                                        />
                                        {errors.vehicleDistrRailway && <p className="text-red-600 text-xs mt-1">{errors.vehicleDistrRailway}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Atık ve Fire */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.waste} alt="Atık ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Atık ve Fire</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık atık miktarı (ton).</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div>
                                        <input
                                            id="wasteMetal"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={wasteMetal}
                                            onChange={(e) => setWasteMetal(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'wastePlastic')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Metal (ton)"
                                        />
                                        {errors.wasteMetal && <p className="text-red-600 text-xs mt-1">{errors.wasteMetal}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="wastePlastic"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={wastePlastic}
                                            onChange={(e) => setWastePlastic(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'wasteChemicals')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Plastik (ton)"
                                        />
                                        {errors.wastePlastic && <p className="text-red-600 text-xs mt-1">{errors.wastePlastic}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="wasteChemicals"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={wasteChemicals}
                                            onChange={(e) => setWasteChemicals(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'staffTransPersonal')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Kimyasal (ton)"
                                        />
                                        {errors.wasteChemicals && <p className="text-red-600 text-xs mt-1">{errors.wasteChemicals}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Personel Ulaşımı */}
                            <div className="mb-4 border border-gray-300 rounded-md p-3 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <img src={icons.staffTransportation} alt="Personel ulaşım ikonu" className="w-4 h-4 mr-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Personel Ulaşımı</h3>
                                </div>
                                <p className="text-xs text-gray-600 mb-2">Yıllık ulaşım mesafeleri (km).</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                        <input
                                            id="staffTransPersonal"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={staffTransPersonal}
                                            onChange={(e) => setStaffTransPersonal(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, 'staffTransCompany')}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Bireysel (km)"
                                        />
                                        {errors.staffTransPersonal && <p className="text-red-600 text-xs mt-1">{errors.staffTransPersonal}</p>}
                                    </div>
                                    <div>
                                        <input
                                            id="staffTransCompany"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={staffTransCompany}
                                            onChange={(e) => setStaffTransCompany(e.target.value)}
                                            className="w-full p-1.5 border border-gray-300 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                                            placeholder="Şirket (km)"
                                        />
                                        {errors.staffTransCompany && <p className="text-red-600 text-xs mt-1">{errors.staffTransCompany}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Gönder Butonu */}
                            <motion.div
                                className="flex justify-end"
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-1.5 bg-gray-800 text-white rounded-md text-sm font-semibold hover:bg-gray-900 transition"
                                >
                                    Analizi Tamamla
                                </button>
                            </motion.div>
                        </div>
                    )}

                    {currentStep === 'results' && (
                        <div>
                            <div className="flex items-center mb-3">
                                <img src={icons.results} alt="Sonuçlar ikonu" className="w-4 h-4 mr-2" />
                                <h3 className="text-lg font-semibold text-gray-900">Analiz Sonuçları</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">Fabrikanızın karbon ayak izine ilişkin detaylı rapor.</p>

                            {/* Karbon Skoru */}
                            <motion.div
                                className="flex items-center mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className={`px-2 py-1 text-xs text-white font-semibold rounded-full ${calculateCarbonScore().color}`}>
                                    Skor: {calculateCarbonScore().score}
                                </div>
                                <p className="ml-2 text-sm text-gray-600">{calculateCarbonScore().text}</p>
                            </motion.div>

                            {/* Grafikler */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <motion.div
                                    className="bg-white p-3 rounded-md border border-gray-200"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Katkı Yüzdeleri</h4>
                                    <div className="h-48">
                                        <Pie
                                            data={pieData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: {
                                                    legend: { position: 'top', labels: { color: '#1f2937', font: { size: 10 } } },
                                                    tooltip: { backgroundColor: '#fff', borderColor: '#1f2937', borderWidth: 1, bodyColor: '#1f2937', bodyFont: { size: 10 } },
                                                    datalabels: {
                                                        color: '#1f2937',
                                                        font: { size: 8 },
                                                        formatter: (value: number, context: any) => {
                                                            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0)
                                                            return `${((value / total) * 100).toFixed(1)}%`
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="bg-white p-3 rounded-md border border-gray-200"
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    <h4 className="text-xs font-semibold text-gray-900 mb-2">Karbon Emisyonları</h4>
                                    <div className="h-48">
                                        <Bar
                                            data={barData}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                        title: { display: true, text: 'CO2 (ton)', color: '#1f2937', font: { size: 10 } },
                                                        ticks: { color: '#1f2937', font: { size: 10 } }
                                                    },
                                                    x: {
                                                        title: { display: true, text: 'Kategori', color: '#1f2937', font: { size: 10 } },
                                                        ticks: { color: '#1f2937', font: { size: 10 } }
                                                    }
                                                },
                                                plugins: {
                                                    legend: { display: false },
                                                    tooltip: { backgroundColor: '#fff', borderColor: '#1f2937', borderWidth: 1, bodyColor: '#1f2937', bodyFont: { size: 10 } }
                                                }
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Tablo */}
                            <div className="overflow-x-auto mb-4">
                                <table className="w-full text-left text-sm border border-gray-200">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="p-2 font-medium text-gray-900">Kategori</th>
                                        <th className="p-2 font-medium text-gray-900">CO2 (ton)</th>
                                        <th className="p-2 font-medium text-gray-900">m³</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Elektrik</td>
                                        <td className="p-2">{((results.electricityCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.electricityM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Doğal Gaz</td>
                                        <td className="p-2">{((results.naturalGasCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.naturalGasM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Su</td>
                                        <td className="p-2">{((results.waterCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.waterM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Hammadde</td>
                                        <td className="p-2">{((results.rawUsageCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.rawUsageM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Hammadde Taşıma</td>
                                        <td className="p-2">{((results.rawTransportationCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.rawTransportationM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Araç Dağıtımı</td>
                                        <td className="p-2">{((results.vehicleDistributionCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.vehicleDistributionM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Atık</td>
                                        <td className="p-2">{((results.wasteCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.wasteM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-b border-gray-200">
                                        <td className="p-2">Personel Ulaşımı</td>
                                        <td className="p-2">{((results.staffTransportationCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.staffTransportationM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr className="font-medium bg-gray-100">
                                        <td className="p-2">Toplam</td>
                                        <td className="p-2">{((results.totalCO2 || 0) / 1000).toFixed(2)}</td>
                                        <td className="p-2">{(results.totalM3 || 0).toFixed(2)}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Öneriler */}
                            <motion.div
                                className="bg-gray-50 p-3 rounded-md border border-gray-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                            >
                                <h4 className="text-xs font-semibold text-gray-900 mb-2">Emisyon Azaltım Önerileri</h4>
                                <ul className="list-disc list-inside text-gray-600 text-xs">
                                    {getSuggestions().map((suggestion, index) => (
                                        <li key={index}>{suggestion}</li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Butonlar */}
                            <motion.div
                                className="flex flex-wrap justify-end gap-2 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.8 }}
                            >
                                <button
                                    onClick={handleSaveResults}
                                    className="px-4 py-1.5 bg-blue-800 text-white rounded-md text-sm font-semibold hover:bg-blue-900 transition"
                                >
                                    Sonuçları Kaydet
                                </button>
                                <button
                                    onClick={() => alert('Rapor indirme özelliği geliştirme aşamasında.')}
                                    className="px-4 py-1.5 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-700 transition"
                                >
                                    Rapor İndir
                                </button>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Navigasyon Butonları */}
                {currentStep === 'results' && (
                    <motion.div
                        className="flex justify-end mt-4"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <button
                            onClick={handleReset}
                            className="px-4 py-1.5 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-700 transition"
                        >
                            Yeni Analiz
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Yardım Modalı */}
            <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
        </div>
    )
}

export default AutomotiveCalculator