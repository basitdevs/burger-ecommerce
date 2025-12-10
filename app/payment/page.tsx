"use client";

import { useCart } from "@/components/context/CartContext";
import { useAuth } from "@/components/context/AuthContext"; // Import Auth
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner for toasts

export default function PaymentPage() {
    const { cart } = useCart();
    const { user } = useAuth();
    const { language } = useLanguage();
    const [loading, setLoading] = useState(false);
    
    // State to hold shipping info
    const [shippingInfo, setShippingInfo] = useState<any>(null);
    const [orderType, setOrderType] = useState<string>("pickup");

    // Load Shipping Info on Mount
    useEffect(() => {
        const storedAddress = sessionStorage.getItem("shippingAddress");
        const storedType = sessionStorage.getItem("orderType");

        if (storedAddress) {
            setShippingInfo(JSON.parse(storedAddress));
        }
        if (storedType) {
            setOrderType(storedType);
        }
    }, []);

    const t = {
        en: {
            title: "Order Summary",
            desc: "Please review your items before making the payment.",
            qty: "Quantity",
            total: "Total Price",
            payBtn: "Proceed to Payment",
            alert: "Initiating payment...",
            currency: "KWD",
            deliveryTo: "Delivering to:",
            pickupAt: "Pickup Order",
        },
        ar: {
            title: "ملخص الطلب",
            desc: "يرجى مراجعة العناصر قبل إتمام عملية الدفع.",
            qty: "الكمية",
            total: "إجمالي المبلغ",
            payBtn: "متابعة الدفع",
            alert: "جاري بدء عملية الدفع...",
            currency: "د.ك",
            deliveryTo: "التوصيل إلى:",
            pickupAt: "استلام من الفرع",
        }
    };

    const content = t[language];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handlePayment = async () => {
        setLoading(true);

        // Prepare Customer Data
        // Priority: Shipping Info > Logged In User > Guest Defaults
        const customerData = {
            name: shippingInfo?.name || user?.name || "Guest",
            email: shippingInfo?.email || user?.email || "guest@example.com",
            mobile: shippingInfo?.phone || "12345678", // MyFatoorah needs a mobile
        };

        try {
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalPrice,
                    currency: "KWD",
                    language: language,
                    cartItems: cart,
                    customer: customerData,
                    shippingAddress: shippingInfo, // Pass the full address
                    orderType: orderType // 'delivery' or 'pickup'
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Payment initiation failed");
                console.error("API Error:", data);
            }
        } catch (error) {
            console.error("Frontend Error:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
                    <CardDescription>
                        {orderType === 'delivery' && shippingInfo ? (
                            <span className="text-blue-600 block mt-1">
                                {content.deliveryTo} {shippingInfo.area}, {shippingInfo.block}
                            </span>
                        ) : (
                            <span className="text-green-600 block mt-1">{content.pickupAt}</span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Button 
                        className="w-full text-lg py-6" 
                        onClick={handlePayment} 
                        disabled={loading || cart.length === 0}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : content.payBtn}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}