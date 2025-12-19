import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Calendar, Stethoscope, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Chăm sóc sức khỏe của bạn,
              <span className="text-blue-600"> đơn giản hơn bao giờ hết</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Kết nối với hàng ngàn bác sĩ và phòng khám uy tín. Đặt lịch khám trực tuyến nhanh chóng, theo dõi sức khỏe mọi lúc mọi nơi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="text-lg px-8">
                  Đăng ký ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/doctors">
                <Button variant="outline" className="text-lg px-8">
                  <Stethoscope className="mr-2 h-5 w-5" />
                  Tìm bác sĩ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn HealthEco?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chúng tôi cung cấp giải pháp toàn diện cho nhu cầu chăm sóc sức khỏe của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Đặt lịch dễ dàng</h3>
              <p className="text-gray-600">
                Chọn bác sĩ, đặt lịch hẹn trong vài phút. Hủy hoặc đổi lịch linh hoạt.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-xl">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bác sĩ uy tín</h3>
              <p className="text-gray-600">
                Đội ngũ bác sĩ chuyên môn cao, có giấy phép hành nghề và nhiều năm kinh nghiệm.
              </p>
            </div>

            <div className="bg-purple-50 p-8 rounded-xl">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bảo mật thông tin</h3>
              <p className="text-gray-600">
                Dữ liệu sức khỏe được mã hóa và bảo vệ nghiêm ngặt theo tiêu chuẩn quốc tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng ngàn người đang sử dụng HealthEco để quản lý sức khỏe tốt hơn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white text-white hover:bg-blue-700 text-lg px-8">
                Đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Stethoscope className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">HealthEco</span>
              </div>
              <p className="text-gray-400">
                Chăm sóc sức khỏe thông minh cho mọi người
              </p>
            </div>
            <div className="text-gray-400">
              <p>© {new Date().getFullYear()} HealthEco. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}