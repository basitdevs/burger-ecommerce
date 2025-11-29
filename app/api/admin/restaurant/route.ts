import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// UPDATE Restaurant Info
export async function PUT(req: Request) {
  try {
    const { id, name, tagline, logoUrl, phone, address, email } = await req.json();
    
    if (!id) {
        return NextResponse.json({ success: false, message: "Restaurant ID is missing" }, { status: 400 });
    }

    const pool = await getConnection();

    await pool.request()
      .input("id", id)
      .input("name", name)
      .input("tagline", tagline)
      .input("logoUrl", logoUrl)
      .input("phone", phone)
      // Ensure we don't pass null to DB if column forbids it, default to empty string
      .input("address", address || "") 
      .input("email", email || "")
      .query(`
        UPDATE RestaurantInfo 
        SET name=@name, tagline=@tagline, logoUrl=@logoUrl, phone=@phone, address=@address, email=@email 
        WHERE id=@id
      `);

    return NextResponse.json({ success: true, message: "Restaurant info updated" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}