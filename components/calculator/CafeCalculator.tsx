'use client'

import React, { useState } from 'react'
import { CafeStep, CafeWaste, CafeFood, CafeCalculationResults } from '@/types/calculator'
import { COEFFICIENTS } from '@/constants/coefficients'
import StepIndicator from './StepIndicator'
import ElectricityStep from '@/components/calculator/steps/base/ElectricityStep'
import ProgressBar from '@/components/ProgressBar'
import { useEmission } from '@/context/EmissionContext'
import HeatingStep from '@/components/calculator/steps/base/HeatingStep'
import WasteStep from "@/components/calculator/steps/base/WasteStep";
import WaterStep from "@/components/calculator/steps/base/WaterStep";
import Results from "@/components/calculator/steps/cafe/Results";
import FoodStep from "@/components/calculator/steps/cafe/FoodStep";

export default function CafeCalculator() {
    // Adım kontrolü için state
    const [currentStep, setCurrentStep] = useState<CafeStep>('electricity')

    // Elektrik için state
    const [monthlyElectricity, setMonthlyElectricity] = useState('')

    // Isınma için state
    const [monthlyHeating, setMonthlyHeating] = useState('')

    // Atık için state
    const [waste, setWaste] = useState<CafeWaste>({
        generalWaste: '',
        organicWaste: '',
        hasRecycling: false,
        recyclingAmount: ''
    });

    // Yemek için state
    const [food, setFood] = useState<CafeFood>({
        beefAmount: '',
        lambAmount: '',
        chickenAmount: '',
        vegetableAmount: '',
        fruitAmount: '',
        grainAmount: '',
        legumesAmount: '',
        nutAmount: '',
        milkAmount: '',
        eggAmount: '',
        butterAmount: '',
        porkAmount: ''
    });

    // Su için state
    const [monthlyWater, setMonthlyWater] = useState('')


    // Sonuçlar için state
    const [results, setResults] = useState<CafeCalculationResults | null>(null)

    const { addToCO2, resetCO2 } = useEmission()

    const handleNextStep = () => {
        if (currentStep === 'electricity') {
            const electricityCO2 = parseFloat(monthlyElectricity) * COEFFICIENTS.electricity
            addToCO2(electricityCO2)
            setCurrentStep('heating')
        }
        else if (currentStep === 'heating') {
            const heatingCO2 = parseFloat(monthlyHeating) * COEFFICIENTS.naturalGas
            addToCO2(heatingCO2)
            setCurrentStep('waste')
        }
        else if (currentStep === 'waste') {
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
        else if (currentStep === 'water') {
            const waterCO2 = parseFloat(monthlyWater) * COEFFICIENTS.water
            addToCO2(waterCO2)
            setCurrentStep('food')
        }
        else if (currentStep === 'food') {
            const waterWaste = {
                beef: parseFloat(food.beefAmount || '0') * COEFFICIENTS.beefWater,
                lamb: parseFloat(food.lambAmount || '0') * COEFFICIENTS.lambWater,
                chicken: parseFloat(food.chickenAmount || '0') * COEFFICIENTS.chickenWater,
                vegetable: parseFloat(food.vegetableAmount || '0') * COEFFICIENTS.vegetableWater,
                fruit: parseFloat(food.fruitAmount || '0') * COEFFICIENTS.fruitWater,
                grain: parseFloat(food.grainAmount || '0') * COEFFICIENTS.grainWater,
                legumes: parseFloat(food.legumesAmount || '0') * COEFFICIENTS.legumesWater,
                nut: parseFloat(food.nutAmount || '0') * COEFFICIENTS.nutWater,
                milk: parseFloat(food.milkAmount || '0') * COEFFICIENTS.milkWater,
                egg: parseFloat(food.eggAmount || '0') * COEFFICIENTS.eggWater,
                butter: parseFloat(food.butterAmount || '0') * COEFFICIENTS.butterWater,
                pork: parseFloat(food.porkAmount || '0') * COEFFICIENTS.porkWater,
            }

            const totalWaterWaste = Object.values(waterWaste).reduce((acc, curr) => acc + curr, 0)
            addToCO2(0) // Yemek CO2'si eklemiyoruz artık
            calculateFinalResults()
            setCurrentStep('results')
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

        // Su atığı hesaplaması
        const waterWaste = {
            beef: parseFloat(food.beefAmount || '0') * COEFFICIENTS.beefWater,
            lamb: parseFloat(food.lambAmount || '0') * COEFFICIENTS.lambWater,
            chicken: parseFloat(food.chickenAmount || '0') * COEFFICIENTS.chickenWater,
            vegetable: parseFloat(food.vegetableAmount || '0') * COEFFICIENTS.vegetableWater,
            fruit: parseFloat(food.fruitAmount || '0') * COEFFICIENTS.fruitWater,
            grain: parseFloat(food.grainAmount || '0') * COEFFICIENTS.grainWater,
            legumes: parseFloat(food.legumesAmount || '0') * COEFFICIENTS.legumesWater,
            nut: parseFloat(food.nutAmount || '0') * COEFFICIENTS.nutWater,
            milk: parseFloat(food.milkAmount || '0') * COEFFICIENTS.milkWater,
            egg: parseFloat(food.eggAmount || '0') * COEFFICIENTS.eggWater,
            butter: parseFloat(food.butterAmount || '0') * COEFFICIENTS.butterWater,
            pork: parseFloat(food.porkAmount || '0') * COEFFICIENTS.porkWater,
        }
        const totalWaterWaste = Object.values(waterWaste).reduce((acc, curr) => acc + curr, 0)

        // Toplam hesaplama
        const totalCO2 = electricityCO2 + heatingCO2 + totalWasteCO2 + waterCO2
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

            // Yemek CO2 değerleri (kullanılmıyor ama tip için gerekli)
            meatFoodCO2: 0,
            meatFoodM3: 0,
            chickenFoodCO2: 0,
            chickenFoodM3: 0,
            vegetableFoodCO2: 0,
            vegetableFoodM3: 0,
            totalFoodCO2: 0,
            totalFoodM3: 0,

            // Su atığı
            waterWaste,
            totalWaterWaste,

            // Toplam
            totalCO2,
            totalM3
        })
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
        if (currentStep === 'food') {
            return food.beefAmount !== '' && food.lambAmount !== '' && food.chickenAmount !== '' && food.vegetableAmount !== '' &&
                food.fruitAmount !== '' && food.grainAmount !== '' && food.legumesAmount !== '' && food.nutAmount !== '' &&
                food.milkAmount !== '' && food.eggAmount !== '' && food.butterAmount !== '' && food.porkAmount !== '';
        }
        return true
    }

    const handleReset = () => {
        setResults(null)
        setCurrentStep('electricity')
        setMonthlyElectricity('')
        setMonthlyHeating('')
        setWaste({
            generalWaste: '',
            organicWaste: '',
            hasRecycling: false,
            recyclingAmount: ''
        })
        setMonthlyWater('');
        setFood({
            beefAmount: '',
            lambAmount: '',
            chickenAmount: '',
            vegetableAmount: '',
            fruitAmount: '',
            grainAmount: '',
            legumesAmount: '',
            nutAmount: '',
            milkAmount: '',
            eggAmount: '',
            butterAmount: '',
            porkAmount: ''
        });
        resetCO2()
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold text-green-800">Kafe CO2 Emisyon Hesaplayıcı</h2>

            <div className="flex gap-8">
                <div className="flex-grow">
                    <StepIndicator currentStep={currentStep} calculatorType="cafe" />

                    <div className="mt-6 bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        {currentStep === 'electricity' && (
                            <ElectricityStep
                                monthlyElectricity={monthlyElectricity}
                                setMonthlyElectricity={setMonthlyElectricity}
                                calculatorType='cafe'
                            />
                        )}

                        {currentStep === 'heating' && (
                            <HeatingStep
                                monthlyHeating={monthlyHeating}
                                setMonthlyHeating={setMonthlyHeating}
                                calculatorType='cafe'
                            />
                        )}

                        {currentStep === 'waste' && (
                            <WasteStep
                                waste={waste}
                                setWaste={setWaste}
                                calculatorType='cafe'
                            />
                        )}

                        {currentStep === 'water' && (
                            <WaterStep
                                monthlyWater={monthlyWater}
                                setMonthlyWater={setMonthlyWater}
                                calculatorType='cafe'
                            />
                        )}

                        {currentStep === 'food' && (
                            <FoodStep
                                food={food}
                                setFood={setFood}
                            />
                        )}

                        {currentStep === 'results' && results && (
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
                                        currentStep === 'heating' ? 'Atık Bilgilerine Geç' :
                                            currentStep === 'waste' ? 'Su Bilgilerine Geç' :
                                                currentStep === 'water' ? 'Yiyecek Bilgilerine Geç' :
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
            </div>
        </div>
    )
}