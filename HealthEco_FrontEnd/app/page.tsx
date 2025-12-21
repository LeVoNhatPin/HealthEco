import Link from 'next/link';
import { Stethoscope, Calendar, Shield, Users, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Healthcare Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Book appointments with top doctors, manage your health records, and get care when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/patient"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HealthEco?
            </h2>
            <p className="text-xl text-gray-600">
              Modern healthcare solutions for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments with doctors in just a few clicks, 24/7.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Top Doctors</h3>
              <p className="text-gray-600">
                Access to verified and experienced healthcare professionals.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data is protected with enterprise-grade security.
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Everyone</h3>
              <p className="text-gray-600">
                Patients, doctors, and clinics all in one integrated platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your healthcare experience?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of satisfied patients and healthcare providers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register/patient"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Sign Up as Patient
            </Link>
            <Link
              href="/register/doctor"
              className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}