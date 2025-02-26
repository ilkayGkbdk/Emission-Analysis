'use client'

import React from 'react'
import BaseResults from '../base/Results'
import { SchoolCalculationResults } from '@/types/calculator'

interface ResultsProps {
    results: SchoolCalculationResults
    onReset: () => void
}

export default function Results({ results, onReset }: ResultsProps) {
    return <BaseResults results={results} type="school" onReset={onReset} />
}