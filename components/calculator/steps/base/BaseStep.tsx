'use client'

import React from 'react'
import Input from '@/components/ui/Input'
import StepContainer from '@/components/calculator/StepContainer'

interface BaseStepProps {
    title: string
    description: string
    tip: string
    value: string
    setValue: (value: string) => void
    label: string
    unit: string
    helper: string
    calculatorType: 'school' | 'cafe' | 'personal'
}

export default function BaseStep({
                                     title,
                                     description,
                                     tip,
                                     value,
                                     setValue,
                                     label,
                                     unit,
                                     helper,
                                 }: BaseStepProps) {
    return (
        <StepContainer
            title={title}
            description={description}
            tip={tip}
        >
            <Input
                label={label}
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                min="0"
                unit={unit}
                helper={helper}
            />
        </StepContainer>
    )
}