"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { useAuth } from "@/components/context/AuthContext";

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (!paymentId || isProcessed) return;

    const verifyAndSave = async () => {
      setIsProcessed(true);

      // 1. RETRIEVE SHIPPING DATA
      // This retrieves the exact JSON object you saved in ShippingPage
      const storedAddress = sessionStorage.getItem("shippingAddress");
      const shippingAddress = storedAddress ? JSON.parse(storedAddress) : null;

      // 2. CHECK IF DATA EXISTS
      // If user did Pickup, address might be null, which is fine.
      // If Delivery, address will have {area, block, street...}

      const orderPayload = {
        cartItems: cart,
        shippingAddress: shippingAddress, // Sends the full object with Area/Block etc
        customer: {
          name: user?.name || shippingAddress?.name || "Guest",
          email: user?.email || shippingAddress?.email || "guest@example.com",
          mobile: shippingAddress?.phone || "00000000",
        },
      };

      try {
        // 3. CALL VERIFY API
        const res = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId,
            orderData: orderPayload,
          }),
        });

        const data = await res.json();

        if (data.isSuccess) {
          setStatus("success");
          clearCart();
          sessionStorage.removeItem("shippingAddress"); // Clean up
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("failed");
      }
    };

    if (paymentId) {
      verifyAndSave();
    } else {
      setStatus("failed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md text-center shadow-lg border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <Loader2 className="h-20 w-20 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="h-20 w-20 text-green-500" />
            )}
            {status === "failed" && (
              <XCircle className="h-20 w-20 text-red-500" />
            )}
          </div>
          <CardTitle className="text-3xl">
            {status === "loading" && "Finalizing Order..."}
            {status === "success" && "Order Saved Successfully!"}
            {status === "failed" && "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-600">
            {status === "loading" &&
              "Please wait while we confirm payment and save your order details."}
            {status === "success" &&
              "Thank you! We have received your payment and your order is now being processed."}
            {status === "failed" &&
              "We could not verify your payment. No order has been saved."}
          </p>

          {status !== "loading" && (
            <Button
              className="w-full py-6 text-lg"
              onClick={() =>
                router.push(status === "success" ? "/" : "/payment")
              }
            >
              {status === "success" ? "Return to Home" : "Try Again"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
