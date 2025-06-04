// Temel tipler
export type PersonalStep = 'electricity' | 'heating' | 'fuel' | 'results'
export type SchoolStep = PersonalStep | 'waste' | 'water'
export type CafeStep = 'electricity' | 'heating' | 'waste' | 'water' | 'food' | 'results'
export type HeatingType = 'naturalGas' | 'coal' | 'wood' | 'lpg' | null
export type FuelType = 'gasoline' | 'diesel' | 'electric'

// Fabrika tipleri
export type AutomotiveSteps = 'form' | 'electricity' | 'naturalGas' | 'water' | 'rawUsage' | 'rawTransportation' | 'vehicleDistribution' | 'waste' | 'staffTransportation' | 'results';
export type CementSteps = 'electricity' | 'naturalGas' | 'usage' | 'logistics' | 'waste' | 'results';
export type ChemicalsSteps = 'electricity' | 'naturalGas' | 'usage' | 'logistics' | 'waste' | 'staffTransportation' | 'results';
export type ElectronicsSteps = 'electricity' | 'naturalGas' | 'water' | 'usage' | 'logistics' | 'staffTransportation' | 'results';
export type FoodSteps = 'electricity' | 'naturalGas' | 'water' | 'usage' | 'logistics' | 'staffTransportation' | 'results';
export type MetalsSteps = 'electricity' | 'naturalGas' | 'water' | 'rawUsage' | 'waste' | 'logistics' | 'results';
export type PackagingSteps = 'electricity' | 'naturalGas' | 'water' | 'rawUsage' | 'waste' | 'logistics' | 'results';
export type TextilesSteps = 'electricity' | 'naturalGas' | 'water' | 'usage' | 'rawTransportation' | 'productTransportation' | 'waste' | 'staffTransportation' | 'results';

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

export type CafeWaste = SchoolWaste

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
    totalCO2: number | null;
    totalM3: number | null;
}

export interface FuelResults {
    gasolineCO2: number | null;
    dieselCO2: number | null;
    electricVehicleCO2: number | null;
    totalFuelCO2: number | null;
    totalFuelM3: number | null;
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
    foodWaste: {
        beef_WaterWaste: number;
        lamb_WaterWaste: number;
        chicken_WaterWaste: number;
        vegetable_WaterWaste: number;
        fruit_WaterWaste: number;
        grain_WaterWaste: number;
        legumes_WaterWaste: number;
        nut_WaterWaste: number;
        milk_WaterWaste: number;
        egg_WaterWaste: number;
        butter_WaterWaste: number;
        pork_WaterWaste: number;
    }
    totalFoodWaterWaste: number;
}

export interface PersonalCalculationResults extends BaseResults, FuelResults {}
export interface SchoolCalculationResults extends BaseResults, FuelResults, WasteResults, WaterResults {}
export interface CafeCalculationResults extends BaseResults, WasteResults, WaterResults, FoodResults {}

// Fabrika sonuçları
export interface AutomotiveCalculationResults {
    electricityCO2: number | null;
    electricityM3: number | null;
    naturalGasCO2: number | null;
    naturalGasM3: number | null;
    waterCO2: number | null;
    waterM3: number | null;
    rawUsageCO2: number | null;
    rawUsageM3: number | null;
    rawTransportationCO2: number | null;
    rawTransportationM3: number | null;
    vehicleDistributionCO2: number | null;
    vehicleDistributionM3: number | null;
    wasteCO2: number | null;
    wasteM3: number | null;
    staffTransportationCO2: number | null;
    staffTransportationM3: number | null;
    totalCO2: number | null;
    totalM3: number | null;
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
    results: PersonalCalculationResults | SchoolCalculationResults | CafeCalculationResults
}

// Bileşen prop tipleri
export interface FuelStepProps {
    vehicleCount: string
    setVehicleCount: (count: string) => void
    vehicles: PersonalVehicle[] | SchoolVehicle[]
    updateVehicle: (id: number, field: VehicleField, value: string | FuelType) => void
    calculatorType: 'personal' | 'school'
}