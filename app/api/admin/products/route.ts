import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ADD Product
export async function POST(req: Request) {
  try {
    const { Title, price, image, categoryId } = await req.json();
    const pool = await getConnection();

    await pool.request()
      .input("Title", Title)
      .input("price", price)
      .input("image", image)
      .input("categoryId", categoryId)
      .query(`
        INSERT INTO Products (Title, price, image, categoryId) 
        VALUES (@Title, @price, @image, @categoryId)
      `);

    return NextResponse.json({ success: true, message: "Product added" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// UPDATE Product (New)
export async function PUT(req: Request) {
  try {
    const { id, Title, price, image, categoryId } = await req.json();
    const pool = await getConnection();

    await pool.request()
      .input("id", id)
      .input("Title", Title)
      .input("price", price)
      .input("image", image)
      .input("categoryId", categoryId)
      .query(`
        UPDATE Products 
        SET Title=@Title, price=@price, image=@image, categoryId=@categoryId
        WHERE id=@id
      `);

    return NextResponse.json({ success: true, message: "Product updated" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE Product
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const pool = await getConnection();

    await pool.request()
      .input("id", id)
      .query("DELETE FROM Products WHERE id = @id");

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}