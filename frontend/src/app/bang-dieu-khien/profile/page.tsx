'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, User, Phone, Home, Calendar } from 'lucide-react';

function ProfileContent() {
    const { user, updateProfile, changePassword, logout, isLoading } = useAuth();
    const router = useRouter();

    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        city: '',
        avatarUrl: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Khởi tạo form data từ user
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || '',
                dateOfBirth: user.dateOfBirth || '',
                address: user.address || '',
                city: user.city || '',
                avatarUrl: user.avatarUrl || '',
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            const response = await updateProfile(formData);

            if (response.success) {
                setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
                setEditMode(false);
            } else {
                setMessage({ type: 'error', text: response.message || 'Cập nhật thất bại' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Đã xảy ra lỗi' });
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
            return;
        }

        try {
            const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);

            if (response.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setPasswordMode(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setMessage({ type: 'error', text: response.message || 'Đổi mật khẩu thất bại' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Đã xảy ra lỗi' });
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/dang-nhap');
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
                    <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản của bạn</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center gap-2">
                            {message.type === 'success' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                {message.text}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Thông tin cá nhân */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Thông Tin Cá Nhân</CardTitle>
                                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                                </div>
                                {!editMode ? (
                                    <Button onClick={() => setEditMode(true)} variant="outline">
                                        Chỉnh Sửa
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setEditMode(false);
                                                // Reset form data
                                                setFormData({
                                                    fullName: user.fullName || '',
                                                    phoneNumber: user.phoneNumber || '',
                                                    dateOfBirth: user.dateOfBirth || '',
                                                    address: user.address || '',
                                                    city: user.city || '',
                                                    avatarUrl: user.avatarUrl || '',
                                                });
                                            }}
                                            variant="outline"
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-6">
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            {formData.avatarUrl ? (
                                                <img
                                                    src={formData.avatarUrl}
                                                    alt={user.fullName}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-3xl font-bold text-white">
                                                    {user.fullName.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{user.fullName}</h3>
                                        <p className="text-gray-600">{user.email}</p>
                                        <div className="flex items-center mt-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                                            </span>
                                            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                                                {user.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Họ và tên
                                        </Label>
                                        <Input
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            disabled={!editMode}
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Số điện thoại
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            disabled={!editMode}
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Ngày sinh
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                            disabled={!editMode}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="flex items-center gap-2">
                                            <Home className="h-4 w-4" />
                                            Thành phố
                                        </Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            disabled={!editMode}
                                            placeholder="Nhập thành phố"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="address">Địa chỉ</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            disabled={!editMode}
                                            placeholder="Nhập địa chỉ đầy đủ"
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="avatarUrl">URL Avatar</Label>
                                        <Input
                                            id="avatarUrl"
                                            value={formData.avatarUrl}
                                            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                            disabled={!editMode}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Bảo mật và tài khoản */}
                    <div className="space-y-6">
                        {/* Đổi mật khẩu */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Bảo Mật</CardTitle>
                                <CardDescription>Đổi mật khẩu tài khoản</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!passwordMode ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">
                                            Để bảo mật tài khoản, hãy thay đổi mật khẩu định kỳ.
                                        </p>
                                        <Button onClick={() => setPasswordMode(true)} variant="outline" className="w-full">
                                            Đổi Mật Khẩu
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                placeholder="Nhập mật khẩu mới"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                placeholder="Nhập lại mật khẩu mới"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button type="submit" disabled={isLoading} className="flex-1">
                                                {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setPasswordMode(false);
                                                    setPasswordData({
                                                        currentPassword: '',
                                                        newPassword: '',
                                                        confirmPassword: '',
                                                    });
                                                }}
                                            >
                                                Hủy
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        {/* Thông tin tài khoản */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông Tin Tài Khoản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-lg font-medium">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Xác thực email</p>
                                    <p className={`text-lg font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {user.isEmailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Ngày tạo tài khoản</p>
                                    <p className="text-lg font-medium">
                                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Cập nhật lần cuối</p>
                                    <p className="text-lg font-medium">
                                        {user.updatedAt
                                            ? new Date(user.updatedAt).toLocaleDateString('vi-VN')
                                            : 'Chưa cập nhật'
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Đăng xuất */}
                        <Card>
                            <CardContent className="pt-6">
                                <Button
                                    onClick={handleLogout}
                                    variant="destructive"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Đăng Xuất'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Test Accounts Info */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Tài khoản test</CardTitle>
                        <CardDescription>Thông tin đăng nhập cho testing</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-800">Admin</h4>
                                <p className="text-sm text-blue-600">admin@healtheco.com</p>
                                <p className="text-sm text-blue-600">Admin123!</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-medium text-green-800">Bệnh nhân</h4>
                                <p className="text-sm text-green-600">patient@test.com</p>
                                <p className="text-sm text-green-600">Patient123!</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h4 className="font-medium text-purple-800">Bác sĩ</h4>
                                <p className="text-sm text-purple-600">doctor@test.com</p>
                                <p className="text-sm text-purple-600">Doctor123!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}