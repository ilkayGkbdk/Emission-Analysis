import { Inter } from 'next/font/google';
import ClientProvider from '@/components/providers/ClientProvider';
import Navbar from '@/app/components/factory/Navbar';
import Footer from '@/app/components/factory/Footer';
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] });

export const metadata = {
    title: 'Fabrika CO2 Emisyon Hesaplama Aracı',
    description: 'Fabrika operasyonlarınızın karbon ayak izini profesyonelce hesaplayın ve sürdürülebilirlik hedeflerinize ulaşın.',
    openGraph: {
        title: 'Fabrika CO2 Emisyon Hesaplama Aracı',
        description: 'Sektörel karbon ayak izi analizleri için güvenilir çözüm.',
        url: 'https://co2hesaplayici.com/calculator/factory',
        type: 'website',
    },
};

export default function FactoryLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: '#2563eb', // blue-600
                    colorText: '#1e3a8a', // blue-800
                    colorBackground: '#f9fafb', // gray-50
                    colorInputBackground: '#ffffff',
                    colorInputText: '#1e3a8a',
                },
                elements: {
                    formButtonPrimary:
                        'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors',
                    card: 'bg-white shadow-sm border border-blue-100 rounded-lg',
                    headerTitle: 'text-xl font-semibold text-blue-800',
                    headerSubtitle: 'text-blue-600 font-medium',
                    socialButtonsIconButton:
                        'border border-blue-200 hover:bg-blue-50 rounded-md p-2 transition-colors',
                    footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                },
            }}
        >
            <html lang="tr">
            <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
            <ClientProvider>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                </div>
            </ClientProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}