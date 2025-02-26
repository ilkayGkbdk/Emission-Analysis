'use client'

import React from 'react'
import { CafeFood } from '@/types/calculator'

interface FoodStepProps {
    food: CafeFood
    setFood: (food: CafeFood) => void
}

export default function FoodStep({ food, setFood }: FoodStepProps) {
    const handleChange = (field: keyof CafeFood, value: string) => {
        setFood({
            ...food,
            [field]: value
        })
    }

    const foodItems = [
        { id: 'beef', label: 'Büyük Baş Et', field: 'beefAmount' },
        { id: 'lamb', label: 'Küçük Baş Et', field: 'lambAmount' },
        { id: 'chicken', label: 'Tavuk', field: 'chickenAmount' },
        { id: 'vegetable', label: 'Sebze', field: 'vegetableAmount' },
        { id: 'fruit', label: 'Meyve', field: 'fruitAmount' },
        { id: 'grain', label: 'Tahıl', field: 'grainAmount' },
        { id: 'legumes', label: 'Bakliyat', field: 'legumesAmount' },
        { id: 'nut', label: 'Fındık', field: 'nutAmount' },
        { id: 'milk', label: 'Süt', field: 'milkAmount' },
        { id: 'egg', label: 'Yumurta', field: 'eggAmount' },
        { id: 'butter', label: 'Tereyağı', field: 'butterAmount' },
        { id: 'pork', label: 'Domuz Eti', field: 'porkAmount' },
    ]

    return (
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Aylık Yemek Tüketimi
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Lütfen aylık ortalama tüketim miktarlarını kilogram cinsinden giriniz.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {foodItems.map((item) => (
                    <div key={item.id} className="space-y-2">
                        <label htmlFor={item.id} className="block text-sm font-medium text-gray-700">
                            {item.label} (kg)
                        </label>
                        <input
                            type="number"
                            id={item.id}
                            min="0"
                            value={food[item.field as keyof CafeFood] || ''}
                            onChange={(e) => handleChange(item.field as keyof CafeFood, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                            placeholder="0"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}