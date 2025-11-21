import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("email", email)
      .query(
        "SELECT id, name, email, password FROM signup WHERE email = @email"
      );

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
