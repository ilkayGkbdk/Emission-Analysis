import { BaseResults, EmissionAnalysis, CafeCalculationResults, FoodResults, ResultSection } from '@/types/calculator'
import { getEmissionSuggestions } from './suggestions'

export const getEmissionAnalysis = (results: BaseResults, type: 'personal' | 'school' | 'cafe'): EmissionAnalysis => {
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
            title: 'Elektrik Tüketimi',
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
            title: 'Isınma Tüketimi',
            values: [{
                label: 'Isınma',
                value: results.heatingCO2,
                volume: results.heatingM3 || 0
            }]
        })
    }

    // Kafe için yiyecek emisyonları
    if (type === 'cafe' && isCafeResults(results)) {
        if (results.meatFoodCO2 || results.chickenFoodCO2 || results.vegetableFoodCO2) {
            sections.push({
                title: 'Yiyecek Emisyonları',
                values: [
                    {
                        label: 'Kırmızı Et',
                        value: results.meatFoodCO2 || 0,
                        volume: results.meatFoodM3 || 0
                    },
                    {
                        label: 'Beyaz Et',
                        value: results.chickenFoodCO2 || 0,
                        volume: results.chickenFoodM3 || 0
                    },
                    {
                        label: 'Sebze',
                        value: results.vegetableFoodCO2 || 0,
                        volume: results.vegetableFoodM3 || 0
                    }
                ],
                total: {
                    co2: results.totalFoodCO2 || 0,
                    volume: results.totalFoodM3 || 0
                }
            })
        }
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

    // Su atığı (sadece kafe için)
    if (type === 'cafe' && isCafeResults(results)) {
        type WaterWasteKey = keyof CafeCalculationResults['waterWaste'];

        const foodItems: { key: WaterWasteKey; label: string }[] = [
            { key: 'beef', label: 'Kırmızı Et' },
            { key: 'lamb', label: 'Kuzu Eti' },
            { key: 'chicken', label: 'Tavuk' },
            { key: 'vegetable', label: 'Sebze' },
            { key: 'fruit', label: 'Meyve' },
            { key: 'grain', label: 'Tahıl' },
            { key: 'legumes', label: 'Baklagiller' },
            { key: 'nut', label: 'Kuruyemiş' },
            { key: 'milk', label: 'Süt' },
            { key: 'egg', label: 'Yumurta' },
            { key: 'butter', label: 'Tereyağı' },
            { key: 'pork', label: 'Domuz Eti' }
        ];

        sections.push({
            title: 'Yiyecek Su Atığı',
            values: foodItems.map(item => ({
                label: item.label,
                value: results.waterWaste[item.key],
                volume: 0,
                unit: 'L'
            })),
            total: {
                co2: 0,
                volume: 0,
                value: results.totalWaterWaste,
                unit: 'L'
            },
            layout: 'grid' // İki sütunlu görünüm için
        })
    }

    return { status, sections, suggestions }
}

// Type guard fonksiyonu
function isCafeResults(results: BaseResults): results is CafeCalculationResults {
    return 'meatFoodCO2' in results &&
        'chickenFoodCO2' in results &&
        'vegetableFoodCO2' in results
}