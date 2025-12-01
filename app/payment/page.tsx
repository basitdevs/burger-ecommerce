"use client";

import { useCart } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Context

export default function PaymentPage() {
    const { cart } = useCart();
    const { language } = useLanguage(); // 2. Get Language

    // 3. Define Translations
    const t = {
        en: {
            title: "Order Summary",
            desc: "Please review your items before making the payment.",
            qty: "Quantity",
            total: "Total Price",
            payBtn: "Proceed to Payment",
            alert: "Redirecting to payment provider...",
            currency: "KWD"
        },
        ar: {
            title: "ملخص الطلب",
            desc: "يرجى مراجعة العناصر قبل إتمام عملية الدفع.",
            qty: "الكمية",
            total: "إجمالي المبلغ",
            payBtn: "متابعة الدفع",
            alert: "جاري التحويل لصفحة الدفع...",
            currency: "د.ك"
        }
    };

    const content = t[language]; // Select content

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handlePayment = () => {
        // Use translated alert message
        alert(content.alert);
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
                    <CardDescription>{content.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* pe-2 adds padding to the 'end' (right in EN, left in AR) to avoid scrollbar overlap */}
                    <div className="max-h-60 overflow-y-auto pe-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 shrink-0">
                                        <Image
                                            src={item.image || "/placeholder.png"}
                                            alt={item.Title}
                                            fill
                                            className="object-cover rounded-md bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        {/* Dynamic Title Selection */}
                                        <p className="font-semibold">
                                            {language === 'ar' && (item as any).Title_ar 
                                                ? (item as any).Title_ar 
                                                : item.Title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {content.qty}: {item.qty}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold whitespace-nowrap">
                                    {(item.price * item.qty).toFixed(3)} {content.currency}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg pt-2">
                        <span>{content.total}</span>
                        <span>{totalPrice.toFixed(3)} {content.currency}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full text-lg py-6" onClick={handlePayment}>
                        {content.payBtn}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}