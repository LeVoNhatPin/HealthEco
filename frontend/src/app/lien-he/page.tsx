'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageSquare,
    Send,
    CheckCircle,
    Users,
    Building,
    Shield
} from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const contactInfo = [
        {
            icon: <Phone className="h-6 w-6" />,
            title: "Hotline",
            details: ["1900 1234", "0912 345 678"],
            description: "Hỗ trợ 24/7, kể cả ngày lễ"
        },
        {
            icon: <Mail className="h-6 w-6" />,
            title: "Email",
            details: ["info@healtheco.com", "support@healtheco.com"],
            description: "Phản hồi trong vòng 2 giờ làm việc"
        },
        {
            icon: <MapPin className="h-6 w-6" />,
            title: "Trụ sở chính",
            details: ["Tầng 10, Tòa nhà Sunrise", "123 Nguyễn Trãi, Quận 1, TP.HCM"],
            description: "Làm việc từ 7:00 - 20:00"
        },
        {
            icon: <Clock className="h-6 w-6" />,
            title: "Giờ làm việc",
            details: ["Thứ 2 - Thứ 6: 7:00 - 20:00", "Thứ 7: 7:00 - 18:00", "Chủ nhật: 7:00 - 12:00"],
            description: "Khám cấp cứu 24/7"
        }
    ];

    const branches = [
        {
            name: "Chi nhánh Quận 1",
            address: "123 Nguyễn Trãi, Quận 1, TP.HCM",
            phone: "028 1234 5678",
            hours: "7:00 - 20:00",
            specialties: ["Tim mạch", "Nhi khoa", "Da liễu"]
        },
        {
            name: "Chi nhánh Quận 3",
            address: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
            phone: "028 8765 4321",
            hours: "7:00 - 20:00",
            specialties: ["Sản phụ khoa", "Thần kinh", "Mắt"]
        },
        {
            name: "Chi nhánh Quận 7",
            address: "789 Nguyễn Văn Linh, Quận 7, TP.HCM",
            phone: "028 5678 1234",
            hours: "7:00 - 20:00",
            specialties: ["Răng hàm mặt", "Cơ xương khớp", "Tai mũi họng"]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid opacity-20" />
                <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Liên hệ với <span className="text-amber-300">HealthEco</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white border-none shadow-xl">
                            <CardContent className="p-8">
                                <div className="flex items-center mb-8">
                                    <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl mr-4">
                                        <MessageSquare className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Gửi tin nhắn cho chúng tôi</h2>
                                        <p className="text-gray-600">Đội ngũ hỗ trợ sẽ phản hồi trong thời gian sớm nhất</p>
                                    </div>
                                </div>

                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="h-10 w-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Gửi tin nhắn thành công!</h3>
                                        <p className="text-gray-600 mb-8">
                                            Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                                        </p>
                                        <Button
                                            onClick={() => setIsSubmitted(false)}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600"
                                        >
                                            Gửi tin nhắn mới
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Họ và tên *
                                                </label>
                                                <Input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Nguyễn Văn A"
                                                    required
                                                    className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Số điện thoại *
                                                </label>
                                                <Input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="0912 345 678"
                                                    required
                                                    className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email *
                                            </label>
                                            <Input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="nguyenvana@example.com"
                                                required
                                                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tiêu đề
                                            </label>
                                            <Input
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Vấn đề cần hỗ trợ"
                                                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nội dung tin nhắn *
                                            </label>
                                            <Textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Mô tả chi tiết vấn đề của bạn..."
                                                rows={6}
                                                required
                                                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                                        Đang gửi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="h-5 w-5 mr-2" />
                                                        Gửi tin nhắn
                                                    </>
                                                )}
                                            </Button>
                                            <p className="text-sm text-gray-600">
                                                * Thông tin bắt buộc
                                            </p>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <div className="space-y-6 mb-8">
                            {contactInfo.map((info, index) => (
                                <Card key={index} className="bg-white border-none shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex items-start">
                                            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl mr-4">
                                                <div className="text-blue-600">
                                                    {info.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                                                {info.details.map((detail, idx) => (
                                                    <p key={idx} className="text-gray-700 mb-1">{detail}</p>
                                                ))}
                                                <p className="text-sm text-gray-500 mt-2">{info.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Emergency Contact */}
                        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-none shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex items-start">
                                    <div className="p-3 bg-white/20 rounded-xl mr-4">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Cấp cứu 24/7</h3>
                                        <p className="text-xl font-bold mb-2">113</p>
                                        <p className="text-red-100 text-sm">Gọi ngay khi cần hỗ trợ cấp cứu</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Branch Locations */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Hệ thống chi nhánh</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            HealthEco có mặt tại nhiều địa điểm thuận tiện cho việc khám chữa bệnh
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {branches.map((branch, index) => (
                            <Card key={index} className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start mb-4">
                                        <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl mr-4">
                                            <Building className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 mb-1">{branch.name}</h3>
                                            <p className="text-sm text-blue-600">{branch.phone}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span className="font-medium">Địa chỉ:</span>
                                            </div>
                                            <p className="text-gray-700">{branch.address}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span className="font-medium">Giờ làm việc:</span>
                                            </div>
                                            <p className="text-gray-700">{branch.hours}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <Shield className="h-4 w-4 mr-2" />
                                                <span className="font-medium">Chuyên khoa:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {branch.specialties.map((specialty, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                                    >
                                                        {specialty}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full mt-6 border-blue-300 text-blue-600 hover:bg-blue-50"
                                    >
                                        <a href={`/dat-lich?branch=${branch.name}`}>
                                            Đặt lịch tại đây
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none shadow-xl">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
                                <p className="text-gray-600">Tìm câu trả lời cho những thắc mắc phổ biến</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        question: "Tôi cần chuẩn bị gì trước khi đến khám?",
                                        answer: "Vui lòng mang theo CMND/CCCD, thẻ BHYT (nếu có) và các kết quả xét nghiệm, hình ảnh cũ (nếu có). Nên đến trước 15 phút để hoàn tất thủ tục."
                                    },
                                    {
                                        question: "Có đặt lịch khám ngoài giờ không?",
                                        answer: "HealthEco có dịch vụ khám ngoài giờ từ 18:00 - 20:00 các ngày trong tuần và 7:00 - 12:00 Chủ nhật. Phí dịch vụ sẽ cao hơn 30% so với giờ hành chính."
                                    },
                                    {
                                        question: "Có hỗ trợ thanh toán bảo hiểm không?",
                                        answer: "HealthEco liên kết với hầu hết các công ty bảo hiểm y tế. Vui lòng mang theo thẻ BHYT và giấy tờ liên quan để được hỗ trợ thanh toán trực tiếp."
                                    }
                                ].map((faq, index) => (
                                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                            <Users className="h-5 w-5 text-blue-600 mr-3" />
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-600 pl-8">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}