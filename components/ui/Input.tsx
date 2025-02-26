import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    unit?: string
    helper?: string
    error?: string
}

export default function Input({
                                  label,
                                  unit,
                                  helper,
                                  error,
                                  className = '',
                                  ...props
                              }: InputProps) {
    return (
        <div className="space-y-2">
            <label className="block text-base font-medium text-gray-700 mb-1">
                {label}
            </label>

            <div className="relative">
                <input
                    {...props}
                    className={`
                        block w-full px-4 py-3.5 text-base
                        bg-white border-2 border-gray-200 
                        rounded-lg shadow-sm
                        transition-all duration-200
                        hover:border-green-300
                        focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500
                        placeholder:text-gray-400
                        ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : ''}
                        ${unit ? 'pr-14' : ''}
                        ${className}
                    `}
                />
                {unit && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-gray-500 font-medium">{unit}</span>
                    </div>
                )}
            </div>

            {helper && !error && (
                <p className="mt-2 text-sm text-gray-500">
                    {helper}
                </p>
            )}

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    )
} 