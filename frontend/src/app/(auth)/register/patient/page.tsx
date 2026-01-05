'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function PatientRegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error for this field
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Số điện thoại là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName,
        role: 'Patient' as const,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined,
        city: formData.city || undefined,
      };

      await register(registerData);
      router.push('/bang-dieu-khien');
    } catch (err: any) {
      const errorMessage = err.message || 'Đăng ký thất bại';
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mr-4"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Quay lại
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold">Đăng ký Bệnh nhân</CardTitle>
              <CardDescription>
                Điền thông tin cá nhân để tạo tài khoản bệnh nhân
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  label="Email *"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={errors.email}
                  required
                />

                <Input
                  id="password"
                  type="password"
                  label="Mật khẩu *"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={errors.password}
                  required
                />

                <Input
                  id="confirmPassword"
                  type="password"
                  label="Xác nhận mật khẩu *"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={errors.confirmPassword}
                  required
                />

                <Input
                  id="fullName"
                  type="text"
                  label="Họ tên *"
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={errors.fullName}
                  required
                />
              </div>

              {/* Right column */}
              <div className="space-y-4">
                <Input
                  id="phoneNumber"
                  type="tel"
                  label="Số điện thoại *"
                  placeholder="0987654321"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={errors.phoneNumber}
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    placeholder="Ngày sinh"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <Input
                  id="address"
                  type="text"
                  label="Địa chỉ"
                  placeholder="Số nhà, đường, phường/xã"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                />

                <Input
                  id="city"
                  type="text"
                  label="Thành phố"
                  placeholder="Hà Nội"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {errors.form && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{errors.form}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                  required
                />
                <Label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                  Tôi đồng ý với{' '}
                  <Link href="/dieu-khoan" className="text-blue-600 hover:text-blue-500 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{' '}
                  và{' '}
                  <Link href="/bao-mat" className="text-blue-600 hover:text-blue-500 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
                loading={isLoading}
                rightIcon={<ArrowLeft className="h-4 w-4 rotate-180" />}
              >
                Hoàn tất đăng ký
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}