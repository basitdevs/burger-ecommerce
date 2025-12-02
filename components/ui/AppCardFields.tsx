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
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useCart } from "@/components/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Plus, Minus, ShoppingCart, Utensils } from "lucide-react";

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

  const { language } = useLanguage();

  const t = {
    en: {
      searchPlaceholder: "Search for delicious food...",
      noProducts: "No products found.",
      noItemsInCat: "No items in this category yet.",
      addToCart: "Add",
      currency: "KWD",
    },
    ar: {
      searchPlaceholder: "ابحث عن طعام لذيذ...",
      noProducts: "لا توجد منتجات.",
      noItemsInCat: "لا توجد عناصر في هذا القسم.",
      addToCart: "أضف",
      currency: "د.ك",
    },
  };

  const content = t[language];

  const getLocalized = (obj: any, field: string) => {
    if (!obj) return "";
    if (language === "ar" && obj[`${field}_ar`]) {
      return obj[`${field}_ar`];
    }
    return obj[field];
  };

  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) => {
      const title = getLocalized(p, "Title").toLowerCase();
      return title.includes(search.toLowerCase());
    });
  }, [search, products, language]);

  const handleQtyChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product: any) => {
    const qty = quantities[product.id] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
      {/* --- Search Input Section --- */}
      <div className="sticky top-4 z-30 mb-8 mt-4">
        <div className="relative shadow-lg rounded-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder={content.searchPlaceholder}
            className="block w-full p-4 ps-11 outline-none text-sm rounded-full border-0 bg-white dark:bg-zinc-900 dark:text-white ring-1 ring-gray-200 dark:ring-zinc-800 focus-visible:ring-1 focus-visible:ring-primary shadow-sm h-12 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- Restaurant Info Card --- */}
      {info && (
        <Card className="border-none shadow-none bg-transparent mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-transparent rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-primary/10 dark:border-white/10">
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-background shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
                <Image
                  src={info.logoUrl}
                  alt="Restaurant Logo"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col text-center md:text-start space-y-2">
              <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {getLocalized(info, "name")}
              </h3>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto md:mx-0">
                {getLocalized(info, "tagline")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* --- Products Grid (Search Mode) --- */}
      {search ? (
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Utensils className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">{content.noProducts}</p>
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
        /* --- Categories Accordion (Default Mode) --- */
        <Accordion type="single" collapsible className="w-full space-y-4">
          {categories.map((cat) => {
            const items = products.filter((p) => p.categoryId === cat.id);
            if (items.length === 0) return null;

            return (
              <AccordionItem
                key={cat.id}
                value={`cat-${cat.id}`}
                className="border border-border/60 dark:border-zinc-800 bg-card rounded-2xl overflow-hidden shadow-sm dark:shadow-none"
              >
                <AccordionTrigger className="px-6 py-5 text-lg font-bold hover:no-underline hover:bg-muted/50 data-[state=open]:bg-muted/30 transition-colors text-start">
                  <div className="flex items-center gap-3">
                    <span className="text-foreground">
                      {getLocalized(cat, "name")}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-background/50 p-0">
                  <div className="grid gap-6 p-6 grid-cols-2 lg:grid-cols-3 bg-gray-50/50 dark:bg-zinc-900/30">
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
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

function ProductCard({
  product,
  qty,
  onQtyChange,
  onAdd,
  getLocalized,
  currency,
  addBtnText,
}: any) {
  return (
    <Card className="group py-0 relative overflow-hidden border border-border/60 bg-card hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 rounded-xl flex flex-col h-full">
      {/* Image Section */}
      <div className="relative w-full pt-[65%] overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.Title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 300px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <CardContent className="flex flex-col flex-grow p-4 md:p-5 gap-3">
        <div className="flex-grow">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg leading-tight text-card-foreground line-clamp-2">
              {getLocalized(product, "Title")}
            </h3>
            <span className="shrink-0 font-bold text-primary bg-primary/10 px-2 py-1 rounded-md text-sm whitespace-nowrap">
              {Number(product.price).toFixed(3)}{" "}
              <span className="text-xs">{currency}</span>
            </span>
          </div>
          {/* Optional: Add description if available */}
          {product.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {getLocalized(product, "description")}
            </p>
          )}
        </div>
      </CardContent>

      {/* Footer / Actions */}
      <CardFooter className="p-4 pt-0 mt-auto grid grid-cols-1 gap-3">
        <div className="flex items-center justify-between gap-3 p-1 bg-muted/40 dark:bg-zinc-800/50 rounded-lg border border-border/50">
          {/* Quantity Controls */}
          <div className="flex items-center" dir="ltr">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:text-red-500 hover:shadow-sm transition-all"
              onClick={() => onQtyChange(product.id, Math.max(1, qty - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-10 text-center font-bold text-foreground tabular-nums">
              {qty}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-md hover:bg-white dark:hover:bg-zinc-700 hover:text-green-500 hover:shadow-sm transition-all"
              onClick={() => onQtyChange(product.id, qty + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="flex-1 font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
            onClick={() => onAdd(product)}
          >
            <ShoppingCart className="w-4 h-4 me-2" />
            {addBtnText}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
