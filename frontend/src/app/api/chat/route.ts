import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { message } = await req.json();

    if (!message) {
        return NextResponse.json(
            { success: false, message: "Message is required" },
            { status: 400 }
        );
    }

    // 👉 Ví dụ gọi OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Bạn là trợ lý AI của hệ thống HealthEco, hỗ trợ đặt lịch khám, bác sĩ, phòng khám.",
                },
                { role: "user", content: message },
            ],
        }),
    });

    const data = await response.json();

    return NextResponse.json({
        success: true,
        reply: data.choices[0].message.content,
    });
}
