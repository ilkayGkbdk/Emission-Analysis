'use client'

import React from 'react'
import BaseResults from '../base/Results'
import { CafeCalculationResults } from '@/types/calculator'

interface ResultsProps {
    results: CafeCalculationResults
    onReset: () => void
}

export default function Results({ results, onReset }: ResultsProps) {
    return <BaseResults results={results} type="cafe" onReset={onReset} />
}