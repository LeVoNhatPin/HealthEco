import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'sonner'

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HealthEco - Hệ sinh thái chăm sóc sức khỏe thông minh',
  description: 'Kết nối bệnh nhân với bác sĩ và phòng khám chất lượng cao. Đặt lịch khám dễ dàng, nhận tư vấn trực tuyến 24/7.',
  keywords: 'y tế, bác sĩ, phòng khám, đặt lịch khám, chăm sóc sức khỏe, telemedicine',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://healtheco.vn',
    title: 'HealthEco - Chăm sóc sức khỏe thông minh',
    description: 'Kết nối với bác sĩ chất lượng cao ngay hôm nay',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          expand={true}
          richColors
          closeButton
        />
      </body>
    </html>
  )
}