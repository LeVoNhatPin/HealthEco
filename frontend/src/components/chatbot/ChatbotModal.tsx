"use client";

import { useState } from "react";
import { aiService } from "@/services/ai.service";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function ChatbotModal({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await aiService.chat(userMsg.content);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: res.reply },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "❌ Lỗi AI" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="p-4 bg-primary text-white flex justify-between">
                <span>HealthEco AI 🤖</span>
                <button onClick={onClose}>✕</button>
            </div>

            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg max-w-[80%] ${
                            msg.role === "user"
                                ? "ml-auto bg-primary text-white"
                                : "bg-gray-100"
                        }`}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && <p className="text-sm text-gray-400">AI đang trả lời...</p>}
            </div>

            <div className="p-3 border-t flex gap-2">
                <input
                    className="flex-1 border rounded px-3 py-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Hỏi gì đi..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-primary text-white px-4 rounded"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
