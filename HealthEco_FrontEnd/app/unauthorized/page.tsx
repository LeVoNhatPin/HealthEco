'use client';

import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg text-center">
        <div>
          <div className="flex justify-center">
            <ShieldAlert className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You dont have permission to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Your account role doesnt have the required permissions to view this page.
          </p>
          
          <div className="pt-4">
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
          
          <div>
            <Link
              href="/login"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}