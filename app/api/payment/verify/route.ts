import { NextResponse } from "next/server";
import { createOrder } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { paymentId, orderData } = await request.json();

    if (!paymentId) {
      return NextResponse.json({
        isSuccess: false,
        message: "Missing Payment ID",
      });
    }

    const myFatoorahPayload = {
      Key: paymentId,
      KeyType: "PaymentId",
    };

    const res = await fetch(
      "https://apitest.myfatoorah.com/v2/GetPaymentStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.MYFATOORAH_API_TOKEN || "",
        },
        body: JSON.stringify(myFatoorahPayload),
      }
    );

    const data = await res.json();

    if (data.IsSuccess && data.Data.InvoiceStatus === "Paid") {
      const transaction = data.Data;

      await createOrder({
        paymentId: `${transaction.InvoiceId}`,
        totalAmount: transaction.InvoiceValue,
        customerName: transaction.CustomerName,
        customerEmail: transaction.CustomerEmail,
        customerPhone: transaction.CustomerMobile,
        address: orderData.shippingAddress,
        items: orderData.cartItems,
      });

      return NextResponse.json({ isSuccess: true, data: transaction });
    } else {
      return NextResponse.json({ isSuccess: false, status: "Unpaid" });
    }
  } catch (error: any) {
    console.error("Verify API Error:", error);
    return NextResponse.json(
      { isSuccess: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
