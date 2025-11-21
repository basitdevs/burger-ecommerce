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
import { useCart } from "../context/CartContext";

export default function ProductCollapse({
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
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({}); // Track qty per product

  // 🔍 filter products by search text
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    return products.filter((p) =>
      p.Title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, products]);

  const handleQtyChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (product: any) => {
    const qty = quantities[product.id] || 1;
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: 1 })); // reset qty
  };

  return (
    <div className="w-full my-6">
      {/* Search input */}
      <Input
        placeholder="Search products..."
        className="flex max-w-4xl mb-5 border-2 mx-auto items-center justify-center py-2 px-2 border-grey"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Restaurant Info */}
      {info && (
        <Card className="w-full max-w-4xl mx-auto border-2 border-black rounded-xl shadow-md p-2 mb-5">
          <CardContent className="flex items-center justify-center py-8 px-6">
            <div className="grid grid-cols-2 items-center w-full gap-6">
              <div className="flex justify-center lg:justify-end">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border">
                  <Image
                    src={info.logoUrl}
                    alt={info.logoUrl}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h3 className="text-4xl font-extrabold text-primary">
                  {info.name}
                </h3>
                <p className="mt-2 text-lg text-gray-600">{info.tagline}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* If searching → show only matching products */}
      {search ? (
        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 col-span-full">
              No products found.
            </div>
          )}

          {filteredProducts.map((p) => (
            <Card key={p.id} className="overflow-hidden py-0 gap-0">
              <div className="relative w-full h-40">
                <Image
                  src={p.image || "/placeholder.png"}
                  alt={p.Title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 300px"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="text-base font-semibold">{p.Title}</h3>
                <p className="text-primary font-bold">{p.price} KWD</p>
                {/* Quantity selector */}
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleQtyChange(
                        p.id,
                        Math.max(1, (quantities[p.id] || 1) - 1)
                      )
                    }
                  >
                    -
                  </Button>
                  <span className="w-6 text-center">
                    {quantities[p.id] || 1}
                  </span>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleQtyChange(p.id, (quantities[p.id] || 1) + 1)
                    }
                  >
                    +
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="p-3">
                <Button className="w-full" onClick={() => handleAddToCart(p)}>
                  + Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // Normal category view when not searching
        <Accordion type="single" collapsible className="w-full">
          {categories.map((cat) => {
            const items = products.filter((p) => p.categoryId === cat.id);
            return (
              <AccordionItem
                key={cat.id}
                value={`cat-${cat.id}`}
                className="w-full max-w-4xl mx-auto border-1 border-black rounded-xl shadow-md mb-2 mt-5 p-2"
              >
                <Card className="w-full rounded-xl shadow-md border-grey">
                  <AccordionTrigger className="px-4 py-1 text-lg font-semibold">
                    {cat.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4 p-2 grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                      {items.length === 0 && (
                        <div className="text-sm text-muted-foreground">
                          No items in this category yet.
                        </div>
                      )}
                      {items.map((p) => (
                        <Card key={p.id} className="overflow-hidden py-0 gap-0">
                          <div className="relative w-full h-40">
                            <Image
                              src={p.image || "/placeholder.png"}
                              alt={p.Title}
                              fill
                              className="object-cover"
                              sizes="(max-width:768px) 100vw, 300px"
                            />
                          </div>
                          <CardContent className="p-3">
                            <h3 className="text-base font-semibold">
                              {p.Title}
                            </h3>
                            <p className="text-primary font-bold">
                              {p.price} KWD
                            </p>
                            {/* Quantity selector */}
                            <div className="mt-2 flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleQtyChange(
                                    p.id,
                                    Math.max(1, (quantities[p.id] || 1) - 1)
                                  )
                                }
                              >
                                -
                              </Button>
                              <span className="w-6 text-center">
                                {quantities[p.id] || 1}
                              </span>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleQtyChange(
                                    p.id,
                                    (quantities[p.id] || 1) + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                          </CardContent>
                          <CardFooter className="p-3">
                            <Button
                              className="w-full"
                              onClick={() => handleAddToCart(p)}
                            >
                              + Add to Cart
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
