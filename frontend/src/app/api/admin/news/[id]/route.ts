// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";

// export const runtime = "nodejs";

// /* =========================
//    GET /api/admin/news/:id
// ========================= */
// export async function GET(
//     req: NextRequest,
//     context: { params: Promise<{ id: string }> },
// ) {
//     try {
//         const { id } = await context.params;

//         const result = await pool.query("SELECT * FROM news WHERE id = $1", [
//             id,
//         ]);

//         if (result.rowCount === 0) {
//             return NextResponse.json(
//                 { message: "Không tìm thấy bài viết" },
//                 { status: 404 },
//             );
//         }

//         return NextResponse.json(result.rows[0]);
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
//     }
// }

// /* =========================
//    PUT /api/admin/news/:id
// ========================= */
// export async function PUT(
//     req: Request,
//     context: { params: { id: string } }
// ) {
//     try {
//         const { id } = context.params;
//         const body = await req.json();
//         const { title, content } = body;

//         if (!title || !content) {
//             return NextResponse.json(
//                 { success: false, message: "Thiếu dữ liệu" },
//                 { status: 400 }
//             );
//         }

//         const result = await pool.query(
//             `
//             UPDATE news
//             SET title = $1,
//                 content = $2,
//                 updated_at = NOW()
//             WHERE id = $3
//             RETURNING *
//             `,
//             [title, content, id]
//         );

//         if (result.rowCount === 0) {
//             return NextResponse.json(
//                 { success: false, message: "Không tìm thấy bài viết" },
//                 { status: 404 }
//             );
//         }

//         return NextResponse.json({
//             success: true,
//             message: "Cập nhật bài viết thành công",
//             data: result.rows[0],
//         });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { success: false, message: "Lỗi cập nhật bài viết" },
//             { status: 500 }
//         );
//     }
// }

// export async function DELETE(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         await pool.query(
//             `DELETE FROM news WHERE id = $1`,
//             [params.id]
//         );

//         return NextResponse.json({
//             success: true,
//             message: "Xoá bài viết thành công",
//         });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { success: false, message: "Lỗi xoá bài viết" },
//             { status: 500 }
//         );
//     }
// }

