'use client'

import React from 'react'
import BaseStep from './BaseStep'

interface ElectricityStepProps {
    monthlyElectricity: string
    setMonthlyElectricity: (value: string) => void
    calculatorType: 'school' | 'cafe' | 'personal'
}

const stepConfig = {
    school: {
        title: "Elektrik Tüketimi",
        description: "Okulunuzun aylık elektrik tüketimini giriniz.",
        tip: "Elektrik faturanızda 'Tüketim Miktarı' veya 'kWh' olarak belirtilen değeri giriniz.",
        label: "Aylık Elektrik Tüketimi",
        helper: "Son elektrik faturanızdaki kWh cinsinden tüketim miktarını giriniz."
    },
    cafe: {
        title: "Elektrik Tüketimi",
        description: "Kafenizin aylık elektrik tüketimini giriniz.",
        tip: "Elektrik faturanızda 'Tüketim Miktarı' veya 'kWh' olarak belirtilen değeri giriniz.",
        label: "Aylık Elektrik Tüketimi",
        helper: "Son elektrik faturanızdaki kWh cinsinden tüketim miktarını giriniz."
    },
    personal: {
        title: "Elektrik Tüketimi",
        description: "Evinizin aylık elektrik tüketimini giriniz.",
        tip: "Elektrik faturanızda 'Tüketim Miktarı' veya 'kWh' olarak belirtilen değeri giriniz.",
        label: "Aylık Elektrik Tüketimi",
        helper: "Son elektrik faturanızdaki kWh cinsinden tüketim miktarını giriniz."
    }
}

export default function ElectricityStep({
                                            monthlyElectricity,
                                            setMonthlyElectricity,
                                            calculatorType
                                        }: ElectricityStepProps) {
    const config = stepConfig[calculatorType]

    return (
        <BaseStep
            {...config}
            value={monthlyElectricity}
            setValue={setMonthlyElectricity}
            unit="kWh"
            calculatorType={calculatorType}
        />
    )
}