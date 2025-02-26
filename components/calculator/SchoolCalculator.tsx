'use client'

import React, { useState } from 'react'
import {
    SchoolStep,
    SchoolWaste,
    SchoolVehicle,
    SchoolCalculationResults,
    FuelType,
    VehicleField
} from '@/types/calculator'
import { COEFFICIENTS } from '@/constants/coefficients'
import StepIndicator from './StepIndicator'
import ElectricityStep from '@/components/calculator/steps/base/ElectricityStep'
import HeatingStep from '@/components/calculator/steps/base/HeatingStep'
import WasteStep from '@/components/calculator/steps/base/WasteStep'
import WaterStep from '@/components/calculator/steps/base/WaterStep'
import FuelStep from '@/components/calculator/steps/base/FuelStep'
import Results from './steps/school/Results'
import ProgressBar from '@/components/ProgressBar'
import { useEmission } from '@/context/EmissionContext'

export default function SchoolCalculator() {
    // Adım kontrolü için state
    const [currentStep, setCurrentStep] = useState<SchoolStep>('electricity')

    // Elektrik için state
    const [monthlyElectricity, setMonthlyElectricity] = useState('')

    // Isınma için state
    const [monthlyHeating, setMonthlyHeating] = useState('')

    // Atık için state
    const [waste, setWaste] = useState<SchoolWaste>({
        generalWaste: '',
        organicWaste: '',
        hasRecycling: false,
        recyclingAmount: ''
    })

    // Su için state
    const [monthlyWater, setMonthlyWater] = useState('')

    // Yakıt için state'ler
    const [vehicles, setVehicles] = useState<SchoolVehicle[]>([])
    const [vehicleCount, setVehicleCount] = useState('')

    // Sonuçlar için state
    const [results, setResults] = useState<SchoolCalculationResults>({
        electricityCO2: null,
        electricityM3: null,
        heatingCO2: null,
        heatingM3: null,
        generalWasteCO2: null,
        generalWasteM3: null,
        organicWasteCO2: null,
        organicWasteM3: null,
        recyclingCO2: null,
        recyclingM3: null,
        totalWasteCO2: null,
        totalWasteM3: null,
        waterCO2: null,
        waterM3: null,
        fuelCO2: null,
        fuelM3: null,
        gasolineCO2: null,
        dieselCO2: null,
        electricVehicleCO2: null,
        totalCO2: null,
        totalM3: null
    })

    const { addToCO2, resetCO2 } = useEmission()

    const handleNextStep = () => {
        switch (currentStep) {
            case 'electricity':
                if (monthlyElectricity) {
                    const electricityCO2 = parseFloat(monthlyElectricity) * COEFFICIENTS.electricity
                    addToCO2(electricityCO2)
                    setCurrentStep('heating')
                }
                break
            case 'heating':
                if (monthlyHeating) {
                    const heatingCO2 = parseFloat(monthlyHeating) * COEFFICIENTS.naturalGas
                    addToCO2(heatingCO2)
                    setCurrentStep('waste')
                }
                break
            case 'waste':
                if (waste.generalWaste && waste.organicWaste) {
                    const generalWasteCO2 = parseFloat(waste.generalWaste) * COEFFICIENTS.generalWaste
                    const organicWasteCO2 = parseFloat(waste.organicWaste) * COEFFICIENTS.organicWaste
                    let recyclingCO2 = 0

                    if (waste.hasRecycling && waste.recyclingAmount) {
                        recyclingCO2 = parseFloat(waste.recyclingAmount) * COEFFICIENTS.recycling
                    }

                    const totalWasteCO2 = generalWasteCO2 + organicWasteCO2 - recyclingCO2
                    addToCO2(totalWasteCO2)
                    setCurrentStep('water')
                }
                break
            case 'water':
                if (monthlyWater) {
                    const waterCO2 = parseFloat(monthlyWater) * COEFFICIENTS.water
                    addToCO2(waterCO2)
                    setCurrentStep('fuel')
                }
                break
            case 'fuel':
                const allVehiclesComplete = vehicles.every(v =>
                    v.fuelType && v.dailyDistance
                )
                if (vehicleCount === '0' || (vehicles.length > 0 && allVehiclesComplete)) {
                    let totalFuelCO2 = 0
                    vehicles.forEach(vehicle => {
                        if (vehicle.fuelType && vehicle.dailyDistance) {
                            const monthlyDistance = parseFloat(vehicle.dailyDistance) * 22 // 22 iş günü
                            switch (vehicle.fuelType) {
                                case 'gasoline':
                                    totalFuelCO2 += monthlyDistance * COEFFICIENTS.gasoline
                                    break
                                case 'diesel':
                                    totalFuelCO2 += monthlyDistance * COEFFICIENTS.diesel
                                    break
                                case 'electric':
                                    totalFuelCO2 += monthlyDistance * COEFFICIENTS.electricVehicle
                                    break
                            }
                        }
                    })
                    addToCO2(totalFuelCO2)
                    calculateFinalResults()
                    setCurrentStep('results')
                }
                break
        }
    }

    const handlePrevStep = () => {
        switch (currentStep) {
            case 'heating':
                setCurrentStep('electricity')
                break
            case 'waste':
                setCurrentStep('heating')
                break
            case 'water':
                setCurrentStep('waste')
                break
            case 'fuel':
                setCurrentStep('water')
                break
            case 'results':
                setCurrentStep('fuel')
                break
        }
    }

    const calculateFinalResults = () => {
        // Elektrik hesaplaması
        const electricityCO2 = parseFloat(monthlyElectricity) * COEFFICIENTS.electricity
        const electricityM3 = electricityCO2 * COEFFICIENTS.m3Conversion

        // Isınma hesaplaması
        const heatingCO2 = parseFloat(monthlyHeating) * COEFFICIENTS.naturalGas
        const heatingM3 = heatingCO2 * COEFFICIENTS.m3Conversion

        // Atık hesaplaması
        const generalWasteCO2 = parseFloat(waste.generalWaste) * COEFFICIENTS.generalWaste
        const generalWasteM3 = generalWasteCO2 * COEFFICIENTS.m3Conversion
        const organicWasteCO2 = parseFloat(waste.organicWaste) * COEFFICIENTS.organicWaste
        const organicWasteM3 = organicWasteCO2 * COEFFICIENTS.m3Conversion
        let recyclingCO2 = 0
        let recyclingM3 = 0

        if (waste.hasRecycling && waste.recyclingAmount) {
            recyclingCO2 = parseFloat(waste.recyclingAmount) * COEFFICIENTS.recycling
            recyclingM3 = recyclingCO2 * COEFFICIENTS.m3Conversion
        }

        const totalWasteCO2 = generalWasteCO2 + organicWasteCO2 - recyclingCO2
        const totalWasteM3 = totalWasteCO2 * COEFFICIENTS.m3Conversion

        // Su hesaplaması
        const waterCO2 = parseFloat(monthlyWater) * COEFFICIENTS.water
        const waterM3 = waterCO2 * COEFFICIENTS.m3Conversion

        // Araç emisyonları
        let gasolineCO2 = 0
        let dieselCO2 = 0
        let electricVehicleCO2 = 0

        vehicles.forEach(vehicle => {
            if (vehicle.dailyDistance && vehicle.fuelType) {
                const distance = parseFloat(vehicle.dailyDistance)
                if (vehicle.fuelType === 'gasoline') {
                    gasolineCO2 += distance * COEFFICIENTS.gasoline
                } else if (vehicle.fuelType === 'diesel') {
                    dieselCO2 += distance * COEFFICIENTS.diesel
                } else if (vehicle.fuelType === 'electric') {
                    electricVehicleCO2 += distance * COEFFICIENTS.electricVehicle
                }
            }
        })

        const fuelCO2 = gasolineCO2 + dieselCO2 + electricVehicleCO2
        const fuelM3 = fuelCO2 * COEFFICIENTS.m3Conversion

        // Toplam hesaplama
        const totalCO2 = electricityCO2 + heatingCO2 + totalWasteCO2 + waterCO2 + fuelCO2
        const totalM3 = totalCO2 * COEFFICIENTS.m3Conversion

        setResults({
            // Elektrik
            electricityCO2,
            electricityM3,

            // Isınma
            heatingCO2,
            heatingM3,

            // Atık
            generalWasteCO2,
            generalWasteM3,
            organicWasteCO2,
            organicWasteM3,
            recyclingCO2,
            recyclingM3,
            totalWasteCO2,
            totalWasteM3,

            // Su
            waterCO2,
            waterM3,

            // Araç emisyonları
            gasolineCO2,
            dieselCO2,
            electricVehicleCO2,
            fuelCO2,
            fuelM3,

            // Toplam
            totalCO2,
            totalM3
        })
    }

    // Araç sayısı belirleme
    const handleVehicleCountChange = (count: string) => {
        setVehicleCount(count)
        const vehicleNum = parseInt(count)
        if (vehicleNum > 0) {
            setVehicles(Array.from({ length: vehicleNum }, (_, index) => ({
                id: index,
                fuelType: null,
                dailyDistance: ''
            })))
        } else {
            setVehicles([])
        }
    }

    // Araç bilgilerini güncelleme
    const updateVehicle = (id: number, field: VehicleField, value: string | FuelType) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
        ))
    }

    const isStepValid = () => {
        if (currentStep === 'electricity') {
            return monthlyElectricity !== ''
        }
        if (currentStep === 'heating') {
            return monthlyHeating !== ''
        }
        if (currentStep === 'waste') {
            return waste.generalWaste !== '' && waste.organicWaste !== '' &&
                (!waste.hasRecycling || (waste.hasRecycling && waste.recyclingAmount !== ''))
        }
        if (currentStep === 'water') {
            return monthlyWater !== ''
        }
        if (currentStep === 'fuel') {
            if (vehicleCount === '' || parseInt(vehicleCount) === 0) return true
            return vehicles.every(v => v.fuelType && v.dailyDistance !== '')
        }
        return true
    }

    const handleReset = () => {
        setCurrentStep('electricity')
        setMonthlyElectricity('')
        setMonthlyHeating('')
        setWaste({
            generalWaste: '',
            organicWaste: '',
            hasRecycling: false,
            recyclingAmount: ''
        })
        setMonthlyWater('')
        setVehicles([])
        setVehicleCount('')
        setResults({
            electricityCO2: null,
            electricityM3: null,
            heatingCO2: null,
            heatingM3: null,
            generalWasteCO2: null,
            generalWasteM3: null,
            organicWasteCO2: null,
            organicWasteM3: null,
            recyclingCO2: null,
            recyclingM3: null,
            totalWasteCO2: null,
            totalWasteM3: null,
            waterCO2: null,
            waterM3: null,
            fuelCO2: null,
            fuelM3: null,
            gasolineCO2: null,
            dieselCO2: null,
            electricVehicleCO2: null,
            totalCO2: null,
            totalM3: null
        })
        resetCO2()
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-green-800">Okul CO2 Emisyon Hesaplayıcı</h2>

            <div className="flex gap-8">
                <div className="flex-grow">
                    <StepIndicator currentStep={currentStep} calculatorType="school" />

                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        {currentStep === 'electricity' && (
                            <ElectricityStep
                                monthlyElectricity={monthlyElectricity}
                                setMonthlyElectricity={setMonthlyElectricity}
                                calculatorType='school'
                            />
                        )}

                        {currentStep === 'heating' && (
                            <HeatingStep
                                monthlyHeating={monthlyHeating}
                                setMonthlyHeating={setMonthlyHeating}
                                calculatorType='school'
                            />
                        )}

                        {currentStep === 'waste' && (
                            <WasteStep
                                waste={waste}
                                setWaste={setWaste}
                                calculatorType='school'
                            />
                        )}

                        {currentStep === 'water' && (
                            <WaterStep
                                monthlyWater={monthlyWater}
                                setMonthlyWater={setMonthlyWater}
                                calculatorType='school'
                            />
                        )}

                        {currentStep === 'fuel' && (
                            <FuelStep
                                vehicleCount={vehicleCount}
                                setVehicleCount={handleVehicleCountChange}
                                vehicles={vehicles}
                                updateVehicle={updateVehicle}
                                calculatorType='school'
                            />
                        )}

                        {currentStep === 'results' && (
                            <Results results={results} onReset={handleReset} />
                        )}

                        <div className="p-6 bg-green-50 border-t border-green-100">
                            <div className="flex justify-between gap-4">
                                {currentStep !== 'electricity' && currentStep !== 'results' && (
                                    <button
                                        onClick={handlePrevStep}
                                        className="px-4 py-3 rounded-lg bg-white text-green-700 font-medium border-2 border-green-200 hover:border-green-300 transition-colors"
                                    >
                                        Geri Dön
                                    </button>
                                )}

                                {currentStep !== 'results' ? (
                                    <button
                                        onClick={handleNextStep}
                                        disabled={!isStepValid()}
                                        className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors
                                            ${isStepValid()
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-green-300 cursor-not-allowed'}`}
                                    >
                                        {currentStep === 'electricity' ? 'Isınma Bilgilerine Geç' :
                                            currentStep === 'heating' ? 'Atık Bilgilerine Geç' :
                                                currentStep === 'waste' ? 'Su Bilgilerine Geç' :
                                                    currentStep === 'water' ? 'Yakıt Bilgilerine Geç' :
                                                        'Sonuçları Göster'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleReset}
                                        className="w-full py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Yeniden Hesapla
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-32 flex-shrink-0">
                    <div className="sticky top-6">
                        <ProgressBar />
                    </div>
                </div>
            </div>
        </div>
    )
}