import { NextResponse,NextRequest } from "next/server";
import pool from "@/lib/db"; // 👈 IMPORT DEFAULT

interface Params {
    params: { id: string };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status"); // DRAFT | PUBLISHED | REJECTED
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
      values.push(topic);
      query += ` AND topic ILIKE $${values.length}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Lỗi server" },
      { status: 500 }
    );
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
