import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export const runtime = "nodejs";

/* =========================
   GET /api/admin/news/:id
========================= */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;

        const result = await pool.query("SELECT * FROM news WHERE id = $1", [
            id,
        ]);

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "Không tìm thấy bài viết" },
                { status: 404 },
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
}

/* =========================
   PUT /api/admin/news/:id
========================= */
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await context.params;
        const { title, content, status } = await req.json();

        await pool.query(
            `
      UPDATE news
      SET title = $1,
          content = $2,
          status = $3
      WHERE id = $4
      `,
            [title, content, status, id],
        );

        return NextResponse.json({
            message: "Cập nhật thành công",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
}
