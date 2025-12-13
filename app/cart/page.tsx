"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Trash } from "lucide-react";
import { useCart } from "@/components/context/CartContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage() {
  const { cart, removeFromCart, updateCartItem } = useCart();
  const router = useRouter();

  const { language } = useLanguage();

  const t = {
    en: {
      emptyTitle: "Your Cart is Empty",
      emptyDesc: "Looks like you haven't added anything yet.",
      startShopping: "Start Shopping",
      cartTitle: `Your Cart (${cart.length} items)`,
      total: "Total:",
      checkout: "Checkout",
      currency: "KWD",
      item: "items",
    },
    ar: {
      emptyTitle: "سلة المشتريات فارغة",
      emptyDesc: "يبدو أنك لم تضف أي شيء بعد.",
      startShopping: "ابدأ التسوق",
      cartTitle: `سلة المشتريات (${cart.length} عناصر)`,
      total: "الإجمالي:",
      checkout: "إتمام الطلب",
      currency: "د.ك",
      item: "عناصر",
    },
  };

  const content = t[language];

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-gray-600 px-4">
        <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">
          {content.emptyTitle}
        </h2>
        <p className="mb-6 dark:text-gray-200">{content.emptyDesc}</p>
        <Button onClick={() => router.push("/")}>
          {content.startShopping}
        </Button>
      </div>
    );
  }

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-36 md:pb-20">
      <h2 className="text-2xl font-bold mb-5">{content.cartTitle}</h2>

      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <Card
            key={item.id}
            className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow hover:shadow-md"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative shrink-0 border rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.Title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="text-base sm:text-lg font-semibold line-clamp-2">
                  {language === "ar" && (item as any).Title_ar
                    ? (item as any).Title_ar
                    : item.Title}
                </h3>
                <p className="text-primary font-bold mt-1">
                  {item.price.toFixed(3)} {content.currency}
                </p>
              </div>
            </div>

            {/* Actions (Qty & Delete) */}
            <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 mt-2 sm:mt-0 border-t sm:border-none pt-3 sm:pt-0">
              {/* Quantity Selector */}
              <div
                className="flex items-center border rounded-md bg-background"
                dir="ltr"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 px-0 rounded-none"
                  onClick={() =>
                    updateCartItem(item.id, Math.max(1, item.qty - 1))
                  }
                >
                  -
                </Button>

                <span className="w-8 text-center text-sm font-medium">
                  {item.qty}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 px-0 rounded-none"
                  onClick={() => updateCartItem(item.id, item.qty + 1)}
                >
                  +
                </Button>
              </div>

              {/* Delete Button */}
              {/* Changed ml-auto to ms-auto (margin-start) for RTL support */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 ms-auto sm:ms-0"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Checkout Summary Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg sm:relative sm:bg-transparent sm:border-none sm:shadow-none sm:mt-8 sm:p-0 z-40">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-end items-center gap-4">
          <div className="flex justify-between w-full sm:w-auto gap-4 items-center">
            <span className="text-lg text-muted-foreground sm:hidden">
              {content.total}
            </span>
            <span className="text-xl font-bold text-primary">
              {totalPrice.toFixed(3)} {content.currency}
            </span>
          </div>

          <Button
            className="w-full sm:w-auto rounded-full px-8 py-6 text-lg shadow-md"
            onClick={handleCheckout}
          >
            {content.checkout}
          </Button>
        </div>
      </div>
    </div>
  );
}
