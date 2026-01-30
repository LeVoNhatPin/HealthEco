// import { NextResponse } from "next/server";
// import pool from "@/lib/db";

// export async function GET() {
//     try {
//         const result = await pool.query(`
//             SELECT id, title, created_at
//             FROM news
//             ORDER BY created_at DESC
//         `);

//         return NextResponse.json({
//             success: true,
//             data: result.rows,
//         });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { success: false, message: "Lỗi lấy danh sách bài viết" },
//             { status: 500 }
//         );
//     }
// }
