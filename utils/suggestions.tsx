import {
    CafeCalculationResults,
    PersonalCalculationResults,
    SchoolCalculationResults
} from '@/types/calculator'
import { Suggestion } from '@/types/calculator'

export const getEmissionSuggestions = (results: PersonalCalculationResults | SchoolCalculationResults | CafeCalculationResults, type: 'personal' | 'school' | 'cafe'): Suggestion[] => {
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

    // Araç kullanım önerileri
    const vehicleThreshold = type === 'personal' ? 200 : type === 'school' ? 1000 : 700
    if ('totalFuelCO2' in results && results.totalFuelCO2 && results.totalFuelCO2 > vehicleThreshold) {
        suggestions.push({
            category: 'Araç Kullanımı',
            tips: type === 'personal' ? [
                'Toplu taşıma veya bisiklet kullanarak karbon ayak izinizi azaltın.',
                'Araç paylaşımı yaparak yakıt tüketimini azaltın.',
                'Elektrikli veya hibrit araçları tercih edin.',
                'Lastik basınçlarını düzenli kontrol ederek yakıt verimliliğini artırın.',
                'Gereksiz yere motoru çalışır halde bırakmayın.'
            ] : type === 'school' ? [
                'Okul servislerinde yakıt tasarruflu veya elektrikli araçlar kullanın.',
                'Öğrencilere bisiklet kullanımı teşvik edin.',
                'Öğretmen ve personel için araç paylaşım programları oluşturun.',
                'Gereksiz araç kullanımını azaltmak için toplu taşıma teşvikleri sunun.',
                'Servis güzergahlarını optimize ederek yakıt tüketimini azaltın.'
            ] : [
                'Restoran teslimatlarını elektrikli veya bisikletli kuryeler ile yapın.',
                'Çalışanlarınız için toplu taşıma destekleri sağlayın.',
                'Müşterilerin toplu taşımayı kullanmasını teşvik eden kampanyalar düzenleyin.',
                'Araç paylaşım sistemlerini işletme çalışanları için kullanın.',
                'Araçların düzenli bakımını yaparak yakıt tüketimini azaltın.'
            ]
        })
    }

    // Atık yönetimi önerileri (okul ve kafe için)
    if ((type === 'school' || type === 'cafe') && "generalWasteCO2" in results && results.generalWasteCO2 && results.generalWasteCO2 > 300) {
        suggestions.push({
            category: 'Atık Yönetimi',
            tips: [
                'Geri dönüşüm kutularını yaygınlaştırın.',
                'Çalışanları ve müşterileri atık azaltma konusunda bilinçlendirin.',
                'Kağıt tüketimini azaltmak için dijital kaynaklar kullanın.',
                'Yiyecek atıklarını kompost yaparak değerlendirin.',
                'Tek kullanımlık plastikleri yasaklayarak atık miktarını azaltın.'
            ]
        })
    }

    // Yiyecek tüketimi önerileri (sadece kafeler için)
    if (type === 'cafe' && "totalFoodWaterWaste" in results && results.totalFoodWaterWaste && results.totalFoodWaterWaste > 200) {
        suggestions.push({
            category: 'Yiyecek Tüketimi',
            tips: [
                'Yerel ve mevsimlik ürünler kullanarak karbon ayak izinizi azaltın.',
                'Gıda israfını azaltmak için porsiyon kontrolü yapın.',
                'Fazla yiyecekleri bağışlayarak değerlendirilmelerini sağlayın.',
                'Bitkisel bazlı menü seçenekleri sunarak sürdürülebilirliği artırın.',
                'Tek kullanımlık plastiklerden kaçının ve geri dönüştürülebilir ambalajlar kullanın.'
            ]
        })
    }

    return suggestions
}