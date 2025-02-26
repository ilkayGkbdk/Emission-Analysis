'use client'

import Link from 'next/link'
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
    const { isSignedIn } = useAuth();

    return (
        <nav className="bg-green-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
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
                            <span className="font-bold text-xl">CO2 Hesaplayıcı</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-4">
                            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                                Ana Sayfa
                            </Link>
                            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                                Hakkında
                            </Link>
                            <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700">
                                İletişim
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 ml-4 border-l border-green-700 pl-4">
                            {!isSignedIn ? (
                                <>
                                    <SignInButton mode="modal">
                                        <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                                            Giriş Yap
                                        </button>
                                    </SignInButton>
                                    <SignUpButton mode="modal">
                                        <button className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-500 transition-colors">
                                            Kayıt Ol
                                        </button>
                                    </SignUpButton>
                                </>
                            ) : (
                                <UserButton
                                    appearance={{
                                        elements: {
                                            userButtonAvatarBox: "w-8 h-8",
                                            userButtonTrigger: "focus:shadow-none"
                                        }
                                    }}
                                    afterSignOutUrl="/"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}