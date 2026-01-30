import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/* =========================
   GET /api/admin/news
========================= */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const status = searchParams.get("status");
        const topic = searchParams.get("topic");

        let query = `
      SELECT id, topic, title, status, created_at
      FROM news
      WHERE 1 = 1
    `;
        const values: any[] = [];

        if (status) {
            values.push(status);
            query += ` AND status = $${values.length}`;
        }

        if (topic) {
            values.push(`%${topic}%`);
            query += ` AND topic ILIKE $${values.length}`;
        }

        query += " ORDER BY created_at DESC";

        const result = await pool.query(query, values);

        return NextResponse.json(result.rows);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Lỗi server" }, { status: 500 });
    }
}
