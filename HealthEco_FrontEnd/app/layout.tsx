import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HealthEco - Hệ thống đặt lịch khám bệnh thông minh',
  description: 'Đặt lịch khám bệnh trực tuyến nhanh chóng, tiện lợi với hàng ngàn bác sĩ và phòng khám uy tín',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}