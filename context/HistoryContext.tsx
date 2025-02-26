'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { CalculationHistory } from '@/types/calculator'

interface HistoryContextType {
    history: CalculationHistory[];
    addToHistory: (entry: Omit<CalculationHistory, 'id'>) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<CalculationHistory[]>([])

    // LocalStorage'dan geçmişi yükle
    useEffect(() => {
        const savedHistory = localStorage.getItem('calculationHistory')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    // Geçmişi LocalStorage'a kaydet
    useEffect(() => {
        localStorage.setItem('calculationHistory', JSON.stringify(history))
    }, [history])

    const addToHistory = (entry: Omit<CalculationHistory, 'id'>) => {
        const newEntry: CalculationHistory = {
            ...entry,
            id: Date.now().toString()
        }
        setHistory(prev => [newEntry, ...prev].slice(0, 10)) // Son 10 kaydı tut
    }

    const clearHistory = () => {
        setHistory([])
    }

    return (
        <HistoryContext.Provider value={{ history, addToHistory, clearHistory }}>
            {children}
        </HistoryContext.Provider>
    )
}

export const useHistory = () => {
    const context = useContext(HistoryContext)
    if (context === undefined) {
        throw new Error('useHistory must be used within a HistoryProvider')
    }
    return context
}