'use client'

import React from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import StepContainer from '@/components/calculator/StepContainer'
import { SchoolWaste, CafeWaste } from '@/types/calculator'

interface WasteStepProps {
    waste: SchoolWaste | CafeWaste
    setWaste: (waste: SchoolWaste | CafeWaste) => void
    calculatorType: 'school' | 'cafe'
}

const recyclingOptions = [
    { value: 'true', label: 'Evet' },
    { value: 'false', label: 'Hayır' }
]

const stepConfig = {
    school: {
        title: "Atık Yönetimi",
        description: "Okulunuzun aylık atık miktarlarını giriniz.",
        tip: "Atık miktarlarını kilogram cinsinden giriniz. Geri dönüşüm varsa ayrıştırılan atık miktarını belirtiniz.",
        generalWasteHelper: "Aylık toplam genel atık miktarını giriniz.",
        organicWasteHelper: "Aylık toplam organik atık (yemek artıkları vb.) miktarını giriniz.",
        recyclingHelper: "Okulunuzda geri dönüşüm yapılıyorsa 'Evet'i seçiniz."
    },
    cafe: {
        title: "Atık Yönetimi",
        description: "Kafenizin aylık atık miktarlarını giriniz.",
        tip: "Atık miktarlarını kilogram cinsinden giriniz. Geri dönüşüm varsa ayrıştırılan atık miktarını belirtiniz.",
        generalWasteHelper: "Aylık toplam genel atık miktarını giriniz.",
        organicWasteHelper: "Aylık toplam organik atık (yemek artıkları vb.) miktarını giriniz.",
        recyclingHelper: "Kafenizde geri dönüşüm yapılıyorsa 'Evet'i seçiniz."
    }
}

export default function WasteStep({
                                      waste,
                                      setWaste,
                                      calculatorType
                                  }: WasteStepProps) {
    const config = stepConfig[calculatorType]

    const handleWasteChange = (field: keyof (SchoolWaste | CafeWaste), value: string) => {
        setWaste({
            ...waste,
            [field]: field === 'hasRecycling' ? value === 'true' : value
        })
    }

    return (
        <StepContainer
            title={config.title}
            description={config.description}
            tip={config.tip}
        >
            <Input
                label="Genel Atık Miktarı"
                type="number"
                value={waste.generalWaste}
                onChange={(e) => handleWasteChange('generalWaste', e.target.value)}
                placeholder="0"
                min="0"
                unit="kg"
                helper={config.generalWasteHelper}
            />

            <Input
                label="Organik Atık Miktarı"
                type="number"
                value={waste.organicWaste}
                onChange={(e) => handleWasteChange('organicWaste', e.target.value)}
                placeholder="0"
                min="0"
                unit="kg"
                helper={config.organicWasteHelper}
            />

            <Select
                label="Geri Dönüşüm Yapıyor musunuz?"
                value={waste.hasRecycling.toString()}
                onChange={(e) => handleWasteChange('hasRecycling', e.target.value)}
                options={recyclingOptions}
                helper={config.recyclingHelper}
            />

            {waste.hasRecycling && (
                <Input
                    label="Geri Dönüşüm Miktarı"
                    type="number"
                    value={waste.recyclingAmount}
                    onChange={(e) => handleWasteChange('recyclingAmount', e.target.value)}
                    placeholder="0"
                    min="0"
                    unit="kg"
                    helper="Aylık toplam geri dönüşüme giden atık miktarını giriniz."
                />
            )}
        </StepContainer>
    )
} 