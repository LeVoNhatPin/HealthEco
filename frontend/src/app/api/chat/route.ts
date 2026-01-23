import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return Response.json(
                { error: "Message is required" },
                { status: 400 },
            );
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Bạn là chatbot AI của HealthEco, tư vấn y tế ngắn gọn, dễ hiểu, không chẩn đoán thay bác sĩ.",
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        return Response.json({
            reply: completion.choices[0].message.content,
        });
    } catch (error: any) {
        console.error("CHAT API ERROR:", error);

        return Response.json(
            {
                error: error.message || "Internal Server Error",
            },
            { status: 500 },
        );
    }
}
