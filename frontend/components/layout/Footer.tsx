import Link from 'next/link'
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    'Dịch vụ': [
      { name: 'Tìm bác sĩ', href: '/bac-si' },
      { name: 'Đặt lịch khám', href: '/dat-lich' },
      { name: 'Khám trực tuyến', href: '/kham-truc-tuyen' },
      { name: 'Xét nghiệm tại nhà', href: '/xet-nghiem-tai-nha' },
    ],
    'Hỗ trợ': [
      { name: 'Câu hỏi thường gặp', href: '/faq' },
      { name: 'Hướng dẫn sử dụng', href: '/huong-dan' },
      { name: 'Chính sách bảo mật', href: '/bao-mat' },
      { name: 'Điều khoản dịch vụ', href: '/dieu-khoan' },
    ],
    'Công ty': [
      { name: 'Về chúng tôi', href: '/ve-chung-toi' },
      { name: 'Tuyển dụng', href: '/tuyen-dung' },
      { name: 'Tin tức y tế', href: '/tin-tuc' },
      { name: 'Liên hệ hợp tác', href: '/hop-tac' },
    ],
  }

  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  HealthEco
                </h2>
                <p className="text-sm text-muted-foreground">Chăm sóc sức khỏe thông minh</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              HealthEco là nền tảng công nghệ kết nối bệnh nhân với hệ thống bác sĩ và phòng khám 
              chất lượng cao. Chúng tôi mang đến giải pháp chăm sóc sức khỏe toàn diện, tiện lợi 
              và hiệu quả cho mọi người.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="font-medium">Đăng ký nhận tin khuyến mãi</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <button className="btn-primary px-4">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-foreground">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:pl-2 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hotline 24/7</p>
              <p className="font-semibold">1900 1234</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email hỗ trợ</p>
              <p className="font-semibold">support@healtheco.vn</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Địa chỉ</p>
              <p className="font-semibold">Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HealthEco. Tất cả quyền được bảo lưu.</p>
          <p className="mt-2 text-sm">
            Được phát triển với <Heart className="inline w-4 h-4 text-red-500 animate-pulse" /> vì sức khỏe cộng đồng.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer