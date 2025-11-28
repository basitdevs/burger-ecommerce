import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // ✅ FIX: Await the cookies() call
  const cookieStore = await cookies();
  
  cookieStore.delete(process.env.COOKIE_NAME || "admin_session_token");
  
  return NextResponse.json({ success: true });
}