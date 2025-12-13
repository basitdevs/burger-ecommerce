import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch("https://apitest.myfatoorah.com/v2/SendPayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MYFATOORAH_API_TOKEN || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { IsSuccess: false, Message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
