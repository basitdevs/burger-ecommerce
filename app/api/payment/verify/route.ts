import { NextResponse } from "next/server";
import { createOrder, getOrderByPaymentId } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { paymentId, orderData } = await request.json();

    console.log("Verify API Called with:", { paymentId });

    if (!paymentId) {
      return NextResponse.json({
        isSuccess: false,
        message: "Missing Payment ID",
      });
    }

    const existingOrder = await getOrderByPaymentId(paymentId);
    if (existingOrder) {
      console.log("Order already exists in DB. Skipping creation.");
      return NextResponse.json({
        isSuccess: true,
        message: "Order already processed",
        data: existingOrder,
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
          Authorization: `${process.env.MYFATOORAH_API_TOKEN}`,
        },
        body: JSON.stringify(myFatoorahPayload),
      }
    );

    const data = await res.json();

    if (!data.IsSuccess) {
      console.error("MyFatoorah Validation Failed:", data);
      return NextResponse.json({
        isSuccess: false,
        message: "Payment Validation Failed",
      });
    }

    if (data.Data.InvoiceStatus === "Paid") {
      const transaction = data.Data;

      const customerName =
        orderData.shippingAddress?.name ||
        orderData.customer?.name ||
        transaction.CustomerName ||
        "Guest";
      const customerEmail =
        orderData.shippingAddress?.email ||
        orderData.customer?.email ||
        transaction.CustomerEmail ||
        "guest@example.com";

      let customerPhone =
        orderData.shippingAddress?.phone || orderData.customer?.phone;

      if (
        !customerPhone &&
        transaction.CustomerMobile &&
        transaction.CustomerMobile.length > 5
      ) {
        customerPhone = transaction.CustomerMobile;
      }

      const safeAddress = orderData.shippingAddress || {
        name: customerName,
        phone: customerPhone || "N/A",
        email: customerEmail,
        area: "Pickup/Store",
        block: "-",
        street: "-",
        house: "-",
      };

      await createOrder({
        paymentId: `${transaction.InvoiceId}`,
        totalAmount: transaction.InvoiceValue,
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone || "N/A",
        address: safeAddress,
        items: orderData.cartItems,
      });

      return NextResponse.json({ isSuccess: true, data: transaction });
    } else {
      return NextResponse.json({ isSuccess: false, status: "Unpaid" });
    }
  } catch (error: any) {
    console.error("Verify API Critical Error:", error);
    return NextResponse.json(
      { isSuccess: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
