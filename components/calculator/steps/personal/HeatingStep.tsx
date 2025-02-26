import React from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import StepContainer from '@/components/calculator/StepContainer'
import { HeatingType } from '@/types/calculator'

interface HeatingStepProps {
    heatingType: HeatingType
    setHeatingType: (value: HeatingType) => void
    heatingConsumption: string
    setHeatingConsumption: (value: string) => void
}

const heatingOptions = [
    { value: '', label: 'Seçiniz' },
    { value: 'naturalGas', label: 'Doğalgaz' },
    { value: 'coal', label: 'Kömür' },
    { value: 'wood', label: 'Odun' },
    { value: 'lpg', label: 'Ev Tüpü (12kg)' }
]

const getConsumptionLabel = (type: HeatingType): string => {
    switch (type) {
        case 'naturalGas': return 'Aylık Doğalgaz Tüketimi'
        case 'coal': return 'Aylık Kömür Tüketimi'
        case 'wood': return 'Aylık Odun Tüketimi'
        case 'lpg': return 'Aylık Tüp Sayısı'
        default: return ''
    }
}

const getConsumptionUnit = (type: HeatingType): string => {
    switch (type) {
        case 'naturalGas': return 'm³'
        case 'coal': return 'kg'
        case 'wood': return 'kg'
        case 'lpg': return 'adet'
        default: return ''
    }
}

export default function HeatingStep({
                                        heatingType,
                                        setHeatingType,
                                        heatingConsumption,
                                        setHeatingConsumption
                                    }: HeatingStepProps) {
    return (
        <StepContainer
            title="Isınma Tüketimi"
            description="Evinizde kullandığınız ısınma tipini ve aylık tüketim miktarını giriniz."
            tip="Faturanızdaki veya alım miktarınızdaki aylık ortalama değeri giriniz."
        >
            <Select
                label="Isınma Tipi"
                value={heatingType || ''}
                onChange={(e) => setHeatingType(e.target.value as HeatingType)}
                options={heatingOptions}
                helper="Evinizde kullandığınız ana ısınma kaynağını seçiniz."
            />

            {heatingType && (
                <Input
                    label={getConsumptionLabel(heatingType)}
                    type="number"
                    value={heatingConsumption}
                    onChange={(e) => setHeatingConsumption(e.target.value)}
                    placeholder="0"
                    min="0"
                    unit={getConsumptionUnit(heatingType)}
                    helper={`Aylık ortalama ${getConsumptionLabel(heatingType).toLowerCase()} miktarını giriniz.`}
                />
            )}
        </StepContainer>
    )
}