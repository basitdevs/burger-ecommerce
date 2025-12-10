"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // Import the hook

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage(); // Get current language

  // Translation Dictionary
  const t = {
    en: {
      title: "How would you like to get your order?",
      pickup: "Pickup",
      delivery: "Delivery",
    },
    ar: {
      title: "كيف تود استلام طلبك؟",
      pickup: "استلام من الفرع",
      delivery: "توصيل",
    },
  };

  const content = t[language];

  const handleOptionSelect = (option: "pickup" | "delivery") => {
    if (option === "delivery") {
      router.push("/shipping");
    } else {
      // For pickup, we can go directly to the payment page
      router.push("/payment");
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => handleOptionSelect("pickup")}
            className="w-full py-8 text-lg"
            variant="outline"
          >
            {/* me-4 adds margin to the "end" (right in English, left in Arabic) */}
            <Package className="me-4 h-8 w-8" />
            {content.pickup}
          </Button>
          <Button
            onClick={() => handleOptionSelect("delivery")}
            className="w-full py-8 text-lg"
          >
            <Truck className="me-4 h-8 w-8" />
            {content.delivery}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
