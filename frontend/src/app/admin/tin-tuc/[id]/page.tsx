'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface NewsDetail {
    id: number;
    topic: string;
    title: string;
    content: string;
    status: string;
}

export default function ReviewNewsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [news, setNews] = useState<NewsDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadDetail();
    }, []);

    const loadDetail = async () => {
        try {
            const res = await fetch(`/api/admin/news/${id}`);
            const data = await res.json();
            setNews(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (status: 'PUBLISHED' | 'REJECTED') => {
        if (!news) return;

        if (
            !confirm(
                status === 'PUBLISHED'
                    ? 'Đăng bài này?'
                    : 'Từ chối bài này?'
            )
        )
            return;

        try {
            setSaving(true);
            await fetch(`/api/admin/news/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: news.title,
                    content: news.content,
                    status
                })
            });

            alert(
                status === 'PUBLISHED'
                    ? '✅ Đã đăng bài'
                    : '❌ Đã từ chối'
            );
            router.push('/admin/tin-tuc');
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return <div>Đang tải bài viết...</div>;

    if (!news)
        return <div>Không tìm thấy bài viết</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                Duyệt bài AI
            </h1>

            <div className="bg-white border rounded-xl p-6 space-y-4">
                <div>
                    <label className="font-medium">Chủ đề</label>
                    <p className="text-gray-600">{news.topic}</p>
                </div>

                <div>
                    <label className="font-medium">Tiêu đề</label>
                    <input
                        value={news.title}
                        onChange={(e) =>
                            setNews({ ...news, title: e.target.value })
                        }
                        className="w-full border rounded p-2 mt-1"
                    />
                </div>

                <div>
                    <label className="font-medium">Nội dung</label>
                    <textarea
                        value={news.content}
                        onChange={(e) =>
                            setNews({ ...news, content: e.target.value })
                        }
                        rows={14}
                        className="w-full border rounded p-3 mt-1"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        disabled={saving}
                        onClick={() => updateStatus('PUBLISHED')}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Đăng bài
                    </button>

                    <button
                        disabled={saving}
                        onClick={() => updateStatus('REJECTED')}
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Từ chối
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}
