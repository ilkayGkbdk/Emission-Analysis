import React from 'react'
import { useHistory } from '@/context/HistoryContext'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default function History() {
    const { history, clearHistory } = useHistory()

    const getCalculatorTypeText = (type: string) => {
        switch (type) {
            case 'personal': return 'Bireysel'
            case 'school': return 'Okul'
            case 'cafe': return 'Kafe/Restoran'
            default: return type
        }
    }

    if (history.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                Henüz hesaplama geçmişi bulunmuyor.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-green-800">Hesaplama Geçmişi</h3>
                <button
                    onClick={clearHistory}
                    className="text-sm text-red-600 hover:text-red-800"
                >
                    Geçmişi Temizle
                </button>
            </div>
            <div className="space-y-2">
                {history.map(entry => (
                    <div
                        key={entry.id}
                        className="p-4 bg-white rounded-lg border border-green-100 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-sm text-gray-500">
                                    {format(new Date(entry.date), 'd MMMM yyyy, HH:mm', { locale: tr })}
                                </span>
                                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                    {getCalculatorTypeText(entry.type)}
                                </span>
                            </div>
                        </div>
                        <div className="text-green-800">
                            <p>Toplam CO2: <span className="font-bold">{entry.results.totalCO2?.toFixed(2)} kg</span></p>
                            <p>Toplam Hacim: <span className="font-bold">{entry.results.totalM3?.toFixed(2)} m³</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}