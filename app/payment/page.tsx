"use client";

import { useCart } from "@/components/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function PaymentPage() {
    const { cart } = useCart();
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const handlePayment = () => {
        // This is where you would trigger your payment integration logic
        alert("Redirecting to payment provider...");
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
            <Card className="w-full max-w-lg shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
                    <CardDescription>Please review your items before making the payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-h-60 overflow-y-auto pr-2">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={item.image || "/placeholder.png"}
                                            alt={item.Title}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{item.Title}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">{(item.price * item.qty).toFixed(2)} KWD</p>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg pt-2">
                        <span>Total Price</span>
                        <span>{totalPrice.toFixed(2)} KWD</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full text-lg py-6" onClick={handlePayment}>
                        Proceed to Payment
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}