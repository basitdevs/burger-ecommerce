import { NextResponse } from "next/server";
import axios from "axios";
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

    console.log(">> MyFatoorah Verification Response:", data);

    if (data.IsSuccess && data.Data.Invoice.Status == "PAID") {
      const transaction = data.Data;
      console.log(">> Payment Verified:", transaction);
      // 2. SAVE TO SQL DB
      // 'orderData.shippingAddress' contains the full form object (Area, Block, etc.)

      await createOrder({
        paymentId: transaction.Invoice.Id, // Invoice ID
        totalAmount: transaction.Amount.ValueInPayCurrency, // Final paid amount
        customerName: transaction.Customer.Name, // Customer name
        customerEmail: transaction.Customer.Email, // Customer email
        customerPhone: transaction.Customer.Mobile, // Customer phone
        address: orderData.shippingAddress, // Your stored address
        items: orderData.cartItems,
      });

      console.log(`>> SUCCESS: Invoice ${transaction.Invoice.Id} saved to DB.`);
      return NextResponse.json({ isSuccess: true, data: transaction });
    } else {
      return NextResponse.json({ isSuccess: false, status: "Unpaid" });
    }
  } catch (error: any) {
    console.error("Verify API Error:", error?.response?.data || error.message);
    return NextResponse.json({ isSuccess: false }, { status: 500 });
  }
}
