'use client'

import { EmissionProvider } from '@/context/EmissionContext'
import { HistoryProvider } from '@/context/HistoryContext'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
    return (
        <EmissionProvider>
            <HistoryProvider>
                {children}
            </HistoryProvider>
        </EmissionProvider>
    )
}