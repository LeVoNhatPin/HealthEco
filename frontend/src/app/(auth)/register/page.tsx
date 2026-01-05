'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Stethoscope, Building } from 'lucide-react';

const roleOptions = [
  {
    value: 'Patient',
    label: 'Bệnh nhân',
    description: 'Đặt lịch khám và quản lý sức khỏe',
    icon: User,
  },
  {
    value: 'Doctor',
    label: 'Bác sĩ',
    description: 'Cung cấp dịch vụ khám chữa bệnh',
    icon: Stethoscope,
  },
  {
    value: 'ClinicAdmin',
    label: 'Quản lý phòng khám',
    description: 'Quản lý phòng khám và đội ngũ',
    icon: Building,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mx-auto flex items-center justify-center">
              <span className="text-white font-bold text-xl">HE</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
          <CardDescription className="text-gray-600">
            Chọn vai trò của bạn để bắt đầu với HealthEco
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {roleOptions.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-full ${
                      isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{role.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleContinue}
              className="w-full"
              disabled={!selectedRole}
              size="lg"
            >
              Tiếp tục với tư cách {selectedRole ? roleOptions.find(r => r.value === selectedRole)?.label : ''}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link href="/dang-nhap" className="text-blue-600 hover:text-blue-500 font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h4 className="font-semibold mb-4">Bạn sẽ nhận được:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Đặt lịch khám dễ dàng</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Quản lý hồ sơ sức khỏe</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Thanh toán an toàn</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Hỗ trợ khách hàng 24/7</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}