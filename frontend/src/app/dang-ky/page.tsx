'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Stethoscope, Building, Shield } from 'lucide-react';

const roleOptions = [
  {
    value: 'benh-nhan',
    label: 'Bệnh nhân',
    description: 'Đặt lịch khám và quản lý sức khỏe',
    icon: User,
    color: 'from-blue-500 to-blue-600',
  },
  {
    value: 'bac-si',
    label: 'Bác sĩ',
    description: 'Cung cấp dịch vụ khám chữa bệnh',
    icon: Stethoscope,
    color: 'from-green-500 to-green-600',
  },
  {
    value: 'quan-ly-phong-kham',
    label: 'Quản lý phòng khám',
    description: 'Quản lý phòng khám và đội ngũ',
    icon: Building,
    color: 'from-purple-500 to-purple-600',
  },
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole) {
      router.push(`/dang-ky/${selectedRole.toLowerCase()}`);
    }
  };

  const getIconColor = (roleValue: string) => {
    const role = roleOptions.find(r => r.value === roleValue);
    return role?.color || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-4xl shadow-2xl relative z-10 border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bắt đầu hành trình chăm sóc sức khỏe
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn vai trò phù hợp để đăng ký tài khoản HealthEco
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Tôi muốn đăng ký với vai trò:
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;
                
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`
                      relative p-6 border-2 rounded-xl text-left transition-all duration-300
                      ${isSelected 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-[1.02]' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`
                        p-4 rounded-full ${isSelected ? 'shadow-lg' : 'shadow-md'}
                        bg-gradient-to-br ${role.color}
                      `}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div>
                        <h3 className={`font-bold text-xl ${isSelected ? 'text-gray-900' : 'text-gray-800'}`}>
                          {role.label}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <Button
              onClick={handleContinue}
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
              disabled={!selectedRole}
              size="lg"
            >
              Tiếp tục đăng ký {selectedRole ? `- ${roleOptions.find(r => r.value === selectedRole)?.label}` : ''}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/dang-nhap" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <h4 className="font-bold text-lg mb-6 text-center text-gray-900">
              Lợi ích khi sử dụng HealthEco
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">Tiết kiệm thời gian</h5>
                <p className="text-sm text-gray-600">Đặt lịch nhanh chóng, không cần chờ đợi</p>
              </div>
              
              <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">Bảo mật tuyệt đối</h5>
                <p className="text-sm text-gray-600">Thông tin cá nhân được mã hóa an toàn</p>
              </div>
              
              <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">Đội ngũ chuyên gia</h5>
                <p className="text-sm text-gray-600">Hàng nghìn bác sĩ uy tín, có chuyên môn</p>
              </div>
              
              <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 mb-1">Chi phí minh bạch</h5>
                <p className="text-sm text-gray-600">Giá dịch vụ rõ ràng, không phát sinh</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}