'use client'

import React from 'react'
import BaseStep from './BaseStep'

interface HeatingStepProps {
    monthlyHeating: string
    setMonthlyHeating: (value: string) => void
    calculatorType: 'school' | 'cafe'
}

const stepConfig = {
    school: {
        title: "Doğalgaz Tüketimi",
        description: "Okulunuzun aylık doğalgaz tüketimini giriniz.",
        tip: "Doğalgaz faturanızdaki aylık tüketim miktarını m³ cinsinden giriniz.",
        label: "Aylık Doğalgaz Tüketimi",
        helper: "Son doğalgaz faturanızdaki m³ cinsinden tüketim miktarını giriniz."
    },
    cafe: {
        title: "Doğalgaz Tüketimi",
        description: "Kafenizin aylık doğalgaz tüketimini giriniz.",
        tip: "Doğalgaz faturanızdaki aylık tüketim miktarını m³ cinsinden giriniz.",
        label: "Aylık Doğalgaz Tüketimi",
        helper: "Son doğalgaz faturanızdaki m³ cinsinden tüketim miktarını giriniz."
    }
}

export default function HeatingStep({
                                        monthlyHeating,
                                        setMonthlyHeating,
                                        calculatorType
                                    }: HeatingStepProps) {
    const config = stepConfig[calculatorType]

    return (
        <BaseStep
            {...config}
            value={monthlyHeating}
            setValue={setMonthlyHeating}
            unit="m³"
            calculatorType={calculatorType}
        />
    )
}