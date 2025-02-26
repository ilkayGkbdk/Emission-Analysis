'use client'

import React, { useState } from 'react'

export default function ContactPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormStatus('sending')

        // Form gönderme simülasyonu
        setTimeout(() => {
            setFormStatus('success')
        }, 1000)
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-green-800 mb-4">
                    İletişim
                </h1>
                <p className="text-xl text-green-600">
                    Sorularınız için bizimle iletişime geçin
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-green-800 mb-4">
                            Bize Ulaşın
                        </h2>
                        <p className="text-gray-600">
                            Hesaplayıcı hakkında sorularınız veya önerileriniz mi var?
                            Size yardımcı olmaktan mutluluk duyarız.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-green-800">E-posta</h3>
                                <p className="text-gray-600">info@co2calculator.com</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-green-800">Adres</h3>
                                <p className="text-gray-600">İstanbul, Türkiye</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Adınız
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-posta Adresiniz
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Mesajınız
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                required
                                className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={formStatus === 'sending'}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                ${formStatus === 'sending'
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'}`}
                        >
                            {formStatus === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
                        </button>

                        {formStatus === 'success' && (
                            <div className="text-green-600 text-center">
                                Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                            </div>
                        )}

                        {formStatus === 'error' && (
                            <div className="text-red-600 text-center">
                                Bir hata oluştu. Lütfen daha sonra tekrar deneyin.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}