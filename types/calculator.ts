// Temel tipler
export type HeatingType = 'naturalGas' | 'coal' | 'wood' | 'lpg' | null
export type FuelType = 'gasoline' | 'diesel' | 'electric'
export type Step = 'electricity' | 'heating' | 'fuel' | 'results'
export type SchoolStep = Step | 'waste' | 'water'
export type CafeStep = 'electricity' | 'heating' | 'waste' | 'water' | 'food' | 'results'

// Araç tipleri
export interface BaseVehicle {
    id: number
    fuelType: FuelType | null
}

export interface PersonalVehicle extends BaseVehicle {
    consumption: string // Yakıt tüketimi veya elektrikli araçlar için km
}

export interface SchoolVehicle extends BaseVehicle {
    dailyDistance: string // Günlük mesafe
}

export type VehicleField = 'fuelType' | 'consumption' | 'dailyDistance'

// Form tipleri
export interface SchoolWaste {
    generalWaste: string
    organicWaste: string
    hasRecycling: boolean
    recyclingAmount: string
}

export interface CafeWaste extends SchoolWaste {}

export interface CafeFood {
    beefAmount: string
    lambAmount: string
    chickenAmount: string
    vegetableAmount: string
    fruitAmount: string
    grainAmount: string
    legumesAmount: string
    nutAmount: string
    milkAmount: string
    eggAmount: string
    butterAmount: string
    porkAmount: string
}

// Sonuç tipleri
export interface BaseResults {
    electricityCO2: number | null;
    electricityM3: number | null;
    heatingCO2: number | null;
    heatingM3: number | null;
    generalWasteCO2: number | null;
    generalWasteM3: number | null;
    organicWasteCO2: number | null;
    organicWasteM3: number | null;
    recyclingCO2: number | null;
    recyclingM3: number | null;
    totalWasteCO2: number | null;
    totalWasteM3: number | null;
    waterCO2: number | null;
    waterM3: number | null;
    totalCO2: number | null;
    totalM3: number | null;
}

export interface WasteResults {
    generalWasteCO2: number | null
    generalWasteM3: number | null
    organicWasteCO2: number | null
    organicWasteM3: number | null
    recyclingCO2: number | null
    recyclingM3: number | null
    totalWasteCO2: number | null
    totalWasteM3: number | null
}

export interface WaterResults {
    waterCO2: number | null
    waterM3: number | null
}

export interface FoodResults {
    meatFoodCO2: number | null
    meatFoodM3: number | null
    chickenFoodCO2: number | null
    chickenFoodM3: number | null
    vegetableFoodCO2: number | null
    vegetableFoodM3: number | null
    totalFoodCO2: number | null
    totalFoodM3: number | null
}

export interface CalculationResults extends BaseResults {}
export interface SchoolCalculationResults extends BaseResults, WasteResults, WaterResults {}
export interface CafeCalculationResults extends BaseResults, WasteResults, WaterResults, FoodResults {
    // Su atığı hesaplamaları
    waterWaste: {
        beef: number;
        lamb: number;
        chicken: number;
        vegetable: number;
        fruit: number;
        grain: number;
        legumes: number;
        nut: number;
        milk: number;
        egg: number;
        butter: number;
        pork: number;
    };
    totalWaterWaste: number;
}

// Görüntüleme tipleri
export interface ResultValue {
    label: string
    value: number
    volume: number
    unit?: string
}

export interface ResultSection {
    title: string
    values: ResultValue[]
    total?: {
        co2: number
        volume: number
        value?: number
        unit?: string
    }
    layout?: 'grid'
}

export interface EmissionStatus {
    title: string
    description: string
    color: string
}

export interface Suggestion {
    category: string
    tips: string[]
}

export interface EmissionAnalysis {
    status: EmissionStatus
    sections: ResultSection[]
    suggestions: Suggestion[]
}

// Geçmiş tipi
export interface CalculationHistory {
    id: string
    date: string
    type: 'personal' | 'school' | 'cafe'
    results: CalculationResults | SchoolCalculationResults | CafeCalculationResults
}

// Bileşen prop tipleri
export interface FuelStepProps {
    vehicleCount: string
    setVehicleCount: (count: string) => void
    vehicles: PersonalVehicle[] | SchoolVehicle[]
    updateVehicle: (id: number, field: VehicleField, value: string | FuelType) => void
    calculatorType: 'personal' | 'school'
}