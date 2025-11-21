import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { success: false, message: "Token and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const pool = await getConnection();

    const userResult = await pool
      .request()
      .input("hashedToken", hashedToken)
      .query(
        "SELECT id, resetTokenExpiry FROM signup WHERE resetToken = @hashedToken"
      );

    if (userResult.recordset.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid token." },
        { status: 400 }
      );
    }

    const user = userResult.recordset[0];
    const now = new Date();

    if (now > new Date(user.resetTokenExpiry)) {
      return NextResponse.json(
        {
          success: false,
          message: "Token has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("id", user.id)
      .input("hashedPassword", hashedPassword)
      .query(
        "UPDATE signup SET password = @hashedPassword, resetToken = NULL, resetTokenExpiry = NULL WHERE id = @id"
      );

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (err: any) {
    console.error("Reset Password Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
