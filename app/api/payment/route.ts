import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, currency, customer, language, shippingAddress } = body;

        // 1. Prepare Payload (Simplified for Sandbox Safety)
        // We only send Name and Email to avoid mobile validation errors.
        const payload = {
            PaymentMethod: 'INVOICE', 
            InvoiceNotificationOption: 'LINK', 
            Order: {
                Amount: amount, 
                Currency: currency || 'KWD'
            },
            Customer: {
                Name: customer?.name || 'Guest',
                Email: customer?.email || 'guest@example.com',
                // No Mobile/CountryCode to prevent sandbox bugs
            },
            IntegrationUrls: {
                CallbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/status`,
                ErrorUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/status`,
            },
            Language: language === 'ar' ? 'AR' : 'EN',
            // We use the Customer's Name as a reference for the receipt
            CustomerReference: shippingAddress?.name || "OrderRef"
        };

        console.log(">> 1. Requesting Payment URL...");

        // 2. Call MyFatoorah
        const response = await axios.post(
            `${process.env.MYFATOORAH_BASE_URL}/v3/payments`,
            payload,
            {
                headers: {
                    Authorization: process.env.MYFATOORAH_API_TOKEN,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data && response.data.IsSuccess) {
            // 3. Return URL to Frontend (Don't save to DB yet)
            return NextResponse.json({ 
                url: response.data.Data.PaymentURL, 
                invoiceId: response.data.Data.InvoiceId 
            });
        } else {
            console.error("MyFatoorah Error:", response.data);
            return NextResponse.json({ 
                error: 'Payment Init Failed', 
                details: response.data.ValidationErrors || response.data.Message 
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("API Error:", error?.response?.data || error.message);
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}