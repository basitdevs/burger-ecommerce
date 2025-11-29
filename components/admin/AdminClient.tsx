"use client";

import { useState } from "react";
import { Store, Package, List } from "lucide-react";
import { Product, Category, ExtendedRestaurantInfo } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import RestaurantInfoTab from "@/components/admin/RestaurantInfoTab";

interface AdminProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialInfo: ExtendedRestaurantInfo | null;
}

export default function AdminClient({
  initialProducts,
  initialCategories,
  initialInfo,
}: AdminProps) {
  const [activeTab, setActiveTab] = useState<
    "products" | "categories" | "info"
  >("products");

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: List },
    { id: "info", label: "Restaurant Info", icon: Store },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto  md:px-6">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center mb-8 gap-4">
        {/* <h1 className="text-3xl font-bold">Admin Dashboard</h1> */}

        {/* Mobile: Shadcn Select */}
        <div className="w-full md:hidden">
          <Select value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <span className="flex items-center gap-2">
                    <t.icon className="w-4 h-4" /> {t.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop: Buttons */}
        <div className="hidden md:flex bg-muted p-1 rounded-lg">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <t.icon className="w-4 h-4 mr-2" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "products" && (
          <ProductsTab
            products={initialProducts}
            categories={initialCategories}
          />
        )}
        {activeTab === "categories" && (
          <CategoriesTab categories={initialCategories} />
        )}
        {activeTab === "info" && (
          <RestaurantInfoTab initialInfo={initialInfo} />
        )}
      </div>
    </div>
  );
}
