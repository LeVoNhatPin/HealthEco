'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { User, Calendar, Stethoscope, Building } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'Patient':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Welcome, {user.fullName}!</h3>
              <p className="text-gray-600">You are logged in as a patient.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl shadow p-6">
                <Calendar className="h-8 w-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2">My Appointments</h4>
                <p className="text-gray-600">View and manage your appointments</p>
              </div>
              <div className="bg-green-50 rounded-xl shadow p-6">
                <Stethoscope className="h-8 w-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2">Find Doctors</h4>
                <p className="text-gray-600">Book appointments with doctors</p>
              </div>
              <div className="bg-purple-50 rounded-xl shadow p-6">
                <Building className="h-8 w-8 text-purple-600 mb-4" />
                <h4 className="font-semibold text-lg mb-2">Clinics</h4>
                <p className="text-gray-600">Browse clinics near you</p>
              </div>
            </div>
          </div>
        );
      
      case 'Doctor':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Doctor Dashboard</h3>
            <p className="text-gray-600">Welcome, Dr. {user.fullName}!</p>
          </div>
        );
      
      case 'ClinicAdmin':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Clinic Admin Dashboard</h3>
            <p className="text-gray-600">Manage your clinic operations</p>
          </div>
        );
      
      case 'SystemAdmin':
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">System Admin Dashboard</h3>
            <p className="text-gray-600">Manage the entire HealthEco platform</p>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Dashboard</h3>
            <p className="text-gray-600">Welcome to HealthEco!</p>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-2xl font-bold text-blue-600">HealthEco</h1>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-700">{user?.fullName}</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {user?.role}
                  </div>
                  <button
                    onClick={() => logout()}
                    className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-2">Manage your health journey</p>
          </div>
          
          {getDashboardContent()}
        </main>
      </div>
    </ProtectedRoute>
  );
}