'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Shield, Users, Star, Clock, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Đặt lịch dễ dàng',
    description: 'Chọn bác sĩ, thời gian và đặt lịch chỉ trong vài phút',
    icon: Calendar,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    title: 'Bảo mật tuyệt đối',
    description: 'Thông tin cá nhân được mã hóa và bảo vệ an toàn',
    icon: Shield,
    color: 'text-green-600 bg-green-100',
  },
  {
    title: 'Đội ngũ chuyên gia',
    description: 'Hàng nghìn bác sĩ uy tín với chuyên môn cao',
    icon: Users,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    title: 'Đánh giá minh bạch',
    description: 'Xem đánh giá từ bệnh nhân đã sử dụng dịch vụ',
    icon: Star,
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    title: 'Tiết kiệm thời gian',
    description: 'Không cần chờ đợi, đặt lịch mọi lúc mọi nơi',
    icon: Clock,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    title: 'Phủ sóng toàn quốc',
    description: 'Kết nối với phòng khám tại nhiều tỉnh thành',
    icon: MapPin,
    color: 'text-red-600 bg-red-100',
  },
];

const doctors = [
  {
    name: 'BS. Nguyễn Văn A',
    specialization: 'Tim mạch',
    experience: '15 năm kinh nghiệm',
    rating: 4.9,
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'BS. Trần Thị B',
    specialization: 'Nhi khoa',
    experience: '12 năm kinh nghiệm',
    rating: 4.8,
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'BS. Lê Văn C',
    specialization: 'Da liễu',
    experience: '10 năm kinh nghiệm',
    rating: 4.7,
    image: 'https://via.placeholder.com/150',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    doctors: 1500,
    clinics: 200,
    appointments: 50000,
    patients: 100000,
  });

  useEffect(() => {
    // Animate stats
    const interval = setInterval(() => {
      setStats(prev => ({
        doctors: prev.doctors + Math.floor(Math.random() * 10),
        clinics: prev.clinics + Math.floor(Math.random() * 2),
        appointments: prev.appointments + Math.floor(Math.random() * 100),
        patients: prev.patients + Math.floor(Math.random() * 50),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Chăm sóc sức khỏe{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  thông minh
                </span>{' '}
                cho mọi nhà
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                Kết nối với hàng nghìn bác sĩ và phòng khám uy tín. 
                Đặt lịch khám trực tuyến, nhận tư vấn từ xa và quản lý 
                hồ sơ sức khỏe một cách dễ dàng.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button 
                  className="h-12 px-8 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  <Link href="/dat-lich">
                    Đặt lịch ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-12 px-8 text-lg"
                >
                  <Link href="/bac-si">
                    Tìm bác sĩ
                  </Link>
                </Button>
              </div>
              
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.doctors.toLocaleString('vi')}+</div>
                  <div className="text-sm text-gray-600 mt-1">Bác sĩ</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.clinics.toLocaleString('vi')}+</div>
                  <div className="text-sm text-gray-600 mt-1">Phòng khám</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.appointments.toLocaleString('vi')}+</div>
                  <div className="text-sm text-gray-600 mt-1">Lượt đặt lịch</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats.patients.toLocaleString('vi')}+</div>
                  <div className="text-sm text-gray-600 mt-1">Bệnh nhân</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tìm bác sĩ phù hợp</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chuyên khoa
                    </label>
                    <select className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn chuyên khoa</option>
                      <option value="tim-mach">Tim mạch</option>
                      <option value="nhi-khoa">Nhi khoa</option>
                      <option value="da-lieu">Da liễu</option>
                      <option value="noi-tiet">Nội tiết</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố
                    </label>
                    <select className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn thành phố</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="cantho">Cần Thơ</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày khám
                    </label>
                    <Input 
                      type="date" 
                      className="h-12"
                    />
                  </div>
                  
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Search className="mr-2 h-5 w-5" />
                    Tìm kiếm
                  </Button>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 h-64 w-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn HealthEco?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến giải pháp chăm sóc sức khỏe toàn diện 
              và tiện lợi cho bạn và gia đình
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`h-14 w-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Bác sĩ tiêu biểu
              </h2>
              <p className="text-gray-600">
                Đội ngũ bác sĩ giàu kinh nghiệm và chuyên môn cao
              </p>
            </div>
            <Button variant="outline"  >
              <Link href="/bac-si">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 overflow-hidden">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Có lịch trống tuần này</span>
                    </div>
                  </div>
                  
                  <Button className="w-full"  >
                    <Link href={`/bac-si/${index}`}>
                      Đặt lịch ngay
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Đăng ký ngay để trải nghiệm dịch vụ chăm sóc sức khỏe 
              thông minh và tiện lợi nhất
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="h-12 px-8 text-lg"
                 
              >
                <Link href="/dang-ky">
                  Đăng ký miễn phí
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 text-lg bg-transparent text-white border-white hover:bg-white/10"
                 
              >
                <Link href="/lien-he">
                  Liên hệ tư vấn
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <span className="text-xl font-bold">HealthEco</span>
              </div>
              <p className="text-gray-400">
                Nền tảng chăm sóc sức khỏe thông minh hàng đầu Việt Nam
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Dịch vụ</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dat-lich" className="hover:text-white">Đặt lịch khám</Link></li>
                <li><Link href="/bac-si" className="hover:text-white">Tìm bác sĩ</Link></li>
                <li><Link href="/phong-kham" className="hover:text-white">Phòng khám</Link></li>
                <li><Link href="/tu-van" className="hover:text-white">Tư vấn từ xa</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Về chúng tôi</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ve-chung-toi" className="hover:text-white">Giới thiệu</Link></li>
                <li><Link href="/tin-tuc" className="hover:text-white">Tin tức</Link></li>
                <li><Link href="/tuyen-dung" className="hover:text-white">Tuyển dụng</Link></li>
                <li><Link href="/lien-he" className="hover:text-white">Liên hệ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>1900 1234</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@healtheco.vn</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 HealthEco. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}