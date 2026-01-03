'use client'

import { motion } from 'framer-motion'
import { Search, Clock, Shield, Users, Star, Calendar, Video, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Đặt lịch nhanh chóng',
      description: 'Đặt lịch khám chỉ trong 30 giây, linh hoạt 24/7.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bác sĩ uy tín',
      description: 'Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, được kiểm chứng.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: 'Khám trực tuyến',
      description: 'Tư vấn từ xa qua video call, tiết kiệm thời gian di chuyển.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Hỗ trợ 1-1',
      description: 'Chăm sóc khách hàng tận tình, theo dõi sức khỏe liên tục.',
      color: 'from-orange-500 to-red-500'
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Chăm sóc sức khỏe{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                thông minh
              </span>{' '}
              cho cả gia đình bạn
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Kết nối với bác sĩ chất lượng cao, đặt lịch khám dễ dàng và nhận tư vấn 
              từ xa mọi lúc, mọi nơi. Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm bác sĩ, chuyên khoa, triệu chứng..."
                  className="w-full pl-12 pr-32 py-4 text-lg border border-input rounded-xl 
                           focus:ring-3 focus:ring-primary focus:border-transparent 
                           outline-none transition-all duration-300 bg-background/50 backdrop-blur-sm"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary">
                  <span className="flex items-center">
                    Tìm kiếm
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dat-lich"
                className="btn-primary px-8 py-4 text-lg inline-flex items-center justify-center group"
              >
                <span>Đặt lịch ngay</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/bac-si"
                className="btn-secondary px-8 py-4 text-lg inline-flex items-center justify-center"
              >
                <Video className="w-5 h-5 mr-2" />
                Khám trực tuyến
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: '50.000+', label: 'Bệnh nhân hài lòng' },
              { number: '1.200+', label: 'Bác sĩ chuyên khoa' },
              { number: '200+', label: 'Phòng khám đối tác' },
              { number: '99%', label: 'Hài lòng dịch vụ' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tại sao chọn <span className="text-primary">HealthEco</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm chăm sóc sức khỏe toàn diện và tiện lợi nhất
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="card-hover bg-card p-6 rounded-2xl border h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Sẵn sàng chăm sóc sức khỏe của bạn?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hàng nghìn bệnh nhân đã tin tưởng và lựa chọn HealthEco để đồng hành cùng sức khỏe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="btn-primary px-8 py-4 text-lg"
              >
                Đăng ký ngay
              </Link>
              <Link
                href="/bac-si"
                className="btn-secondary px-8 py-4 text-lg"
              >
                Tìm bác sĩ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}