'use client'

import React from 'react'
import { FuelStepProps, PersonalVehicle, SchoolVehicle, FuelType } from '@/types/calculator'

export default function FuelStep({ vehicleCount, setVehicleCount, vehicles, updateVehicle, calculatorType }: FuelStepProps) {
    // Tip kontrolü için yardımcı fonksiyon
    const isPersonalVehicle = (vehicle: PersonalVehicle | SchoolVehicle): vehicle is PersonalVehicle => {
        return 'consumption' in vehicle
    }

    return (
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                {calculatorType === 'personal' ? 'Araç Yakıt Tüketimi' : 'Servis Araçları'}
            </h3>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Araç Sayısı
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={vehicleCount}
                        onChange={(e) => setVehicleCount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Araç sayısını girin"
                    />
                </div>

                {vehicles.length > 0 && (
                    <div className="space-y-4">
                        {vehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-800 mb-3">
                                    {index + 1}. Araç
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Yakıt Tipi
                                        </label>
                                        <select
                                            value={vehicle.fuelType || ''}
                                            onChange={(e) => updateVehicle(vehicle.id, 'fuelType', e.target.value as FuelType)}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value="gasoline">Benzin</option>
                                            <option value="diesel">Dizel</option>
                                            <option value="electric">Elektrik</option>
                                        </select>
                                    </div>

                                    {vehicle.fuelType && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {vehicle.fuelType === 'electric' && calculatorType === 'personal'
                                                    ? 'Aylık Ortalama Mesafe (km)'
                                                    : calculatorType === 'personal'
                                                        ? 'Aylık Yakıt Tüketimi (lt)'
                                                        : 'Günlük Mesafe (km)'}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={isPersonalVehicle(vehicle) ? vehicle.consumption : vehicle.dailyDistance}
                                                onChange={(e) => updateVehicle(
                                                    vehicle.id,
                                                    isPersonalVehicle(vehicle) ? 'consumption' : 'dailyDistance',
                                                    e.target.value
                                                )}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                placeholder={vehicle.fuelType === 'electric' && calculatorType === 'personal'
                                                    ? "Aylık km'yi girin"
                                                    : calculatorType === 'personal'
                                                        ? "Aylık yakıt tüketimini girin"
                                                        : "Günlük mesafeyi girin"}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}