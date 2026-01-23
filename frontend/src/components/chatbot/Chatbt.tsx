"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = {
    role: "user" | "bot";
    content: string;
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Msg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                { role: "bot", content: data.reply || "Có lỗi xảy ra 😢" },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: "Không kết nối được server 😢" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
            >
                <MessageCircle />
            </button>

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-xl flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center p-3 border-b">
                        <span className="font-semibold">🤖 HealthEco AI</span>
                        <button onClick={() => setOpen(false)}>
                            <X />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg max-w-[80%] ${m.role === "user"
                                        ? "bg-primary text-white ml-auto"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {m.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="text-gray-400 italic">Đang trả lời...</div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex border-t p-2 gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Nhập câu hỏi..."
                            className="flex-1 border rounded px-2 py-1 text-sm"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-primary text-white px-3 rounded"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
