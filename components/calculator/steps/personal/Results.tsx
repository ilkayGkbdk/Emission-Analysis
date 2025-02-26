'use client'

import React from 'react'
import BaseResults from '../base/Results'
import { CalculationResults } from '@/types/calculator'

interface ResultsProps {
    results: CalculationResults
    onReset: () => void
}

export default function Results({ results, onReset }: ResultsProps) {
    return <BaseResults results={results} type="personal" onReset={onReset} />
}