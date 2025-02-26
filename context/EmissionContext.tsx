'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface EmissionContextType {
    totalCO2: number
    updateCO2: (value: number) => void
    addToCO2: (value: number) => void
    resetCO2: () => void
}

const EmissionContext = createContext<EmissionContextType | undefined>(undefined)

export function EmissionProvider({ children }: { children: React.ReactNode }) {
    const [totalCO2, setTotalCO2] = useState(0)
    const pathname = usePathname()

    // Sayfa değiştiğinde CO2 değerini sıfırla
    useEffect(() => {
        setTotalCO2(0)
    }, [pathname])

    const updateCO2 = (value: number) => {
        setTotalCO2(value)
    }

    const addToCO2 = (value: number) => {
        setTotalCO2(prev => prev + value)
    }

    const resetCO2 = () => {
        setTotalCO2(0)
    }

    return (
        <EmissionContext.Provider value={{ totalCO2, updateCO2, addToCO2, resetCO2 }}>
            {children}
        </EmissionContext.Provider>
    )
}

export function useEmission() {
    const context = useContext(EmissionContext)
    if (context === undefined) {
        throw new Error('useEmission must be used within an EmissionProvider')
    }
    return context
}