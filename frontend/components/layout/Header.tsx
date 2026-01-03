'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Bell, User, Stethoscope, Calendar, MapPin, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Bác sĩ', href: '/bac-si', icon: <User className="w-4 h-4" /> },
    { name: 'Đặt lịch', href: '/dat-lich', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Phòng khám', href: '/phong-kham', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Dịch vụ', href: '/dich-vu' },
    { name: 'Tin tức', href: '/tin-tuc' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-lg' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HealthEco
              </h1>
              <p className="text-xs text-muted-foreground">Chăm sóc sức khỏe thông minh</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.icon && <span className="text-primary">{item.icon}</span>}
                <span className="font-medium">{item.name}</span>
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Tìm bác sĩ, chuyên khoa..."
                className="pl-10 pr-4 py-2 w-64 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-background/50 backdrop-blur-sm"
              />
            </div>
            
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors group">
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button className="btn-primary py-2 px-4 text-sm">
                Đăng nhập
              </button>
              <button className="btn-secondary py-2 px-4 text-sm">
                Đăng ký
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon && <span>{item.icon}</span>}
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn-primary py-2">Đăng nhập</button>
                    <button className="btn-secondary py-2">Đăng ký</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header