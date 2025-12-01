import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import sql from "mssql";

export async function PUT(req: Request) {
  try {
    const {
      id,
      name,
      name_ar,
      tagline,
      tagline_ar,
      logoUrl,
      phone,
      address,
      address_ar,
      email,
    } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Restaurant ID is missing" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)

      .input("name", sql.NVarChar, name)
      .input("tagline", sql.NVarChar, tagline)
      .input("address", sql.NVarChar, address || "")

      .input("name_ar", sql.NVarChar, name_ar || "")
      .input("tagline_ar", sql.NVarChar, tagline_ar || "")
      .input("address_ar", sql.NVarChar, address_ar || "")

      .input("logoUrl", sql.VarChar, logoUrl)
      .input("phone", sql.VarChar, phone)
      .input("email", sql.VarChar, email || "").query(`
        UPDATE RestaurantInfo 
        SET 
          name = @name, 
          name_ar = @name_ar,
          tagline = @tagline, 
          tagline_ar = @tagline_ar,
          logoUrl = @logoUrl, 
          phone = @phone, 
          address = @address, 
          address_ar = @address_ar,
          email = @email 
        WHERE id = @id
      `);

    return NextResponse.json({
      success: true,
      message: "Restaurant info updated",
    });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
