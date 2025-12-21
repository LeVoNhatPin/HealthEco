'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Calendar, Bell, Settings } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['Patient']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">HealthEco</h1>
                <span className="ml-4 text-sm text-gray-500">Patient Dashboard</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <Bell className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <Settings className="h-5 w-5" />
                </button>
                <button
                  onClick={() => logout()}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.fullName}!
                </h2>
                <p className="text-gray-600 mt-1">
                  {user?.email} • Patient since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : ''}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Appointments</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cancelled Appointments</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="mt-1">{user?.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Number</label>
                <p className="mt-1">{user?.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="mt-1">
                  {user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'dd/MM/yyyy') : 'Not provided'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="mt-1">{user?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}