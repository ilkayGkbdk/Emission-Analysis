import { BaseResults } from '@/types/calculator'
import { Suggestion } from '@/types/calculator'

export const getEmissionSuggestions = (results: BaseResults, type: 'personal' | 'school' | 'cafe'): Suggestion[] => {
    const suggestions: Suggestion[] = []

    // Elektrik önerileri
    const electricityThreshold = type === 'personal' ? 100 : type === 'school' ? 500 : 300
    if (results.electricityCO2 && results.electricityCO2 > electricityThreshold) {
        suggestions.push({
            category: 'Elektrik',
            tips: type === 'personal' ? [
                'LED ampuller kullanarak enerji tüketimini azaltın.',
                'Kullanılmayan elektronik cihazları tamamen kapatın.',
                'Çamaşır ve bulaşık makinelerini tam dolu çalıştırın.',
                'Doğal aydınlatmadan maksimum faydalanın.',
                'Enerji tasarruflu cihazlar tercih edin.'
            ] : type === 'school' ? [
                'Tüm sınıflarda LED aydınlatma sistemine geçiş yapın.',
                'Teneffüslerde ve boş sınıflarda ışıkları kapatın.',
                'Bilgisayar laboratuvarlarında enerji tasarruflu cihazlar kullanın.',
                'Güneş enerjisi panelleri kurarak yenilenebilir enerji kullanımına geçin.',
                'Öğrencilere enerji tasarrufu konusunda eğitimler verin.'
            ] : [
                'LED aydınlatma sistemine geçiş yapın.',
                'Enerji tasarruflu cihazlar kullanın.',
                'Kullanılmayan alanların ışıklarını kapatın.',
                'Güneş enerjisi sistemleri kurun.',
                'Çalışanlarınıza enerji tasarrufu eğitimi verin.'
            ]
        })
    }

    // Isınma önerileri
    const heatingThreshold = type === 'personal' ? 150 : type === 'school' ? 800 : 500
    if (results.heatingCO2 && results.heatingCO2 > heatingThreshold) {
        suggestions.push({
            category: 'Isınma',
            tips: type === 'personal' ? [
                'Evinizin yalıtımını iyileştirin.',
                'Termostat sıcaklığını optimize edin.',
                'Güneş enerjisinden faydalanın.',
                'Radyatörlerin önünü kapatmayın.',
                'Perdeleri gece kapatın, gündüz açın.'
            ] : type === 'school' ? [
                'Okul binasının yalıtımını güçlendirin.',
                'Merkezi ısıtma sistemini düzenli olarak bakımdan geçirin.',
                'Sınıflarda termostat kullanarak sıcaklığı optimize edin.',
                'Çift cam veya ısı yalıtımlı cam sistemlerine geçiş yapın.',
                'Tatil dönemlerinde ısıtma sistemini minimum seviyede tutun.'
            ] : [
                'İşletmenizin yalıtımını güçlendirin.',
                'Isıtma sistemini düzenli bakımdan geçirin.',
                'Termostat kullanarak sıcaklığı optimize edin.',
                'Çift cam veya ısı yalıtımlı cam kullanın.',
                'Kapalı olmadığınız saatlerde ısıtmayı minimumda tutun.'
            ]
        })
    }

    // Diğer öneriler...
    // ... (Araç, atık, yiyecek önerileri benzer şekilde eklenebilir)

    return suggestions
}