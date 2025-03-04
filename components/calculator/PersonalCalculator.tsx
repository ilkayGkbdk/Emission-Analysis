'use client'

import React, { useState } from 'react'
import {
    HeatingType,
    PersonalVehicle,
    FuelType,
    VehicleField, PersonalCalculationResults, PersonalStep
} from '@/types/calculator'
import { COEFFICIENTS } from '@/constants/coefficients'
import StepIndicator from './StepIndicator'
import ElectricityStep from '@/components/calculator/steps/base/ElectricityStep'
import HeatingStep from './steps/personal/HeatingStep'
import FuelStep from '@/components/calculator/steps/base/FuelStep'
import Results from './steps/personal/Results'
import ProgressBar from '@/components/ProgressBar'
import { useEmission } from '@/context/EmissionContext'
import { useHistory } from '@/context/HistoryContext'
import History from './History'

export default function PersonalCalculator() {
    // Adım kontrolü için state
    const [currentStep, setCurrentStep] = useState<PersonalStep>('electricity')

    // Elektrik için state
    const [monthlyElectricity, setMonthlyElectricity] = useState('')

    // Isınma için state'ler
    const [heatingType, setHeatingType] = useState<HeatingType>(null)
    const [heatingConsumption, setHeatingConsumption] = useState('')

    // Yakıt için state'ler
    const [vehicles, setVehicles] = useState<PersonalVehicle[]>([])
    const [vehicleCount, setVehicleCount] = useState('')

    // Sonuçlar için state
    const [results, setResults] = useState<PersonalCalculationResults>({
        electricityCO2: null,
        electricityM3: null,
        heatingCO2: null,
        heatingM3: null,
        gasolineCO2: null,
        dieselCO2: null,
        electricVehicleCO2: null,
        totalFuelCO2: null,
        totalFuelM3: null,
        totalCO2: null,
        totalM3: null
    })

    const { addToCO2, resetCO2 } = useEmission()
    const { addToHistory } = useHistory()

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
                if (heatingType && heatingConsumption) {
                    let heatingCO2 = 0
                    switch (heatingType) {
                        case 'naturalGas':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.naturalGas
                            break
                        case 'coal':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.coal
                            break
                        case 'wood':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.wood
                            break
                        case 'lpg':
                            heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.lpg
                            break
                    }
                    addToCO2(heatingCO2)
                    setCurrentStep('fuel')
                }
                break
            case 'fuel':
                const allVehiclesComplete = vehicles.every(v =>
                    v.fuelType && v.consumption
                )
                if (vehicleCount === '0' || (vehicles.length > 0 && allVehiclesComplete)) {
                    let totalFuelCO2 = 0
                    vehicles.forEach(vehicle => {
                        if (vehicle.fuelType && vehicle.consumption) {
                            switch (vehicle.fuelType) {
                                case 'gasoline':
                                    totalFuelCO2 += parseFloat(vehicle.consumption) * COEFFICIENTS.gasoline
                                    break
                                case 'diesel':
                                    totalFuelCO2 += parseFloat(vehicle.consumption) * COEFFICIENTS.diesel
                                    break
                                case 'electric':
                                    totalFuelCO2 += parseFloat(vehicle.consumption) * COEFFICIENTS.electricVehicle
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

    // Araç sayısı belirleme
    const handleVehicleCountChange = (count: string) => {
        setVehicleCount(count)
        const vehicleNum = parseInt(count)
        if (vehicleNum > 0) {
            setVehicles(Array.from({ length: vehicleNum }, (_, index) => ({
                id: index,
                fuelType: null,
                consumption: ''
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
            return heatingType && heatingConsumption !== ''
        }
        if (currentStep === 'fuel') {
            if (vehicleCount === '' || parseInt(vehicleCount) === 0) return true
            return vehicles.every(v => v.fuelType && v.consumption !== '')
        }
        return true
    }

    const handleReset = () => {
        setCurrentStep('electricity')
        setMonthlyElectricity('')
        setHeatingType(null)
        setHeatingConsumption('')
        setVehicles([])
        setVehicleCount('')
        setResults({
            electricityCO2: null,
            electricityM3: null,
            heatingCO2: null,
            heatingM3: null,
            gasolineCO2: null,
            dieselCO2: null,
            electricVehicleCO2: null,
            totalFuelCO2: null,
            totalFuelM3: null,
            totalCO2: null,
            totalM3: null
        })
        resetCO2()
    }

    const calculateFinalResults = () => {
        // Elektrik hesaplaması
        const electricityCO2 = parseFloat(monthlyElectricity) * COEFFICIENTS.electricity
        const electricityM3 = electricityCO2 * COEFFICIENTS.m3Conversion

        // Isınma hesaplaması
        const heatingCO2 = parseFloat(heatingConsumption) * COEFFICIENTS.naturalGas
        const heatingM3 = heatingCO2 * COEFFICIENTS.m3Conversion

        // Araç emisyonları
        let gasolineCO2 = 0
        let dieselCO2 = 0
        let electricVehicleCO2 = 0

        vehicles.forEach(vehicle => {
            if (vehicle.consumption && vehicle.fuelType) {
                const value = parseFloat(vehicle.consumption)
                if (vehicle.fuelType === 'gasoline') {
                    gasolineCO2 += value * COEFFICIENTS.gasoline
                } else if (vehicle.fuelType === 'diesel') {
                    dieselCO2 += value * COEFFICIENTS.diesel
                } else if (vehicle.fuelType === 'electric') {
                    electricVehicleCO2 += value * COEFFICIENTS.electricVehicle
                }
            }
        })

        const totalFuelCO2 = gasolineCO2 + dieselCO2 + electricVehicleCO2
        const totalFuelM3 = totalFuelCO2 * COEFFICIENTS.m3Conversion

        // Toplam hesaplama
        const totalCO2 = electricityCO2 + heatingCO2 + totalFuelCO2
        const totalM3 = totalCO2 * COEFFICIENTS.m3Conversion

        const newResults = {
            // Elektrik
            electricityCO2,
            electricityM3,

            // Isınma
            heatingCO2,
            heatingM3,

            // Araç emisyonları
            gasolineCO2,
            dieselCO2,
            electricVehicleCO2,
            totalFuelCO2,
            totalFuelM3,

            // Toplam
            totalCO2,
            totalM3
        }

        setResults(newResults)

        // History'ye eklerken sadece gerekli alanları gönder (id hariç)
        addToHistory({
            date: new Date().toISOString(),
            type: 'personal',
            results: newResults
        })
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-green-800">Bireysel CO2 Emisyon Hesaplayıcı</h2>

            <div className="flex gap-8">
                <div className="flex-grow">
                    <StepIndicator currentStep={currentStep} calculatorType="personal" />

                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        {currentStep === 'electricity' && (
                            <ElectricityStep
                                monthlyElectricity={monthlyElectricity}
                                setMonthlyElectricity={setMonthlyElectricity}
                                calculatorType="personal"
                            />
                        )}

                        {currentStep === 'heating' && (
                            <HeatingStep
                                heatingType={heatingType}
                                setHeatingType={setHeatingType}
                                heatingConsumption={heatingConsumption}
                                setHeatingConsumption={setHeatingConsumption}
                            />
                        )}

                        {currentStep === 'fuel' && (
                            <FuelStep
                                vehicleCount={vehicleCount}
                                setVehicleCount={handleVehicleCountChange}
                                vehicles={vehicles}
                                updateVehicle={updateVehicle}
                                calculatorType='personal'
                            />
                        )}

                        {currentStep === 'results' && (
                            <Results results={results} onReset={handleReset} />
                        )}

                        <div className="p-6 bg-green-50 border-t border-green-100">
                            {currentStep !== 'results' ? (
                                <button
                                    onClick={handleNextStep}
                                    disabled={!isStepValid()}
                                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                    ${isStepValid()
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-green-300 cursor-not-allowed'}`}
                                >
                                    {currentStep === 'electricity' ? 'Isınma Bilgilerine Geç' :
                                        currentStep === 'heating' ? 'Yakıt Bilgilerine Geç' :
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

                <div className="w-32 flex-shrink-0">
                    <div className="sticky top-6">
                        <ProgressBar />
                    </div>
                </div>

                <div className="w-80">
                    <History />
                </div>
            </div>
        </div>
    )
}