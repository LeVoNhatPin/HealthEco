import findHardAnswer from "@/chatbot/hardChatHandler";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages?.[messages.length - 1]?.content || "";

    // ✅ 1. Ưu tiên HARD CHAT
    const hardReply = findHardAnswer(lastMessage);
    if (hardReply) {
      return NextResponse.json({ reply: hardReply });
    }

    // ✅ 2. Nếu KHÔNG có API KEY → vẫn trả lời cứng
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        reply: "Hệ thống AI đang bảo trì ⚠️. Mình vẫn có thể trả lời các câu hỏi cơ bản."
      });
    }

    // ✅ 3. Gọi OpenAI nếu cần
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });

  } catch (err: any) {
    console.error("Chat API error:", err);

    // ✅ 4. FALLBACK CUỐI CÙNG
    return NextResponse.json({
      reply: "Chatbot đang gặp sự cố kỹ thuật 🤖. Bạn thử hỏi lại sau nhé."
    });
  }
}
