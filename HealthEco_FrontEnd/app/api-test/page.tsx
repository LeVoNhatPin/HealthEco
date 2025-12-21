'use client';

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [status, setStatus] = useState('Testing...');
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'Not set';

  useEffect(() => {
    if (backendUrl === 'Not set') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('❌ Backend URL is not set');
      return;
    }

    const testApi = async () => {
      try {
        // Test health endpoint
        const response = await fetch(`${backendUrl}/health`);
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
  }, [backendUrl]); // Thêm backendUrl vào dependency array

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">API Connection Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Backend URL:</label>
            <div className="mt-1 p-2 bg-gray-50 rounded border">
              <code className="text-sm break-all">{backendUrl}</code>
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

          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Test these endpoints:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>GET /health</code> - Health check</li>
                <li><code>POST /api/auth/register</code> - Register</li>
                <li><code>POST /api/auth/login</code> - Login</li>
                <li><code>GET /api/auth/me</code> - Get user info</li>
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <a
                href="/login"
                className="block w-full text-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </a>
              <a
                href="/register/patient"
                className="block w-full text-center py-2.5 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Patient Registration
              </a>
              <a
                href="/dashboard/patient"
                className="block w-full text-center py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Patient Dashboard (Protected)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}