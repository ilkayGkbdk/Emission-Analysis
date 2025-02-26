'use client'

import React from 'react'
import { useEmission } from '@/context/EmissionContext'

export default function ProgressBar() {
    const { totalCO2 } = useEmission()
    const co2Value = totalCO2 || 0

    // CO2 değerini kategorize etme
    const getCategory = (value: number) => {
        if (value < 180) return {
            text: 'Düşük Emisyon',
            color: 'text-green-600',
            gradient: 'from-green-500 to-green-300',
            description: 'Harika! Düşük karbon ayak izi.'
        }
        if (value < 270) return {
            text: 'Orta Emisyon',
            color: 'text-yellow-600',
            gradient: 'from-yellow-500 to-yellow-300',
            description: 'İyi gidiyorsunuz, biraz daha azaltabilirsiniz.'
        }
        return {
            text: 'Yüksek Emisyon',
            color: 'text-red-600',
            gradient: 'from-red-500 to-red-300',
            description: 'Emisyonlarınızı azaltmak için önlemler alın.'
        }
    }

    const category = getCategory(co2Value)

    return (
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 w-32 hover:shadow-md transition-shadow duration-300">
            <div className="text-center mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Anlık Emisyon
                </h3>
                <div className="flex items-center justify-center space-x-1">
          <span className={`text-2xl font-bold ${category.color} transition-colors duration-300`}>
            {co2Value.toFixed(1)}
          </span>
                    <span className="text-xs text-gray-500">
            kg CO2
          </span>
                </div>
                <p className={`text-xs mt-1 ${category.color} font-medium transition-colors duration-300`}>
                    {category.text}
                </p>
            </div>

            <div className="space-y-3">
                <div className="relative h-48">
                    <div className="absolute inset-x-0 bottom-0 w-4 h-full bg-gray-100 rounded-full mx-auto">
                        <div
                            className={`absolute bottom-0 inset-x-0 w-4 mx-auto rounded-full transition-all duration-500 bg-gradient-to-t ${category.gradient}`}
                            style={{
                                height: `${Math.min((co2Value / 500) * 100, 100)}%`,
                                opacity: co2Value > 0 ? 1 : 0.3
                            }}
                        />
                        {/* Seviye işaretleyicileri */}
                        <div className="absolute inset-0">
                            <div className="absolute w-6 h-0.5 bg-gray-200 left-4 top-0">
                                <span className="absolute right-0 transform translate-x-2 -translate-y-1/2 text-[10px] text-gray-400">500</span>
                            </div>
                            <div className="absolute w-6 h-0.5 bg-gray-200 left-4 top-1/4">
                                <span className="absolute right-0 transform translate-x-2 -translate-y-1/2 text-[10px] text-gray-400">375</span>
                            </div>
                            <div className="absolute w-6 h-0.5 bg-gray-200 left-4 top-1/2">
                                <span className="absolute right-0 transform translate-x-2 -translate-y-1/2 text-[10px] text-gray-400">250</span>
                            </div>
                            <div className="absolute w-6 h-0.5 bg-gray-200 left-4 top-3/4">
                                <span className="absolute right-0 transform translate-x-2 -translate-y-1/2 text-[10px] text-gray-400">125</span>
                            </div>
                        </div>
                    </div>
                </div>

                {co2Value > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 text-xs">
                                <span className="text-gray-500">Ağaç</span>
                                <span className="font-medium text-gray-700 text-right">
                  {(co2Value * 0.0833).toFixed(1)}/yıl
                </span>
                            </div>
                            <div className="grid grid-cols-2 text-xs">
                                <span className="text-gray-500">Mesafe</span>
                                <span className="font-medium text-gray-700 text-right">
                  {(co2Value * 4).toFixed(1)} km
                </span>
                            </div>
                            <div className="grid grid-cols-2 text-xs">
                                <span className="text-gray-500">Enerji</span>
                                <span className="font-medium text-gray-700 text-right">
                  {(co2Value * 2.5).toFixed(1)} kWh
                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}