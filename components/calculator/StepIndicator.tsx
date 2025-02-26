'use client'

import React from 'react'
import {Step, SchoolStep, CafeStep} from '@/types/calculator'

interface StepIndicatorProps {
    currentStep: Step | SchoolStep | CafeStep
    calculatorType: 'personal' | 'school' | 'cafe'
}

type AllSteps = Step | SchoolStep | CafeStep

export default function StepIndicator({ currentStep, calculatorType }: StepIndicatorProps) {
    const personalSteps: { id: Step; label: string }[] = [
        { id: 'electricity', label: 'Elektrik' },
        { id: 'heating', label: 'Isınma' },
        { id: 'fuel', label: 'Yakıt' },
        { id: 'results', label: 'Sonuç' }
    ];

    const schoolSteps: { id: AllSteps; label: string }[] = [
        { id: 'electricity', label: 'Elektrik' },
        { id: 'heating', label: 'Isınma' },
        { id: 'waste', label: 'Atık' },
        { id: 'water', label: 'Su' },
        { id: 'fuel', label: 'Yakıt' },
        { id: 'results', label: 'Sonuç' }
    ];

    const cafeSteps: { id: AllSteps; label: string }[] = [
        { id: 'electricity', label: 'Elektrik' },
        { id: 'heating', label: 'Isınma' },
        { id: 'waste', label: 'Atık' },
        { id: 'water', label: 'Su' },
        { id: 'food', label: 'Yiyecek' },
        { id: 'results', label: 'Sonuç' }
    ];

    let steps;
    if (calculatorType === 'personal') steps = personalSteps;
    else if (calculatorType === 'school') steps = schoolSteps;
    else steps = cafeSteps;
    const currentStepIndex = steps.findIndex(step => step.id === currentStep)

    return (
        <div className="flex items-center justify-center">
            <nav className="flex items-center space-x-2" aria-label="Progress">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {index > 0 && (
                            <div className="h-0.5 w-10 bg-gray-200">
                                <div
                                    className={`h-full transition-all duration-500 ${
                                        index <= currentStepIndex ? 'bg-green-500' : ''
                                    }`}
                                />
                            </div>
                        )}
                        <div
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold
                ${
                                index < currentStepIndex
                                    ? 'border-green-500 bg-green-500 text-white'
                                    : index === currentStepIndex
                                        ? 'border-green-500 text-green-500'
                                        : 'border-gray-300 text-gray-500'
                            }
              `}
                        >
              <span className="absolute -bottom-6 w-max text-xs">
                {step.label}
              </span>
                            {index + 1}
                        </div>
                    </React.Fragment>
                ))}
            </nav>
        </div>
    )
} 