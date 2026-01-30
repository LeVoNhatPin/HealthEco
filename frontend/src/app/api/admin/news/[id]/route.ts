import { NextResponse } from "next/server";
import pool from "@/lib/db"; // 👈 IMPORT DEFAULT

export async function GET(
    req: Request,
    { params }: { params: { id: string } },
) {
    try {
        const result = await pool.query(`SELECT * FROM news WHERE id = $1`, [
            params.id,
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
