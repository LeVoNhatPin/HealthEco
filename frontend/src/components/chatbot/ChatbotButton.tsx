"use client";

export default function ChatbotButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:scale-105 transition"
        >
            🤖
        </button>
    );
}
