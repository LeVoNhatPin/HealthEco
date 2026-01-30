'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewsItem {
    id: number;
    topic: string;
    title: string;
    created_at: string;
}

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/news');
            const data = await res.json();
            setNews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Duyệt bài AI</h1>
                <p className="text-gray-600">
                    Danh sách bài viết do AI tạo – chờ admin xác nhận
                </p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center">Đang tải...</div>
                ) : news.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        Không có bài nào cần duyệt
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Chủ đề</th>
                                <th className="p-3 text-left">Tiêu đề</th>
                                <th className="p-3 text-left">Ngày tạo</th>
                                <th className="p-3 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.map(item => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-3">{item.id}</td>
                                    <td className="p-3">{item.topic}</td>
                                    <td className="p-3 font-medium">
                                        {item.title}
                                    </td>
                                    <td className="p-3 text-sm text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                router.push(`/admin/tin-tuc/${item.id}`)
                                            }
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Xem duyệt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
