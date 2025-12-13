"use client";

import { useCart } from "@/components/context/CartContext";
import { useAuth } from "@/components/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage() {
  const { cart } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [orderType, setOrderType] = useState<string>("pickup");

  const [pickupDetails, setPickupDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedAddress = sessionStorage.getItem("shippingAddress");
    const storedType = sessionStorage.getItem("orderType");

    if (storedAddress) {
      setShippingInfo(JSON.parse(storedAddress));
    }
    if (storedType) {
      setOrderType(storedType);
    }

    if (user) {
      setPickupDetails({
        name: user.name || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user]);

  const t = {
    en: {
      title: "Order Summary",
      desc: "Please review your items before making the payment.",
      contactDetails: "Contact Details",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      qty: "Quantity",
      total: "Total Price",
      payBtn: "Proceed to Payment",
      currency: "KWD",
      deliveryTo: "Delivering to:",
      pickupAt: "Pickup Order",
      reqFields: "Please fill in all contact details.",
    },
    ar: {
      title: "ملخص الطلب",
      desc: "يرجى مراجعة العناصر قبل إتمام عملية الدفع.",
      contactDetails: "معلومات الاتصال",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      qty: "الكمية",
      total: "إجمالي المبلغ",
      payBtn: "متابعة الدفع",
      currency: "د.ك",
      deliveryTo: "التوصيل إلى:",
      pickupAt: "استلام من الفرع",
      reqFields: "يرجى تعبئة جميع معلومات الاتصال.",
    },
  };

  const content = t[language];
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePayment = async () => {
    if (orderType === "pickup") {
      if (!pickupDetails.name || !pickupDetails.phone) {
        toast.error(content.reqFields);
        return;
      }
    }

    setLoading(true);

    let finalShippingInfo = shippingInfo;

    if (orderType === "pickup") {
      finalShippingInfo = {
        name: pickupDetails.name,
        email: pickupDetails.email || "guest@example.com",
        phone: pickupDetails.phone,
        area: "Pickup",
        block: "-",
        street: "-",
        house: "-",
      };
    }

    sessionStorage.setItem("tempCart", JSON.stringify(cart));
    sessionStorage.setItem(
      "shippingAddress",
      JSON.stringify(finalShippingInfo)
    );

    const customerName = finalShippingInfo?.name || user?.name || "Guest";
    const customerEmail =
      finalShippingInfo?.email || user?.email || "guest@example.com";
    const customerPhone = finalShippingInfo?.phone || "";

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const payload = {
      CustomerName: customerName,
      CustomerEmail: customerEmail,
      CustomerMobile: customerPhone,
      InvoiceValue: totalPrice,
      DisplayCurrencyIso: "KWD",
      NotificationOption: "LNK",
      CallBackUrl: `${origin}/payment/status`,
      ErrorUrl: `${origin}/payment/status`,
      Language: language === "ar" ? "ar" : "en",
      CustomerReference: orderType,
    };

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.IsSuccess && data.Data && data.Data.InvoiceURL) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = data.Data.InvoiceURL;
      } else {
        const errorMessage = data.ValidationErrors
          ? data.ValidationErrors.map((e: any) => e.Error).join(", ")
          : data.Message || "Payment initiation failed";

        toast.error(errorMessage);
        console.error("Payment Error:", data);
      }
    } catch (error) {
      console.error("Frontend Error:", error);
      toast.error("Something went wrong connecting to the server");
    } finally {
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-gray-50 dark:bg-transparent p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{content.title}</CardTitle>
          <CardDescription>
            {orderType === "delivery" && shippingInfo ? (
              <span className="text-blue-600 block mt-1">
                {content.deliveryTo} {shippingInfo.area}, {shippingInfo.block}
              </span>
            ) : (
              <span className="text-green-600 block mt-1">
                {content.pickupAt}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pickup Contact Form */}
          {orderType === "pickup" && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border mb-4 space-y-3">
              <h3 className="font-semibold text-sm mb-2">
                {content.contactDetails}
              </h3>
              <div className="space-y-1">
                <Label className="text-xs">{content.name} *</Label>
                <Input
                  value={pickupDetails.name}
                  onChange={(e) =>
                    setPickupDetails({ ...pickupDetails, name: e.target.value })
                  }
                  placeholder={content.name}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{content.phone} *</Label>
                <Input
                  value={pickupDetails.phone}
                  onChange={(e) =>
                    setPickupDetails({
                      ...pickupDetails,
                      phone: e.target.value,
                    })
                  }
                  placeholder="12345678"
                  type="tel"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{content.email}</Label>
                <Input
                  value={pickupDetails.email}
                  onChange={(e) =>
                    setPickupDetails({
                      ...pickupDetails,
                      email: e.target.value,
                    })
                  }
                  placeholder={content.email}
                  type="email"
                />
              </div>
            </div>
          )}

          {/* Cart Items */}
          <div className="max-h-60 overflow-y-auto pe-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4"
              >
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
                      {language === "ar" && (item as any).Title_ar
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
            <span>
              {totalPrice.toFixed(3)} {content.currency}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-lg py-6"
            onClick={handlePayment}
            disabled={loading || cart.length === 0}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? "Processing..." : content.payBtn}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
