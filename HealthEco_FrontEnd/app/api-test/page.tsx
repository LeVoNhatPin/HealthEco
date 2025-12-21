'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export default function ApiTestPage() {
  const [status, setStatus] = useState('Testing...');
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    const testApi = async () => {
      try {
        // Test health endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
        if (response.ok) {
          setStatus('✅ Backend is connected!');
        } else {
          setStatus('❌ Backend health check failed');
        }
      } catch (error) {
        setStatus('❌ Cannot connect to backend');
        console.error('API Test Error:', error);
      }
    };

    testApi();
    setBackendUrl(process.env.NEXT_PUBLIC_API_URL || 'Not set');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">API Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Backend URL:</label>
            <div className="mt-1 p-2 bg-gray-50 rounded border">
              <code className="text-sm">{backendUrl}</code>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status:</label>
            <div className={`mt-1 p-3 rounded ${
              status.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {status}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <a
              href="/login"
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </a>
            <a
              href="/register/patient"
              className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Go to Patient Registration
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}