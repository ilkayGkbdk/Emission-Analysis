import {
    BaseResults,
    EmissionAnalysis,
    CafeCalculationResults,
    ResultSection,
    SchoolCalculationResults, PersonalCalculationResults
} from '@/types/calculator'
import { getEmissionSuggestions } from './suggestions'

export const getEmissionAnalysis = (results: PersonalCalculationResults | SchoolCalculationResults | CafeCalculationResults, type: 'personal' | 'school' | 'cafe'): EmissionAnalysis => {
    const total = results.totalCO2 || 0
    const suggestions = getEmissionSuggestions(results, type)

    // Durum analizi
    let status
    if (total < (type === 'personal' ? 200 : type === 'school' ? 1000 : 500)) {
        status = {
            title: 'Tebrikler! Düşük Karbon Ayak İzi',
            description: 'Çevre dostu yaklaşımınızı sürdürmeye devam edin.',
            color: 'text-green-600'
        }
    } else if (total < (type === 'personal' ? 400 : type === 'school' ? 2000 : 1000)) {
        status = {
            title: 'Ortalama Emisyon Seviyesi',
            description: 'İyi gidiyorsunuz, ancak daha fazla iyileştirme yapılabilir.',
            color: 'text-yellow-600'
        }
    } else {
        status = {
            title: 'Yüksek Emisyon Seviyesi',
            description: 'Karbon ayak izinizi azaltmak için acil önlemler almalısınız.',
            color: 'text-red-600'
        }
    }

    // Bölümleri oluştur
    const sections: ResultSection[] = []

    // Elektrik bölümü
    if (results.electricityCO2) {
        sections.push({
            title: 'Elektrik Emisyonları',
            values: [{
                label: 'Elektrik',
                value: results.electricityCO2,
                volume: results.electricityM3 || 0
            }]
        })
    }

    // Isınma bölümü
    if (results.heatingCO2) {
        sections.push({
            title: 'Isınma Emisyonları',
            values: [{
                label: 'Isınma',
                value: results.heatingCO2,
                volume: results.heatingM3 || 0
            }]
        })
    }

    // Atık emisyonları
    if ('generalWasteCO2' in results && 'organicWasteCO2' in results) {
        sections.push({
            title: 'Atık Emisyonları',
            values: [
                {
                    label: 'Genel Atık',
                    value: results.generalWasteCO2 || 0,
                    volume: results.generalWasteM3 || 0
                },
                {
                    label: 'Organik Atık',
                    value: results.organicWasteCO2 || 0,
                    volume: results.organicWasteM3 || 0
                },
                {
                    label: 'Geri Dönüşüm',
                    value: -(results.recyclingCO2 || 0),
                    volume: -(results.recyclingM3 || 0)
                }
            ],
            total: {
                co2: results.totalWasteCO2 || 0,
                volume: results.totalWasteM3 || 0
            }
        })
    }

    // Su emisyonları
    if ('waterCO2' in results) {
        sections.push({
            title: 'Su Emisyonları',
            values: [
                {
                    label: 'Su Tüketimi',
                    value: results.waterCO2 || 0,
                    volume: results.waterM3 || 0
                }
            ]
        })
    }

    // Yiyecek Su atığı (sadece kafe için)
    if (type === 'cafe' && 'foodWaste' in results) {
        type FoodWaterWasteKey = keyof CafeCalculationResults['foodWaste'];

        const foodItems: { key: FoodWaterWasteKey; label: string }[] = [
            { key: 'beef_WaterWaste', label: 'Kırmızı Et' },
            { key: 'lamb_WaterWaste', label: 'Kuzu Eti' },
            { key: 'chicken_WaterWaste', label: 'Tavuk' },
            { key: 'vegetable_WaterWaste', label: 'Sebze' },
            { key: 'fruit_WaterWaste', label: 'Meyve' },
            { key: 'grain_WaterWaste', label: 'Tahıl' },
            { key: 'legumes_WaterWaste', label: 'Baklagiller' },
            { key: 'nut_WaterWaste', label: 'Kuruyemiş' },
            { key: 'milk_WaterWaste', label: 'Süt' },
            { key: 'egg_WaterWaste', label: 'Yumurta' },
            { key: 'butter_WaterWaste', label: 'Tereyağı' },
            { key: 'pork_WaterWaste', label: 'Domuz Eti' }
        ];

        sections.push({
            title: 'Yiyecek Su Atığı',
            values: foodItems.map(item => ({
                label: item.label,
                value: results.foodWaste[item.key],
                volume: 0,
                unit: 'Litre'
            })),
            total: {
                co2: 0,
                volume: 0,
                value: results.totalFoodWaterWaste,
                unit: 'Litre'
            },
            layout: 'grid' // İki sütunlu görünüm için
        })
    }

    return { status, sections, suggestions }
}