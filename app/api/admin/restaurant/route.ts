import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// UPDATE Restaurant Info
export async function PUT(req: Request) {
  try {
    const { id, name, tagline, logoUrl, phone, address, email } = await req.json();
    const pool = await getConnection();

    // We assume the DB table has 'address' and 'email' columns even if lib/db.ts doesn't fetch them
    await pool.request()
      .input("id", id)
      .input("name", name)
      .input("tagline", tagline)
      .input("logoUrl", logoUrl)
      .input("phone", phone)
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