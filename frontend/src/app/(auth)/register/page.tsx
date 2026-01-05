'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Sparkles, Heart, Shield, Zap, User, Stethoscope, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/magic/glass-card'
import { ParticleBackground } from '@/components/magic/particle-background'

const roles = [
  {
    id: 'patient',
    title: 'Bệnh nhân',
    description: 'Đặt lịch khám, quản lý hồ sơ sức khỏe, nhận tư vấn từ xa',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    features: ['Đặt lịch 24/7', 'Hồ sơ điện tử', 'Thanh toán online', 'Nhận đơn thuốc'],
  },
  {
    id: 'doctor',
    title: 'Bác sĩ',
    description: 'Quản lý lịch trình, tiếp nhận bệnh nhân, tư vấn trực tuyến',
    icon: Stethoscope,
    color: 'from-purple-500 to-pink-500',
    features: ['Quản lý lịch', 'Tiếp nhận online', 'Kê đơn điện tử', 'Theo dõi bệnh nhân'],
  },
  {
    id: 'clinic',
    title: 'Phòng khám',
    description: 'Quản lý cơ sở, nhân sự, lịch hẹn và doanh thu',
    icon: Building,
    color: 'from-green-500 to-emerald-500',
    features: ['Quản lý đa cơ sở', 'Phân công bác sĩ', 'Thống kê doanh thu', 'Marketing'],
  },
]

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/register/${selectedRole}`)
    }
  }

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-6xl space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full animate-float">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Bắt đầu hành trình sức khỏe</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="block">Chọn vai trò của bạn</span>
              <span className="block bg-gradient-to-r from-primary via-primary-600 to-primary bg-clip-text text-transparent">
                HealthEco
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tham gia mạng lưới chăm sóc sức khỏe thông minh với hơn 10,000+ người dùng
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id
              
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className="group relative"
                >
                  <GlassCard
                    className={`p-8 space-y-6 h-full transition-all duration-500 ${
                      isSelected 
                        ? 'ring-2 ring-primary scale-[1.02]' 
                        : 'hover:scale-[1.02] hover:ring-1 hover:ring-primary/50'
                    }`}
                    intensity={isSelected ? 0.2 : 0.1}
                    blur="lg"
                  >
                    {/* Role Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${role.color}`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Role Info */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">{role.title}</h3>
                      <p className="text-muted-foreground">{role.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 h-6 w-6 rounded-full border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && (
                        <div className="absolute inset-1 bg-white rounded-full animate-pulse-slow" />
                      )}
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  </GlassCard>
                </button>
              )
            })}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              size="xl"
              className="min-w-[200px] group"
              disabled={!selectedRole}
              rightIcon={
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              }
            >
              Tiếp tục {selectedRole && `với ${roles.find(r => r.id === selectedRole)?.title}`}
            </Button>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              {
                icon: Heart,
                title: 'Chăm sóc toàn diện',
                description: 'Theo dõi sức khỏe 24/7 với đội ngũ chuyên gia'
              },
              {
                icon: Shield,
                title: 'Bảo mật tuyệt đối',
                description: 'Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn y tế'
              },
              {
                icon: Zap,
                title: 'Tiết kiệm thời gian',
                description: 'Giảm 80% thời gian chờ đợi so với phương pháp truyền thống'
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="inline-flex p-3 bg-primary/10 rounded-xl">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary-600 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
      </div>
    </>
  )
}