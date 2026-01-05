'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/magic/glass-card'
import { ParticleBackground } from '@/components/magic/particle-background'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar,
  MapPin,
  Building,
  Sparkles
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Thông tin cơ bản', description: 'Email và mật khẩu' },
  { id: 2, title: 'Thông tin cá nhân', description: 'Họ tên và liên hệ' },
  { id: 3, title: 'Hoàn tất', description: 'Xác nhận đăng ký' },
]

const patientSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phoneNumber: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'Bạn phải đồng ý với điều khoản dịch vụ',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
})

type PatientFormData = z.infer<typeof patientSchema>

export default function PatientRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const {
    register: formRegister,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
    defaultValues: {
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data: PatientFormData) => {
    try {
      setIsLoading(true)
      await register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: 'Patient',
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : undefined,
        address: data.address,
        city: data.city,
      })
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (keyof PatientFormData)[] = []
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['email', 'password', 'confirmPassword']
        break
      case 2:
        fieldsToValidate = ['fullName', 'phoneNumber']
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <>
      <ParticleBackground />
      
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl animate-fade-in">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
              
              {steps.map((step, index) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${currentStep >= step.id 
                      ? 'bg-primary border-primary text-white scale-110' 
                      : 'bg-background border-border'
                    }
                    ${currentStep === step.id ? 'ring-4 ring-primary/20' : ''}
                  `}>
                    {currentStep > step.id ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <GlassCard className="p-8" blur="lg" intensity={0.15}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Đăng ký tài khoản Bệnh nhân</h1>
              <p className="text-muted-foreground mt-2">
                Hoàn thành các bước để bắt đầu hành trình chăm sóc sức khỏe
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-up">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Thông tin đăng nhập
                  </h2>
                  
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                    disabled={isLoading}
                    {...formRegister('email')}
                  />

                  <Input
                    label="Mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    error={errors.password?.message}
                    disabled={isLoading}
                    {...formRegister('password')}
                  />

                  <Input
                    label="Xác nhận mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    leftIcon={<Lock className="h-4 w-4" />}
                    showPasswordToggle
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                    {...formRegister('confirmPassword')}
                  />
                </div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-up">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Thông tin cá nhân
                  </h2>
                  
                  <Input
                    label="Họ và tên"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    leftIcon={<User className="h-4 w-4" />}
                    error={errors.fullName?.message}
                    disabled={isLoading}
                    {...formRegister('fullName')}
                  />

                  <Input
                    label="Số điện thoại"
                    type="tel"
                    placeholder="0987654321"
                    leftIcon={<Phone className="h-4 w-4" />}
                    error={errors.phoneNumber?.message}
                    disabled={isLoading}
                    {...formRegister('phoneNumber')}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Ngày sinh"
                      type="date"
                      leftIcon={<Calendar className="h-4 w-4" />}
                      error={errors.dateOfBirth?.message}
                      disabled={isLoading}
                      {...formRegister('dateOfBirth')}
                    />

                    <Input
                      label="Thành phố"
                      type="text"
                      placeholder="Hà Nội"
                      leftIcon={<Building className="h-4 w-4" />}
                      error={errors.city?.message}
                      disabled={isLoading}
                      {...formRegister('city')}
                    />
                  </div>

                  <Input
                    label="Địa chỉ"
                    type="text"
                    placeholder="123 Đường ABC, Quận XYZ"
                    leftIcon={<MapPin className="h-4 w-4" />}
                    error={errors.address?.message}
                    disabled={isLoading}
                    {...formRegister('address')}
                  />
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-up">
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-3 bg-primary/10 rounded-full">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h2 className="text-2xl font-bold">Sẵn sàng đăng ký!</h2>
                    <p className="text-muted-foreground">
                      Xem lại thông tin của bạn và hoàn tất đăng ký
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Email', value: watch('email') },
                      { label: 'Họ tên', value: watch('fullName') },
                      { label: 'Số điện thoại', value: watch('phoneNumber') },
                      { label: 'Thành phố', value: watch('city') },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{item.value || 'Chưa cung cấp'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        disabled={isLoading}
                        {...formRegister('agreeToTerms')}
                      />
                      <div className="text-sm">
                        Tôi đồng ý với{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Điều khoản dịch vụ
                        </Link>{' '}
                        và{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Chính sách bảo mật
                        </Link>{' '}
                        của HealthEco
                      </div>
                    </label>
                    {errors.agreeToTerms && (
                      <p className="text-sm text-destructive">{errors.agreeToTerms.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    Quay lại
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={isLoading}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Tiếp tục
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    loading={isLoading}
                    rightIcon={<Check className="h-4 w-4" />}
                  >
                    Hoàn tất đăng ký
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-border text-center text-sm">
              <p className="text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link href="/login" className="font-semibold text-primary hover:text-primary-600 transition-colors">
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  )
}