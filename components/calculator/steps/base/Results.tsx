'use client'

import React from 'react'
import { BaseResults, ResultSection, EmissionStatus } from '@/types/calculator'
import { getEmissionAnalysis } from '@/utils/emissionAnalysis'

interface ResultsProps {
    results: BaseResults
    type: 'personal' | 'school' | 'cafe'
    onReset: () => void
}

export default function Results({results, type, onReset}: ResultsProps) {
    const formatValue = (value: number | null): string => {
        if (value === null || value === 0) return '-'
        return value.toFixed(2)
    }

    const analysis = getEmissionAnalysis(results, type)

    const renderSection = (section: ResultSection) => {
        if (!section.values.some(v => v.value > 0)) return null;

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {section.title}
                </h4>
                <div className="space-y-4">
                    {section.layout === 'grid' ? (
                        // Grid layout için (Yiyecek Su Atığı)
                        <div className="grid grid-cols-2 gap-4">
                            {section.values.map((item, index) => (
                                item.value > 0 && (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <h5 className="font-medium text-gray-700">{item.label}</h5>
                                            <p className="text-sm text-gray-600 mt-1">
                                                <span className="font-semibold text-blue-600">{formatValue(item.value)} {item.unit}</span>
                                            </p>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    ) : (
                        // Normal layout için (diğer bölümler)
                        section.values.map((item, index) => (
                            item.value > 0 && (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <h5 className="font-medium text-gray-700">{item.label}</h5>
                                        <div className="mt-1 space-y-1">
                                            <p className="text-sm text-gray-600">
                                                CO2: <span className="font-semibold text-green-600">{formatValue(item.value)} kg</span>
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Hacim: <span className="font-semibold text-blue-600">{formatValue(item.volume)} m³</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>
                {section.total && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {section.total.value ? (
                            // Yiyecek Su Atığı için toplam
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-600">Toplam Su Atığı:</span>
                                <span className="text-blue-600">{formatValue(section.total.value)} {section.total.unit}</span>
                            </div>
                        ) : (
                            // Diğer bölümler için toplam
                            <>
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-600">Toplam CO2:</span>
                                    <span className="text-green-600">{formatValue(section.total.co2)} kg</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium mt-1">
                                    <span className="text-gray-600">Toplam Hacim:</span>
                                    <span className="text-blue-600">{formatValue(section.total.volume)} m³</span>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className={`text-2xl font-bold mb-2 ${analysis.status.color}`}>
                    {analysis.status.title}
                </div>
                <p className="text-gray-600">{analysis.status.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <div className="text-3xl font-bold text-green-600">
                            {formatValue(results.totalCO2)} kg
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Toplam CO2 Emisyonu</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-blue-600">
                            {formatValue(results.totalM3)} m³
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Toplam Hacim</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {analysis.sections.map((section, index) => (
                    <React.Fragment key={index}>
                        {renderSection(section)}
                    </React.Fragment>
                ))}
            </div>

            {analysis.suggestions.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        {type === 'personal' ? 'Size Özel Öneriler' :
                            type === 'school' ? 'Okulunuz İçin Öneriler' :
                                'İşletmeniz İçin Öneriler'}
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        {analysis.suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="bg-green-50 rounded-lg p-4"
                            >
                                <h5 className="font-medium text-green-800 mb-3">
                                    {suggestion.category}
                                </h5>
                                <ul className="space-y-2">
                                    {suggestion.tips.map((tip, tipIndex) => (
                                        <li
                                            key={tipIndex}
                                            className="text-sm text-green-600 flex items-start"
                                        >
                                            <span className="mr-2">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}