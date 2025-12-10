import { NextResponse } from "next/server";
import axios from "axios";
import { createOrder } from "@/lib/db"; 

export async function POST(request: Request) {
  try {
    const { paymentId, orderData } = await request.json();

    if (!paymentId) {
      return NextResponse.json({ isSuccess: false, message: "Missing Payment ID" });
    }

    // 1. Verify with MyFatoorah
    const response = await axios.get(
      `${process.env.MYFATOORAH_BASE_URL}/v3/payments/${paymentId}`,
      {
        headers: {
          Authorization: process.env.MYFATOORAH_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (data.IsSuccess && data.Data.InvoiceStatus === "Paid") {
      const transaction = data.Data;

      // 2. SAVE TO SQL DB
      // 'orderData.shippingAddress' contains the full form object (Area, Block, etc.)
      await createOrder({
          paymentId: transaction.InvoiceId.toString(),
          totalAmount: transaction.InvoiceValue,
          customerName: orderData.customer.name,
          customerEmail: orderData.customer.email,
          customerPhone: orderData.customer.mobile,
          address: orderData.shippingAddress, // <--- Passing the full object
          items: orderData.cartItems
      });

      console.log(`>> SUCCESS: Invoice ${transaction.InvoiceId} saved to DB.`);
      return NextResponse.json({ isSuccess: true, data: transaction });
    } 
    else {
      return NextResponse.json({ isSuccess: false, status: "Unpaid" });
    }

  } catch (error: any) {
    console.error("Verify API Error:", error?.response?.data || error.message);
    return NextResponse.json({ isSuccess: false }, { status: 500 });
  }
}