import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import sql from "mssql";

export async function POST(req: Request) {
  try {
    const { Title, Title_ar, price, image, categoryId } = await req.json();
    const pool = await getConnection();

    await pool
      .request()
      .input("Title", sql.NVarChar, Title)
      .input("Title_ar", sql.NVarChar, Title_ar || "")
      .input("price", sql.Decimal(10, 3), price)
      .input("image", sql.NVarChar, image)
      .input("categoryId", sql.Int, categoryId).query(`
        INSERT INTO Products (Title, Title_ar, price, image, categoryId) 
        VALUES (@Title, @Title_ar, @price, @image, @categoryId)
      `);

    return NextResponse.json({ success: true, message: "Product added" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, Title, Title_ar, price, image, categoryId } = await req.json();
    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("Title", sql.NVarChar, Title)
      .input("Title_ar", sql.NVarChar, Title_ar || "")
      .input("price", sql.Decimal(10, 3), price)
      .input("image", sql.NVarChar, image)
      .input("categoryId", sql.Int, categoryId).query(`
        UPDATE Products 
        SET 
          Title = @Title, 
          Title_ar = @Title_ar,
          price = @price, 
          image = @image, 
          categoryId = @categoryId
        WHERE id = @id
      `);

    return NextResponse.json({ success: true, message: "Product updated" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Products WHERE id = @id");

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
