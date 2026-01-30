import { NextResponse } from "next/server";
import pool from "@/lib/db"; // 👈 IMPORT DEFAULT

interface Params {
    params: { id: string };
}

/* =========================
   GET /api/admin/news/:id
========================= */
export async function GET(req: Request, { params }: Params) {
    try {
        const { id } = params;

        const result = await pool.query(
            `SELECT id, topic, title, content, status
       FROM news
       WHERE id = $1`,
            [id],
        );

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
export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = params;
        const body = await req.json();
        const { title, content, status } = body;

        if (!["PUBLISHED", "REJECTED"].includes(status)) {
            return NextResponse.json(
                { message: "Status không hợp lệ" },
                { status: 400 },
            );
        }

        await pool.query(
            `UPDATE news
       SET title = $1,
           content = $2,
           status = $3
       WHERE id = $4`,
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
