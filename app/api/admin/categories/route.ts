import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ADD Category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: "Name required" }, { status: 400 });

    const pool = await getConnection();
    await pool.request()
      .input("name", name)
      .query("INSERT INTO Categories (name) VALUES (@name)");

    return NextResponse.json({ success: true, message: "Category added" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE Category
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const pool = await getConnection();
    
    // Optional: Check if products exist in this category first
    await pool.request()
      .input("id", id)
      .query("DELETE FROM Categories WHERE id = @id");

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}