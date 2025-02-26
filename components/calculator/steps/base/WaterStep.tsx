'use client'

import React from 'react'
import BaseStep from './BaseStep'

interface WaterStepProps {
    monthlyWater: string
    setMonthlyWater: (value: string) => void
    calculatorType: 'school' | 'cafe'  // Sadece okul ve kafe için
}

const stepConfig = {
    school: {
        title: "Su Tüketimi",
        description: "Okulunuzun aylık su tüketimini giriniz.",
        tip: "Su faturanızdaki aylık tüketim miktarını m³ cinsinden giriniz.",
        label: "Aylık Su Tüketimi",
        helper: "Son su faturanızdaki m³ cinsinden tüketim miktarını giriniz."
    },
    cafe: {
        title: "Su Tüketimi",
        description: "Kafenizin aylık su tüketimini giriniz.",
        tip: "Su faturanızdaki aylık tüketim miktarını m³ cinsinden giriniz.",
        label: "Aylık Su Tüketimi",
        helper: "Son su faturanızdaki m³ cinsinden tüketim miktarını giriniz."
    }
}

export default function WaterStep({
                                      monthlyWater,
                                      setMonthlyWater,
                                      calculatorType
                                  }: WaterStepProps) {
    const config = stepConfig[calculatorType]

    return (
        <BaseStep
            {...config}
            value={monthlyWater}
            setValue={setMonthlyWater}
            unit="m³"
            calculatorType={calculatorType}
        />
    )
}