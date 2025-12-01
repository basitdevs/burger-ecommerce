/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/context/CartContext";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Context

export default function AppCardFields({
  products,
  categories,
  info,
}: {
  products: any[];
  categories: any[];
  info: any;
}) {
  const [search, setSearch] = useState("");
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  
  // 2. Get Language
  const { language } = useLanguage();

  // 3. Define Translations
  const t = {
    en: {
      searchPlaceholder: "Search products...",
      noProducts: "No products found.",
      noItemsInCat: "No items in this category yet.",
      addToCart: "+ Add to Cart",
      currency: "KWD"
    },
    ar: {
      searchPlaceholder: "ابحث عن منتجات...",
      noProducts: "لا توجد منتجات.",
      noItemsInCat: "لا توجد عناصر في هذا القسم.",
      addToCart: "+ أضف للسلة",
      currency: "د.ك"
    }
  };

  const content = t[language];

  // 4. Helper to get localized string (Title vs Title_ar)
  const getLocalized = (obj: any, field: string) => {
    if (!obj) return "";
    if (language === 'ar' && obj[`${field}_ar`]) {
      return obj[`${field}_ar`];
    }
    return obj[field];
  };

  // 🔍 Filter products by search text based on CURRENT language title
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => {
      const title = getLocalized(p, "Title").toLowerCase();
      return title.includes(search.toLowerCase());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, products, language]);

  const handleQtyChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product: any) => {
    const qty = quantities[product.id] || 1;
    // We pass the full object. Ensure CartContext handles displaying the correct language
    // or add the localized title here if your cart is simple.
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 })); 
  };

  return (
    <div className="w-full my-6">
      {/* Search input */}
      <Input
        placeholder={content.searchPlaceholder}
        className="flex max-w-4xl mb-5 border-2 mx-auto items-center justify-center py-2 px-4 border-gray-200 text-start"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Restaurant Info */}
      {info && (
        <Card className="w-full max-w-4xl mx-auto border-2 border-black/10 rounded-xl shadow-md p-2 mb-5">
          <CardContent className="flex items-center justify-center py-8 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center w-full gap-6">
              <div className="flex justify-center md:justify-end">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border bg-white">
                  <Image
                    src={info.logoUrl}
                    alt="Restaurant Logo"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center md:items-start text-center md:text-start">
                <h3 className="text-4xl font-extrabold text-primary">
                  {getLocalized(info, "name")}
                </h3>
                <p className="mt-2 text-lg text-gray-600">
                  {getLocalized(info, "tagline")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* If searching → show only matching products */}
      {search ? (
        <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 col-span-full py-10">
              {content.noProducts}
            </div>
          )}

          {filteredProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              qty={quantities[p.id] || 1}
              onQtyChange={handleQtyChange}
              onAdd={handleAddToCart}
              getLocalized={getLocalized}
              currency={content.currency}
              addBtnText={content.addToCart}
            />
          ))}
        </div>
      ) : (
        // Normal category view when not searching
        <Accordion type="single" collapsible className="w-full">
          {categories.map((cat) => {
            const items = products.filter((p) => p.categoryId === cat.id);
            // Hide categories with no items if you prefer, or keep them
            if (items.length === 0) return null; 

            return (
              <AccordionItem
                key={cat.id}
                value={`cat-${cat.id}`}
                className="w-full max-w-4xl mx-auto border border-gray-200 rounded-xl shadow-sm mb-4 bg-white overflow-hidden"
              >
                 {/* text-start ensures correct alignment in RTL */}
                 <div className="w-full rounded-xl">
                  <AccordionTrigger className="px-6 py-4 text-lg font-bold hover:no-underline hover:bg-gray-50 text-start">
                    {getLocalized(cat, "name")}
                  </AccordionTrigger>
                  <AccordionContent className="bg-gray-50/50">
                    <div className="grid gap-4 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {items.map((p) => (
                        <ProductCard 
                          key={p.id} 
                          product={p} 
                          qty={quantities[p.id] || 1}
                          onQtyChange={handleQtyChange}
                          onAdd={handleAddToCart}
                          getLocalized={getLocalized}
                          currency={content.currency}
                          addBtnText={content.addToCart}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Sub-Component for cleaner code (Reusable Product Card)
// ------------------------------------------------------------------
function ProductCard({ 
  product, 
  qty, 
  onQtyChange, 
  onAdd, 
  getLocalized, 
  currency, 
  addBtnText 
}: any) {
  return (
    <Card className="overflow-hidden py-0 gap-0 border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full h-40 bg-gray-100">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.Title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 300px"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-base font-semibold line-clamp-2 min-h-[3rem]">
            {getLocalized(product, "Title")}
        </h3>
        <p className="text-primary font-bold mt-1">
            {Number(product.price).toFixed(3)} {currency}
        </p>
        
        {/* Quantity selector */}
        {/* dir="ltr" keeps math logic intuitive (- 1 +) even in Arabic */}
        <div className="mt-3 flex items-center gap-2 justify-center bg-gray-50 rounded-lg p-1 w-fit mx-auto" dir="ltr">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-md"
            onClick={() => onQtyChange(product.id, Math.max(1, qty - 1))}
          >
            -
          </Button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-md"
            onClick={() => onQtyChange(product.id, qty + 1)}
          >
            +
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button className="w-full font-bold" onClick={() => onAdd(product)}>
          {addBtnText}
        </Button>
      </CardFooter>
    </Card>
  );
}