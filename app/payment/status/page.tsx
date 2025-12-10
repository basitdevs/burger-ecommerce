"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { useAuth } from "@/components/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Language Context

function StatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  
  // 2. Get Language
  const { language } = useLanguage();

  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const [isProcessed, setIsProcessed] = useState(false);

  // 3. Translation Dictionary
  const t = {
    en: {
      loadingTitle: "Finalizing Order...",
      loadingDesc: "Please wait while we confirm payment and save your order details.",
      
      successTitle: "Order Saved Successfully!",
      successDesc: "Thank you! We have received your payment and your order is now being processed.",
      
      failedTitle: "Payment Failed",
      failedDesc: "We could not verify your payment. No order has been saved.",
      
      homeBtn: "Return to Home",
      retryBtn: "Try Again"
    },
    ar: {
      loadingTitle: "جاري إتمام الطلب...",
      loadingDesc: "يرجى الانتظار بينما نقوم بتأكيد الدفع وحفظ تفاصيل الطلب.",
      
      successTitle: "تم حفظ الطلب بنجاح!",
      successDesc: "شكراً لك! تم استلام دفعتك وجاري تجهيز طلبك الآن.",
      
      failedTitle: "فشلت عملية الدفع",
      failedDesc: "لم نتمكن من التحقق من الدفع. لم يتم حفظ الطلب.",
      
      homeBtn: "العودة للرئيسية",
      retryBtn: "حاول مرة أخرى"
    }
  };

  const content = t[language];

  useEffect(() => {
    if (!paymentId || isProcessed) return;

    const verifyAndSave = async () => {
      setIsProcessed(true);

      const storedAddress = sessionStorage.getItem("shippingAddress");
      const shippingAddress = storedAddress ? JSON.parse(storedAddress) : null;

      const orderPayload = {
        cartItems: cart,
        shippingAddress: shippingAddress,
        customer: {
          name: user?.name || shippingAddress?.name || "Guest",
          email: user?.email || shippingAddress?.email || "guest@example.com",
          mobile: shippingAddress?.phone || "00000000",
        },
      };

      try {
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
          sessionStorage.removeItem("shippingAddress");
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
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50 dark:bg-transparent">
      <Card className="w-full max-w-md text-center shadow-lg border-0 bg-white/80 dark:bg-card backdrop-blur-sm">
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
            {status === "loading" && content.loadingTitle}
            {status === "success" && content.successTitle}
            {status === "failed" && content.failedTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {status === "loading" && content.loadingDesc}
            {status === "success" && content.successDesc}
            {status === "failed" && content.failedDesc}
          </p>

          {status !== "loading" && (
            <Button
              className="w-full py-6 text-lg"
              onClick={() =>
                router.push(status === "success" ? "/" : "/payment")
              }
            >
              {status === "success" ? content.homeBtn : content.retryBtn}
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