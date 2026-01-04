import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Stethoscope, Shield, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: "Đặt lịch dễ dàng",
      description: "Đặt lịch khám 24/7 với vài cú click, không cần chờ đợi"
    },
    {
      icon: Stethoscope,
      title: "Bác sĩ uy tín",
      description: "Đội ngũ bác sĩ chuyên môn cao, được xác minh và đánh giá"
    },
    {
      icon: Shield,
      title: "Bảo mật thông tin",
      description: "Dữ liệu được mã hóa an toàn, tuân thủ quy định y tế"
    },
    {
      icon: Users,
      title: "Tư vấn từ xa",
      description: "Khám bệnh trực tuyến tiện lợi, tiết kiệm thời gian"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Chăm sóc sức khỏe 
            <span className="text-blue-600"> dễ dàng</span> hơn
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Kết nối với bác sĩ chất lượng, đặt lịch khám nhanh chóng và quản lý sức khỏe toàn diện tại một nơi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Bắt đầu ngay
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="lg" variant="outline">
                Tìm bác sĩ
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn HealthEco?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Tham gia cùng hàng ngàn người đã tin tưởng sử dụng HealthEco
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Đăng ký miễn phí
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}