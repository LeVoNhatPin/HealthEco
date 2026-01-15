import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'HealthEco - Hệ thống đặt lịch khám bệnh',
    description: 'Hệ thống đặt lịch khám bệnh trực tuyến',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className={inter.className}>
                <AuthProvider>
                    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                        <Navbar />
                        <main className="pb-8">{children}</main>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    padding: '16px',
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: '#10B981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    duration: 4000,
                                    iconTheme: {
                                        primary: '#EF4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </div>
                </AuthProvider>
            </body>
        </html>
    );
}