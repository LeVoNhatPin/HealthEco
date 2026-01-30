// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// import pool from "@/lib/db";

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(req: Request) {
//     try {
//         const { topic } = await req.json();

//         if (!topic) {
//             return NextResponse.json(
//                 { success: false, message: "Thiếu topic" },
//                 { status: 400 }
//             );
//         }

//         const prompt = `
// Bạn là bác sĩ viết bài y khoa cho website HealthEco.
// Hãy viết một bài báo về chủ đề: "${topic}"

// Yêu cầu:
// - Văn phong dễ hiểu cho người dân
// - Có tiêu đề
// - Có các mục rõ ràng
// - Không dùng emoji
// - Không markdown
// - Viết bằng tiếng Việt
// `;

//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }],
//         });

//         const content = completion.choices[0].message.content;

//         // 👉 LƯU DB
//         const result = await pool.query(
//             `
//             INSERT INTO news (title, content)
//             VALUES ($1, $2)
//             RETURNING *
//             `,
//             [topic, content]
//         );

//         return NextResponse.json({
//             success: true,
//             message: "Tạo bài viết AI thành công",
//             data: result.rows[0],
//         });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { success: false, message: "Lỗi tạo bài viết AI" },
//             { status: 500 }
//         );
//     }
// }
