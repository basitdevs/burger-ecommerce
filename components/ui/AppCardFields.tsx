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
      addToCart: "Add to Cart",
      addToCartShort: "Add",
      currency: "KWD",
    },
    ar: {
      searchPlaceholder: "ابحث عن طعام لذيذ...",
      noProducts: "لا توجد منتجات.",
      noItemsInCat: "لا توجد عناصر في هذا القسم.",
      addToCart: "أضف للسلة",
      addToCartShort: "أضف",
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
    <div className="w-full max-w-7xl mx-auto px-1 md:px-4 pb-24 mt-6">
      {/* --- Search Input Section --- */}
      <div className="sticky top-2 z-30 mb-6 mt-2 px-1">
        <div className="relative rounded-full group">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            placeholder={content.searchPlaceholder}
            className="block w-full p-4 ps-11 text-sm rounded-full border-border/50 bg-background/95  focus-visible:ring-1 outline-none h-12 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- Restaurant Info Card --- */}
      {info && (
        <div className="mb-6 px-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-primary/5 border border-primary/10 shadow-sm p-4 md:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-start">
            <div className="relative shrink-0">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full p-1 bg-background shadow-lg ring-1 ring-border overflow-hidden">
                <Image
                  src={info.logoUrl}
                  alt="Restaurant Logo"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1 md:space-y-2">
              <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {getLocalized(info, "name")}
              </h3>
              <p className="text-muted-foreground text-sm md:text-lg max-w-xl">
                {getLocalized(info, "tagline")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- Products Grid (Search Mode) --- */}
      {search ? (
        <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              t={content}
            />
          ))}
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-3 md:space-y-4"
        >
          {categories.map((cat) => {
            const items = products.filter((p) => p.categoryId === cat.id);
            if (items.length === 0) return null;

            return (
              <AccordionItem
                key={cat.id}
                value={`cat-${cat.id}`}
                className="border border-border/50 bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-sm"
              >
                <AccordionTrigger className="px-4 py-4 md:px-6 md:py-5 text-base md:text-lg font-bold hover:no-underline hover:bg-muted/40 data-[state=open]:bg-muted/30 transition-colors text-start">
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-foreground flex-1">
                      {getLocalized(cat, "name")}
                    </span>
                    <span className="shrink-0 text-[10px] md:text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                      {items.length}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-background/50 p-0">
                  {/* Grid Layout Fix: 2 cols on mobile, 3 on desktop */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 md:gap-6 md:p-6 bg-gray-50/50 dark:bg-zinc-900/30">
                    {items.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        qty={quantities[p.id] || 1}
                        onQtyChange={handleQtyChange}
                        onAdd={handleAddToCart}
                        getLocalized={getLocalized}
                        currency={content.currency}
                        t={content}
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
  t,
}: any) {
  return (
    <Card className="group py-0 flex flex-col h-full gap-0 border border-border/60 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/5 rounded-xl md:rounded-2xl overflow-hidden">
      <div className="relative w-full aspect-[4/3] md:aspect-[5/3] overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.Title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2 start-2 bg-background/90 backdrop-blur-sm text-foreground text-xs md:text-sm font-bold px-2 py-1 rounded-md shadow-sm border border-black/5">
          {Number(product.price).toFixed(3)} {currency}
        </div>
      </div>

      <CardContent className="flex flex-col flex-grow px-3 md:px-5 gap-2 md:gap-3 mt-3 md:mt-5">
        <div className="flex-grow">
          <h3 className="font-bold text-sm md:text-lg leading-tight text-foreground line-clamp-2 mb-1">
            {getLocalized(product, "Title")}
          </h3>
          {product.description && (
            <p className="text-[10px] md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {getLocalized(product, "description")}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-2 md:px-5 md:pt-3 mt-auto">
        <div className="w-full flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 bg-muted/30 p-1.5 md:p-2 rounded-lg border border-border/40">
          <div className="flex items-center justify-between md:justify-center bg-background rounded-md border border-border/50 h-8 md:h-10 px-1 md:px-2 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:h-8 md:w-8 hover:text-red-500 rounded-sm"
              onClick={(e) => {
                e.preventDefault();
                onQtyChange(product.id, Math.max(1, qty - 1));
              }}
            >
              <Minus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>

            <span className="w-8 md:w-10 text-center text-xs md:text-sm font-bold tabular-nums">
              {qty}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 md:h-8 md:w-8 hover:text-green-500 rounded-sm"
              onClick={(e) => {
                e.preventDefault();
                onQtyChange(product.id, qty + 1);
              }}
            >
              <Plus className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>

          <Button
            className="flex-1 h-8 md:h-10 text-xs md:text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95"
            onClick={(e) => {
              e.preventDefault();
              onAdd(product);
            }}
          >
            <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 me-1.5" />
            <span className="md:hidden">{t.addToCartShort}</span>
            <span className="hidden md:inline">{t.addToCart}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
