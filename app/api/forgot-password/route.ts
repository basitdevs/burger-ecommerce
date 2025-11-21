import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
      console.error(
        "Email server credentials are not configured in .env.local"
      );
      throw new Error("Server configuration error.");
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const pool = await getConnection();

    const userResult = await pool
      .request()
      .input("email", email)
      .query("SELECT id, name FROM signup WHERE email = @email");

    if (userResult.recordset.length === 0) {
      console.log(`Password reset attempt for non-existent email: ${email}`);
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const user = userResult.recordset[0];

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await pool
      .request()
      .input("id", user.id)
      .input("resetToken", passwordResetToken)
      .input("resetTokenExpiry", passwordResetExpires)
      .query(
        "UPDATE signup SET resetToken = @resetToken, resetTokenExpiry = @resetTokenExpiry WHERE id = @id"
      );

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SERVER_USER,
      to: email,
      subject: "Your Password Reset Request",
      text: `Hello ${user.name},\n\nYou requested a password reset. Please click the link below to set a new password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n`,
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (err: unknown) {
    console.error("Forgot Password Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
