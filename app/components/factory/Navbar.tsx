'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="fixed top-0 z-50 w-full bg-blue-800 text-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/calculator/factory" className="flex items-center space-x-2">
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="text-base font-semibold">CO2 Hesaplama Aracı</span>
                        </Link>
                    </div>

                    {/* Masaüstü Menü */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/"
                            className="px-2 py-1 text-sm font-medium hover:bg-blue-900 rounded-md transition-colors"
                        >
                            Ana Sayfa
                        </Link>
                        <Link
                            href="/about"
                            className="px-2 py-1 text-sm font-medium hover:bg-blue-900 rounded-md transition-colors"
                        >
                            Hakkında
                        </Link>
                        <Link
                            href="/contact"
                            className="px-2 py-1 text-sm font-medium hover:bg-blue-900 rounded-md transition-colors"
                        >
                            İletişim
                        </Link>
                    </div>

                    {/* Mobil Menü Butonu */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-md hover:bg-blue-900 focus:outline-none"
                            aria-label="Menüyü aç/kapat"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobil Menü */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800">
                            <Link
                                href="/"
                                className="block px-2 py-1 text-sm font-medium hover:bg-blue-900 rounded-md"
                                onClick={toggleMenu}
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                href="/about"
                                className="block px-2 py-1 text-sm font-medium hover:bg-blue-900 rounded-md"
                                onClick={toggleMenu}
                            >
                                Hakkında
                            </Link>
                            <Link
                                href="/contact"
                                className="block px-2 py-1 text-sm font-medium hover:bg-blue-900 rounded-md"
                                onClick={toggleMenu}
                            >
                                İletişim
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}