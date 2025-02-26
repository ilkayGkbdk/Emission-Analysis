import React, { ReactNode } from 'react'

interface StepContainerProps {
    title: string
    description?: string
    children: ReactNode
    tip?: string
}

export default function StepContainer({
                                          title,
                                          description,
                                          children,
                                          tip
                                      }: StepContainerProps) {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h3 className="text-lg font-medium text-green-800 mb-4">
                    {title}
                </h3>
                {description && (
                    <p className="text-gray-600 mb-6">
                        {description}
                    </p>
                )}
            </div>

            <div className="space-y-6">
                {children}
            </div>

            {tip && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        💡 İpucu: {tip}
                    </p>
                </div>
            )}
        </div>
    )
}