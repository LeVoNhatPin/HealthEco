'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Stethoscope,
    Users,
    Award,
    Shield,
    Clock,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Star,
    ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
    const teamMembers = [
        {
            name: "TS. BS. Nguyễn Văn An",
            role: "Giám đốc Y khoa",
            specialty: "Tim mạch",
            experience: 20,
            avatar: "/avatars/doctor1.jpg",
            description: "Chuyên gia đầu ngành với 20 năm kinh nghiệm"
        },
        {
            name: "ThS. BS. Trần Thị Bích",
            role: "Trưởng khoa Nhi",
            specialty: "Nhi khoa",
            experience: 15,
            avatar: "/avatars/doctor2.jpg",
            description: "Chuyên sâu về bệnh lý hô hấp trẻ em"
        },
        {
            name: "BS. Lê Minh Cường",
            role: "Trưởng khoa Nội",
            specialty: "Nội tổng quát",
            experience: 12,
            avatar: "/avatars/doctor3.jpg",
            description: "Chuyên điều trị bệnh mãn tính"
        },
        {
            name: "ThS. BS. Phạm Thu Hà",
            role: "Trưởng khoa Sản",
            specialty: "Sản phụ khoa",
            experience: 18,
            avatar: "/avatars/doctor4.jpg",
            description: "Chuyên gia về sinh sản và hiếm muộn"
        }
    ];

    const milestones = [
        { year: 2010, title: "Thành lập", description: "HealthEco được thành lập với sứ mệnh chăm sóc sức khỏe cộng đồng" },
        { year: 2015, title: "Mở rộng", description: "Mở rộng hệ thống với 5 phòng khám chuyên khoa" },
        { year: 2018, title: "Công nghệ hóa", description: "Áp dụng hệ thống đặt lịch trực tuyến và hồ sơ điện tử" },
        { year: 2022, title: "Hoàn thiện", description: "Hoàn thiện hệ thống chăm sóc sức khỏe toàn diện" },
        { year: 2024, title: "Tiên phong", description: "Tiên phong trong chăm sóc sức khỏe số tại Việt Nam" }
    ];

    const values = [
        {
            icon: <Heart className="h-8 w-8" />,
            title: "Tận tâm",
            description: "Luôn đặt sức khỏe và trải nghiệm của bệnh nhân lên hàng đầu"
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: "An toàn",
            description: "Tuân thủ nghiêm ngặt các quy trình y tế và bảo mật thông tin"
        },
        {
            icon: <Award className="h-8 w-8" />,
            title: "Chuyên nghiệp",
            description: "Đội ngũ bác sĩ trình độ cao với chứng chỉ hành nghề"
        },
        {
            icon: <Clock className="h-8 w-8" />,
            title: "Kịp thời",
            description: "Thời gian khám bệnh linh hoạt, phục vụ 24/7"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid opacity-20" />
                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Về <span className="text-amber-300">HealthEco</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                        Hệ thống chăm sóc sức khỏe toàn diện với công nghệ tiên tiến và đội ngũ chuyên gia hàng đầu
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
                        
                    >
                        <a href="/dat-lich">
                            <Calendar className="h-5 w-5 mr-2" />
                            Đặt lịch khám ngay
                        </a>
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                {/* Mission & Vision */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <Card className="bg-gradient-to-br from-white to-blue-50 border-none shadow-xl">
                        <CardContent className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                    <Stethoscope className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Sứ mệnh</h2>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                HealthEco cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao,
                                tiếp cận dễ dàng và chi phí hợp lý cho mọi người dân.
                                Chúng tôi không ngừng cải tiến để trở thành hệ thống y tế
                                tin cậy hàng đầu Việt Nam.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-white to-indigo-50 border-none shadow-xl">
                        <CardContent className="p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-3 bg-indigo-100 rounded-xl mr-4">
                                    <Users className="h-8 w-8 text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Tầm nhìn</h2>
                            </div>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Đến năm 2030, HealthEco sẽ trở thành hệ thống y tế thông minh
                                hàng đầu Đông Nam Á, ứng dụng trí tuệ nhân tạo và công nghệ 4.0
                                để mang đến trải nghiệm chăm sóc sức khỏe vượt trội cho 10 triệu khách hàng.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Our Values */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Những nguyên tắc và giá trị định hướng mọi hoạt động của HealthEco
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4">
                                        <div className="text-blue-600">
                                            {value.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ chuyên gia</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Đội ngũ bác sĩ, chuyên gia giàu kinh nghiệm và tận tâm với nghề
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                                <CardContent className="p-6">
                                    <div className="text-center">
                                        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-white shadow-lg">
                                            <AvatarImage src={member.avatar} alt={member.name} />
                                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                                        <p className="text-blue-600 font-medium mb-1">{member.role}</p>
                                        <div className="flex items-center justify-center space-x-2 mb-3">
                                            <Badge className="bg-gradient-to-r from-green-100 to-green-50 text-green-800">
                                                {member.specialty}
                                            </Badge>
                                            <Badge variant="outline" className="border-amber-200 text-amber-700">
                                                {member.experience} năm
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{member.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Milestones Timeline */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Chặng đường phát triển</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Những dấu mốc quan trọng trong hành trình của HealthEco
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-500 hidden md:block" />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    {/* Content */}
                                    <div className="md:w-1/2 mb-4 md:mb-0 md:px-8">
                                        <Card className={`bg-white border-none shadow-lg ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                                            <CardContent className="p-6">
                                                <div className="flex items-start">
                                                    <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl mr-4">
                                                        <Award className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center mb-2">
                                                            <span className="text-2xl font-bold text-blue-600 mr-3">{milestone.year}</span>
                                                            <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
                                                        </div>
                                                        <p className="text-gray-600">{milestone.description}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Timeline dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 md:left-1/2 md:translate-x-0">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-4 border-white shadow-lg" />
                                    </div>

                                    {/* Empty space for alignment */}
                                    <div className="md:w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                            <div className="text-blue-100">Bác sĩ chuyên khoa</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold mb-2">100K+</div>
                            <div className="text-blue-100">Bệnh nhân tin tưởng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
                            <div className="text-blue-100">Chuyên khoa</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold mb-2">4.9</div>
                            <div className="text-blue-100">Đánh giá trung bình</div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Sẵn sàng trải nghiệm dịch vụ của chúng tôi?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                            <Calendar className="h-5 w-5 mr-2" />
                            Đặt lịch khám ngay
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-6 border-blue-300 text-blue-600 hover:bg-blue-50">
                            <Phone className="h-5 w-5 mr-2" />
                            Liên hệ tư vấn
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, className, variant = "default" }: {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "outline";
}) {
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
            {children}
        </span>
    );
}