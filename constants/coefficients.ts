export const COEFFICIENTS = {
    electricity: 0.478,
    naturalGas: 2.18,
    coal: 3.26,
    wood: 0.10,
    lpg: 3.68,
    gasoline: 2.33,
    diesel: 2.68,
    electricVehicle: 0.086,
    m3Conversion: 0.534,
    generalWaste: 0.2,
    organicWaste: 0.5,
    recycling: 0.2,
    water: 0.0014,
    foodWater: {
        beefWater: 131.68,
        lambWater: 75.28,
        chickenWater: 33.7,
        vegetableWater: 2.05,
        fruitWater: 7.1,
        grainWater: 12.08,
        legumesWater: 30.61,
        nutWater: 68.11,
        milkWater: 8.13,
        eggWater: 24.89,
        butterWater: 44.23,
        porkWater: 46.66,
    },

    //Fabrika
    factory: {
        // Otomotiv
        automotive: {
            electricity: 0.64,
            naturalGas: 1.9141,
            water: 0.0014,
            rawUsage: {
                steel: 2.1,
                aluminum: 10.5,
                plastic: 2.5,
                coatingAndPaintChemicals: 3.5
            },
            rawTransportation: {
                land: 0.126,
                sea: 0.03,
                railway: 0.035
            },
            vehicleDistribution: {
                land: 0.126,
                sea: 0.03,
                railway: 0.035
            },
            waste: {
                metal: 2.1,
                plastic: 2.5,
                chemicals: 3.5,
            },
            staffTransportation: {
                personal: 0.135,
                company: 0.09
            }
        }
    }
}