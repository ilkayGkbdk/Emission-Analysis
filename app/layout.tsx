import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ClientProvider from '@/components/providers/ClientProvider'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'CO2 Emisyon Hesaplayıcı',
    description: 'Karbon ayak izinizi hesaplayın ve çevreye olan etkinizi öğrenin.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: "#15803d", // green-700
                    colorText: "#166534",     // green-800
                    colorBackground: "#f0fdf4" // green-50
                },
                elements: {
                    formButtonPrimary: 'bg-green-600 hover:bg-green-700',
                    card: "shadow-lg border border-green-100",
                    headerTitle: "text-2xl font-bold text-green-800",
                    headerSubtitle: "text-green-600",
                    socialButtonsIconButton: "border-green-200 hover:bg-green-50",
                    footerActionLink: 'text-green-600 hover:text-green-700'
                }
            }}
        >
            <html lang="tr">
            <body className={inter.className}>
            <ClientProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow bg-green-50">
                        {children}
                    </main>
                    <Footer />
                </div>
            </ClientProvider>
            </body>
            </html>
        </ClerkProvider>
    )
}