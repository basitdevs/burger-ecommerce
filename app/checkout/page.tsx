"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Package } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage();

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
    sessionStorage.setItem("orderType", option);

    if (option === "delivery") {
      router.push("/shipping");
    } else {
      sessionStorage.removeItem("shippingAddress");

      router.push("/payment");
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
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
            {/* margin-end handles RTL automatically in Tailwind */}
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
