import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, mobile, country } = body;

    const pool = await getConnection();

    // Check if email already exists
    const checkUser = await pool
      .request()
      .input("email", email)
      .query("SELECT id FROM signup WHERE email = @email");

    if (checkUser.recordset.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool
      .request()
      .input("name", name)
      .input("email", email)
      .input("password", hashedPassword)
      .input("mobile", mobile || null)
      .input("country", country).query(`
        INSERT INTO signup (name, email, password, mobile, country)
        VALUES (@name, @email, @password, @mobile, @country)
      `);

    return NextResponse.json({
      success: true,
      message: "User signed up successfully!",
    });
  } catch (err: unknown) {
    console.error(err);

    // SQL error type guard
    const sqlError = err as { number?: number; message?: string };

    if (sqlError.number === 2627) {
      return NextResponse.json(
        { success: false, message: "Duplicate entry detected" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: sqlError.message ?? "Server error",
      },
      { status: 500 }
    );
  }
}
